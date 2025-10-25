import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";

let tmpDir!: string;
let quotesDir!: string;
let symbolsFile!: string;
let app: import("express").Express;

// mock nodemailer BEFORE imports
vi.mock("nodemailer", () => {
  const sendMail = vi.fn().mockResolvedValue({ messageId: "mocked" });
  return {
    default: { createTransport: () => ({ sendMail }) },
    createTransport: () => ({ sendMail }),
  };
});

beforeAll(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-data-"));
  quotesDir = path.join(tmpDir, "quotes");
  fs.mkdirSync(quotesDir);

  const symbols = [
    { Symbol: "AAPL", "Company Name": "Apple Inc." },
    { Symbol: "MSFT", "Company Name": "Microsoft" },
  ];
  symbolsFile = path.join(tmpDir, "symbols.json");
  fs.writeFileSync(symbolsFile, JSON.stringify(symbols), "utf8");

  const aapl = [
    { date: "2024-10-01", open: 1, high: 2, low: 1, close: 2, volume: 10 },
    { date: "2024-10-02", open: 2, high: 3, low: 2, close: 3, volume: 20 },
  ];
  fs.writeFileSync(path.join(quotesDir, "AAPL.json"), JSON.stringify(aapl), "utf8");

  process.env.SYMBOLS_FILE_PATH = symbolsFile;
  process.env.QUOTES_DIR = quotesDir;
  process.env.WEB_ORIGIN = "http://localhost:5173";
  process.env.EMAIL_FROM = "noreply@example.local";
  process.env.SMTP_HOST = "localhost";
  process.env.SMTP_PORT = "1025";

  // import AFTER env + mocks
  const { preloadSymbols } = await import("../src/services/symbols.js");
  preloadSymbols();
  const mod = await import("../src/app.js");
  app = mod.app;
});

afterAll(() => {
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
});

describe("API v1 (integration via mock data files)", () => {
  it("GET /api/v1/health → 200", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET /api/v1/symbols → symbols list", async () => {
    const res = await request(app).get("/api/v1/symbols");
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual({ symbol: "AAPL", companyName: "Apple Inc." });
    expect(res.body).toContainEqual({ symbol: "MSFT", companyName: "Microsoft" });
  });

  it("POST /api/v1/quotes (inclusive range) → 200 with 2 rows", async () => {
    const res = await request(app)
      .post("/api/v1/quotes")
      .send({ symbol: "AAPL", startDate: "2024-10-01", endDate: "2024-10-02", email: "t@e.com" });
    expect(res.status).toBe(200);
    expect(res.body.symbol).toBe("AAPL");
    expect(res.body.companyName).toBe("Apple Inc.");
    expect(res.body.quotes.length).toBe(2);
  });

  it("POST /api/v1/quotes → 400 on validation error", async () => {
    const res = await request(app)
      .post("/api/v1/quotes")
      .send({ symbol: "", startDate: "2025-10-01", endDate: "2024-01-01", email: "bad" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("POST /api/v1/quotes → 404 when quotes file missing", async () => {
    const res = await request(app)
      .post("/api/v1/quotes")
      .send({ symbol: "NOPE", startDate: "2024-10-01", endDate: "2024-10-02", email: "t@e.com" });
    expect(res.status).toBe(404); // now that ENOENT maps to 404
  });
});
