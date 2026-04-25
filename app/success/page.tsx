'use client';

import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem('volombe_cart');
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#f5f0e8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>

        <div style={{
          fontSize: '2rem',
          color: '#b8996a',
          marginBottom: '28px',
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          letterSpacing: '0.1em',
        }}>
          ✦
        </div>

        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          color: '#f5f0e8',
          marginBottom: '20px',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
        }}>
          Commande confirmée
        </h1>

        <div style={{
          width: '40px',
          height: '0.5px',
          background: '#b8996a',
          margin: '0 auto 24px',
        }} />

        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(245,240,232,0.55)',
          lineHeight: 1.9,
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}>
          Merci pour votre commande.<br />
          Un email de confirmation vous sera envoyé sous peu.
        </p>

        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(245,240,232,0.3)',
          marginBottom: '40px',
          letterSpacing: '0.05em',
        }}>
          Expédition sous 2–3 jours ouvrés.
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#b8996a',
            color: '#000',
            textDecoration: 'none',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          Retour à la boutique
        </a>
      </div>
    </main>
  );
}
