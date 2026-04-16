"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

// ──────────────────────────────────────────────
// Style maps
// ──────────────────────────────────────────────
const variantStyles: Record<Variant, string> = {
  primary:
    "bg-obsidian text-cream-50 hover:bg-stone-deep border border-obsidian hover:border-stone-deep",
  secondary:
    "bg-cream-200 text-obsidian hover:bg-sand border border-cream-200 hover:border-sand",
  ghost:
    "bg-transparent text-obsidian hover:bg-cream-100 border border-transparent",
  outline:
    "bg-transparent text-obsidian border border-stone-warm/40 hover:border-obsidian",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2.5 text-xs tracking-widest",
  md: "px-8 py-3.5 text-xs tracking-widest",
  lg: "px-10 py-4   text-sm  tracking-widest",
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "right",
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center gap-2.5",
          "font-sans font-medium uppercase",
          "rounded-none", // Carré — esthétique luxe
          "transition-colors duration-300",
          "cursor-pointer select-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          // Variante + taille
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isDisabled}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Icône gauche */}
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Texte */}
        <span className={loading ? "opacity-0" : ""}>{children}</span>

        {/* Icône droite */}
        {icon && iconPosition === "right" && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}

        {/* Loader */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
