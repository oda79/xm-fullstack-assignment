import path from "node:path";
import dotenv from "dotenv";

const envFile = process.env.ENV_FILE || ".env.dev";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  publicUrl: process.env.PUBLIC_API_URL || "http://localhost:4000",
  port: Number(process.env.PORT ?? 4000),  
  quotesDir: process.env.QUOTES_DIR ?? "/app/data/quotes",
  symbolsFilePath: process.env.SYMBOLS_FILE_PATH || "/app/data/symbols.json",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  emailFrom: process.env.EMAIL_FROM ?? "noreply@example.com",
  symbolsCacheSeconds: Number(process.env.SYMBOLS_CACHE_SECONDS ?? 300),
  smtpHost: process.env.SMTP_HOST || "smtp.ethereal.email",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpSecure: process.env.SMTP_SECURE === "true",
};