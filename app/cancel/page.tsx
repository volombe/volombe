'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--color-bg, #FDFAF7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h1 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
          fontWeight: 400,
          color: 'var(--color-text, #1A1714)',
          marginBottom: '20px',
          lineHeight: 1.2,
        }}>
          Paiement annulé
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-muted, #8A7F74)',
          lineHeight: 1.8,
          marginBottom: '40px',
        }}>
          Votre panier a été conservé.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: 'var(--color-accent, #B8976C)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Retourner à la boutique
        </Link>
      </div>
    </main>
  );
}
