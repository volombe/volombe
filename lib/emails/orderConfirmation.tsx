import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
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
  shippingAddress: ShippingAddress
}

export default function OrderConfirmation({
  customerName,
  customerEmail,
  items,
  totalAmount,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Merci pour votre commande — VOLOMBE</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* En-tête */}
          <Section style={header}>
            <Text style={logo}>VOLOMBE</Text>
          </Section>

          <Hr style={divider} />

          {/* Titre */}
          <Section style={section}>
            <Heading style={h1}>Merci pour votre commande</Heading>
            <Text style={body}>
              Bonjour {customerName},
            </Text>
            <Text style={body}>
              Nous avons bien reçu votre commande et elle est en cours de préparation.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Récapitulatif */}
          <Section style={section}>
            <Text style={sectionTitle}>Récapitulatif</Text>

            {/* En-têtes tableau */}
            <Row style={tableHeader}>
              <Column style={{ ...cell, width: '40%' }}>Produit</Column>
              <Column style={{ ...cell, width: '20%' }}>Taille</Column>
              <Column style={{ ...cell, width: '15%' }}>Qté</Column>
              <Column style={{ ...cell, width: '25%', textAlign: 'right' }}>Prix</Column>
            </Row>

            {items.map((item, i) => (
              <Row key={i} style={tableRow}>
                <Column style={{ ...cell, width: '40%' }}>{item.name}</Column>
                <Column style={{ ...cell, width: '20%' }}>{item.size}</Column>
                <Column style={{ ...cell, width: '15%' }}>{item.quantity}</Column>
                <Column style={{ ...cell, width: '25%', textAlign: 'right' }}>
                  {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')} €
                </Column>
              </Row>
            ))}

            <Hr style={dividerLight} />

            <Row>
              <Column style={{ ...cell, width: '75%', textAlign: 'right', fontWeight: '600' }}>
                Total
              </Column>
              <Column style={{ ...cell, width: '25%', textAlign: 'right', fontWeight: '600' }}>
                {totalAmount.toFixed(2).replace('.', ',')} €
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Adresse */}
          <Section style={section}>
            <Text style={sectionTitle}>Adresse de livraison</Text>
            <Text style={addressText}>{customerName}</Text>
            <Text style={addressText}>{shippingAddress.line1}</Text>
            <Text style={addressText}>
              {shippingAddress.postalCode} {shippingAddress.city}
            </Text>
            <Text style={addressText}>{shippingAddress.country}</Text>
          </Section>

          <Hr style={divider} />

          {/* Message expédition */}
          <Section style={section}>
            <Text style={body}>
              Votre commande est en cours de préparation. Vous recevrez un email
              dès l'expédition sous <strong>3 à 5 jours ouvrés</strong>.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Pied de page */}
          <Section style={footer}>
            <Text style={footerText}>L'équipe Volombe</Text>
            <Text style={footerText}>noreply@volombe.fr</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

/* ─── Styles ─── */
const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
}
const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '40px auto',
  padding: '0 20px',
}
const header: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '40px',
  paddingBottom: '24px',
}
const logo: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: '400',
  letterSpacing: '0.3em',
  color: '#0a0a0a',
  margin: '0',
}
const divider: React.CSSProperties = {
  borderColor: '#0a0a0a',
  borderTopWidth: '1px',
  margin: '0',
}
const dividerLight: React.CSSProperties = {
  borderColor: '#e5e5e5',
  borderTopWidth: '1px',
  margin: '8px 0',
}
const section: React.CSSProperties = {
  padding: '32px 0',
}
const h1: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '400',
  color: '#0a0a0a',
  margin: '0 0 16px',
  letterSpacing: '0.01em',
}
const sectionTitle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#666',
  margin: '0 0 16px',
}
const body: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.8',
  color: '#333',
  margin: '0 0 12px',
}
const tableHeader: React.CSSProperties = {
  borderBottom: '1px solid #0a0a0a',
  paddingBottom: '8px',
  marginBottom: '8px',
}
const tableRow: React.CSSProperties = {
  borderBottom: '1px solid #f0f0f0',
}
const cell: React.CSSProperties = {
  fontSize: '13px',
  color: '#333',
  padding: '10px 4px',
}
const addressText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#333',
  margin: '0 0 4px',
}
const footer: React.CSSProperties = {
  textAlign: 'center',
  padding: '24px 0 40px',
}
const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#999',
  margin: '0 0 4px',
  letterSpacing: '0.05em',
}
