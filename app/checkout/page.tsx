'use client';

import { useState, useEffect, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

/* ─── Stripe instance (module-level, created once) ─── */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/* ─── Types ─── */
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  qty: number;
  img?: string;
}

/* ─── Styles partagés ─── */
const S = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f5f0e8',
    fontFamily: 'Inter, system-ui, sans-serif',
  } as React.CSSProperties,

  header: {
    borderBottom: '1px solid rgba(184,153,106,0.2)',
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,

  logo: {
    fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
    fontWeight: 300,
    fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
    letterSpacing: '0.35em',
    color: '#f5f0e8',
    textDecoration: 'none',
  } as React.CSSProperties,

  layout: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '48px 24px 80px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '64px',
    alignItems: 'start',
  } as React.CSSProperties,

  sectionTitle: {
    fontFamily: '"Cormorant Garamond", "Cormorant", Georgia, serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
    color: '#f5f0e8',
    marginBottom: '28px',
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  divider: {
    height: '0.5px',
    background: '#b8996a',
    margin: '20px 0',
    opacity: 0.6,
  } as React.CSSProperties,

  input: {
    width: '100%',
    background: '#141414',
    border: '1px solid rgba(245,240,232,0.15)',
    color: '#f5f0e8',
    padding: '12px 14px',
    fontSize: '0.85rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginBottom: '12px',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: 'rgba(245,240,232,0.5)',
    marginBottom: '6px',
  } as React.CSSProperties,

  btn: {
    width: '100%',
    background: '#b8996a',
    color: '#000',
    border: 'none',
    padding: '15px 24px',
    fontSize: '0.7rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,

  secure: {
    fontSize: '0.65rem',
    color: 'rgba(245,240,232,0.3)',
    textAlign: 'center' as const,
    marginTop: '12px',
    letterSpacing: '0.08em',
  } as React.CSSProperties,

  errorMsg: {
    color: '#e07b54',
    fontSize: '0.78rem',
    marginTop: '12px',
    padding: '10px 12px',
    border: '1px solid rgba(224,123,84,0.3)',
    background: 'rgba(224,123,84,0.05)',
  } as React.CSSProperties,

  cartRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 0',
    fontSize: '0.85rem',
    gap: '12px',
  } as React.CSSProperties,

  cartRowMeta: {
    fontSize: '0.72rem',
    color: 'rgba(245,240,232,0.45)',
    marginTop: '3px',
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: '8px',
  } as React.CSSProperties,

  totalLabel: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontStyle: 'italic',
    fontSize: '1rem',
    color: 'rgba(245,240,232,0.6)',
  } as React.CSSProperties,

  totalAmount: {
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 300,
    color: '#f5f0e8',
    letterSpacing: '0.02em',
  } as React.CSSProperties,
};

/* ─── Stripe appearance (thème Volombe) ─── */
const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#b8996a',
    colorBackground: '#141414',
    colorText: '#f5f0e8',
    colorTextSecondary: 'rgba(245,240,232,0.5)',
    colorDanger: '#e07b54',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeBase: '14px',
    borderRadius: '0px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(245,240,232,0.15)', padding: '12px 14px' },
    '.Input:focus': { border: '1px solid #b8996a', boxShadow: 'none' },
    '.Label': { fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.5)' },
  },
};

/* ════════════════════════════════════════════════
   Formulaire de paiement (doit être dans <Elements>)
════════════════════════════════════════════════ */
function CheckoutForm({ grandTotal }: { grandTotal: number }) {
  const stripe   = useStripe();
  const elements = useElements();

  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [adresse,    setAdresse]    = useState('');
  const [complement, setComplement] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville,      setVille]      = useState('');
  const [pays,       setPays]       = useState('FR');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const paysISO: Record<string, string> = {
    FR: 'France', BE: 'Belgique', CH: 'Suisse', LU: 'Luxembourg', CA: 'Canada',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        shipping: {
          name,
          address: {
            line1:       adresse,
            line2:       complement || undefined,
            postal_code: codePostal,
            city:        ville,
            country:     pays,
          },
        },
        payment_method_data: {
          billing_details: {
            name,
            email,
            address: {
              line1:       adresse,
              postal_code: codePostal,
              city:        ville,
              country:     pays,
            },
          },
        },
      },
    });

    /* confirmPayment ne retourne qu'en cas d'erreur — succès = redirect */
    if (stripeError) {
      setError(stripeError.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  const btnStyle: React.CSSProperties = {
    ...S.btn,
    opacity: loading || !stripe ? 0.6 : 1,
    cursor: loading || !stripe ? 'not-allowed' : 'pointer',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={S.label}>Nom complet</label>
        <input
          style={S.input}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jean Dupont"
          required
          autoComplete="name"
        />
      </div>

      <div>
        <label style={S.label}>Adresse email</label>
        <input
          style={S.input}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="jean@exemple.fr"
          required
          autoComplete="email"
        />
      </div>

      {/* ── Adresse de livraison ── */}
      <div style={{ marginTop: '28px', marginBottom: '4px' }}>
        <h3 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '1.15rem',
          color: '#f5f0e8',
          letterSpacing: '0.02em',
          marginBottom: '16px',
        }}>
          Adresse de livraison
        </h3>

        <div>
          <label style={S.label}>Adresse</label>
          <input
            style={S.input}
            type="text"
            value={adresse}
            onChange={e => setAdresse(e.target.value)}
            placeholder="12 rue de la Paix"
            required
            autoComplete="address-line1"
          />
        </div>

        <div>
          <label style={S.label}>Complément <span style={{ opacity: 0.4 }}>(optionnel)</span></label>
          <input
            style={S.input}
            type="text"
            value={complement}
            onChange={e => setComplement(e.target.value)}
            placeholder="Appartement, bâtiment..."
            autoComplete="address-line2"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
          <div>
            <label style={S.label}>Code postal</label>
            <input
              style={S.input}
              type="text"
              value={codePostal}
              onChange={e => setCodePostal(e.target.value)}
              placeholder="75001"
              required
              maxLength={10}
              autoComplete="postal-code"
            />
          </div>
          <div>
            <label style={S.label}>Ville</label>
            <input
              style={S.input}
              type="text"
              value={ville}
              onChange={e => setVille(e.target.value)}
              placeholder="Paris"
              required
              autoComplete="address-level2"
            />
          </div>
        </div>

        <div>
          <label style={S.label}>Pays</label>
          <select
            style={{
              ...S.input,
              appearance: 'none' as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8996a' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
              cursor: 'pointer',
            }}
            value={pays}
            onChange={e => setPays(e.target.value)}
          >
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="LU">Luxembourg</option>
            <option value="CA">Canada</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && <p style={S.errorMsg}>⚠ {error}</p>}

      <button type="submit" style={btnStyle} disabled={loading || !stripe}>
        {loading
          ? 'Traitement en cours…'
          : `Payer ${grandTotal.toFixed(2).replace('.', ',')} €`}
      </button>

      <p style={S.secure}>
        <svg style={{ verticalAlign: 'middle', marginRight: '5px' }} width="10" height="12" viewBox="0 0 10 12" fill="none">
          <rect x="1" y="5" width="8" height="6.5" rx="1" stroke="currentColor" strokeWidth="1"/>
          <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1"/>
        </svg>
        Paiement 100% sécurisé · Stripe
      </p>
    </form>
  );
}

/* ════════════════════════════════════════════════
   Page principale
════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const [items,        setItems]        = useState<CartItem[]>([]);
  const [clientSecret, setClientSecret] = useState('');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => {
    const raw  = localStorage.getItem('volombe_cart');
    const cart: CartItem[] = raw ? JSON.parse(raw) : [];

    if (!cart.length) {
      window.location.href = '/';
      return;
    }

    setItems(cart);

    fetch('/api/payment-intent', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(cart),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); }
        else            { setClientSecret(data.clientSecret); }
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger le paiement. Réessayez.');
        setLoading(false);
      });
  }, []);

  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping    = subtotal >= 80 ? 0 : 5.90;
  const grandTotal  = subtotal + shipping;

  /* ── États de chargement / erreur ── */
  if (loading) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(245,240,232,0.4)', letterSpacing: '0.15em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          Chargement…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <p style={S.errorMsg}>⚠ {error}</p>
          <a href="/" style={{ ...S.btn, display: 'inline-block', marginTop: '20px', textDecoration: 'none', padding: '12px 28px', width: 'auto' }}>
            Retour à la boutique
          </a>
        </div>
      </div>
    );
  }

  /* ── Layout mobile ── */
  const isMobileStyle = `
    @media (max-width: 768px) {
      .vl-checkout-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
    }
  `;

  return (
    <div style={S.page}>
      <style>{isMobileStyle}</style>

      {/* Header */}
      <header style={S.header}>
        <a href="/" style={S.logo}>VOLOMBE</a>
      </header>

      {/* Layout deux colonnes */}
      <div className="vl-checkout-layout" style={S.layout}>

        {/* ── Colonne gauche : récapitulatif ── */}
        <aside>
          <h2 style={S.sectionTitle}>Votre commande</h2>

          {items.map(item => (
            <div key={`${item.id}-${item.size}`} style={S.cartRow}>
              <div>
                <div>{item.name}</div>
                <div style={S.cartRowMeta}>Taille {item.size} · Qté {item.qty}</div>
              </div>
              <div style={{ whiteSpace: 'nowrap', fontWeight: 400 }}>
                {(item.price * item.qty).toFixed(2).replace('.', ',')} €
              </div>
            </div>
          ))}

          <div style={S.divider} />

          <div style={{ ...S.cartRow, fontSize: '0.8rem', color: 'rgba(245,240,232,0.5)' }}>
            <span>Livraison</span>
            <span>{shipping === 0 ? 'Offerte' : '5,90 €'}</span>
          </div>

          {shipping > 0 && (
            <p style={{ fontSize: '0.68rem', color: 'rgba(184,153,106,0.7)', marginTop: '-4px', letterSpacing: '0.05em' }}>
              Livraison offerte dès 80 €
            </p>
          )}

          <div style={S.divider} />

          <div style={S.totalRow}>
            <span style={S.totalLabel}>Total</span>
            <span style={S.totalAmount}>
              {grandTotal.toFixed(2).replace('.', ',')} €
            </span>
          </div>
        </aside>

        {/* ── Colonne droite : paiement ── */}
        <section>
          <h2 style={{ ...S.sectionTitle, fontStyle: 'normal', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Paiement sécurisé
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" style={{ opacity: 0.6 }}>
              <rect x="1" y="7" width="14" height="10" rx="1.5" stroke="#b8996a" strokeWidth="1.2"/>
              <path d="M4 7V5a4 4 0 0 1 8 0v2" stroke="#b8996a" strokeWidth="1.2"/>
            </svg>
          </h2>

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: stripeAppearance, locale: 'fr' }}
            >
              <CheckoutForm grandTotal={grandTotal} />
            </Elements>
          )}
        </section>
      </div>
    </div>
  );
}
