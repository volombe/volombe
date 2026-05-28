import { NextRequest, NextResponse } from 'next/server'
import { validateCartItems } from '@/lib/products'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json()
    const items = (body as { items?: unknown }).items ?? []
    const validated = validateCartItems(items as Array<{ id?: unknown; size?: unknown; qty?: unknown }>)
    return NextResponse.json({ items: validated })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Panier invalide'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
