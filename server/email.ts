/**
 * Email Service
 * Handles sending transactional emails via Hostinger Mailserver
 *
 * TEST MODE:
 * Set MAIL_TEST_MODE=true to redirect ALL outgoing emails to MAIL_TEST_INBOX.
 * This does NOT change SMTP logic — emails still go through real SMTP.
 * Only the recipient address is overridden.
 */

import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

interface ContactConfirmationEmailData {
  firstName: string;
  email: string;
  company: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter (singleton)
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const mailHost = ENV.mailHost;
  const mailPort = ENV.mailPort;
  const mailUser = ENV.mailUser;
  const mailPassword = ENV.mailPassword;

  if (!mailHost || !mailUser || !mailPassword) {
    throw new Error(
      "Email configuration incomplete: MAIL_HOST, MAIL_USER, or MAIL_PASSWORD not set"
    );
  }

  console.log(`[Email Service] Initializing transporter: host=${mailHost}, port=${mailPort}, user=${mailUser}`);

  transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: mailPort === 465, // true for 465, false for other ports
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
  });

  return transporter;
}

/**
 * Resolve recipient address.
 * In test mode, ALL emails are redirected to MAIL_TEST_INBOX.
 */
function resolveRecipient(originalRecipient: string): string {
  if (ENV.mailTestMode) {
    const testInbox = ENV.mailTestInbox;
    if (!testInbox) {
      throw new Error("MAIL_TEST_MODE=true but MAIL_TEST_INBOX is not set");
    }
    console.log(
      `[Email Service] TEST MODE: redirecting ${originalRecipient} → ${testInbox}`
    );
    return testInbox;
  }
  return originalRecipient;
}

/**
 * Send contact form confirmation email
 */
export async function sendContactConfirmationEmail(
  data: ContactConfirmationEmailData
): Promise<void> {
  try {
    const transport = getTransporter();
    const mailFrom = ENV.mailFrom;

    if (ENV.mailTestMode) {
      console.log(`[Email Service] TEST MODE ACTIVE — all emails → ${ENV.mailTestInbox}`);
    }

    // BCC address for internal tracking (always the real address, not redirected)
    const BCC_INTERNAL = "support@kaffeegraf.coffee";

    // Email to customer (or test inbox)
    const customerRecipient = resolveRecipient(data.email);
    await transport.sendMail({
      from: mailFrom,
      to: customerRecipient,
      bcc: BCC_INTERNAL,
      subject: "Vielen Dank für Ihre Anfrage – kaffeegraf",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #8B4513;">Vielen Dank, ${data.firstName}!</h2>
          
          <p>Wir haben Ihre Kontaktanfrage für <strong>${data.company}</strong> erhalten.</p>
          
          <p>Unser Team wird sich innerhalb von <strong>24 Stunden</strong> bei Ihnen melden, um Ihre Anfrage zu besprechen und die perfekte Kaffeelösung für Ihr Unternehmen zu finden.</p>
          
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            Mit freundlichen Grüßen,<br>
            <strong>Das kaffeegraf Team</strong><br>
            <a href="https://www.kaffeegraf.coffee" style="color: #8B4513; text-decoration: none;">www.kaffeegraf.coffee</a>
          </p>
        </div>
      `,
      text: `
Vielen Dank, ${data.firstName}!

Wir haben Ihre Kontaktanfrage für ${data.company} erhalten.

Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden, um Ihre Anfrage zu besprechen und die perfekte Kaffeelösung für Ihr Unternehmen zu finden.

Mit freundlichen Grüßen,
Das kaffeegraf Team
www.kaffeegraf.coffee
      `,
    });

    console.log(`[Email Service] Customer confirmation sent to: ${customerRecipient}`);

    // Email to team/owner (or test inbox)
    const ownerRecipient = resolveRecipient(mailFrom);
    await transport.sendMail({
      from: mailFrom,
      to: ownerRecipient,
      bcc: BCC_INTERNAL,
      subject: `Neue B2B Kontaktanfrage: ${data.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #8B4513;">Neue B2B Kontaktanfrage</h2>
          
          <p><strong>Name:</strong> ${data.firstName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Unternehmen:</strong> ${data.company}</p>
          
          <p style="margin-top: 20px;">
            <a href="https://www.kaffeegraf.coffee/wp-admin/admin.php?page=wc-settings&tab=advanced&section=rest_api" style="color: #8B4513; text-decoration: none;">
              Zur WooCommerce Kundenliste
            </a>
          </p>
        </div>
      `,
    });

    console.log(`[Email Service] Owner notification sent to: ${ownerRecipient}`);
    console.log(`[Email Service] All emails sent successfully for: ${data.email} / ${data.company}`);
  } catch (error) {
    console.error("[Email Service] Failed to send confirmation email:", error);
    throw error;
  }
}
