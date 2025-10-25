import { Router } from "express";
import { config } from "./config.js";
import { getSymbols, getCompanyName } from "./services/symbols.js";
import { loadJson } from "./helpers/json.js";
import path from "node:path";
import { QuoteRequestSchema, QuoteResponseSchema, type QuoteRow, type QuoteResponse } from "@xm-schema/shared";
import { sendEmail } from "./services/mailer.js";

export const v1 = Router();

v1.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

v1.get("/symbols", (_req, res) => {
  res.set("Cache-Control", `public, max-age=${config.symbolsCacheSeconds}`);
  res.json(getSymbols());
});

function loadQuotesFromJson(symbol: string): QuoteRow[] {
  const file = path.resolve(config.quotesDir, `${symbol}.json`);
  return loadJson<QuoteRow[]>(file);
}

v1.post("/quotes", async (req, res, next) => {
  try {
    const parsed = QuoteRequestSchema.parse(req.body);

    const all = loadQuotesFromJson(parsed.symbol);

    const start = new Date(parsed.startDate + "T00:00:00Z");
    const endExclusive = new Date(new Date(parsed.endDate + "T00:00:00Z").getTime() + 24 * 60 * 60 * 1000);
    const quotes = all.filter(q => {
      const d = new Date(q.date + "T00:00:00Z");
      return d >= start && d < endExclusive;
    });

    const payload: QuoteResponse = {
      symbol: parsed.symbol,
      companyName: getCompanyName(parsed.symbol) ?? parsed.symbol,
      range: { startDate: parsed.startDate, endDate: parsed.endDate },
      quotes
    };
    QuoteResponseSchema.parse(payload);
    res.json(payload);

    try {
      await sendEmail({
        from: config.emailFrom,
        to: parsed.email,
        subject: payload.companyName,
        text: `From ${parsed.startDate} to ${parsed.endDate}`
      });
    } catch (e) {
      console.error("Email send failed:", e);
    }
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "Symbol not found" });
    }
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: err.flatten?.() ?? "Validation error" });
    }
    console.error(`Failed to process /quotes request:`, err);
    return next(err);
  }
});
