import { render, screen } from "@testing-library/react";
import Results from "./Results";
import { expect, test, vi } from "vitest";

vi.mock("recharts", () => {
  // dumb stubs to avoid layout warnings
  return {
    LineChart: (p: any) => <div data-testid="chart">{p.children}</div>,
    Line: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    CartesianGrid: () => <div />,
    Legend: () => <div />,
    ResponsiveContainer: (p: any) => <div>{p.children}</div>,
  };
});

test("renders company and table rows", () => {
  const data = {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    range: { startDate: "2025-10-01", endDate: "2025-10-02" },
    quotes: [
      { date: "2025-10-01", open: 1, high: 2, low: 0.5, close: 1.5, volume: 100 },
      { date: "2025-10-02", open: 1.6, high: 2.2, low: 1.2, close: 2.0, volume: 90 },
    ],
  };

  render(<Results data={data} onBack={() => {}} />);

  expect(screen.getByText(/apple inc/i)).toBeInTheDocument();
  // table cells
  expect(screen.getByText("2025-10-01")).toBeInTheDocument();
  expect(screen.getByText("2025-10-02")).toBeInTheDocument();
  expect(screen.getByTestId("chart")).toBeInTheDocument();
});
