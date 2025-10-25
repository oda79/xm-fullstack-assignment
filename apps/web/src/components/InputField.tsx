import React from "react";
import cn from "../utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helpText?: string;
};

const InputField = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, helpText, required, className, id, ...rest }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <input
          id={inputId}
          ref={ref}
          className={cn(
            "block w-full rounded border px-3 py-2 outline-none",
            "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            error && "border-red-400 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...rest}
        />

        {error ? (
          <p role="alert" data-testid="error-message" className="mt-1 text-xs text-red-600">{error}</p>
        ) : helpText ? (
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
