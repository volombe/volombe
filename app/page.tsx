import type { Metadata } from "next";
import Navbar      from "@/components/sections/Navbar";
import Hero        from "@/components/sections/Hero";
import Storytelling from "@/components/sections/Storytelling";
import Products    from "@/components/sections/Products";
import Values      from "@/components/sections/Values";
import Gallery     from "@/components/sections/Gallery";
import Newsletter  from "@/components/sections/Newsletter";
import Footer      from "@/components/sections/Footer";
import { siteConfig } from "@/lib/data";

// ──────────────────────────────────────────────
// Metadata page d'accueil
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
};

// ──────────────────────────────────────────────
// Page d'accueil — Volombe
// ──────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── Navigation ─────────────────────────── */}
      <Navbar />

      {/* ── Main content ───────────────────────── */}
      <main>
        {/* Hero fullscreen avec parallax */}
        <Hero />

        {/* Storytelling — Notre histoire */}
        <Storytelling />

        {/* Catalogue produits */}
        <Products />

        {/* Section valeurs / fond sombre */}
        <Values />

        {/* Galerie lifestyle */}
        <Gallery />

        {/* Newsletter */}
        <Newsletter />
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <Footer />
    </>
  );
}
