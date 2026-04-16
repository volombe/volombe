"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [cartCount]                     = useState(0);
  const { scrollY }                     = useScroll();

  // Détection scroll
  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setIsScrolled(y > 60));
    return unsub;
  }, [scrollY]);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Opacité du fond au scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <>
      {/* ── Barre principale ─────────────────────── */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-colors duration-500"
        )}
        style={{ "--bg-opacity": bgOpacity } as React.CSSProperties}
      >
        {/* Fond dynamique au scroll */}
        <motion.div
          className="absolute inset-0 bg-cream-50/95 backdrop-blur-md border-b border-cream-200"
          style={{ opacity: bgOpacity }}
        />

        <div className="relative container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* ── Logo ───────────────────────────── */}
            <Link href="/" className="relative z-10 group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="font-serif text-xl lg:text-2xl tracking-[0.12em] text-obsidian uppercase">
                  Volombe
                </span>
              </motion.div>
            </Link>

            {/* ── Navigation desktop ──────────────── */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[11px] uppercase tracking-[0.18em] font-sans font-medium",
                    "text-stone-warm hover:text-obsidian",
                    "transition-colors duration-300",
                    "underline-animate"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Actions droite ──────────────────── */}
            <div className="flex items-center gap-4">
              {/* Recherche */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex text-stone-warm hover:text-obsidian transition-colors duration-300"
                aria-label="Rechercher"
              >
                <Search size={18} strokeWidth={1.5} />
              </motion.button>

              {/* Panier */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative text-stone-warm hover:text-obsidian transition-colors duration-300"
                aria-label="Panier"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-obsidian text-cream-50 text-[9px] flex items-center justify-center rounded-full font-medium">
                    {cartCount}
                  </span>
                )}
              </motion.button>

              {/* Menu burger mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden text-stone-warm hover:text-obsidian transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Menu mobile plein écran ───────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-cream-50 flex flex-col"
          >
            <div className="flex flex-col justify-center items-start h-full px-8 gap-8 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-4xl text-obsidian hover:text-stone-warm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Footer du menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-12 left-8 right-8"
              >
                <div className="line-separator mb-6" />
                <p className="text-xs uppercase tracking-[0.2em] text-stone-warm font-sans">
                  Brodé en France · sav.contact@volombe.fr
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
