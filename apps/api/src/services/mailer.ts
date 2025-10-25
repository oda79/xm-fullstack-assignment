import nodemailer from "nodemailer";
import { config } from "../config.js";

let emailTransporter: nodemailer.Transporter;

export async function createEmailTransporter() {
  if (config.smtpUser && config.smtpPass) {
    emailTransporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    emailTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: testAccount,
    });

    console.log("Using Ethereal Email for dev");
    console.log("Login:", testAccount.user);
    console.log("Password:", testAccount.pass);
  }

  return emailTransporter;
}

export async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  if (!emailTransporter) await createEmailTransporter();

  const info = await emailTransporter.sendMail(mailOptions);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) console.log("Email preview:", previewUrl);

  return info;
}
