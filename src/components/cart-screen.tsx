"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { getStore } from "@/data/catalog";
import { priceLines } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";
import { CartLines } from "@/components/cart-lines";
import { Totals } from "@/components/totals";
import { Button } from "@/components/ui/button";

export function CartScreen() {
  const cart = useCart();
  const store = cart.storeId ? getStore(cart.storeId) : undefined;

  if (!cart.ready) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Loading your cart…</p>;
  }

  if (!store || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingBasket className="size-7" />
        </span>
        <h1 className="mt-4 font-heading text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a store and add mealie meal, soap, or whatever is on the list.
        </p>
        <Button asChild className="mt-6 h-11 px-5">
          <Link href="/#stores">Choose a store</Link>
        </Button>
      </div>
    );
  }

  const priced = priceLines(store, cart.items);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_300px]">
      <div>
        <p className="text-sm text-muted-foreground">
          {store.name} · {store.branch}, {store.city}
        </p>
        <h1 className="font-heading text-3xl">Your cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A rider will collect these from {store.name} {store.branch}.
        </p>
        <div className="mt-4">
          <CartLines
            lines={priced.lines}
            onQty={(line, qty) => cart.setQty(line.productId, line.variantId, qty)}
            onRemove={(line) => cart.removeItem(line.productId, line.variantId)}
          />
        </div>
        {priced.missing.length > 0 ? (
          <p className="mt-3 text-sm text-destructive">
            Some saved items are no longer in the sample catalogue and were left out of the total.
          </p>
        ) : null}
        <button type="button" className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={() => cart.clear()}>
          Clear cart
        </button>
      </div>
      <aside className="h-fit rounded-2xl border bg-card p-4 lg:sticky lg:top-20">
        <h2 className="font-heading text-xl">Order total</h2>
        <div className="mt-3">
          <Totals
            subtotal={priced.subtotal}
            deliveryFee={priced.deliveryFee}
            serviceFee={priced.serviceFee}
            total={priced.total}
          />
        </div>
        <Button asChild className="mt-4 h-12 w-full text-base">
          <Link href="/checkout">Checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
