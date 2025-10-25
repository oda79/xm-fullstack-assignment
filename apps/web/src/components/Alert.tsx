import cn from "../utils/cn";

export default function Alert({
  kind = "error",
  children,
  className,
}: {
  kind?: "error" | "success" | "info" | "warning";
  children: React.ReactNode;
  className?: string;
}) {
  // success, info, warning are for futur use
  const tone =
    kind === "success"
      ? "bg-green-50 text-green-800 border-green-300"
      : kind === "info"
      ? "bg-blue-50 text-blue-800 border-blue-300"
      : kind === "warning"
      ? "bg-yellow-50 text-yellow-800 border-yellow-300"
      : "bg-red-50 text-red-800 border-red-300";

  return (
    <div className={cn("rounded border px-4 py-3", tone, className)} data-testid="alert" role="alert">
      {children}
    </div>
  );
}
