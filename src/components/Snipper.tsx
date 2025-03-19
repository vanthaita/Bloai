import { cn } from "@/lib/utils";

export default function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-8 w-8", className)}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bloai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" /> 
        </linearGradient>
      </defs>
      
      <path
        d="M32 58C46.3594 58 58 46.3594 58 32C58 17.6406 46.3594 6 32 6C17.6406 6 6 17.6406 6 32C6 46.3594 17.6406 58 32 58Z"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="8"
        fill="none"
      />
      
      <path
        d="M32 6C17.6406 6 6 17.6406 6 32"
        stroke="url(#bloai-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}