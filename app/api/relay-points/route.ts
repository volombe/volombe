import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function md5(str: string): string {
  return createHash('md5').update(str, 'latin1').digest('hex').toUpperCase()
}

function extractTagValue(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))
  return match ? match[1].trim() : ''
}

function extractAllBlocks(xml: string, tag: string): string[] {
  const blocks: string[] = []
  const regex = new RegExp(`<${tag}[\\s\\S]*?>([\\s\\S]*?)<\\/${tag}>`, 'g')
  let m: RegExpExecArray | null
  while ((m = regex.exec(xml)) !== null) blocks.push(m[1])
  return blocks
}

function buildHoraires(block: string): string {
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const parts: string[] = []
  for (const jour of jours) {
    const matin  = extractTagValue(block, `Horaires_${jour}_Matin`)
    const apresM = extractTagValue(block, `Horaires_${jour}_ApresM`)
    if (matin || apresM) {
      parts.push(`${jour.substring(0, 2)}: ${[matin, apresM].filter(Boolean).join('/')}`)
    }
    if (parts.length >= 3) break
  }
  return parts.join(' · ')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const codePostal = searchParams.get('codePostal') ?? ''
  const pays       = searchParams.get('pays') ?? 'FR'

  if (!codePostal) {
    return NextResponse.json({ error: 'codePostal requis' }, { status: 400 })
  }

  const enseigne       = process.env.MR_CODE_ENSEIGNE!
  const clePrivee      = process.env.MR_CLE_PRIVEE!
  const ville          = ''
  const latitude       = ''
  const longitude      = ''
  const taille         = ''
  const poids          = ''
  const action         = ''
  const delaiEnvoi     = '0'
  const rayonRecherche = '20'
  const typeActivite   = ''
  const nace           = ''
  const nbResultats    = '7'

  const security = md5([
    enseigne, pays, ville, codePostal, latitude, longitude,
    taille, poids, action, delaiEnvoi, rayonRecherche,
    typeActivite, nace, nbResultats, clePrivee,
  ].join(''))

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance" xmlns:xsd="http://www.w3.org/1999/XMLSchema">
  <soap:Body>
    <WSI2_RecherchePointRelais xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>${enseigne}</Enseigne>
      <Pays>${pays}</Pays>
      <Ville>${ville}</Ville>
      <CP>${codePostal}</CP>
      <Latitude>${latitude}</Latitude>
      <Longitude>${longitude}</Longitude>
      <Taille>${taille}</Taille>
      <Poids>${poids}</Poids>
      <Action>${action}</Action>
      <DelaiEnvoi>${delaiEnvoi}</DelaiEnvoi>
      <RayonRecherche>${rayonRecherche}</RayonRecherche>
      <TypeActivite>${typeActivite}</TypeActivite>
      <NACE>${nace}</NACE>
      <NombreResultats>${nbResultats}</NombreResultats>
      <Security>${security}</Security>
    </WSI2_RecherchePointRelais>
  </soap:Body>
</soap:Envelope>`

  const res = await fetch('https://api.mondialrelay.com/WebService.asmx', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://www.mondialrelay.fr/webservice/WSI2_RecherchePointRelais',
    },
    body: soapBody,
  })

  const xml = await res.text()

  const stat = extractTagValue(xml, 'STAT')
  if (stat !== '0') {
    return NextResponse.json({ error: `Mondial Relay STAT=${stat}` }, { status: 500 })
  }

  // L'API MR retourne des tags <PR01>, <PR02>, ..., <PRxx>
  const blocks: string[] = []
  const prRegex = /<(PR\d+)>([\s\S]*?)<\/\1>/g
  let prMatch: RegExpExecArray | null
  while ((prMatch = prRegex.exec(xml)) !== null) blocks.push(prMatch[2])

  const points = blocks
    .map(block => ({
      id:         extractTagValue(block, 'Num'),
      nom:        extractTagValue(block, 'LgAdr1'),
      adresse:    [extractTagValue(block, 'LgAdr3'), extractTagValue(block, 'LgAdr4')].filter(Boolean).join(', ')
                  || extractTagValue(block, 'LgAdr2'),
      ville:      extractTagValue(block, 'Ville'),
      codePostal: extractTagValue(block, 'CP'),
      distance:   extractTagValue(block, 'Distance'),
      horaires:   buildHoraires(block),
    }))
    .filter(p => p.id !== '')

  return NextResponse.json(points)
}
