"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { values } from "@/lib/data";
import { fadeUp, staggerContainer, lineGrow } from "@/lib/animations";

// ──────────────────────────────────────────────
// Values — Section valeurs de marque
// ──────────────────────────────────────────────
export default function Values() {
  return (
    <section className="bg-obsidian py-section px-6 lg:px-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">

        {/* ── En-tête ──────────────────────────────── */}
        <AnimatedSection className="mb-20 lg:mb-28">
          <div className="flex flex-col items-center text-center">
            <motion.span
              variants={fadeUp}
              className="block text-[10px] uppercase tracking-[0.35em] text-sand-200/60 font-sans mb-4"
            >
              Nos Engagements
            </motion.span>
            <AnimatedSection
              variants={lineGrow}
              className="w-12 h-px bg-gold mb-8"
            >{null}</AnimatedSection>
            <AnimatedSection variants={fadeUp}>
              <h2 className="font-serif text-display-lg text-cream-50 text-balance max-w-2xl">
                Ce qui nous définit,
                <br />
                ce qui nous{" "}
                <em className="not-italic text-sand-200">distingue</em>
              </h2>
            </AnimatedSection>
          </div>
        </AnimatedSection>

        {/* ── Grille valeurs ────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cream-200/10"
        >
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              variants={fadeUp}
              custom={i}
              className="relative bg-obsidian p-8 lg:p-10 group"
            >
              {/* Hover accent */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Icône */}
              <div className="text-2xl text-gold mb-8 font-serif select-none">
                {value.icon}
              </div>

              {/* Ligne décorative */}
              <div className="w-8 h-px bg-gold/40 mb-6 group-hover:w-16 transition-all duration-500" />

              {/* Titre */}
              <h3 className="font-serif text-xl text-cream-50 mb-4 leading-tight">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-sand-200/60 font-sans font-light leading-loose">
                {value.description}
              </p>

              {/* Numéro décoratif */}
              <div className="absolute top-6 right-8 font-serif text-5xl text-cream-200/5 select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Citation ──────────────────────────────── */}
        <AnimatedSection className="mt-20 lg:mt-28 max-w-2xl mx-auto text-center">
          <div className="relative">
            {/* Guillemets décoratifs */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-8xl text-gold/15 select-none leading-none">
              "
            </span>
            <AnimatedSection variants={fadeUp}>
              <blockquote className="font-serif text-xl lg:text-2xl text-cream-200/80 italic leading-relaxed">
                La lumière brille dans les ténèbres,
                <br />
                et les ténèbres ne l&apos;ont point reçue.
              </blockquote>
              <cite className="block mt-6 text-[10px] uppercase tracking-[0.3em] text-sand-200/40 font-sans not-italic">
                Jean 1:5
              </cite>
            </AnimatedSection>
          </div>
        </AnimatedSection>

      </div>
    </section>
  );
}
