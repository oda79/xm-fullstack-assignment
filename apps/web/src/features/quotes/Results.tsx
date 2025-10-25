import DataTable, { type Column } from "../../components/DataTable";
import QuotesChart from "./QuotesChart";
import { QuoteResponse, type QuoteRow } from "@xm-schema/shared";

export default function Results({
  data,
  onBack,
}: {
  data: QuoteResponse;
  onBack: () => void;
}) {
  const columns: Column<QuoteRow>[] = [
    { header: "Date", accessor: r => r.date, sortKey: r => r.date, className: "whitespace-nowrap" },
    { header: "Open", accessor: r => r.open.toFixed(2), sortKey: r => r.open, className: "text-right" },
    { header: "Close", accessor: r => r.close.toFixed(2), sortKey: r => r.close, className: "text-right" },
    { header: "High", accessor: r => r.high.toFixed(2), sortKey: r => r.high, className: "text-right" },
    { header: "Low", accessor: r => r.low.toFixed(2), sortKey: r => r.low, className: "text-right" },
    { header: "Volume", accessor: r => r.volume.toLocaleString(), sortKey: r => r.volume, className: "text-right" },
  ];

  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{data.companyName} <span className="text-gray-500">({data.symbol})</span></h2>
        <button onClick={onBack} className="text-sm text-blue-600 rounded-xl px-4 py-2 hover:underline">← Back to form</button>
      </div>
          <QuotesChart rows={data.quotes} />
          <DataTable data={data.quotes} columns={columns} initialSort={{ index: 0, dir: "asc" }} />
    </div>

  );
}
