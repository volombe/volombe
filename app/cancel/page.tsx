'use client';

export default function CancelPage() {
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
          Paiement annulé
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
          marginBottom: '40px',
        }}>
          Votre panier a été conservé.<br />
          Vous pouvez reprendre votre commande à tout moment.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/checkout"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
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
            Reprendre le paiement
          </a>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: 'transparent',
              color: 'rgba(245,240,232,0.5)',
              textDecoration: 'none',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontFamily: 'Inter, sans-serif',
              border: '1px solid rgba(245,240,232,0.15)',
            }}
          >
            Retour à la boutique
          </a>
        </div>
      </div>
    </main>
  );
}
