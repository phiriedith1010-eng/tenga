"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bike, CircleCheck } from "lucide-react";
import { getStore, variantImage } from "@/data/catalog";
import { formatK, formatWhen } from "@/lib/format";
import { ORDERS_EVENT, getOrder } from "@/lib/orders";
import { formatPhone } from "@/lib/phone";
import { ORDER_STATUSES, STATUS_PROGRESS, statusIndex } from "@/lib/status";
import type { PublicOrder } from "@/lib/order-types";
import { RouteMap } from "@/components/route-map";
import { Monogram } from "@/components/store-card";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

export function TrackingScreen({ orderId }: { orderId: string }) {
  const params = useSearchParams();
  const fresh = params.get("fresh") === "1";
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stop = false;
    let timer = 0;

    function load() {
      window.clearTimeout(timer);
      try {
        const next = getOrder(orderId);
        if (!next) {
          if (!stop) setError("We couldn't load this order.");
        } else if (!stop) {
          setOrder(next);
          setError("");
        }
        if (!stop && next?.status !== "delivered") {
          timer = window.setTimeout(load, 3000);
        }
      } catch {
        if (!stop) setError("This browser could not read the saved order.");
      } finally {
        if (!stop) setLoading(false);
      }
    }

    load();
    window.addEventListener(ORDERS_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      stop = true;
      window.clearTimeout(timer);
      window.removeEventListener(ORDERS_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [orderId]);

  if (loading && !order) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-56 animate-pulse rounded-2xl bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-heading text-3xl">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || "That tracking link does not match an order saved in this browser."}
        </p>
        <Button asChild className="mt-6 h-11">
          <Link href="/orders">Your orders</Link>
        </Button>
      </div>
    );
  }

  const index = statusIndex(order.status);
  const meta = ORDER_STATUSES[index] ?? ORDER_STATUSES[0];
  const store = getStore(order.storeId);
  const showRider = order.status !== "placed";
  const delivered = order.status === "delivered";

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {fresh && !delivered ? (
        <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          Demo payment confirmed. {order.code} is placed. The rider steps move on their own.
        </p>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{order.code} · {formatWhen(order.placedAt)}</p>
          <h1 className="font-heading text-3xl leading-tight" aria-live="polite">
            {meta.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.detail}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
          {delivered ? <CircleCheck className="size-3.5 text-primary" /> : <span className="size-2 animate-pulse rounded-full bg-primary" />}
          {delivered ? "Complete" : "Live demo"}
        </span>
      </div>

      <RouteMap
        progress={STATUS_PROGRESS[index] ?? 0}
        storeLabel={order.storeBranch}
        homeLabel="Your gate"
        riderLabel={order.riderName.split(" ")[0]}
        showRider={showRider}
      />

      <ol className="space-y-0">
        {ORDER_STATUSES.map((status, step) => {
          const state = step < index ? "done" : step === index ? "current" : "upcoming";
          return (
            <li key={status.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs font-semibold",
                    state === "upcoming" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {step + 1}
                </span>
                {step < ORDER_STATUSES.length - 1 ? (
                  <span className={cn("w-px flex-1", step < index ? "bg-primary" : "bg-border")} />
                ) : null}
              </div>
              <div className="pb-4">
                <p className={cn("font-medium", state === "upcoming" && "text-muted-foreground")}>{status.label}</p>
                {state === "current" ? <p className="text-sm text-muted-foreground">{status.detail}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-muted-foreground">
        {delivered
          ? "Delivered. This demo order is complete."
          : "Demo timing: the status moves ahead on its own every few seconds, from order placed through to delivered."}
      </p>

      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#143024] text-white">
            <Bike className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {showRider ? "Your rider" : "Finding a rider"}
            </p>
            {showRider ? (
              <>
                <p className="font-heading text-xl">{order.riderName}</p>
                <p className="text-sm text-muted-foreground">{order.riderVehicle}</p>
                <p className="text-sm text-muted-foreground">Plate {order.riderPlate}</p>
              </>
            ) : (
              <p className="text-sm">A rider near {order.storeArea} will be assigned in a moment.</p>
            )}
            <p className="mt-1 text-sm font-medium">
              {delivered ? "Arrived" : `ETA about ${order.etaMinutes} min`}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <Monogram
            initials={store?.initials ?? order.storeName.slice(0, 2).toUpperCase()}
            tint={store?.tint ?? "#0e6b3c"}
          />
          <div>
            <p className="font-medium">
              {order.storeName} · {order.storeBranch}
            </p>
            <p className="text-sm text-muted-foreground">
              To {order.address}, {order.area}, {order.city}
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={`${item.productId}:${item.variantId}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <Image
                  src={item.image || variantImage(item.variantId)}
                  alt=""
                  width={64}
                  height={64}
                  className="size-12 rounded-lg object-cover"
                />
                <span>
                  {item.qty} × {item.brand} {item.name}
                  <span className="block text-xs text-muted-foreground">{item.label}</span>
                </span>
              </span>
              <span className="tabular-nums">{formatK(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatK(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery fee</dt><dd>{formatK(order.deliveryFee)}</dd></div>
          <div className="flex justify-between"><dt>Service fee</dt><dd>{formatK(order.serviceFee)}</dd></div>
          <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatK(order.total)}</dd></div>
        </dl>
        <p className="mt-3 text-sm">
          {order.paymentLabel}
          {order.paymentMethod !== "card" ? null : null}
        </p>
        <p className="text-sm text-muted-foreground">
          {order.customerName} · {formatPhone(order.phone)}
          {order.notes ? ` · ${order.notes}` : ""}
        </p>
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="h-11">
          <Link href="/orders">Your orders</Link>
        </Button>
        <Button asChild className="h-11">
          <Link href="/">Place another order</Link>
        </Button>
      </div>
    </div>
  );
}
