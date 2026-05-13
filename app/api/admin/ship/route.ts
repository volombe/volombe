import { getSupabaseAdmin } from '@/lib/supabase'
import { getResend } from '@/lib/resend'
import ShippingConfirmation from '@/lib/emails/shippingConfirmation'
import { render } from '@react-email/render'
import { createElement } from 'react'
import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function md5(str: string): string {
  return createHash('md5').update(str, 'latin1').digest('hex').toUpperCase()
}

async function createMRLabel(order: Record<string, any>): Promise<{ trackingNumber: string; labelUrl: string }> {
  const enseigne  = process.env.MR_CODE_ENSEIGNE!
  const clePrivee = process.env.MR_CLE_PRIVEE!
  const addr      = (order.shipping_address ?? {}) as Record<string, string>

  const modeCol              = 'CU'
  const modeLiv              = '24R'
  const nDossier             = ''
  const nClient              = ''
  const expe_Langage         = 'FR'
  const expe_Ad1             = 'VOLOMBE'
  const expe_Ad2             = ''
  const expe_Ad3             = ''
  const expe_Ad4             = ''
  const expe_Ville           = 'PARIS'
  const expe_CP              = '75001'
  const expe_Pays            = 'FR'
  const expe_Tel1            = ''
  const expe_Mail            = 'noreply@volombe.fr'
  const dest_Langage         = 'FR'
  const dest_Ad1             = (order.customer_name ?? '').substring(0, 32)
  const dest_Ad2             = (addr.line1 ?? '').substring(0, 32)
  const dest_Ville           = addr.city ?? ''
  const dest_CP              = addr.postalCode ?? ''
  const dest_Pays            = addr.country ?? 'FR'
  const dest_Tel1            = ''
  const dest_Mail            = order.customer_email ?? ''
  const poids                = '500'
  const nbColis              = '1'
  const crtValeur            = '0'
  const assurance            = '0'
  const texte                = ''
  const livraisonInstructions = ''
  const numPointRelais       = ''

  const securityInput = [
    enseigne, modeCol, modeLiv, nDossier, nClient,
    expe_Langage, expe_Ad1, expe_Ad2, expe_Ad3, expe_Ad4,
    expe_Ville, expe_CP, expe_Pays, expe_Tel1, expe_Mail,
    dest_Langage, dest_Ad1, dest_Ad2, dest_Ville, dest_CP,
    dest_Pays, dest_Tel1, dest_Mail,
    poids, nbColis, crtValeur, assurance, texte,
    livraisonInstructions, numPointRelais, clePrivee,
  ].join('')

  const security = md5(securityInput)

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" xmlns:xsd="http://www.w3.org/1999/XMLSchema">
  <soap:Body>
    <WSI2_CreerEtiquette xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${enseigne}</Enseigne>
      <ModeCol>${modeCol}</ModeCol>
      <ModeLiv>${modeLiv}</ModeLiv>
      <NDossier>${nDossier}</NDossier>
      <NClient>${nClient}</NClient>
      <Expe_Langage>${expe_Langage}</Expe_Langage>
      <Expe_Ad1>${expe_Ad1}</Expe_Ad1>
      <Expe_Ad2>${expe_Ad2}</Expe_Ad2>
      <Expe_Ad3>${expe_Ad3}</Expe_Ad3>
      <Expe_Ad4>${expe_Ad4}</Expe_Ad4>
      <Expe_Ville>${expe_Ville}</Expe_Ville>
      <Expe_CP>${expe_CP}</Expe_CP>
      <Expe_Pays>${expe_Pays}</Expe_Pays>
      <Expe_Tel1>${expe_Tel1}</Expe_Tel1>
      <Expe_Mail>${expe_Mail}</Expe_Mail>
      <Dest_Langage>${dest_Langage}</Dest_Langage>
      <Dest_Ad1>${dest_Ad1}</Dest_Ad1>
      <Dest_Ad2>${dest_Ad2}</Dest_Ad2>
      <Dest_Ville>${dest_Ville}</Dest_Ville>
      <Dest_CP>${dest_CP}</Dest_CP>
      <Dest_Pays>${dest_Pays}</Dest_Pays>
      <Dest_Tel1>${dest_Tel1}</Dest_Tel1>
      <Dest_Mail>${dest_Mail}</Dest_Mail>
      <Poids>${poids}</Poids>
      <NbColis>${nbColis}</NbColis>
      <CRT_Valeur>${crtValeur}</CRT_Valeur>
      <Assurance>${assurance}</Assurance>
      <Texte>${texte}</Texte>
      <LivraisonInstructions>${livraisonInstructions}</LivraisonInstructions>
      <NumPointRelais>${numPointRelais}</NumPointRelais>
      <Security>${security}</Security>
    </WSI2_CreerEtiquette>
  </soap:Body>
</soap:Envelope>`

  const res = await fetch('https://www.mondialrelay.fr/webservice/Web_Services.asmx', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction':   'http://www.mondialrelay.fr/webservice/WSI2_CreerEtiquette',
    },
    body: soapBody,
  })

  const xml = await res.text()

  const trackingMatch = xml.match(/<ExpeditionNum>([^<]+)<\/ExpeditionNum>/)
  const urlMatch      = xml.match(/<URL_Etiquette>([^<]+)<\/URL_Etiquette>/)

  if (!trackingMatch || !urlMatch) {
    const stat = xml.match(/<STAT>([^<]+)<\/STAT>/)?.[1] ?? 'unknown'
    throw new Error(`Mondial Relay STAT=${stat}`)
  }

  return { trackingNumber: trackingMatch[1], labelUrl: urlMatch[1] }
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId } = await request.json() as { orderId: string }
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

  const db = getSupabaseAdmin()

  const { data: order, error: fetchErr } = await db
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (fetchErr || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status === 'shipped') return NextResponse.json({ error: 'Already shipped' }, { status: 400 })

  let trackingNumber: string
  let labelUrl: string

  try {
    const result = await createMRLabel(order)
    trackingNumber = result.trackingNumber
    labelUrl       = result.labelUrl
  } catch (mrErr: any) {
    console.error('[MR] Label error:', mrErr?.message)
    return NextResponse.json({ error: mrErr?.message }, { status: 500 })
  }

  await db.from('orders').update({
    status:          'shipped',
    tracking_number: trackingNumber,
    mr_label_url:    labelUrl,
    shipped_at:      new Date().toISOString(),
  }).eq('id', orderId)

  try {
    const emailProps = {
      customerName:    order.customer_name  ?? 'Client',
      customerEmail:   order.customer_email ?? '',
      items:           order.items          ?? [],
      totalAmount:     order.total_amount   ?? 0,
      shippingAddress: order.shipping_address ?? { line1: '', city: '', postalCode: '', country: '' },
      trackingNumber,
      labelUrl,
    }

    const html = await render(createElement(ShippingConfirmation, emailProps))
    const resend = getResend()

    await resend.emails.send({
      from:    'VOLOMBE <noreply@volombe.fr>',
      to:      [order.customer_email],
      subject: 'Votre commande est en route — VOLOMBE',
      html,
    })

    console.log('[Resend] Shipping email →', order.customer_email)
  } catch (emailErr: any) {
    console.error('[Resend] Shipping email error:', emailErr?.message)
  }

  return NextResponse.json({ trackingNumber, labelUrl })
}
