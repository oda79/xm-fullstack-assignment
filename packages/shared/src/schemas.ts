import { z } from "zod";

export const SymbolSchema = z.string().min(1, "Symbol is required");

export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Valid date format is YYYY-MM-DD")
  .superRefine((val, ctx) => {
    const d = new Date(val + "T00:00:00Z");
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date" });
      return;
    }
    const today = new Date();
    const endOfToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    if (d.getTime() > endOfToday.getTime()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Date cannot be in the future" });
    }
  });

export const SymbolRowSchema = z.object({
  Symbol: z.string(),
  "Company Name": z.string(),
  "Financial Status": z.string().optional(),
  "Market Category": z.string().optional(),
  "Round Lot Size": z.number().optional(),
  "Security Name": z.string().optional(),
  "Test Issue": z.string().optional(),
});

// Symbols Lookup for API/frontend
export const SymbolLookupSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const QuoteRequestSchema = z.object({
  symbol: SymbolSchema,
  startDate: IsoDateSchema,
  endDate: IsoDateSchema,
  email: z.string().email("Invalid email")
}).refine(
  ({ startDate, endDate }) => new Date(startDate) <= new Date(endDate),
  { message: "Start date must be before or equal to end date", path: ["endDate"] }
);

export const QuoteRowSchema = z.object({
  date: IsoDateSchema,
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().int()
});

export const QuoteResponseSchema = z.object({
  symbol: SymbolSchema,
  companyName: z.string(),
  range: z.object({ startDate: IsoDateSchema, endDate: IsoDateSchema }),
  quotes: z.array(QuoteRowSchema)
});

export type SymbolRow = z.infer<typeof SymbolRowSchema>;
export type SymbolLookup = z.infer<typeof SymbolLookupSchema>;
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;
export type QuoteRow = z.infer<typeof QuoteRowSchema>;
export type QuoteResponse = z.infer<typeof QuoteResponseSchema>;
