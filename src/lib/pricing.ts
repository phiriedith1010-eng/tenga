import { SERVICE_FEE, findVariant, storePrice, variantImage, type Store } from "@/data/catalog";

export type CartRef = {
  productId: string;
  variantId: string;
  qty: number;
};

export type PricedLine = CartRef & {
  brand: string;
  name: string;
  label: string;
  unitPrice: number;
  lineTotal: number;
  image: string;
};

export function variantLabel(variant: { size: string; option?: string }) {
  return variant.option ? `${variant.option} · ${variant.size}` : variant.size;
}

export function priceLines(store: Store, items: CartRef[]) {
  const lines: PricedLine[] = [];
  const missing: string[] = [];

  for (const item of items) {
    const found = findVariant(item.productId, item.variantId);
    if (!found) {
      missing.push(item.variantId);
      continue;
    }
    const unitPrice = storePrice(found.variant.price, store.priceAdjust);
    lines.push({
      productId: item.productId,
      variantId: item.variantId,
      qty: item.qty,
      brand: found.product.brand,
      name: found.product.name,
      label: variantLabel(found.variant),
      unitPrice,
      lineTotal: unitPrice * item.qty,
      image: variantImage(item.variantId),
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const deliveryFee = store.deliveryFee;
  const serviceFee = SERVICE_FEE;
  const total = subtotal + deliveryFee + serviceFee;
  return { lines, missing, subtotal, deliveryFee, serviceFee, total };
}

export function fromPrice(basePrices: number[], priceAdjust: number) {
  return storePrice(Math.min(...basePrices), priceAdjust);
}
