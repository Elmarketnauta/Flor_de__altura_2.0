import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "hola@flordealtura.com";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send transactional email with Resend.
 * Handles retries on temporary failures (429, 5xx).
 */
export async function sendEmail(options: EmailOptions, retries = 3): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[EmailWarning] RESEND_API_KEY not configured, skipping email send");
    return { success: true };
  }

  const resend = getResendClient();

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await resend.emails.send({
        from: `Flor de Altura <${FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (response.error) {
        throw new Error(`Resend error: ${response.error.message}`);
      }

      console.log(`[Email] Sent to ${options.to} (${options.subject})`);
      return { success: true };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      const shouldRetry =
        err.includes("429") ||
        err.includes("500") ||
        err.includes("502") ||
        err.includes("503") ||
        err.includes("ECONNRESET") ||
        err.includes("ETIMEDOUT");

      if (attempt === retries - 1 || !shouldRetry) {
        console.error(`[EmailError] Failed to send to ${options.to}: ${err}`);
        return { success: false, error: err };
      }

      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`[EmailRetry] Attempt ${attempt + 1}/${retries}, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: "Max retries exceeded" };
}
