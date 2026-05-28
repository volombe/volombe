export interface ServerProduct {
  id: string
  name: string
  price: number
}

export const PRODUCTS: Record<string, ServerProduct> = {
  apocalypse: { id: 'apocalypse', name: 'Apocalypse 20:11-15', price: 40 },
  fondement:  { id: 'fondement',  name: 'Le Fondement',        price: 30 },
  conviction: { id: 'conviction', name: 'Conviction',          price: 80 },
}

export interface ValidatedItem {
  id: string
  name: string
  size: string
  qty: number
  unitPrice: number
}

export function validateCartItems(
  rawItems: Array<{ id?: unknown; size?: unknown; qty?: unknown }>
): ValidatedItem[] {
  const validated: ValidatedItem[] = []

  for (const item of rawItems) {
    const product = typeof item.id === 'string' ? PRODUCTS[item.id] : undefined
    if (!product) {
      throw new Error(`Produit inconnu : ${String(item.id)}`)
    }

    const qty = Math.max(1, Math.min(10, Math.floor(Number(item.qty) || 1)))

    const size = String(item.size ?? '').trim()
    if (!size) {
      throw new Error(`Taille manquante pour ${product.id}`)
    }

    validated.push({
      id:        product.id,
      name:      product.name,
      size,
      qty,
      unitPrice: product.price,
    })
  }

  if (validated.length === 0) {
    throw new Error('Panier vide')
  }

  return validated
}
