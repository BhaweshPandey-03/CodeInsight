import nodemailer from "nodemailer";

const getClientUrl = () =>
  process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendVerificationEmail = async ({ email, name, token }) => {
  const verificationUrl = `${getClientUrl()}/verify-email?token=${token}`;
  const transporter = getTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured for email verification");
    }

    console.log("Email verification URL:", verificationUrl);
    return {
      sent: false,
      verificationUrl,
    };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Verify your CodeInsight AI email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your email</h2>
        <p>Hi ${name},</p>
        <p>Confirm your email address to start using CodeInsight AI.</p>
        <p>
          <a href="${verificationUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 14px;text-decoration:none;border-radius:6px;">
            Verify email
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  });

  return {
    sent: true,
    verificationUrl,
  };
};
