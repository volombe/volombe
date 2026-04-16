"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, lineGrow } from "@/lib/animations";

// ──────────────────────────────────────────────
// Storytelling — Section "Notre Histoire"
// Images alternées gauche/droite + texte
// ──────────────────────────────────────────────

interface StoryBlockProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  text: string;
  reverse?: boolean;
  index: number;
}

function StoryBlock({
  image,
  imageAlt,
  eyebrow,
  title,
  text,
  reverse = false,
  index,
}: StoryBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY    = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const imageYSpring = useSpring(imageY, { damping: 25, stiffness: 80 });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${reverse ? "" : ""}`}
    >
      {/* Image */}
      <AnimatedSection
        variants={reverse ? fadeRight : fadeLeft}
        className={`relative h-[65vw] lg:h-[680px] overflow-hidden ${reverse ? "lg:order-2" : ""}`}
      >
        <motion.div className="absolute inset-0 w-full h-full" style={{ y: imageYSpring }}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
        {/* Numéro de section */}
        <div className="absolute top-8 right-8 font-serif text-7xl text-cream-50/10 select-none">
          0{index + 1}
        </div>
      </AnimatedSection>

      {/* Texte */}
      <AnimatedSection
        variants={reverse ? fadeLeft : fadeRight}
        className={`flex items-center bg-cream-50 ${reverse ? "lg:order-1" : ""}`}
      >
        <div className="px-10 lg:px-16 xl:px-20 py-16 lg:py-0 max-w-lg">
          {/* Eyebrow */}
          <motion.span
            variants={fadeUp}
            className="block text-[10px] uppercase tracking-[0.3em] text-stone-warm font-sans mb-6"
          >
            {eyebrow}
          </motion.span>

          {/* Ligne décorative */}
          <AnimatedSection variants={lineGrow} className="w-12 h-px bg-gold mb-8" >{null}</AnimatedSection>

          {/* Titre */}
          <AnimatedSection variants={fadeUp}>
            <h2 className="font-serif text-display-md text-obsidian mb-6 text-balance">
              {title}
            </h2>
          </AnimatedSection>

          {/* Texte */}
          <AnimatedSection variants={fadeUp} delay={0.1}>
            <p className="text-sm lg:text-base text-stone-warm font-sans font-light leading-loose">
              {text}
            </p>
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </div>
  );
}

// ──────────────────────────────────────────────
// Section principale
// ──────────────────────────────────────────────
export default function Storytelling() {
  const stories = [
    {
      image: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=900&q=80",
      imageAlt: "Artisan brodant un vêtement Volombe",
      eyebrow: "Notre Origine",
      title: "Né d'une conviction profonde",
      text: "Volombe est né d'un constat simple : la foi mérite d'être portée avec autant de soin que n'importe quelle autre conviction. Nous avons créé des vêtements qui permettent à chacun de porter sa spiritualité avec dignité, élégance et fierté.",
    },
    {
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80",
      imageAlt: "Détail broderie Volombe — croix et iconographie",
      eyebrow: "L'Artisanat",
      title: "Chaque point\nest une intention",
      text: "Nos broderies sont réalisées à la main par des artisans français. Les motifs — croix, gravures de Gustave Doré, symboles sacrés — sont sélectionnés avec soin pour leur signification profonde et leur beauté intemporelle.",
    },
    {
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80",
      imageAlt: "Vêtements Volombe en situation",
      eyebrow: "La Vision",
      title: "Redorer l'image\nchrétienne",
      text: "Notre mission est claire : montrer que la foi chrétienne peut s'exprimer avec modernité et classe. Pas de compromis entre convictions et style — Volombe prouve que les deux peuvent coexister avec grâce.",
    },
  ];

  return (
    <section className="bg-cream-50">
      {/* En-tête de section */}
      <AnimatedSection className="text-center py-20 lg:py-28 px-6">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span
            variants={fadeUp}
            className="block text-[10px] uppercase tracking-[0.35em] text-stone-warm font-sans mb-4"
          >
            Notre Histoire
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif text-display-lg text-obsidian text-balance"
          >
            La foi portée
            <br />
            <em className="not-italic text-gold">avec élégance</em>
          </motion.h2>
        </motion.div>
      </AnimatedSection>

      {/* Blocs stories */}
      {stories.map((story, i) => (
        <StoryBlock key={i} {...story} index={i} reverse={i % 2 !== 0} />
      ))}

      {/* CTA vers la page histoire */}
      <AnimatedSection className="text-center py-20 lg:py-28 px-6">
        <Link href="/histoire">
          <Button variant="outline" size="lg">
            Lire l&apos;histoire complète
          </Button>
        </Link>
      </AnimatedSection>
    </section>
  );
}
