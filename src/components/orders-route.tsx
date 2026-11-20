"use client";

import { useSearchParams } from "next/navigation";
import { OrdersScreen } from "@/components/orders-screen";
import { TrackingScreen } from "@/components/tracking-screen";

export function OrdersRoute() {
  const params = useSearchParams();
  const id = params.get("id");
  if (id) return <TrackingScreen orderId={id} />;
  return <OrdersScreen />;
}
