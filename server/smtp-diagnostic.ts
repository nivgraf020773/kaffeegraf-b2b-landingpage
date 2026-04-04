/**
 * SMTP Diagnostic Tool
 * Verifies email configuration and tests SMTP connectivity
 */

import nodemailer from "nodemailer";

export interface SMTPDiagnosticResult {
  envVarsPresent: {
    MAIL_HOST: boolean;
    MAIL_PORT: boolean;
    MAIL_USER: boolean;
    MAIL_PASSWORD: boolean;
    MAIL_FROM: boolean;
  };
  transporterCreated: boolean;
  smtpConnectivity: {
    success: boolean;
    error?: string;
  };
  testEmailSent: {
    success: boolean;
    error?: string;
  };
}

export async function runSMTPDiagnostics(
  testEmail: string
): Promise<SMTPDiagnosticResult> {
  const result: SMTPDiagnosticResult = {
    envVarsPresent: {
      MAIL_HOST: !!process.env.MAIL_HOST,
      MAIL_PORT: !!process.env.MAIL_PORT,
      MAIL_USER: !!process.env.MAIL_USER,
      MAIL_PASSWORD: !!process.env.MAIL_PASSWORD,
      MAIL_FROM: !!process.env.MAIL_FROM,
    },
    transporterCreated: false,
    smtpConnectivity: {
      success: false,
    },
    testEmailSent: {
      success: false,
    },
  };

  // Step 1: Check if env vars are present
  const allEnvVarsPresent = Object.values(result.envVarsPresent).every(
    (v) => v
  );

  if (!allEnvVarsPresent) {
    result.smtpConnectivity.error = "Missing environment variables";
    return result;
  }

  // Step 2: Try to create transporter
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "587", 10),
      secure: parseInt(process.env.MAIL_PORT || "587", 10) === 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    result.transporterCreated = true;

    // Step 3: Verify SMTP connectivity
    try {
      await transporter.verify();
      result.smtpConnectivity.success = true;
    } catch (error) {
      result.smtpConnectivity.success = false;
      result.smtpConnectivity.error = error instanceof Error ? error.message : String(error);
    }

    // Step 4: Send test email
    try {
      await transporter.sendMail({
        from: process.env.MAIL_FROM || "b2b@kaffeegraf.coffee",
        to: testEmail,
        subject: "[SMTP TEST] Kaffeegraf B2B - SMTP Configuration Verification",
        html: `
          <h2>SMTP Configuration Test</h2>
          <p>This is a test email to verify SMTP configuration.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${process.env.MAIL_FROM || "b2b@kaffeegraf.coffee"}</p>
          <p><strong>To:</strong> ${testEmail}</p>
          <p>If you received this email, SMTP is working correctly.</p>
        `,
      });

      result.testEmailSent.success = true;
    } catch (error) {
      result.testEmailSent.success = false;
      result.testEmailSent.error = error instanceof Error ? error.message : String(error);
    }
  } catch (error) {
    result.transporterCreated = false;
    result.smtpConnectivity.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}
