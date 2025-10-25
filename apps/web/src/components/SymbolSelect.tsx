import {useState, useEffect} from "react";
import Select from "react-select";
import type { SymbolLookup } from "@xm-schema/shared";

type Props = {
  label: string;
  id: string;
  onChange: (v: string | null) => void;
  disabled?: boolean;
  apiBase: string;
  helpText?: string;
  error?: string;
  required?: boolean;
};

export default function SymbolSelect({
  label,
  id,
  onChange,
  disabled,
  apiBase,
  helpText,
  error,
  required
}: Props) {
  const [options, setOptions] = useState<SymbolLookup[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`${apiBase}/api/v1/symbols`)
      .then(r => r.json())
      .then((data: SymbolLookup[]) => {
        if (ignore) return;
        setOptions((data ?? []));
      })
      .catch(() => {
        if (!ignore) setOptions([]);
      })
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [apiBase]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        inputId={id}
        options={options}
        isDisabled={disabled || loading}
        isLoading={loading}
        onChange={(opt) => onChange(opt ? (opt as SymbolLookup).value : null)}
        placeholder="Search or select a symbol…"
        noOptionsMessage={() => "No symbols found"}
      />
      {error ? (
        <p role="alert" data-testid="error-message" className="text-xs text-red-600">{error}</p>
      ) : helpText ? (
        <p className="text-xs text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
}
