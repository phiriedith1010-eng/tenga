"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatK, formatWhen } from "@/lib/format";
import { ORDERS_EVENT, advanceOrder, listAllOrders } from "@/lib/orders";
import { ORDER_STATUSES, statusIndex, statusMeta } from "@/lib/status";
import type { PublicOrder } from "@/lib/order-types";
import { RIDER_DESK_CODE } from "@/lib/rider-auth";
import { Button } from "@/components/ui/button";

export function RiderScreen() {
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      const list = listAllOrders();
      list.sort((a, b) => {
        const aDone = a.status === "delivered" ? 1 : 0;
        const bDone = b.status === "delivered" ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;
        return b.placedAt - a.placedAt;
      });
      setOrders(list);
      setError("");
    } catch {
      setError("The desk could not load orders saved in this browser.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 3000);
    window.addEventListener(ORDERS_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(ORDERS_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [load]);

  function advance(id: string) {
    setBusyId(id);
    try {
      const order = advanceOrder(id);
      if (!order) setError("Order not found.");
      load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Demo rider desk</p>
      <h1 className="font-heading text-3xl">Orders on the road</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        This is not a real dispatch login. Statuses also move forward on their own. Use the button
        when you want the next step immediately. Desk latch: {RIDER_DESK_CODE}.
      </p>

      {loading ? <p className="mt-6 text-sm text-muted-foreground">Loading orders…</p> : null}
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {!loading && orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border bg-card px-4 py-10 text-center">
          <p className="font-heading text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Place a demo order and it will show up here.</p>
          <Button asChild className="mt-4 h-11">
            <Link href="/">Go to stores</Link>
          </Button>
        </div>
      ) : null}

      <ul className="mt-6 space-y-3">
        {orders.map((order) => {
          const index = statusIndex(order.status);
          const next = ORDER_STATUSES[index + 1];
          return (
            <li key={order.id} className="rounded-2xl border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {order.code} · {formatWhen(order.placedAt)}
                  </p>
                  <p className="font-medium">
                    {order.customerName} · {order.area}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.storeName} {order.storeBranch} → {order.address}
                  </p>
                  <p className="mt-1 text-sm">
                    {statusMeta(order.status).label} · {order.riderName} · {formatK(order.total)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    className="h-11"
                    disabled={!next || busyId === order.id}
                    onClick={() => void advance(order.id)}
                  >
                    {next ? `Mark next: ${next.label}` : "Delivered"}
                  </Button>
                  <Link href={`/orders/?id=${order.id}`} className="text-center text-sm text-primary">
                    Open tracking
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
