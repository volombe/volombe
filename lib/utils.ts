import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitaire de fusion de classes Tailwind CSS
 * Combine clsx et tailwind-merge pour éviter les conflits de classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix avec la devise
 */
export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Retarde l'exécution (pour les animations staggered)
 */
export function staggerDelay(index: number, base = 0.1): number {
  return index * base;
}
