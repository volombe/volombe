import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const produit = request.nextUrl.searchParams.get('produit')

  if (!produit) {
    return NextResponse.json({ error: 'produit requis' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('stock')
    .select('*')
    .eq('produit', produit)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
