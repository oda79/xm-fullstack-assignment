import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import SymbolSelect from "../../components/SymbolSelect";
import { QuoteRequestSchema, type QuoteRequest } from "@xm-schema/shared";

type Props = {
  onSuccess: (payload: any) => void;
  apiBase: string;
  defaultValues?: Partial<QuoteRequest>;
};

export default function QuoteForm({
  onSuccess,
  apiBase,
  defaultValues,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequest>({
    resolver: zodResolver(QuoteRequestSchema),
    defaultValues: {
      email: "",
      symbol: "",
      startDate: "",
      endDate: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (values: QuoteRequest) => {
    setServerError(null);
    try {
      const res = await fetch(`${apiBase}/api/v1/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {        
        const body = await res.json().catch(() => ({}));
        const msg =
          body?.error?.formErrors?.join?.(", ") ||
          body?.error?.fieldErrors && Object.values(body.error.fieldErrors).flat().join(", ") ||
          body?.error?.message ||
          body?.error ||
          `Request failed: ${res.status}`;
        throw new Error(String(msg));
      }

      const payload = await res.json();
      onSuccess(payload);
    } catch (err: any) {
      setServerError(err?.message ?? "Unexpected error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-start sm:py-12">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white shadow rounded-2xl p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900">Quotes Service</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pick a company symbol, date range, and where to email the summary.
          </p>

          {serverError && <Alert className="mt-3">{serverError}</Alert>}

          <form className="mt-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <SymbolSelect
              label="Company Symbol"
              id="symbol"
              helpText="Start typing to search"
              error={errors.symbol?.message}
              required
              onChange={(v) =>
                setValue("symbol", v ?? "", { shouldValidate: true, shouldDirty: true })
              }
              disabled={isSubmitting}
              apiBase={apiBase!}
            />

            <InputField
              label="Email"
              placeholder="you@example.com"
              disabled={isSubmitting}
              error={errors.email?.message}
              required
              {...register("email")}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Start Date"
                id="startDate"
                type="date"
                disabled={isSubmitting}
                error={errors.startDate?.message}
                required
                {...register("startDate")}
              />
              <InputField
                label="End Date"
                type="date"
                disabled={isSubmitting}
                error={errors.endDate?.message}
                required
                {...register("endDate")}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
                Get Quotes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
