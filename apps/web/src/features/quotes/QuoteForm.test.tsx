import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, expect, test, vi } from "vitest";

const baseApi = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function setup() {
  const onSuccess = vi.fn();
  render(<QuoteForm onSuccess={onSuccess} apiBase={baseApi} />);
  return { onSuccess };
}

// SymbolSelect is a pain in the ass. Let's mock it
vi.mock("../../components/SymbolSelect", () => ({
  default: ({ onChange, disabled, label = "Company Symbol", error }: any) => (
    <div>
      <label htmlFor="symbol">{label}</label>
      <input
        id="symbol"
        role="combobox"
        placeholder="Search or select a symbol…"
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      {error && <p data-testid="error-message">{error}</p>}
    </div>
  ),
}));

beforeAll(() => {
  vi.stubGlobal("fetch", vi.fn(async (_url, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(init.body as string) : {};
    if (body.symbol === "NOPE") {
      return new Response(JSON.stringify({ error: "Symbol not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

import QuoteForm from "./QuoteForm";

test("shows zod errors for invalid email and dates", async () => {
  setup();

  // Submit empty
  await userEvent.click(screen.getByRole("button", { name: /get quotes/i }));

  expect(await screen.findAllByTestId("error-message")).toHaveLength(4);
  // Fill invalid email
  await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");
  await userEvent.click(screen.getByRole("button", { name: /get quotes/i }));
  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  // Start > End
  await userEvent.type(screen.getByLabelText(/start date/i), "2025-10-03");
  await userEvent.type(screen.getByLabelText(/end date/i), "2025-10-01");
  await userEvent.click(screen.getByRole("button", { name: /get quotes/i }));
  expect(await screen.findByText(/start date must be before/i)).toBeInTheDocument();
});

test("successful submit calls onSuccess", async () => {
  const onSuccess = vi.fn();

  render(
    <QuoteForm
      onSuccess={onSuccess}
      apiBase={baseApi}
      defaultValues={{
        symbol: "AAPL",
        email: "you@example.com",
        startDate: "2025-10-01",
        endDate: "2025-10-02",
      }}
    />
  );

  await userEvent.click(screen.getByRole("button", { name: /get quotes/i }));
  expect(onSuccess).toHaveBeenCalledTimes(1);
});

test("server 404 maps to symbol field error", async () => {
  render(
    <QuoteForm
      onSuccess={() => {}}
      apiBase={baseApi}
      defaultValues={{
        symbol: "NOPE", 
        email: "you@example.com",
        startDate: "2025-10-01",
        endDate: "2025-10-02",
      }}
    />
  );

  await userEvent.click(screen.getByRole("button", { name: /get quotes/i }));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/symbol not found/i);
});

test("updates symbol via onChange handler", async () => {
  const onSuccess = vi.fn();
  render(<QuoteForm onSuccess={onSuccess} apiBase={baseApi} />);

  await userEvent.type(screen.getByRole("combobox"), "AAPL");

  expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("AAPL");
});