import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

const attempts = new Map<string, { count: number; lockedUntil: number }>()

function safeCompare(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  if (ha.length !== hb.length) return false
  return timingSafeEqual(ha, hb)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const now = Date.now()
  const record = attempts.get(ip) ?? { count: 0, lockedUntil: 0 }

  if (record.lockedUntil > now) {
    const minutes = Math.ceil((record.lockedUntil - now) / 60000)
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${minutes} minutes.` },
      { status: 429 }
    )
  }

  const { password } = await req.json()

  if (!safeCompare(password ?? '', process.env.ADMIN_PASSWORD ?? '')) {
    record.count += 1
    if (record.count >= 3) {
      record.lockedUntil = now + 30 * 60 * 1000
      record.count = 0
    }
    attempts.set(ip, record)
    const remaining = 3 - record.count
    return NextResponse.json(
      { error: record.lockedUntil > now ? 'Compte bloqué 30 minutes.' : `Mot de passe incorrect. ${remaining} tentative(s) restante(s).` },
      { status: 401 }
    )
  }

  attempts.delete(ip)
  return NextResponse.json({ success: true })
}
