"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { toast } from "sonner";
import {
  categories,
  findVariant,
  getCategory,
  getStore,
  products,
  storePlace,
  storePrice,
  variantImage,
  type Product,
  type Variant,
} from "@/data/catalog";
import { formatK } from "@/lib/format";
import { fromPrice } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";
import { Monogram } from "@/components/store-card";
import { QtyStepper } from "@/components/qty-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "cn";

function uniqueInOrder(values: Array<string | undefined>) {
  const seen: string[] = [];
  for (const value of values) {
    if (value && !seen.includes(value)) seen.push(value);
  }
  return seen;
}

export function StoreScreen({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const cart = useCart();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Product | null>(null);
  const [option, setOption] = useState<string | undefined>();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [pending, setPending] = useState<{ product: Product; variantId: string; qty: number } | null>(
    null,
  );
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (!words.length) return true;
      const categoryLabel = getCategory(product.category)?.label ?? "";
      const hay = [
        product.name,
        product.brand,
        product.blurb,
        product.keywords,
        categoryLabel,
        ...product.variants.flatMap((variant) => [variant.size, variant.option ?? ""]),
      ]
        .join(" ")
        .toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [category, query]);

  if (!store) return null;

  const otherStore = cart.storeId ? getStore(cart.storeId) : undefined;
  const cartHere = cart.storeId === store.id;

  function selectedVariant(product: Product, nextOption = option, nextSize = size) {
    return (
      product.variants.find(
        (variant) =>
          variant.size === nextSize && (variant.option ?? undefined) === (nextOption ?? undefined),
      ) ??
      product.variants.find((variant) => (variant.option ?? undefined) === (nextOption ?? undefined)) ??
      product.variants[0]
    );
  }

  function openProduct(product: Product) {
    const first = product.variants[0];
    setOption(first.option);
    setSize(first.size);
    setQty(1);
    setActive(product);
  }

  function add(product: Product, variantId: string, amount: number) {
    const found = findVariant(product.id, variantId);
    if (!found) return;
    const result = cart.addItem(store!.id, product.id, variantId, amount);
    if (result === "conflict") {
      setPending({ product, variantId, qty: amount });
      setActive(null);
      return;
    }
    const label = found.variant.option
      ? `${found.variant.option} · ${found.variant.size}`
      : found.variant.size;
    toast.success(
      result === "updated"
        ? `Updated ${product.brand} ${product.name}`
        : `Added ${product.brand} ${product.name} · ${label}`,
    );
    setActive(null);
  }

  function chooseOption(next: string) {
    if (!active) return;
    setOption(next);
    const still = active.variants.some((variant) => variant.option === next && variant.size === size);
    if (!still) {
      const fallback = active.variants.find((variant) => variant.option === next);
      if (fallback) setSize(fallback.size);
    }
  }

  const activeVariant = active ? selectedVariant(active) : null;
  const activePrice = activeVariant ? storePrice(activeVariant.price, store.priceAdjust) : 0;
  const optionValues = active ? uniqueInOrder(active.variants.map((variant) => variant.option)) : [];
  const sizeValues = active
    ? uniqueInOrder(
        active.variants
          .filter((variant) => !option || variant.option === option)
          .map((variant) => variant.size),
      )
    : [];

  const sections =
    category === "all" && !query.trim()
      ? categories
          .map((entry) => ({
            ...entry,
            products: filtered.filter((product) => product.category === entry.id),
          }))
          .filter((entry) => entry.products.length > 0)
      : [{ id: "results", label: query.trim() ? "Search results" : getCategory(category)?.label ?? "Items", products: filtered }];

  return (
    <div className={cartHere && cart.count > 0 ? "mx-auto max-w-5xl px-4 py-6 pb-28" : "mx-auto max-w-5xl px-4 py-6"}>
      <Link href="/#stores" className="text-sm font-medium text-primary">
        All stores
      </Link>
      <div className="mt-3 flex items-start gap-3">
        <Monogram initials={store.initials} tint={store.tint} className="size-14 text-base" />
        <div>
          <p className="text-sm text-muted-foreground">{storePlace(store)}</p>
          <h1 className="font-heading text-3xl leading-tight sm:text-4xl">{store.name}</h1>
          <p className="mt-1 text-sm">
            {store.deliveryMin}–{store.deliveryMax} min · Delivery {formatK(store.deliveryFee)} · Open{" "}
            {store.hours}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sample prices for this demo. The same shelf is in every store, with a small price difference.
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-30 -mx-4 mt-4 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search mayonnaise, kapenta, shower gel…"
            className="h-11 pl-9 text-base"
            aria-label="Search products"
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible" role="tablist" aria-label="Categories">
          <button
            type="button"
            role="tab"
            aria-selected={category === "all"}
            onClick={() => setCategory("all")}
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-sm font-medium",
              category === "all" ? "bg-primary text-primary-foreground" : "border bg-card",
            )}
          >
            All
          </button>
          {categories.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={category === entry.id}
              onClick={() => setCategory(entry.id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm font-medium",
                category === entry.id ? "bg-primary text-primary-foreground" : "border bg-card",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-card px-4 py-10 text-center">
          <p className="font-heading text-2xl">Nothing matches “{query.trim()}”</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try mealie meal, kapenta, Boom, or shower gel.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {sections.map((section) => (
            <section key={section.id}>
              <h2 className="font-heading text-2xl">{section.label}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {section.products.map((product) => {
                  const cover = product.variants.reduce((best, variant) =>
                    variant.price < best.price ? variant : best,
                  );
                  const price = fromPrice(
                    product.variants.map((variant) => variant.price),
                    store.priceAdjust,
                  );
                  const multi = product.variants.length > 1;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => openProduct(product)}
                      className="rounded-2xl border bg-card p-2 text-left transition hover:border-primary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      aria-label={`${product.brand} ${product.name}, ${multi ? "from " : ""}${formatK(price)}`}
                    >
                      <Image
                        src={variantImage(cover.id)}
                        alt=""
                        width={640}
                        height={640}
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                      <span className="mt-2 block px-1 text-sm leading-tight font-medium">{product.name}</span>
                      <span className="block px-1 text-xs text-muted-foreground">{product.brand}</span>
                      <span className="mt-1 block px-1 font-semibold">
                        {multi ? `From ${formatK(price)}` : formatK(price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {cartHere && cart.count > 0 ? (
        <div className="fixed inset-x-0 bottom-16 z-30 px-4 md:bottom-4">
          <Link
            href="/cart"
            className="mx-auto flex max-w-lg items-center justify-between rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg"
          >
            <span className="font-medium">View cart · {cart.count}</span>
            <span className="font-heading text-lg">
              {formatK(
                cart.items.reduce((sum, item) => {
                  const found = findVariant(item.productId, item.variantId);
                  if (!found) return sum;
                  return sum + storePrice(found.variant.price, store.priceAdjust) * item.qty;
                }, 0),
              )}
            </span>
          </Link>
        </div>
      ) : null}

      {desktop ? (
        <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
          <DialogContent className="sm:max-w-lg">
            {active && activeVariant ? (
              <PickerBody
                product={active}
                variant={activeVariant}
                optionValues={optionValues}
                sizeValues={sizeValues}
                option={option}
                size={size}
                qty={qty}
                price={activePrice}
                onOption={chooseOption}
                onSize={setSize}
                onQty={setQty}
                onAdd={() => add(active, activeVariant.id, qty)}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
          <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl">
            {active && activeVariant ? (
              <PickerBody
                product={active}
                variant={activeVariant}
                optionValues={optionValues}
                sizeValues={sizeValues}
                option={option}
                size={size}
                qty={qty}
                price={activePrice}
                onOption={chooseOption}
                onSize={setSize}
                onQty={setQty}
                onAdd={() => add(active, activeVariant.id, qty)}
              />
            ) : null}
          </SheetContent>
        </Sheet>
      )}

      <Dialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new cart?</DialogTitle>
            <DialogDescription>
              Your cart is from {otherStore ? `${otherStore.name} ${otherStore.branch}` : "another store"}.
              Adding something from {store.name} {store.branch} clears those items. A rider collects from
              one store per order.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:flex-col">
            <Button type="button" variant="outline" className="h-11" onClick={() => setPending(null)}>
              Keep current cart
            </Button>
            <Button
              type="button"
              className="h-11"
              onClick={() => {
                if (!pending) return;
                cart.replaceAndAdd(store.id, pending.product.id, pending.variantId, pending.qty);
                toast.success(`Cart switched to ${store.name}`);
                setPending(null);
              }}
            >
              Clear cart and add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PickerBody({
  product,
  variant,
  optionValues,
  sizeValues,
  option,
  size,
  qty,
  price,
  onOption,
  onSize,
  onQty,
  onAdd,
}: {
  product: Product;
  variant: Variant;
  optionValues: string[];
  sizeValues: string[];
  option: string | undefined;
  size: string;
  qty: number;
  price: number;
  onOption: (value: string) => void;
  onSize: (value: string) => void;
  onQty: (qty: number) => void;
  onAdd: () => void;
}) {
  const label = variant.option ? `${variant.option} · ${variant.size}` : variant.size;
  return (
    <div className="space-y-4">
      <Image
        src={variantImage(variant.id)}
        alt={`${product.brand} ${product.name}, ${label}`}
        width={640}
        height={640}
        priority
        className="mx-auto aspect-square w-full max-w-xs rounded-2xl object-cover"
      />
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          {product.brand} {product.name}
        </DialogTitle>
        <DialogDescription>{product.blurb}</DialogDescription>
      </DialogHeader>
      {optionValues.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium">{product.chooserLabel ?? "Option"}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {optionValues.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={option === value}
                onClick={() => onOption(value)}
                className={cn(
                  "h-11 rounded-full px-3 text-sm",
                  option === value ? "bg-primary text-primary-foreground" : "border bg-card",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      {sizeValues.length > 0 ? (
        <fieldset>
          <legend className="text-sm font-medium">Size</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizeValues.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={size === value}
                onClick={() => onSize(value)}
                className={cn(
                  "h-11 rounded-full px-3 text-sm",
                  size === value ? "bg-primary text-primary-foreground" : "border bg-card",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <QtyStepper qty={qty} onChange={onQty} />
        <p className="font-heading text-2xl">{formatK(price * qty)}</p>
      </div>
      <Button type="button" className="h-12 w-full text-base" onClick={onAdd}>
        Add to cart
      </Button>
    </div>
  );
}
