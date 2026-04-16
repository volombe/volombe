"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { fadeUp, lineGrow } from "@/lib/animations";

// ──────────────────────────────────────────────
// Newsletter — Inscription email premium
// ──────────────────────────────────────────────
export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simuler un appel API
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="relative bg-cream-200 py-section px-6 lg:px-12 overflow-hidden">
      {/* Motif décoratif de fond */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-gold/5 to-transparent" />
      </div>

      <div className="container mx-auto max-w-2xl relative z-10">
        <AnimatedSection className="text-center">

          {/* Kicker */}
          <motion.span
            variants={fadeUp}
            className="block text-[10px] uppercase tracking-[0.35em] text-stone-warm font-sans mb-4"
          >
            Restez informé
          </motion.span>

          {/* Ligne */}
          <AnimatedSection variants={lineGrow} className="w-12 h-px bg-gold mx-auto mb-8" >{null}</AnimatedSection>

          {/* Titre */}
          <AnimatedSection variants={fadeUp}>
            <h2 className="font-serif text-display-md text-obsidian mb-4 text-balance">
              Les premières à savoir
            </h2>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection variants={fadeUp} delay={0.1}>
            <p className="text-sm text-stone-warm font-sans font-light leading-loose mb-10">
              Inscrivez-vous pour recevoir en avant-première nos nouvelles collections,
              éditions limitées et contenus exclusifs. Pas de spam — que de l&apos;essentiel.
            </p>
          </AnimatedSection>

          {/* Formulaire */}
          <AnimatedSection variants={fadeUp} delay={0.2}>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className={[
                      "flex-1 px-5 py-3.5",
                      "text-sm font-sans font-light",
                      "bg-cream-50 border border-cream-300",
                      "text-obsidian placeholder:text-stone-warm/50",
                      "outline-none focus:border-obsidian",
                      "transition-colors duration-300",
                      "rounded-none",
                    ].join(" ")}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="flex-shrink-0 sm:border-l-0"
                  >
                    S&apos;inscrire
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 text-obsidian"
                >
                  <CheckCircle size={20} className="text-gold flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-sm font-sans">
                    Merci ! Vous serez parmi les premiers informés.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedSection>

          {/* RGPD */}
          <AnimatedSection variants={fadeUp} delay={0.3} className="mt-5">
            <p className="text-[10px] text-stone-warm/50 font-sans">
              En vous inscrivant, vous acceptez notre{" "}
              <a href="/privacy" className="underline hover:text-stone-warm transition-colors duration-200">
                politique de confidentialité
              </a>
              .
            </p>
          </AnimatedSection>

        </AnimatedSection>
      </div>
    </section>
  );
}
