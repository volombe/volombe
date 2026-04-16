"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import {
  fadeUp,
  staggerContainer,
  cardHover,
  imageZoom,
  lineGrow,
} from "@/lib/animations";
import { ArrowUpRight } from "lucide-react";

// ──────────────────────────────────────────────
// ProductCard — Carte produit premium
// ──────────────────────────────────────────────
interface ProductCardProps {
  product: (typeof products)[number];
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      transition={{ delay: index * 0.12 }}
    >
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group cursor-pointer"
      >
        <Link href={product.href}>
          {/* ── Image container ───────────────────── */}
          <div className="relative overflow-hidden bg-cream-200 aspect-[3/4]">
            {/* Image principale */}
            <motion.div
              variants={imageZoom}
              initial="rest"
              animate={isHovered && product.hoverImage ? "rest" : "rest"}
              whileHover="hover"
              className="absolute inset-0"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isHovered && product.hoverImage ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Image hover */}
              {product.hoverImage && (
                <Image
                  src={product.hoverImage}
                  alt={`${product.name} — vue alternative`}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </motion.div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="default">{product.badge}</Badge>
              </div>
            )}

            {/* Overlay CTA au hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute bottom-4 left-4 right-4 z-10"
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-cream-50/95 backdrop-blur-sm"
                icon={<ArrowUpRight size={14} />}
              >
                Voir le produit
              </Button>
            </motion.div>

            {/* Couleurs disponibles */}
            <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
              {product.colors.map((color) => (
                <div
                  key={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-cream-50/40 ring-1 ring-cream-50/20"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* ── Infos produit ─────────────────────── */}
          <div className="pt-5 pb-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-warm font-sans mb-1">
                  {product.subtitle}
                </p>
                <h3 className="font-serif text-lg text-obsidian group-hover:text-stone-deep transition-colors duration-300">
                  {product.name}
                </h3>
              </div>
              <span className="font-serif text-lg text-obsidian mt-1 flex-shrink-0">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Tailles disponibles */}
            <div className="flex items-center gap-1.5 mt-3">
              {product.sizes.slice(0, 5).map((size) => (
                <span
                  key={size}
                  className="text-[9px] uppercase tracking-wide text-stone-warm/70 font-sans border border-cream-300 px-1.5 py-0.5"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-[9px] text-stone-warm/50 font-sans">
                  +{product.sizes.length - 5}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

// ──────────────────────────────────────────────
// Section principale
// ──────────────────────────────────────────────
export default function Products() {
  return (
    <section className="bg-cream-50 py-section px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">

        {/* ── En-tête ──────────────────────────────── */}
        <AnimatedSection className="mb-16 lg:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.span
                variants={fadeUp}
                className="block text-[10px] uppercase tracking-[0.35em] text-stone-warm font-sans mb-4"
              >
                La Collection
              </motion.span>
              <AnimatedSection variants={lineGrow} className="w-12 h-px bg-gold mb-6" >{null}</AnimatedSection>
              <AnimatedSection variants={fadeUp}>
                <h2 className="font-serif text-display-lg text-obsidian">
                  Pièces
                  <br />
                  <em className="not-italic italic">d&apos;exception</em>
                </h2>
              </AnimatedSection>
            </div>
            <AnimatedSection variants={fadeUp} delay={0.2} className="max-w-xs">
              <p className="text-sm text-stone-warm font-sans font-light leading-loose">
                Chaque vêtement est une édition limitée, brodée à la main en France.
                Quantités restreintes pour garantir l&apos;excellence.
              </p>
            </AnimatedSection>
          </div>
        </AnimatedSection>

        {/* ── Grille produits ───────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>

        {/* ── CTA voir tout ─────────────────────────── */}
        <AnimatedSection className="text-center mt-16 lg:mt-20">
          <Link href="/collection">
            <Button variant="outline" size="lg">
              Voir toute la collection
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
