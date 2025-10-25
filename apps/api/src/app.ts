// app.ts
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config.js";
import { v1 } from "./routes.js";
import nodemailer from "nodemailer";

export const app = express();
app.use(express.json());
app.use(cors({ origin: [config.webOrigin], credentials: false }));

export const emailTransporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: false,
});

app.use("/api/v1", v1);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
