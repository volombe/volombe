// ──────────────────────────────────────────────
// lib/animations.ts — Variantes Framer Motion réutilisables
// ──────────────────────────────────────────────

import type { Variants } from "framer-motion";

// ── Ease curves premium ────────────────────────
export const ease = {
  premium:  [0.25, 0.46, 0.45, 0.94] as const,
  out:      [0.0, 0.0, 0.2, 1.0] as const,
  inOut:    [0.4, 0.0, 0.2, 1.0] as const,
  spring:   { type: "spring", stiffness: 80, damping: 20 },
  reveal:   [0.77, 0, 0.175, 1] as const,
} as const;

// ── Apparition depuis le bas ───────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

// ── Apparition simple ──────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: ease.out },
  },
};

// ── Apparition depuis la gauche ────────────────
export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

// ── Apparition depuis la droite ───────────────
export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: ease.premium },
  },
};

// ── Scale reveal ──────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: ease.premium },
  },
};

// ── Container stagger ─────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// ── Container stagger lent ───────────────────
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// ── Ligne qui grandit ────────────────────────
export const lineGrow: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: ease.reveal },
  },
};

// ── Texte caractère par caractère ────────────
export const charReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.6, ease: ease.reveal },
  },
};

// ── Image parallax ────────────────────────────
export const imageParallax = (yRange: [number, number] = [-30, 30]) => ({
  initial: { y: yRange[0] },
  animate: { y: yRange[1] },
});

// ── Hover card ────────────────────────────────
export const cardHover = {
  rest: { y: 0, transition: { duration: 0.4, ease: ease.premium } },
  hover: { y: -8, transition: { duration: 0.4, ease: ease.premium } },
};

// ── Hover image zoom ──────────────────────────
export const imageZoom = {
  rest: { scale: 1, transition: { duration: 0.6, ease: ease.premium } },
  hover: { scale: 1.04, transition: { duration: 0.6, ease: ease.premium } },
};
