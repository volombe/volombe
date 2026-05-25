'use client'

import { useEffect, useState } from 'react'

interface OrderItem {
  id?: string
  name: string
  size: string
  qty?: number
  quantity?: number
  price?: number
  unitPrice?: number
}

interface ShippingAddress {
  line1: string
  city: string
  postalCode: string
  country: string
}

interface Order {
  id: string
  created_at: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  total_amount: number
  shipping_cost: number
  shipping_address: ShippingAddress
  status: 'pending' | 'shipped'
  tracking_number: string | null
  mr_label_url: string | null
  shipped_at: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmt(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false)
  const [pwdInput, setPwdInput]   = useState('')
  const [loginErr, setLoginErr]   = useState('')
  const [orders, setOrders]       = useState<Order[]>([])
  const [loading, setLoading]     = useState(false)
  const [shipping, setShipping]   = useState<Record<string, boolean>>({})
  const [expanded, setExpanded]   = useState<Record<string, boolean>>({})
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('volombe_admin_token')) {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 4000)
  }

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('volombe_admin_token') ?? ''}` },
      })
      if (!res.ok) throw new Error('Erreur ' + res.status)
      setOrders(await res.json())
    } catch (e: unknown) {
      showToast('Erreur chargement : ' + (e instanceof Error ? e.message : String(e)), false)
    } finally {
      setLoading(false)
    }
  }

  async function login() {
    setLoginErr('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwdInput }),
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem('volombe_admin_token', pwdInput)
        setAuthed(true)
      } else {
        setLoginErr(data.error ?? 'Mot de passe incorrect.')
      }
    } catch {
      setLoginErr('Erreur réseau. Réessayez.')
    }
  }

  async function ship(orderId: string) {
    setShipping(s => ({ ...s, [orderId]: true }))
    try {
      const res = await fetch('/api/admin/ship', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('volombe_admin_token') ?? ''}`,
        },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur ' + res.status)
      showToast(`Expédié ✓  Suivi : ${data.trackingNumber}`)
      fetchOrders()
    } catch (e: unknown) {
      showToast('Erreur : ' + (e instanceof Error ? e.message : String(e)), false)
    } finally {
      setShipping(s => ({ ...s, [orderId]: false }))
    }
  }

  /* ── LOGIN ── */
  if (!authed) {
    return (
      <div style={s.page}>
        <div style={s.loginCard}>
          <div style={s.logo}>VOLOMBE</div>
          <p style={s.loginSub}>Administration</p>
          <input
            type="password"
            placeholder="Mot de passe"
            value={pwdInput}
            onChange={e => setPwdInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={s.input}
            autoFocus
          />
          {loginErr && <p style={s.err}>{loginErr}</p>}
          <button onClick={login} style={s.btnGold}>
            Accéder
          </button>
        </div>
      </div>
    )
  }

  /* ── DASHBOARD ── */
  const pending = orders.filter(o => o.status === 'pending')
  const shipped = orders.filter(o => o.status === 'shipped')

  return (
    <div style={s.page}>
      {toast && (
        <div style={{ ...s.toast, backgroundColor: toast.ok ? '#1a3a1a' : '#3a1a1a', borderColor: toast.ok ? '#4a8a4a' : '#8a4a4a' }}>
          {toast.msg}
        </div>
      )}

      <div style={s.header}>
        <span style={s.logo}>VOLOMBE</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>
            {orders.length} commande{orders.length !== 1 ? 's' : ''}
          </span>
          <button onClick={fetchOrders} style={s.btnGhost} disabled={loading}>
            {loading ? '…' : 'Actualiser'}
          </button>
          <button onClick={() => { sessionStorage.removeItem('volombe_admin_token'); setAuthed(false) }} style={s.btnGhost}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={s.container}>

        {/* ── COMMANDES EN ATTENTE ── */}
        <h2 style={s.sectionTitle}>
          À expédier
          <span style={s.badge}>{pending.length}</span>
        </h2>

        {pending.length === 0 && (
          <p style={s.empty}>Aucune commande en attente.</p>
        )}

        {pending.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            expanded={!!expanded[order.id]}
            onToggle={() => setExpanded(e => ({ ...e, [order.id]: !e[order.id] }))}
            onShip={() => ship(order.id)}
            shipping={!!shipping[order.id]}
          />
        ))}

        {/* ── COMMANDES EXPÉDIÉES ── */}
        {shipped.length > 0 && (
          <>
            <h2 style={{ ...s.sectionTitle, marginTop: '40px' }}>
              Expédiées
              <span style={{ ...s.badge, backgroundColor: '#1a3a1a', color: '#6dbf8e' }}>{shipped.length}</span>
            </h2>
            {shipped.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={!!expanded[order.id]}
                onToggle={() => setExpanded(e => ({ ...e, [order.id]: !e[order.id] }))}
                onShip={() => {}}
                shipping={false}
              />
            ))}
          </>
        )}

      </div>
    </div>
  )
}

function OrderCard({
  order, expanded, onToggle, onShip, shipping,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onShip: () => void
  shipping: boolean
}) {
  const addr = order.shipping_address ?? {}

  return (
    <div style={s.card}>
      {/* ── En-tête carte ── */}
      <div style={s.cardHeader} onClick={onToggle}>
        <div>
          <span style={s.customerName}>{order.customer_name}</span>
          <span style={s.customerEmail}>{order.customer_email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ ...s.statusBadge, ...(order.status === 'shipped' ? s.statusShipped : s.statusPending) }}>
            {order.status === 'shipped' ? 'Expédiée' : 'En attente'}
          </span>
          <span style={s.totalBig}>{fmt(order.total_amount)}</span>
          <span style={s.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={s.cardBody}>
          {/* Date */}
          <p style={s.meta}>Commande du {formatDate(order.created_at)}</p>

          {/* Produits */}
          <div style={s.itemsTable}>
            {(order.items ?? []).map((item, i) => {
              const qty = item.qty ?? item.quantity ?? 1
              const price = item.unitPrice ?? item.price ?? 0
              return (
                <div key={i} style={s.itemRow}>
                  <span style={s.itemName}>{item.name}</span>
                  <span style={s.itemMeta}>T-{item.size} × {qty}</span>
                  <span style={s.itemPrice}>{fmt(price * qty)}</span>
                </div>
              )
            })}
            <div style={s.itemRow}>
              <span style={{ ...s.itemMeta, color: '#555' }}>Livraison</span>
              <span style={s.itemMeta}></span>
              <span style={{ ...s.itemPrice, color: order.shipping_cost === 0 ? '#6dbf8e' : '#c8a96e' }}>
                {order.shipping_cost === 0 ? 'Offerte' : fmt(order.shipping_cost)}
              </span>
            </div>
          </div>

          {/* Adresse */}
          <div style={s.addressBlock}>
            <p style={s.metaLabel}>Adresse</p>
            <p style={s.meta}>
              {addr.line1}<br />
              {addr.postalCode} {addr.city}<br />
              {addr.country}
            </p>
          </div>

          {/* Tracking si expédié */}
          {order.status === 'shipped' && order.tracking_number && (
            <div style={s.trackingBlock}>
              <p style={s.metaLabel}>Suivi Mondial Relay</p>
              <p style={{ ...s.meta, color: '#c8a96e', letterSpacing: '0.08em' }}>
                {order.tracking_number}
              </p>
              {order.mr_label_url && (
                <a href={order.mr_label_url} target="_blank" rel="noreferrer" style={s.labelLink}>
                  Télécharger l'étiquette
                </a>
              )}
              {order.shipped_at && (
                <p style={{ ...s.meta, marginTop: '8px' }}>Expédiée le {formatDate(order.shipped_at)}</p>
              )}
            </div>
          )}

          {/* Bouton expédier */}
          {order.status === 'pending' && (
            <button
              onClick={onShip}
              disabled={shipping}
              style={{ ...s.btnGold, marginTop: '20px', opacity: shipping ? 0.6 : 1 }}
            >
              {shipping ? 'Génération étiquette…' : 'Générer étiquette & Expédier'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#080808',
    color: '#e8e0d0',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 32px',
    borderBottom: '1px solid #1e1e1e',
    backgroundColor: '#0a0a0a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  logo: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '18px',
    letterSpacing: '0.45em',
    color: '#f5f0e8',
  },
  loginCard: {
    maxWidth: '360px',
    margin: '120px auto',
    backgroundColor: '#111111',
    border: '1px solid #1e1e1e',
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginSub: {
    fontSize: '11px',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    margin: '0',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0d0d0d',
    border: '1px solid #2a2a2a',
    color: '#e8e0d0',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnGold: {
    backgroundColor: 'transparent',
    border: '1px solid #c8a96e',
    color: '#c8a96e',
    padding: '12px 28px',
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    width: '100%',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    border: '1px solid #2a2a2a',
    color: '#666',
    padding: '7px 16px',
    fontSize: '11px',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  },
  err: {
    color: '#c87070',
    fontSize: '12px',
    margin: '0',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.25em',
    color: '#555',
    margin: '0 0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badge: {
    backgroundColor: '#1e1a12',
    color: '#c8a96e',
    borderRadius: '999px',
    padding: '2px 10px',
    fontSize: '11px',
  },
  empty: {
    color: '#444',
    fontSize: '13px',
    padding: '24px 0',
  },
  card: {
    backgroundColor: '#111111',
    border: '1px solid #1e1e1e',
    marginBottom: '12px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    cursor: 'pointer',
    gap: '16px',
  },
  cardBody: {
    padding: '0 24px 24px',
    borderTop: '1px solid #1a1a1a',
  },
  customerName: {
    display: 'block',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '15px',
    color: '#e8e0d0',
    marginBottom: '4px',
  },
  customerEmail: {
    display: 'block',
    fontSize: '12px',
    color: '#555',
  },
  totalBig: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '16px',
    color: '#f5f0e8',
  },
  chevron: {
    fontSize: '10px',
    color: '#444',
  },
  statusBadge: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    border: '1px solid',
  },
  statusPending: {
    borderColor: '#c8a96e',
    color: '#c8a96e',
  },
  statusShipped: {
    borderColor: '#4a8a4a',
    color: '#6dbf8e',
  },
  meta: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 4px',
    lineHeight: '1.8',
  },
  metaLabel: {
    fontSize: '9px',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    margin: '20px 0 6px',
  },
  itemsTable: {
    marginTop: '20px',
    borderTop: '1px solid #1e1e1e',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1a1a1a',
    gap: '16px',
  },
  itemName: {
    fontSize: '13px',
    color: '#e8e0d0',
    flex: 1,
  },
  itemMeta: {
    fontSize: '12px',
    color: '#666',
  },
  itemPrice: {
    fontSize: '13px',
    color: '#aaa',
    minWidth: '70px',
    textAlign: 'right',
  },
  addressBlock: {
    marginTop: '4px',
  },
  trackingBlock: {
    marginTop: '16px',
    backgroundColor: '#0d0d0d',
    border: '1px solid #1e1e1e',
    padding: '16px',
  },
  labelLink: {
    display: 'inline-block',
    marginTop: '8px',
    fontSize: '11px',
    color: '#c8a96e',
    textDecoration: 'underline',
    letterSpacing: '0.05em',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '14px 20px',
    fontSize: '13px',
    color: '#e8e0d0',
    border: '1px solid',
    zIndex: 100,
    maxWidth: '400px',
    backgroundColor: '#1a3a1a',
    borderColor: '#4a8a4a',
  },
}
