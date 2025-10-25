import cn from "../utils/cn";
import Spinner from "./Spinner";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({ loading, className, children, ...rest }: Props) {
  return (
    <button
      disabled={loading || rest.disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-white",
        "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        "shadow-sm transition",
        className
      )}
      {...rest}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
