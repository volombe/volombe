import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

export interface OrderItem {
  name: string
  size: string
  quantity: number
  unitPrice: number
}

export interface ShippingAddress {
  line1: string
  city: string
  postalCode: string
  country: string
}

export interface OrderConfirmationProps {
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  shippingCost: number
  shippingAddress: ShippingAddress
}

export default function OrderConfirmation({
  customerName,
  customerEmail: _customerEmail,
  items,
  totalAmount,
  shippingCost,
  shippingAddress,
}: OrderConfirmationProps) {
  const subtotal    = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const dateRef     = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const fmt         = (n: number) => n.toFixed(2).replace('.', ',') + ' €'

  return (
    <Html lang="fr">
      <Head />
      <Preview>Merci pour votre commande — VOLOMBE</Preview>
      <Body style={{ margin: '0', padding: '0', backgroundColor: '#080808', fontFamily: 'Arial, Helvetica, sans-serif' }}>

        {/* ── Wrapper principal ── */}
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#080808' }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '32px 16px' }}>

                {/* ── Carte email 600px ── */}
                <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', backgroundColor: '#111111', border: '1px solid #1e1e1e' }}>
                  <tbody>

                    {/* ══════════ 1. HEADER ══════════ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#080808', padding: '36px 48px 28px' }}>
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td style={{ borderTop: '1px solid #c8a96e', borderBottom: '1px solid #c8a96e', padding: '10px 32px', textAlign: 'center' }}>
                                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '22px', fontWeight: '400', letterSpacing: '0.55em', color: '#f5f0e8', textTransform: 'uppercase' }}>
                                  VOLOMBE
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p style={{ margin: '12px 0 0', fontSize: '10px', letterSpacing: '0.3em', color: '#c8a96e', textTransform: 'uppercase', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          Vêtements chrétiens premium
                        </p>
                      </td>
                    </tr>

                    {/* ══════════ 2. HERO BAND ══════════ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #c8a96e', padding: '32px 48px' }}>
                        <p style={{ margin: '0 0 10px', fontSize: '10px', letterSpacing: '0.25em', color: '#c8a96e', textTransform: 'uppercase', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          Confirmation de commande
                        </p>
                        <p style={{ margin: '0', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '24px', fontWeight: '400', color: '#f5f0e8', letterSpacing: '0.02em' }}>
                          Merci pour votre confiance
                        </p>
                      </td>
                    </tr>

                    {/* ══════════ 3. CORPS ══════════ */}
                    <tr>
                      <td style={{ backgroundColor: '#111111', padding: '40px 48px' }}>

                        {/* ── a) Salutation ── */}
                        <p style={{ margin: '0 0 12px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '15px', color: '#e8e0d0' }}>
                          Bonjour {customerName},
                        </p>
                        <p style={{ margin: '0 0 28px', fontSize: '13px', lineHeight: '1.85', color: '#888888' }}>
                          Nous avons bien reçu votre commande. Chaque pièce Volombe est brodée avec soin en France — votre commande est en cours de préparation et sera expédiée sous{' '}
                          <span style={{ color: '#c8a96e' }}>3 à 5 jours ouvrés</span>.
                        </p>

                        {/* ── b) Séparateur ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #222222', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* ── c) Référence commande ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1e1e1e', marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                  Référence commande
                                </span>
                              </td>
                              <td align="right" style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: '12px', color: '#c8a96e', letterSpacing: '0.1em' }}>
                                  #VLB-{dateRef}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* ── d) Titre section ── */}
                        <p style={{ margin: '0 0 12px', fontSize: '9px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                          Votre sélection
                        </p>

                        {/* ── e) Items ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '0' }}>
                          <tbody>
                            {items.map((item, i) => (
                              <tr key={i}>
                                <td style={{ padding: '14px 0', borderBottom: '1px solid #1e1e1e', verticalAlign: 'top' }}>
                                  <table width="100%" cellPadding="0" cellSpacing="0">
                                    <tbody>
                                      <tr>
                                        {/* Placeholder image */}
                                        <td width="60" valign="top" style={{ paddingRight: '14px' }}>
                                          <div style={{ width: '48px', height: '48px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' }}>
                                            <span style={{ fontSize: '8px', color: '#555555', fontFamily: 'Arial' }}>VLB</span>
                                          </div>
                                        </td>
                                        {/* Nom + meta */}
                                        <td valign="top">
                                          <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', color: '#e8e0d0' }}>
                                            {item.name}
                                          </p>
                                          <p style={{ margin: '0', fontSize: '11px', color: '#666666' }}>
                                            T-shirt · Taille {item.size} · Qté {item.quantity}
                                          </p>
                                        </td>
                                        {/* Prix */}
                                        <td align="right" valign="top" style={{ whiteSpace: 'nowrap' }}>
                                          <span style={{ fontSize: '14px', color: '#f5f0e8' }}>
                                            {fmt(item.unitPrice * item.quantity)}
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* ── f) Tableau totaux ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1e1e1e', borderTop: 'none', marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '10px 16px', fontSize: '12px', color: '#666666' }}>Sous-total</td>
                              <td align="right" style={{ padding: '10px 16px', fontSize: '12px', color: '#aaaaaa' }}>{fmt(subtotal)}</td>
                            </tr>
                            <tr>
                              <td style={{ padding: '10px 16px', fontSize: '12px', color: '#666666' }}>
                                {shippingCost === 0 ? 'Livraison offerte' : 'Livraison standard'}
                              </td>
                              <td align="right" style={{ padding: '10px 16px', fontSize: '12px', color: shippingCost === 0 ? '#6dbf8e' : '#c8a96e' }}>
                                {shippingCost === 0 ? 'Gratuite' : fmt(shippingCost)}
                              </td>
                            </tr>
                            <tr style={{ borderTop: '1px solid #c8a96e' }}>
                              <td style={{ padding: '14px 16px', borderTop: '1px solid #c8a96e' }}>
                                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', color: '#f5f0e8' }}>
                                  Total TTC
                                </span>
                              </td>
                              <td align="right" style={{ padding: '14px 16px', borderTop: '1px solid #c8a96e' }}>
                                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px', color: '#ffffff' }}>
                                  {fmt(totalAmount)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* ── g) Séparateur ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '28px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #1e1e1e', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* ── h) Adresse + Délai ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              {/* Adresse */}
                              <td width="50%" valign="top" style={{ paddingRight: '20px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '9px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                  Adresse de livraison
                                </p>
                                <p style={{ margin: '0', fontSize: '13px', color: '#aaaaaa', lineHeight: '2' }}>
                                  {shippingAddress.line1}<br />
                                  {shippingAddress.postalCode} {shippingAddress.city}<br />
                                  {shippingAddress.country}
                                </p>
                              </td>
                              {/* Délai */}
                              <td width="50%" valign="top" style={{ paddingLeft: '20px', borderLeft: '1px solid #1e1e1e' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '9px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                  Délai estimé
                                </p>
                                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#aaaaaa', lineHeight: '2' }}>
                                  3 à 5 jours ouvrés
                                </p>
                                <span style={{ display: 'inline-block', backgroundColor: '#0d0d0d', border: '1px solid #c8a96e', padding: '5px 14px', fontSize: '10px', color: '#c8a96e', letterSpacing: '0.08em' }}>
                                  En préparation
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* ── i) Séparateur ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '28px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #1e1e1e', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* ── j) Verset biblique ── */}
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td align="center" style={{ padding: '0 16px' }}>
                                <p style={{ margin: '0 0 8px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', fontStyle: 'italic', color: '#666666', lineHeight: '1.9' }}>
                                  « Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. »
                                </p>
                                <p style={{ margin: '0', fontSize: '10px', color: '#444444', letterSpacing: '0.1em' }}>
                                  Éphésiens 2:8
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>

                    {/* ══════════ 4. FOOTER ══════════ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1e1e1e', padding: '28px 48px' }}>
                        <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#555555', lineHeight: '1.8' }}>
                          Pour toute question :{' '}
                          <a href="mailto:sav.contact@volombe.fr" style={{ color: '#c8a96e', textDecoration: 'none' }}>
                            sav.contact@volombe.fr
                          </a>
                        </p>
                        <p style={{ margin: '0', fontSize: '10px', color: '#333333', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                          L'équipe Volombe · noreply@volombe.fr
                        </p>
                      </td>
                    </tr>

                    {/* ══════════ 5. BAS DE PAGE ══════════ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#080808', padding: '16px 48px' }}>
                        <p style={{ margin: '0', fontSize: '10px', color: '#2a2a2a' }}>
                          © 2026 Volombe · Tous droits réservés
                        </p>
                      </td>
                    </tr>

                  </tbody>
                </table>
                {/* fin carte 600px */}

              </td>
            </tr>
          </tbody>
        </table>

      </Body>
    </Html>
  )
}
