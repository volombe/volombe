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

import type { OrderItem, ShippingAddress } from './orderConfirmation'

export interface AdminNotificationProps {
  customerName: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: ShippingAddress
}

export default function AdminNotification({
  customerName,
  customerEmail,
  items,
  totalAmount,
  shippingAddress,
}: AdminNotificationProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>🛒 Nouvelle commande — {customerName} — {totalAmount.toFixed(2)} €</Preview>
      <Body style={main}>
        <Container style={container}>

          <Heading style={h1}>🛒 Nouvelle commande</Heading>
          <Hr style={divider} />

          {/* Client */}
          <Section style={section}>
            <Text style={label}>CLIENT</Text>
            <Text style={value}>{customerName}</Text>
            <Text style={value}>{customerEmail}</Text>
          </Section>

          <Hr style={divider} />

          {/* Produits */}
          <Section style={section}>
            <Text style={label}>PRODUITS</Text>
            {items.map((item, i) => (
              <Row key={i} style={row}>
                <Column style={{ width: '50%' }}>
                  <Text style={value}>{item.name} — {item.size}</Text>
                </Column>
                <Column style={{ width: '25%' }}>
                  <Text style={value}>Qté : {item.quantity}</Text>
                </Column>
                <Column style={{ width: '25%' }}>
                  <Text style={{ ...value, textAlign: 'right' }}>
                    {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')} €
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={divider} />
            <Text style={{ ...value, fontWeight: '700', textAlign: 'right' }}>
              Total : {totalAmount.toFixed(2).replace('.', ',')} €
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Adresse */}
          <Section style={section}>
            <Text style={label}>ADRESSE DE LIVRAISON</Text>
            <Text style={value}>{customerName}</Text>
            <Text style={value}>{shippingAddress.line1}</Text>
            <Text style={value}>
              {shippingAddress.postalCode} {shippingAddress.city}
            </Text>
            <Text style={value}>{shippingAddress.country}</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
}
const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '32px auto',
  backgroundColor: '#ffffff',
  padding: '32px',
  border: '1px solid #e5e5e5',
}
const h1: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#0a0a0a',
  margin: '0 0 16px',
}
const divider: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
}
const section: React.CSSProperties = {
  padding: '20px 0',
}
const label: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '0.15em',
  color: '#999',
  margin: '0 0 8px',
}
const value: React.CSSProperties = {
  fontSize: '14px',
  color: '#222',
  margin: '0 0 4px',
  lineHeight: '1.5',
}
const row: React.CSSProperties = {
  marginBottom: '8px',
}
