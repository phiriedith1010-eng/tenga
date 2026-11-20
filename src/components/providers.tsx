"use client";

import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster position="top-center" theme="light" />
    </CartProvider>
  );
}
