"use client";

import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useProfile } from "@/components/use-profile";

export function SiteHeader() {
  const { count } = useCart();
  const { profile, ready } = useProfile();
  const firstName = profile.name.trim().split(" ")[0];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="h-1 bg-[linear-gradient(90deg,#0e6b3c,#c4622d)]" />
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShoppingBasket className="size-5" />
          </span>
          <span className="font-heading text-2xl leading-none tracking-tight">Tenga</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/#how-delivery-works" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline">
            How delivery works
          </Link>
          <Link href="/orders" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline">
            {ready && firstName ? `Hi, ${firstName}` : "Orders"}
          </Link>
          <Link
            href="/cart"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground sm:px-4"
          >
            <ShoppingBasket className="size-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="sr-only sm:hidden">Cart</span>
            {count > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-semibold text-primary">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
