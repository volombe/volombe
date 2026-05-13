import {
  Body,
  Head,
  Html,
  Preview,
} from '@react-email/components'
import * as React from 'react'

import type { OrderItem, ShippingAddress } from './orderConfirmation'

export interface ShippingConfirmationProps {
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
  trackingNumber: string
  labelUrl?: string
}

export default function ShippingConfirmation({
  customerName,
  items,
  totalAmount,
  shippingAddress,
  trackingNumber,
}: ShippingConfirmationProps) {
  const fmt = (n: number) => n.toFixed(2).replace('.', ',') + ' €'
  const trackingUrl = `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackingNumber}`

  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre commande est en route — VOLOMBE #{trackingNumber}</Preview>
      <Body style={{ margin: '0', padding: '0', backgroundColor: '#080808', fontFamily: 'Arial, Helvetica, sans-serif' }}>

        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#080808' }}>
          <tbody>
            <tr>
              <td align="center" style={{ padding: '32px 16px' }}>

                <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', backgroundColor: '#111111', border: '1px solid #1e1e1e' }}>
                  <tbody>

                    {/* ══ HEADER ══ */}
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

                    {/* ══ HERO ══ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #c8a96e', padding: '32px 48px' }}>
                        <p style={{ margin: '0 0 10px', fontSize: '10px', letterSpacing: '0.25em', color: '#c8a96e', textTransform: 'uppercase', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          Expédition confirmée
                        </p>
                        <p style={{ margin: '0', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '24px', fontWeight: '400', color: '#f5f0e8', letterSpacing: '0.02em' }}>
                          Votre commande est en route
                        </p>
                      </td>
                    </tr>

                    {/* ══ CORPS ══ */}
                    <tr>
                      <td style={{ backgroundColor: '#111111', padding: '40px 48px' }}>

                        {/* Salutation */}
                        <p style={{ margin: '0 0 12px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '15px', color: '#e8e0d0' }}>
                          Bonjour {customerName},
                        </p>
                        <p style={{ margin: '0 0 28px', fontSize: '13px', lineHeight: '1.85', color: '#888888' }}>
                          Votre commande a été expédiée via{' '}
                          <span style={{ color: '#c8a96e' }}>Mondial Relay</span>.
                          Vous pouvez suivre votre colis en temps réel grâce au numéro de suivi ci-dessous.
                        </p>

                        {/* Séparateur */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #222222', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* Tracking block */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#0d0d0d', border: '1px solid #c8a96e', marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '16px 20px' }}>
                                <p style={{ margin: '0 0 6px', fontSize: '10px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                  Numéro de suivi Mondial Relay
                                </p>
                                <p style={{ margin: '0 0 14px', fontSize: '18px', color: '#c8a96e', letterSpacing: '0.1em', fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                  {trackingNumber}
                                </p>
                                <a href={trackingUrl}
                                  style={{ display: 'inline-block', backgroundColor: '#c8a96e', color: '#080808', padding: '9px 22px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' }}>
                                  Suivre mon colis
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Séparateur */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #1e1e1e', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* Récapitulatif produits */}
                        <p style={{ margin: '0 0 12px', fontSize: '9px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                          Récapitulatif
                        </p>

                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '0' }}>
                          <tbody>
                            {items.map((item, i) => (
                              <tr key={i}>
                                <td style={{ padding: '12px 0', borderBottom: '1px solid #1e1e1e' }}>
                                  <table width="100%" cellPadding="0" cellSpacing="0">
                                    <tbody>
                                      <tr>
                                        <td valign="top">
                                          <p style={{ margin: '0 0 4px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', color: '#e8e0d0' }}>
                                            {item.name}
                                          </p>
                                          <p style={{ margin: '0', fontSize: '11px', color: '#666666' }}>
                                            Taille {item.size} · Qté {item.quantity}
                                          </p>
                                        </td>
                                        <td align="right" valign="top" style={{ whiteSpace: 'nowrap' }}>
                                          <span style={{ fontSize: '13px', color: '#aaaaaa' }}>
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

                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#0d0d0d', border: '1px solid #1e1e1e', borderTop: 'none', marginBottom: '28px' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', color: '#f5f0e8' }}>
                                  Total TTC
                                </span>
                              </td>
                              <td align="right" style={{ padding: '14px 16px' }}>
                                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px', color: '#ffffff' }}>
                                  {fmt(totalAmount)}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Séparateur */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '28px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #1e1e1e', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* Adresse */}
                        <p style={{ margin: '0 0 8px', fontSize: '9px', color: '#555555', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                          Adresse de livraison
                        </p>
                        <p style={{ margin: '0 0 28px', fontSize: '13px', color: '#aaaaaa', lineHeight: '2' }}>
                          {shippingAddress.line1}<br />
                          {shippingAddress.postalCode} {shippingAddress.city}<br />
                          {shippingAddress.country}
                        </p>

                        {/* Séparateur */}
                        <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '28px' }}>
                          <tbody><tr><td style={{ borderTop: '1px solid #1e1e1e', fontSize: '0', lineHeight: '0' }}>&nbsp;</td></tr></tbody>
                        </table>

                        {/* Verset */}
                        <table width="100%" cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td align="center" style={{ padding: '0 16px' }}>
                                <p style={{ margin: '0 0 8px', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13px', fontStyle: 'italic', color: '#666666', lineHeight: '1.9' }}>
                                  « Que tout ce que vous faites soit fait avec amour. »
                                </p>
                                <p style={{ margin: '0', fontSize: '10px', color: '#444444', letterSpacing: '0.1em' }}>
                                  1 Corinthiens 16:14
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>

                    {/* ══ FOOTER ══ */}
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

                    {/* ══ BAS DE PAGE ══ */}
                    <tr>
                      <td align="center" style={{ backgroundColor: '#080808', padding: '16px 48px' }}>
                        <p style={{ margin: '0', fontSize: '10px', color: '#2a2a2a' }}>
                          © 2026 Volombe · Tous droits réservés
                        </p>
                      </td>
                    </tr>

                  </tbody>
                </table>

              </td>
            </tr>
          </tbody>
        </table>

      </Body>
    </Html>
  )
}
