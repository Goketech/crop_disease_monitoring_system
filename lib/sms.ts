/**
 * PlantMD SMS Utility (Powered by InfiniReach)
 * Handles sending notifications to farmers about AI results and expert reviews.
 */

export async function sendSMS(to: string, message: string) {
  const apiKey = process.env.INFINIREACH_API_KEY;
  const deviceId = process.env.INFINIREACH_DEVICE_ID;
  const senderNumber = process.env.INFINIREACH_SENDER_NUMBER;

  if (!apiKey || !deviceId || !senderNumber) {
    console.warn('[SMS] InfiniReach credentials missing in .env.local. Falling back to mock logging.');
    console.log('--------------------------------------------------');
    console.log(`[SMS MOCK] To: ${to}`);
    console.log(`[SMS MESSAGE] ${message}`);
    console.log('--------------------------------------------------');
    return true;
  }

  try {
    const response = await fetch('https://api.infinireach.io/api/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        to: to,               // Changed from recipient to to
        from: senderNumber,   // Added from field
        body: message,
        deviceId: deviceId,
        channel: 'sms'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SMS ERROR] InfiniReach API error: ${response.status} - ${errorText}`);
      return false;
    }

    console.log(`[SMS SUCCESS] Message live-sent to ${to} via InfiniReach.`);
    return true;
  } catch (error) {
    console.error('[SMS ERROR] Critical failure sending message via InfiniReach:', error);
    return false;
  }
}

export function formatAIMessage(crop: string, disease: string, confidence: number) {
  return `PlantMD AI: Your ${crop} diagnosis is ready. We detected ${disease} (${confidence}% confidence). Check the app for the treatment plan.`;
}

export function formatExpertMessage(crop: string, disease: string, severity: string) {
  return `PlantMD Expert: An agronomist has reviewed your ${crop} case. Result: ${disease} (${severity} severity). Log in to view the clinical observations.`;
}
