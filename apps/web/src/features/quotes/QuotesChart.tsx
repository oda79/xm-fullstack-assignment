import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { type QuoteRow } from "@xm-schema/shared";

export default React.memo(function QuotesChart({ rows }: { rows: QuoteRow[] }) {
  const data = useMemo(
    () =>
      rows.map(r => ({
        date: r.date,
        open: r.open,
        close: r.close,
      })),
    [rows]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-base font-semibold text-gray-900">Open vs Close</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#6366F1" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="close" stroke="#10B981" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
})
