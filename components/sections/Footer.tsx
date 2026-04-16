"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { fadeUp, staggerContainer, lineGrow } from "@/lib/animations";
import { navLinks, siteConfig } from "@/lib/data";

// ──────────────────────────────────────────────
// Footer — Élégant et complet
// ──────────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Politique de confidentialité",  href: "/privacy" },
    { label: "CGV & CGU",                     href: "/cgv" },
    { label: "Retours & Remboursements",       href: "/retours" },
  ];

  const paymentMethods = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"];

  return (
    <footer className="bg-obsidian text-cream-200/70">

      {/* ── Bande de navigation du footer ────────── */}
      <div className="border-b border-cream-200/10">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
          >

            {/* ── Colonne 1 : Brand ─────────────── */}
            <motion.div variants={fadeUp} className="lg:col-span-2">
              {/* Logo */}
              <Link href="/" className="group inline-block mb-6">
                <span className="font-serif text-2xl tracking-[0.12em] text-cream-50 uppercase">
                  Volombe
                </span>
              </Link>

              {/* Ligne décorative */}
              <AnimatedSection variants={lineGrow} className="w-8 h-px bg-gold mb-6">{null}</AnimatedSection>

              {/* Tagline */}
              <p className="text-sm font-sans font-light leading-loose max-w-xs mb-8 text-cream-200/60">
                {siteConfig.tagline}
              </p>

              {/* Réseaux sociaux */}
              <div className="flex items-center gap-4">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-10 h-10 border border-cream-200/15 hover:border-cream-200/40 hover:text-cream-50 transition-all duration-300"
                  aria-label="Instagram Volombe"
                >
                  <Instagram size={16} strokeWidth={1.5} />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center justify-center w-10 h-10 border border-cream-200/15 hover:border-cream-200/40 hover:text-cream-50 transition-all duration-300"
                  aria-label="Email Volombe"
                >
                  <Mail size={16} strokeWidth={1.5} />
                </a>
              </div>
            </motion.div>

            {/* ── Colonne 2 : Navigation ────────── */}
            <motion.div variants={fadeUp}>
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-cream-50/50 font-sans mb-6">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-sans font-light text-cream-200/60 hover:text-cream-50 transition-colors duration-300 underline-animate"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Colonne 3 : Contact & Infos ───── */}
            <motion.div variants={fadeUp}>
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-cream-50/50 font-sans mb-6">
                Contact & Aide
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm font-sans font-light text-cream-200/60 hover:text-cream-50 transition-colors duration-300"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <p className="text-sm font-sans font-light text-cream-200/40">
                    Livraison dans 40+ pays
                  </p>
                </li>
                <li>
                  <p className="text-sm font-sans font-light text-cream-200/40">
                    Réponse sous 24-48h
                  </p>
                </li>
              </ul>

              {/* Moyens de paiement */}
              <div className="mt-8">
                <h4 className="text-[10px] uppercase tracking-[0.25em] text-cream-50/50 font-sans mb-4">
                  Paiements acceptés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="text-[9px] uppercase tracking-wide font-sans text-cream-200/40 border border-cream-200/10 px-2 py-1"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-6 lg:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-[11px] font-sans text-cream-200/30 order-2 sm:order-1">
            © {currentYear} Volombe. Tous droits réservés.
          </p>

          {/* Liens légaux */}
          <nav className="flex items-center gap-6 order-1 sm:order-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.12em] font-sans text-cream-200/30 hover:text-cream-200/60 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

        </div>
      </div>

    </footer>
  );
}
