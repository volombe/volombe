# Volombe — Instructions de démarrage

## Prérequis
- Node.js 18+ installé
- npm ou pnpm

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:3000
```

## Build production

```bash
npm run build
npm run start
```

## Structure du projet

```
/app
  layout.tsx       ← Root layout + SEO + fonts
  page.tsx         ← Homepage (compose toutes les sections)
  globals.css      ← Reset CSS + variables + utilitaires

/components
  /ui
    Button.tsx          ← Bouton réutilisable (4 variantes)
    Badge.tsx           ← Badge/étiquette
    AnimatedSection.tsx ← Wrapper animation scroll
  /sections
    Navbar.tsx          ← Navigation fixe avec menu mobile
    Hero.tsx            ← Section plein écran + parallax
    Storytelling.tsx    ← Histoire de la marque (images alternées)
    Products.tsx        ← Catalogue produits avec hover
    Values.tsx          ← Section valeurs (fond sombre)
    Gallery.tsx         ← Galerie masonry lifestyle
    Newsletter.tsx      ← Formulaire d'inscription email
    Footer.tsx          ← Footer complet

/lib
  data.ts          ← Données : produits, valeurs, galerie, config
  utils.ts         ← Helpers : cn(), formatPrice()
  animations.ts    ← Variantes Framer Motion réutilisables
```

## Personnalisation

### Couleurs
Modifier dans `tailwind.config.ts` → `theme.extend.colors`

### Contenu
Tout le contenu est centralisé dans `lib/data.ts` :
- `products` : liste des produits
- `values` : valeurs de la marque
- `galleryItems` : photos de la galerie
- `siteConfig` : nom, description, URLs

### Ajouter une page
1. Créer `app/[page]/page.tsx`
2. Ajouter le lien dans `lib/data.ts` → `navLinks`

## Images
Les images utilisent Unsplash (placeholder).
Remplacer les URLs dans `lib/data.ts` par vos vraies photos.

Pour ajouter un domaine d'images, modifier `next.config.ts` → `images.remotePatterns`.

## Variables d'environnement
Créer un `.env.local` pour :
```
NEXT_PUBLIC_SITE_URL=https://volombe.fr
```
