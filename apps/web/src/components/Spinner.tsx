import cn from "../utils/cn";

type SpinnerProps = {
  size?: number; 
  className?: string;
};

export default function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M22 12a10 10 0 0 1-10 10"
      />
    </svg>
  );
}
