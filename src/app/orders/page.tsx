import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersRoute } from "@/components/orders-route";

export const metadata: Metadata = { title: "Your orders" };

export default function OrdersPage() {
  return (
    <Suspense
      fallback={<p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Loading…</p>}
    >
      <OrdersRoute />
    </Suspense>
  );
}
