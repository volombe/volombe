import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data";

// ──────────────────────────────────────────────
// Fonts — Optimisées avec next/font
// ──────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

// ──────────────────────────────────────────────
// Viewport
// ──────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#1A1714",
  width: "device-width",
  initialScale: 1,
};

// ──────────────────────────────────────────────
// Metadata globale
// ──────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "vêtements chrétiens",
    "broderie France",
    "mode chrétienne",
    "t-shirt chrétien",
    "hoodie brodé",
    "Volombe",
    "foi élégance",
    "mode premium",
    "édition limitée",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: 'vqIyRpqeEsO6ZQ2uYgSA0Uaz2mJVhWNUXdykqSvaOVw',
  },
};

// ──────────────────────────────────────────────
// Root Layout
// ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen bg-cream-50">
        {children}
      </body>
    </html>
  );
}
