import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { QuoteRequest } from "@xm-schema/shared";

const symbols = [
  { label: "Apple Inc. (AAPL)", value: "AAPL" },
  { label: "AAON, Inc. (AAON)", value: "AAON" },
];

const baseApi = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const server = setupServer(
  // GET /symbols
  http.get(`${baseApi}/api/v1/symbols`, () => {
    return HttpResponse.json(symbols);
  }),

  // POST /quotes success
  http.post(`${baseApi}/api/v1/quotes`, async ({ request }) => {
    const body = await request.json() as QuoteRequest;
    if (body.symbol === "NOPE") {
      return HttpResponse.json({ error: "Symbol not found" }, { status: 404 });
    }
    return HttpResponse.json({
      symbol: body.symbol,
      companyName: body.symbol === "AAPL" ? "Apple Inc." : body.symbol,
      range: { startDate: body.startDate, endDate: body.endDate },
      quotes: [
        { date: "2025-10-01", open: 1, high: 2, low: 0.5, close: 1.5, volume: 100 },
        { date: "2025-10-02", open: 1.6, high: 2.2, low: 1.2, close: 2.0, volume: 90 },
      ],
    });
  }),
);
