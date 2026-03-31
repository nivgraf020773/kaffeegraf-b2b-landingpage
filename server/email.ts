/**
 * Email Service
 * Handles sending transactional emails via Hostinger Mailserver
 */

import nodemailer from "nodemailer";

interface ContactConfirmationEmailData {
  name: string;
  email: string;
  company: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) {
    return transporter;
  }

  const mailHost = process.env.MAIL_HOST;
  const mailPort = parseInt(process.env.MAIL_PORT || "587", 10);
  const mailUser = process.env.MAIL_USER;
  const mailPassword = process.env.MAIL_PASSWORD;

  if (!mailHost || !mailUser || !mailPassword) {
    throw new Error("Email configuration incomplete");
  }

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
 * Send contact form confirmation email
 */
export async function sendContactConfirmationEmail(
  data: ContactConfirmationEmailData
): Promise<void> {
  try {
    const transporter = getTransporter();
    const mailFrom = process.env.MAIL_FROM || "team@kaffeegraf.coffee";

    // Email to customer
    await transporter.sendMail({
      from: mailFrom,
      to: data.email,
      subject: "Vielen Dank für Ihre Anfrage – kaffeegraf",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #8B4513;">Vielen Dank, ${data.name}!</h2>
          
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
Vielen Dank, ${data.name}!

Wir haben Ihre Kontaktanfrage für ${data.company} erhalten.

Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden, um Ihre Anfrage zu besprechen und die perfekte Kaffeelösung für Ihr Unternehmen zu finden.

Mit freundlichen Grüßen,
Das kaffeegraf Team
www.kaffeegraf.coffee
      `,
    });

    // Email to team
    await transporter.sendMail({
      from: mailFrom,
      to: mailFrom,
      subject: `Neue B2B Kontaktanfrage: ${data.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #8B4513;">Neue B2B Kontaktanfrage</h2>
          
          <p><strong>Name:</strong> ${data.name}</p>
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

    console.log(
      `[Email Service] Confirmation emails sent to ${data.email} and team`
    );
  } catch (error) {
    console.error("[Email Service] Failed to send confirmation email:", error);
    throw error;
  }
}
