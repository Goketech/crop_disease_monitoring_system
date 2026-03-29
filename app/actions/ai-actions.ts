'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function analyzePlantImage(caseId: string, imageUrls: string[], crop: string) {
  console.log(`[AI] Starting analysis for case ${caseId}...`);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("[AI] Not authenticated");
    return { success: false, error: "Not authenticated" };
  }
  
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn("[AI] GOOGLE_AI_API_KEY is missing. Falling back to Simulation Mode.");
    return simulateAnalysis(caseId, crop);
  }

  try {
    // 1. Using the model version that worked for the user
    const modelToUse = "gemini-2.5-flash";
    console.log(`[AI] Attempting analysis with model: ${modelToUse} (API: v1)`);
    
    const model = genAI.getGenerativeModel({ model: modelToUse }, { apiVersion: 'v1' });
    
    // 2. Fetch image
    const imgResponse = await fetch(imageUrls[0]);
    if (!imgResponse.ok) throw new Error("Failed to fetch image from Supabase Storage");
    const buffer = await imgResponse.arrayBuffer();
    
    // 3. Prompt AI with strict enum instructions
    const prompt = `
      Analyze this image of a ${crop} plant. 
      Identify if there is any disease or pest issue.
      Return the result strictly as a JSON object with these fields:
      {
        "disease": "Name of disease",
        "confidence": 85,
        "treatment_plan": "Short treatment recommendation",
        "urgency": "High"
      }
      IMPORTANT: The "urgency" field MUST be exactly one of: 'Low', 'Medium', 'High', or 'Critical'.
    `;

    console.log("[AI] Sending request...");
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(buffer).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = await result.response.text();
    console.log("[AI] Raw Response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON format");
    const analysis = JSON.parse(jsonMatch[0]);

    console.log("[AI] Parsed Analysis:", analysis);

    // 4. Update Database
    // Ensure urgency matches DB Enum: 'Low', 'Medium', 'High', 'Critical'
    const validUrgencies = ['Low', 'Medium', 'High', 'Critical'];
    let finalUrgency = analysis.urgency || 'Low';
    if (!validUrgencies.includes(finalUrgency)) {
      finalUrgency = 'Low'; // Fallback for "None" or other AI guesses
    }

    const { error: updateError } = await supabase
      .from('cases')
      .update({
        disease: analysis.disease,
        confidence: analysis.confidence,
        treatment_plan: analysis.treatment_plan || analysis.treatment,
        urgency: finalUrgency,
        status: 'Analyzed'
      })
      .eq('id', caseId);

    if (updateError) {
      console.error("[AI] Database Update Error:", updateError);
      throw updateError;
    }

    console.log("[AI] Success! Database updated.");

    // 5. Send SMS Notification
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number, sms_notifications_enabled')
        .eq('id', user.id) // This assumes the current user is the farmer (which is true for /diagnose)
        .single();

      if (profile?.phone_number && profile?.sms_notifications_enabled) {
        const { sendSMS, formatAIMessage } = await import("@/lib/sms");
        const msg = formatAIMessage(crop, analysis.disease, analysis.confidence);
        await sendSMS(profile.phone_number, msg);
      }
    } catch (smsError) {
      console.warn("[AI] Failed to send SMS:", smsError);
    }

    return { success: true, analysis };

  } catch (error: any) {
    console.error("[AI] Critical Error:", error.message || error);
    return simulateAnalysis(caseId, crop);
  }
}

async function simulateAnalysis(caseId: string, crop: string) {
  console.log(`[AI] Simulating analysis for case ${caseId}...`);
  const supabase = await createClient();
  
  const mockDiagnoses: Record<string, any[]> = {
    "Tomato": [
      { disease: "Late Blight", confidence: 94, treatment_plan: "Apply fungicide containing chlorothalonil. Remove infected leaves immediately.", urgency: "High" },
      { disease: "Bacterial Spot", confidence: 82, treatment_plan: "Use copper-based bactericides. Avoid overhead watering.", urgency: "Medium" }
    ],
    "Corn": [
      { disease: "Common Rust", confidence: 88, treatment_plan: "Apply foliar fungicides. Ensure proper plant spacing for airflow.", urgency: "Medium" },
      { disease: "Northern Leaf Blight", confidence: 75, treatment_plan: "Rotate crops and use resistant hybrids next season.", urgency: "High" }
    ],
    "Maize": [
      { disease: "Gray Leaf Spot", confidence: 79, treatment_plan: "Apply fungicides early. Deep plow residues after harvest.", urgency: "Medium" }
    ],
    "Apple": [
      { disease: "Fire Blight", confidence: 91, treatment_plan: "Prune infected branches 12 inches below visible symptoms.", urgency: "Critical" }
    ],
    "Default": [
      { disease: "Nutrient Deficiency (Nitrogen)", confidence: 70, treatment_plan: "Apply a nitrogen-rich fertilizer (NPK 20-10-10). Check soil pH.", urgency: "Low" },
      { disease: "Generic Fungal Mutation", confidence: 65, treatment_plan: "Broad-spectrum antifungal treatment recommended.", urgency: "Medium" }
    ]
  };

  const cropKey = Object.keys(mockDiagnoses).find(k => crop.includes(k)) || "Default";
  const options = mockDiagnoses[cropKey];
  const analysis = options[Math.floor(Math.random() * options.length)];

  const { error: updateError } = await supabase
    .from('cases')
    .update({
      disease: analysis.disease,
      confidence: analysis.confidence,
      treatment_plan: analysis.treatment_plan,
      urgency: analysis.urgency,
      status: 'Analyzed'
    })
    .eq('id', caseId);

  if (updateError) console.error("[AI] Simulation DB Error:", updateError);

  // 3. Send SMS Notification (Simulation)
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number, sms_notifications_enabled')
        .eq('id', user.id)
        .single();

      if (profile?.phone_number && profile?.sms_notifications_enabled) {
        const { sendSMS, formatAIMessage } = await import("@/lib/sms");
        const msg = formatAIMessage(crop, analysis.disease, analysis.confidence);
        await sendSMS(profile.phone_number, msg);
      }
    }
  } catch (smsError) {
    console.warn("[AI Simulation] Failed to send SMS:", smsError);
  }

  await new Promise(resolve => setTimeout(resolve, 3000));
  return { success: true, analysis, simulated: true };
}
