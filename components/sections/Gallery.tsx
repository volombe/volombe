"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { galleryItems } from "@/lib/data";
import { fadeUp, scaleIn, lineGrow } from "@/lib/animations";

// ──────────────────────────────────────────────
// Gallery — Galerie immersive Masonry
// ──────────────────────────────────────────────

interface GalleryImageProps {
  src: string;
  alt: string;
  index: number;
  className?: string;
}

function GalleryImage({ src, alt, index, className = "" }: GalleryImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax léger alterné
  const yRange = index % 2 === 0 ? [-20, 20] : [20, -20];
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden bg-cream-200 ${className}`}
    >
      <motion.div className="absolute inset-0 w-full h-[110%] -top-[5%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-obsidian/0 hover:bg-obsidian/20 transition-colors duration-500" />
    </motion.div>
  );
}

export default function Gallery() {
  return (
    <section className="bg-cream-100 py-section px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">

        {/* ── En-tête ──────────────────────────────── */}
        <AnimatedSection className="mb-16 lg:mb-20 text-center">
          <motion.span
            variants={fadeUp}
            className="block text-[10px] uppercase tracking-[0.35em] text-stone-warm font-sans mb-4"
          >
            L&apos;Univers Volombe
          </motion.span>
          <AnimatedSection variants={lineGrow} className="w-12 h-px bg-gold mx-auto mb-8" >{null}</AnimatedSection>
          <AnimatedSection variants={fadeUp}>
            <h2 className="font-serif text-display-lg text-obsidian text-balance">
              Une esthétique
              <br />
              <em className="not-italic text-gold">intemporelle</em>
            </h2>
          </AnimatedSection>
        </AnimatedSection>

        {/* ── Grille Masonry ────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">

          {/* Ligne 1 : grande image + colonne droite */}
          <GalleryImage
            src={galleryItems[0].src}
            alt={galleryItems[0].alt}
            index={0}
            className="col-span-2 lg:col-span-2 row-span-1 aspect-[16/9] lg:aspect-[16/10]"
          />
          <GalleryImage
            src={galleryItems[1].src}
            alt={galleryItems[1].alt}
            index={1}
            className="col-span-2 sm:col-span-1 aspect-square"
          />

          {/* Ligne 2 */}
          <GalleryImage
            src={galleryItems[2].src}
            alt={galleryItems[2].alt}
            index={2}
            className="col-span-1 row-span-2 aspect-[2/3]"
          />
          <GalleryImage
            src={galleryItems[3].src}
            alt={galleryItems[3].alt}
            index={3}
            className="col-span-1 aspect-square"
          />
          <GalleryImage
            src={galleryItems[4].src}
            alt={galleryItems[4].alt}
            index={4}
            className="col-span-2 lg:col-span-1 aspect-video"
          />
        </div>

        {/* ── Texte sous la galerie ─────────────────── */}
        <AnimatedSection className="mt-12 lg:mt-16 text-center max-w-xl mx-auto">
          <AnimatedSection variants={fadeUp}>
            <p className="text-sm text-stone-warm font-sans font-light leading-loose">
              Chaque image raconte une partie de notre histoire — la foi, le travail
              artisanal, l&apos;élégance. Rejoignez la communauté Volombe et partagez
              votre style sur{" "}
              <a
                href="https://instagram.com/volombe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-deep transition-colors duration-300 underline-animate"
              >
                @volombe
              </a>
              .
            </p>
          </AnimatedSection>
        </AnimatedSection>

      </div>
    </section>
  );
}
