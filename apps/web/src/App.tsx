import { useState } from "react";
import QuoteForm from "./features/quotes/QuoteForm";
import Results from "./features/quotes/Results";
import { type QuoteResponse } from "@xm-schema/shared";

export default function App() {
  console.log(import.meta.env);
  const baseApi = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
  const [data, setData] = useState<QuoteResponse | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
        {!data ? (
          <QuoteForm onSuccess={setData} apiBase={baseApi} />
        ) : (
          <Results data={data} onBack={() => setData(null)} />
        )}
    </div>
  );
}
