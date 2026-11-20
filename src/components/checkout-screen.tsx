"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { deliveryAreas, getStore } from "@/data/catalog";
import { formatK } from "@/lib/format";
import { isZambianMobile, normalizePhone } from "@/lib/phone";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payments";
import { createOrder } from "@/lib/orders";
import { priceLines } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";
import { CartLines } from "@/components/cart-lines";
import { PaymentDialog } from "@/components/payment-dialog";
import { Totals } from "@/components/totals";
import { writeProfile, useProfile } from "@/components/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";

type Errors = Partial<Record<"name" | "phone" | "area" | "address", string>>;

export function CheckoutScreen() {
  const cart = useCart();
  const router = useRouter();
  const { profile, ready } = useProfile();
  const store = cart.storeId ? getStore(cart.storeId) : undefined;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethodId>("airtel");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!ready || prefilled) return;
    if (profile.name) setName(profile.name);
    if (profile.phone) setPhone(profile.phone);
    setPrefilled(true);
  }, [ready, profile, prefilled]);

  useEffect(() => {
    if (store && !area) setArea(store.area);
  }, [store, area]);

  if (!cart.ready) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Loading checkout…</p>;
  }

  if (!store || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-heading text-3xl">{placing ? "Placing your order…" : "Nothing to check out"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {placing ? "Taking you to tracking." : "Add a few groceries before paying."}
        </p>
        {placing ? null : (
          <Button asChild className="mt-6 h-11 px-5">
            <Link href="/#stores">Choose a store</Link>
          </Button>
        )}
      </div>
    );
  }

  const priced = priceLines(store, cart.items);
  const areas = deliveryAreas[store.city] ?? [];
  const momo = PAYMENT_METHODS.filter((entry) => entry.group === "momo");
  const other = PAYMENT_METHODS.filter((entry) => entry.group === "other");

  function validate() {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter the name the rider should ask for.";
    if (!isZambianMobile(phone)) next.phone = "Enter a Zambian mobile number, like 0977 123 456.";
    if (!areas.includes(area)) next.area = "Choose the area for delivery.";
    if (address.trim().length < 4) next.address = "Enter a plot, street or landmark.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder() {
    setFormError("");
    setPlacing(true);
    try {
      const order = createOrder({
        storeId: store!.id,
        items: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
        })),
        customerName: name,
        phone,
        city: store!.city,
        area,
        address,
        notes,
        paymentMethod: method,
      });
      writeProfile({ name: name.trim(), phone: normalizePhone(phone) });
      cart.clear();
      router.push(`/orders/?id=${order.id}&fresh=1`);
    } catch (error) {
      setPlacing(false);
      const message = error instanceof Error ? error.message : "The order did not save. Nothing was charged.";
      throw new Error(message);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 pb-28 lg:grid-cols-[1fr_320px] lg:pb-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            From {store.name} · {store.branch}
          </p>
          <h1 className="font-heading text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Delivery stays in {store.city}. The rider picks up at the store and comes to your gate.
          </p>
        </div>

        <section>
          <h2 className="font-heading text-xl">Items</h2>
          <div className="mt-3">
            <CartLines
              lines={priced.lines}
              onQty={(line, qty) => cart.setQty(line.productId, line.variantId, qty)}
              onRemove={(line) => cart.removeItem(line.productId, line.variantId)}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl">Delivery</h2>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: undefined }));
              }}
              placeholder="Chipo Banda"
              className="h-11 text-base"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setErrors((current) => ({ ...current, phone: undefined }));
              }}
              placeholder="0977 123 456"
              className="h-11 text-base"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={store.city} readOnly className="h-11 bg-muted text-base" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Area</Label>
              <select
                id="area"
                value={area}
                onChange={(event) => {
                  setArea(event.target.value);
                  setErrors((current) => ({ ...current, area: undefined }));
                }}
                className="h-11 w-full rounded-lg border bg-transparent px-3 text-base"
                aria-invalid={Boolean(errors.area)}
              >
                {areas.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
              {errors.area ? <p className="text-sm text-destructive">{errors.area}</p> : null}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Plot, street or landmark</Label>
            <Input
              id="address"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
                setErrors((current) => ({ ...current, address: undefined }));
              }}
              placeholder="Plot 18, Kasangula Road"
              className="h-11 text-base"
              autoComplete="street-address"
              aria-invalid={Boolean(errors.address)}
            />
            {errors.address ? <p className="text-sm text-destructive">{errors.address}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes for the rider</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Green gate. Call when you reach the corner."
              className="min-h-20 text-base"
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-xl">Payment</h2>
            <span className="rounded-full bg-[#c4622d] px-2 py-0.5 text-xs font-semibold text-white">
              Demo / sandbox
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            No payment processor is connected. Mobile money is the usual way to pay.
          </p>
          <div className="mt-3" role="radiogroup" aria-label="Payment method">
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Mobile money
            </p>
            <div className="grid gap-2">
              {momo.map((entry) => (
                <PayOption
                  key={entry.id}
                  selected={method === entry.id}
                  label={entry.label}
                  detail={entry.detail}
                  icon={<Smartphone className="size-5" />}
                  onSelect={() => setMethod(entry.id)}
                />
              ))}
            </div>
            <p className="mt-4 mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Other ways
            </p>
            <div className="grid gap-2">
              {other.map((entry) => (
                <PayOption
                  key={entry.id}
                  selected={method === entry.id}
                  label={entry.label}
                  detail={entry.detail}
                  icon={entry.id === "card" ? <CreditCard className="size-5" /> : <Banknote className="size-5" />}
                  onSelect={() => setMethod(entry.id)}
                />
              ))}
            </div>
          </div>
          {formError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {formError}
            </p>
          ) : null}
          <Button
            type="button"
            className="mt-4 hidden h-12 w-full text-base lg:inline-flex"
            onClick={() => {
              if (!validate()) return;
              setPayOpen(true);
            }}
          >
            Continue with {PAYMENT_METHODS.find((entry) => entry.id === method)?.label}
          </Button>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border bg-card p-4 lg:sticky lg:top-20">
        <h2 className="font-heading text-xl">To pay</h2>
        <div className="mt-3">
          <Totals
            subtotal={priced.subtotal}
            deliveryFee={priced.deliveryFee}
            serviceFee={priced.serviceFee}
            total={priced.total}
          />
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-card/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-heading text-2xl leading-none">{formatK(priced.total)}</p>
          </div>
          <Button
            type="button"
            className="h-12 px-5"
            onClick={() => {
              if (!validate()) return;
              setPayOpen(true);
            }}
          >
            Pay
          </Button>
        </div>
      </div>

      <PaymentDialog
        method={method}
        amount={priced.total}
        phone={phone}
        open={payOpen}
        onOpenChange={setPayOpen}
        onConfirm={async () => {
          try {
            await placeOrder();
          } catch (error) {
            const message = error instanceof Error ? error.message : "The order did not save.";
            setFormError(message);
            throw error;
          }
        }}
      />
    </div>
  );
}

function PayOption({
  selected,
  label,
  detail,
  icon,
  onSelect,
}: {
  selected: boolean;
  label: string;
  detail: string;
  icon: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3 py-3 text-left",
        selected ? "border-primary bg-primary/5 ring-2 ring-primary" : "bg-card",
      )}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-muted text-foreground">{icon}</span>
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
    </button>
  );
}
