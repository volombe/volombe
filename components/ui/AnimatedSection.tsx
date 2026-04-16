"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Variants } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  threshold?: number;
}

// Variante par défaut
const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * Wrapper d'animation au scroll — s'anime à l'apparition dans le viewport.
 * Utilise useInView de Framer Motion pour déclencher l'animation.
 */
export default function AnimatedSection({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
  once = true,
  threshold = 0.15,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  // Injection du delay dans les variants
  const delayedVariants: Variants = delay
    ? {
        ...variants,
        visible: {
          ...(variants.visible as object),
          transition: {
            ...(typeof variants.visible === "object" &&
            "transition" in variants.visible
              ? (variants.visible.transition as object)
              : {}),
            delay,
          },
        },
      }
    : variants;

  return (
    <motion.div
      ref={ref}
      variants={delayedVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
