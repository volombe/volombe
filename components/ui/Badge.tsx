import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1",
        "text-[10px] font-sans font-medium uppercase tracking-[0.2em]",
        "rounded-none",
        {
          "bg-obsidian text-cream-50":    variant === "default",
          "bg-gold text-obsidian":         variant === "gold",
          "border border-stone-warm/40 text-stone-warm": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
