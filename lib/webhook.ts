/**
 * Webhook dispatcher for real-time synchronization with Google Sheets / Yandex Tables
 * If WEBHOOK_SHEETS_URL is configured in .env, every successful registration is forwarded.
 */
export async function sendWebhookNotification(payload: {
  bookingId: number;
  fullName: string;
  phone: string;
  age: number;
  date: string;
  timeSlot: string;
  isMinor: boolean;
  createdAt: string;
}) {
  const webhookUrl = process.env.WEBHOOK_SHEETS_URL;
  if (!webhookUrl) {
    return; // No webhook configured, silent skip
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (err) {
    // Non-blocking error logging
    console.warn('Webhook notification warning:', err);
  }
}
