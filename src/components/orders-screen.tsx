"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatK, formatWhen } from "@/lib/format";
import { OrderError, listOrdersByPhone } from "@/lib/orders";
import { formatPhone, isZambianMobile, normalizePhone } from "@/lib/phone";
import { statusMeta } from "@/lib/status";
import type { PublicOrder } from "@/lib/order-types";
import { useProfile, writeProfile } from "@/components/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OrdersScreen() {
  const { profile, ready, save } = useProfile();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const lookup = useCallback(async (nextPhone: string) => {
    const normalized = normalizePhone(nextPhone);
    if (!isZambianMobile(normalized)) {
      setError("Enter a Zambian mobile number, like 0977 123 456.");
      setOrders([]);
      setLoaded(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setOrders(listOrdersByPhone(normalized));
      save({ name: profile.name, phone: normalized });
    } catch (error) {
      setOrders([]);
      setError(error instanceof OrderError ? error.message : "Could not load orders.");
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [profile.name, save]);

  useEffect(() => {
    if (ready && profile.phone && !phone) setPhone(profile.phone);
  }, [ready, profile.phone, phone]);

  useEffect(() => {
    if (!ready || !profile.phone) return;
    void lookup(profile.phone);
  }, [ready, profile.phone, lookup]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-heading text-3xl">Your orders</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Guest checkout needs no password. This phone number is your demo account on this browser:
        orders placed with it are saved here, and asking for the same number shows them again.
      </p>

      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(phone);
        }}
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="history-phone">Mobile number</Label>
          <Input
            id="history-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0977 123 456"
            className="h-11 text-base"
            inputMode="tel"
          />
        </div>
        <Button type="submit" className="h-11" disabled={loading}>
          {loading ? "Looking…" : "Show orders"}
        </Button>
      </form>
      {profile.name ? (
        <button
          type="button"
          className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => {
            writeProfile({ name: "", phone: "" });
            setPhone("");
            setOrders([]);
            setLoaded(false);
          }}
        >
          Forget this number on this browser
        </button>
      ) : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      {loading && !loaded ? (
        <div className="mt-6 space-y-3">
          <div className="h-20 animate-pulse rounded-2xl bg-muted" />
          <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        </div>
      ) : null}

      {loaded && !loading && orders.length === 0 && !error ? (
        <div className="mt-8 rounded-2xl border bg-card px-4 py-10 text-center">
          <p className="font-heading text-2xl">No orders for this number yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Place a demo order with {formatPhone(normalizePhone(phone)) || "this phone"} and it will land here.
          </p>
          <Button asChild className="mt-4 h-11">
            <Link href="/#stores">Choose a store</Link>
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link href={`/orders/?id=${order.id}`} className="block rounded-2xl border bg-card p-4 hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{order.code} · {formatWhen(order.placedAt)}</p>
                  <p className="font-medium">
                    {order.storeName} · {order.storeBranch}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.area}, {order.city} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-xl">{formatK(order.total)}</p>
                  <p className="text-xs font-medium text-primary">{statusMeta(order.status).label}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
