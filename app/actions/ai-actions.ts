'use server'

import { GoogleGenerativeAI, SchemaType, type ObjectSchema } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

const MODEL_ID = "gemini-2.5-flash";

const DIAGNOSIS_SCHEMA: ObjectSchema = {
  type: SchemaType.OBJECT,
  properties: {
    disease: { type: SchemaType.STRING },
    confidence: { type: SchemaType.NUMBER },
    treatment_plan: { type: SchemaType.STRING },
    urgency: {
      type: SchemaType.STRING,
      format: "enum",
      enum: ["Low", "Medium", "High", "Critical"],
    },
  },
  required: ["disease", "confidence", "treatment_plan", "urgency"],
};

function guessMimeType(url: string, contentType: string | null): string {
  const header = contentType?.split(";")[0]?.trim().toLowerCase();
  if (header && header.startsWith("image/")) return header;
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".bmp")) return "image/bmp";
  return "image/jpeg";
}

const validUrgencies = ['Low', 'Medium', 'High', 'Critical'] as const;

function normalizeUrgency(value: unknown): typeof validUrgencies[number] {
  if (typeof value === "string" && validUrgencies.includes(value as typeof validUrgencies[number])) {
    return value as typeof validUrgencies[number];
  }
  return 'Low';
}

async function markAnalysisFailed(caseId: string, userMessage: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cases")
    .update({
      disease: null,
      confidence: null,
      treatment_plan: userMessage,
      urgency: "Medium",
      status: "Submitted",
    })
    .eq("id", caseId);
  if (error) console.error("[AI] markAnalysisFailed DB error:", error);
}

export type AnalyzePlantImageResult =
  | { success: true; analysis: Record<string, unknown>; simulated?: boolean }
  | { success: false; error: string };

export async function analyzePlantImage(
  caseId: string,
  imageUrls: string[],
  crop: string
): Promise<AnalyzePlantImageResult> {
  console.log(`[AI] Starting analysis for case ${caseId}...`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("[AI] Not authenticated");
    return { success: false, error: "Not authenticated" };
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn("[AI] GOOGLE_AI_API_KEY is missing. Using simulation mode.");
    return simulateAnalysis(caseId, crop);
  }

  const urls = imageUrls.filter(Boolean).slice(0, 4);
  if (urls.length === 0) {
    await markAnalysisFailed(caseId, "No images available for analysis.");
    return { success: false, error: "No images available for analysis." };
  }

  try {
    const model = genAI.getGenerativeModel(
      {
        model: MODEL_ID,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: DIAGNOSIS_SCHEMA,
        },
      },
      { apiVersion: "v1" }
    );

    const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = [];
    for (const url of urls) {
      const imgResponse = await fetch(url);
      if (!imgResponse.ok) throw new Error(`Failed to fetch image: ${imgResponse.status}`);
      const buffer = await imgResponse.arrayBuffer();
      const mimeType = guessMimeType(url, imgResponse.headers.get("content-type"));
      imageParts.push({
        inlineData: {
          data: Buffer.from(buffer).toString("base64"),
          mimeType,
        },
      });
    }

    const cropLabel = crop || "crop";
    const prompt =
      urls.length > 1
        ? `You are a plant pathologist. These ${urls.length} images show the same ${cropLabel} plant or affected tissue. ` +
          "Identify disease or pest issues using all images together. " +
          "Return only the JSON object matching the schema (disease name, confidence 0-100, concise treatment_plan, urgency)."
        : `You are a plant pathologist. Analyze this ${cropLabel} plant image for disease or pest issues. ` +
          "Return only the JSON object matching the schema (disease name, confidence 0-100, concise treatment_plan, urgency).";

    console.log("[AI] Sending request...");
    const result = await model.generateContent([prompt, ...imageParts]);
    const text = (await result.response.text()).trim();
    let analysis: Record<string, unknown>;
    try {
      analysis = JSON.parse(text) as Record<string, unknown>;
    } catch {
      console.error("[AI] JSON parse error, raw:", text.slice(0, 500));
      throw new Error("Model returned invalid JSON");
    }

    const confidenceRaw = analysis.confidence;
    const confidence =
      typeof confidenceRaw === "number" && Number.isFinite(confidenceRaw)
        ? Math.min(100, Math.max(0, Math.round(confidenceRaw)))
        : null;

    const disease = typeof analysis.disease === "string" ? analysis.disease : "Unknown condition";
    const treatment =
      (typeof analysis.treatment_plan === "string" ? analysis.treatment_plan : null) ||
      (typeof analysis.treatment === "string" ? analysis.treatment : "") ||
      "See a local agronomist for site-specific advice.";
    const finalUrgency = normalizeUrgency(analysis.urgency);

    const { error: updateError } = await supabase
      .from("cases")
      .update({
        disease,
        confidence,
        treatment_plan: treatment,
        urgency: finalUrgency,
        status: "Analyzed",
      })
      .eq("id", caseId);

    if (updateError) {
      console.error("[AI] Database update error:", updateError);
      throw updateError;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone_number, sms_notifications_enabled")
        .eq("id", user.id)
        .single();

      if (profile?.phone_number && profile?.sms_notifications_enabled) {
        const { sendSMS, formatAIMessage } = await import("@/lib/sms");
        const msg = formatAIMessage(cropLabel, disease, confidence ?? 0);
        await sendSMS(profile.phone_number, msg);
      }
    } catch (smsError) {
      console.warn("[AI] Failed to send SMS:", smsError);
    }

    console.log("[AI] Success.");
    return { success: true, analysis: { ...analysis, disease, confidence, treatment_plan: treatment, urgency: finalUrgency } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("[AI] Error:", message);
    await markAnalysisFailed(
      caseId,
      `Automatic analysis could not be completed: ${message}. You can retry from the case page or request expert review.`
    );
    return { success: false, error: message };
  }
}

async function simulateAnalysis(caseId: string, crop: string): Promise<AnalyzePlantImageResult> {
  console.log(`[AI] Simulating analysis for case ${caseId}...`);
  const supabase = await createClient();

  const mockDiagnoses: Record<string, any[]> = {
    Tomato: [
      { disease: "Late Blight", confidence: 94, treatment_plan: "Apply fungicide containing chlorothalonil. Remove infected leaves immediately.", urgency: "High" },
      { disease: "Bacterial Spot", confidence: 82, treatment_plan: "Use copper-based bactericides. Avoid overhead watering.", urgency: "Medium" },
    ],
    Corn: [
      { disease: "Common Rust", confidence: 88, treatment_plan: "Apply foliar fungicides. Ensure proper plant spacing for airflow.", urgency: "Medium" },
      { disease: "Northern Leaf Blight", confidence: 75, treatment_plan: "Rotate crops and use resistant hybrids next season.", urgency: "High" },
    ],
    Maize: [
      { disease: "Gray Leaf Spot", confidence: 79, treatment_plan: "Apply fungicides early. Deep plow residues after harvest.", urgency: "Medium" },
    ],
    Apple: [
      { disease: "Fire Blight", confidence: 91, treatment_plan: "Prune infected branches 12 inches below visible symptoms.", urgency: "Critical" },
    ],
    Default: [
      { disease: "Nutrient Deficiency (Nitrogen)", confidence: 70, treatment_plan: "Apply a nitrogen-rich fertilizer (NPK 20-10-10). Check soil pH.", urgency: "Low" },
      { disease: "Generic Fungal Mutation", confidence: 65, treatment_plan: "Broad-spectrum antifungal treatment recommended.", urgency: "Medium" },
    ],
  };

  const cropKey = Object.keys(mockDiagnoses).find((k) => crop.includes(k)) || "Default";
  const options = mockDiagnoses[cropKey];
  const analysis = options[Math.floor(Math.random() * options.length)];

  const { error: updateError } = await supabase
    .from("cases")
    .update({
      disease: analysis.disease,
      confidence: analysis.confidence,
      treatment_plan: analysis.treatment_plan,
      urgency: analysis.urgency,
      status: "Analyzed",
    })
    .eq("id", caseId);

  if (updateError) console.error("[AI] Simulation DB error:", updateError);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone_number, sms_notifications_enabled")
        .eq("id", user.id)
        .single();

      if (profile?.phone_number && profile?.sms_notifications_enabled) {
        const { sendSMS, formatAIMessage } = await import("@/lib/sms");
        const msg = formatAIMessage(crop, analysis.disease, analysis.confidence);
        await sendSMS(profile.phone_number, msg);
      }
    }
  } catch (smsError) {
    console.warn("[AI Simulation] SMS error:", smsError);
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true, analysis, simulated: true };
}
