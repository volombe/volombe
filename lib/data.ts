// ──────────────────────────────────────────────
// lib/data.ts — Données statiques Volombe
// ──────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  description: string;
  badge?: string;
  image: string;
  hoverImage?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  href: string;
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  span?: "normal" | "wide" | "tall";
}

// ── Produits ────────────────────────────────────
export const products: Product[] = [
  {
    id: "tshirt-apocalypse",
    name: "T-Shirt Apocalypse",
    subtitle: "20:11-15",
    price: 40,
    currency: "EUR",
    badge: "Édition Limitée",
    description:
      "Une pièce d'exception brodée à la main en France. Le dos dévoile une gravure de Gustave Doré — entre art sacré et mode contemporaine.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Noir", hex: "#1A1714" },
      { name: "Blanc cassé", hex: "#F0E8DC" },
    ],
    details: [
      "100% coton premium 300g/m²",
      "Broderie artisanale française",
      "Gravure Gustave Doré au dos",
      "Croix brodée sur la poitrine",
      "Coupe unisexe oversize",
    ],
    href: "/products/tshirt-apocalypse",
  },
  {
    id: "hoodie-volombe",
    name: "Hoodie Volombe",
    subtitle: "Collection Signature",
    price: 80,
    currency: "EUR",
    description:
      "La chaleur de l'hiver, l'élégance du sacré. Un hoodie épais brodé avec soin pour les porteurs de lumière.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Noir", hex: "#1A1714" },
      { name: "Gris anthracite", hex: "#3A3028" },
    ],
    details: [
      "80% coton / 20% polyester",
      "Broderie signature Volombe",
      "Poche kangourou",
      "Capuche doublée",
      "Lavage à 30°C",
    ],
    href: "/products/hoodie-volombe",
  },
  {
    id: "tshirt-signature",
    name: "T-Shirt Signature",
    subtitle: "Essentiel",
    price: 30,
    currency: "EUR",
    description:
      "L'essentiel épuré. Le logo Volombe brodé sur la poitrine — pour ceux qui portent leur foi avec discrétion et élégance.",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    colors: [
      { name: "Blanc", hex: "#FDFAF7" },
      { name: "Beige", hex: "#C4AF93" },
      { name: "Noir", hex: "#1A1714" },
    ],
    details: [
      "100% coton 200g/m²",
      "Broderie logo discret",
      "Coupe ajustée",
      "Certifié OEKO-TEX",
    ],
    href: "/products/tshirt-signature",
  },
];

// ── Valeurs de marque ─────────────────────────
export const values: Value[] = [
  {
    icon: "✦",
    title: "Artisanat Français",
    description:
      "Chaque pièce est brodée à la main par des artisans français. Nous refusons la production de masse pour préserver l'excellence.",
  },
  {
    icon: "◈",
    title: "Foi & Élégance",
    description:
      "Volombe naît d'une conviction : la foi mérite d'être portée avec grâce. Nos vêtements sont une déclaration silencieuse.",
  },
  {
    icon: "◇",
    title: "Matières Nobles",
    description:
      "Coton premium 300g/m², certifié OEKO-TEX. Nous sélectionnons les matières pour leur durabilité et leur douceur.",
  },
  {
    icon: "⊹",
    title: "Éthique & Durabilité",
    description:
      "Production responsable, quantités limitées. Nous préférons faire moins, mais faire mieux — pour la planète et pour vous.",
  },
];

// ── Galerie ──────────────────────────────────
export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Broderie artisanale Volombe",
    span: "wide",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    alt: "Collection Volombe en situation",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    alt: "Style Volombe lifestyle",
    span: "tall",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?w=600&q=80",
    alt: "Détail broderie Volombe",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    alt: "Lookbook Volombe",
    span: "wide",
  },
];

// ── Navigation ────────────────────────────────
export const navLinks = [
  { label: "Collection", href: "/collection" },
  { label: "Notre Histoire", href: "/histoire" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

// ── SEO metadata ──────────────────────────────
export const siteConfig = {
  name: "Volombe",
  tagline: "Redorer l'image chrétienne à travers nos vêtements",
  description:
    "Volombe crée des vêtements chrétiens premium brodés en France. Éditions limitées, matières nobles, artisanat d'exception.",
  url: "https://volombe.fr",
  ogImage: "https://volombe.fr/og-image.jpg",
  email: "sav.contact@volombe.fr",
  social: {
    instagram: "https://instagram.com/volombe",
  },
};
