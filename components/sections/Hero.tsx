"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/animations";

// ──────────────────────────────────────────────
// Hero — Section plein écran avec parallax
// ──────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax image (plus lente que le scroll)
  const imageY    = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageYSpring = useSpring(imageY, { damping: 20, stiffness: 100 });

  // Opacity du contenu qui disparaît au scroll
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY       = useTransform(scrollYProgress, [0, 0.4], ["0%", "-15%"]);

  // Scroll indicator
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
    >
      {/* ── Image de fond avec parallax ──────────── */}
      <motion.div
        className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
        style={{ y: imageYSpring }}
      >
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85"
          alt="Volombe — Vêtements chrétiens premium brodés en France"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay dégradé */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/30 to-obsidian/70" />
      </motion.div>

      {/* ── Contenu hero ──────────────────────────── */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 max-w-4xl"
        >
          {/* Kicker line */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-cream-200/80 font-sans font-medium">
              <span className="w-8 h-px bg-cream-200/50" />
              Brodé en France
              <span className="w-8 h-px bg-cream-200/50" />
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            variants={fadeUp}
            className="font-serif text-display-xl text-cream-50 text-balance leading-[1.05]"
          >
            Portez votre
            <br />
            <em className="not-italic text-sand-200">foi</em>{" "}
            avec grâce.
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={fadeUp}
            className="text-sm lg:text-base text-cream-200/75 font-sans font-light max-w-md leading-relaxed"
          >
            Vêtements chrétiens premium. Chaque pièce est brodée à la main
            par des artisans français — une alliance rare entre foi et élégance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <Link href="/collection">
              <Button
                variant="secondary"
                size="lg"
                className="bg-cream-50 text-obsidian hover:bg-cream-200 border-cream-50"
              >
                Découvrir la collection
              </Button>
            </Link>
            <Link href="/histoire">
              <Button
                variant="ghost"
                size="lg"
                className="text-cream-200 hover:text-cream-50 border border-cream-200/30 hover:border-cream-200/60"
              >
                Notre histoire
              </Button>
            </Link>
          </motion.div>

          {/* Badges de preuve sociale */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-6 mt-4"
          >
            {[
              { value: "300g/m²", label: "Coton premium" },
              { value: "40+", label: "Pays livrés" },
              { value: "100%", label: "Brodé en France" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-serif text-xl text-cream-50">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-cream-200/60 font-sans mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: arrowOpacity }}
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-cream-200/60 font-sans">
          Défiler
        </span>
        <ArrowDown size={14} className="text-cream-200/60" strokeWidth={1.5} />
      </motion.div>

      {/* ── Édition limitée bandeau ───────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="text-[9px] uppercase tracking-[0.4em] text-cream-200/30 font-sans py-3 px-8 inline-block"
            >
              Édition Limitée · Brodé en France · Collection Chrétienne ·
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
