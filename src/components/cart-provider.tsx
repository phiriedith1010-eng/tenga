"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "tenga-cart";

export type CartItem = {
  productId: string;
  variantId: string;
  qty: number;
};

type CartState = {
  storeId: string | null;
  items: CartItem[];
};

type AddResult = "added" | "updated" | "conflict";

type CartContextValue = {
  storeId: string | null;
  items: CartItem[];
  ready: boolean;
  count: number;
  addItem: (storeId: string, productId: string, variantId: string, qty?: number) => AddResult;
  replaceAndAdd: (storeId: string, productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const empty: CartState = { storeId: null, items: [] };

function clampQty(qty: number) {
  return Math.min(20, Math.max(1, Math.round(qty)));
}

function sanitize(value: unknown): CartState {
  if (!value || typeof value !== "object") return empty;
  const record = value as { storeId?: unknown; items?: unknown };
  if (!Array.isArray(record.items)) return empty;
  const items: CartItem[] = [];
  for (const entry of record.items) {
    if (!entry || typeof entry !== "object") continue;
    const line = entry as { productId?: unknown; variantId?: unknown; qty?: unknown };
    const productId = String(line.productId ?? "");
    const variantId = String(line.variantId ?? "");
    const qty = Number(line.qty);
    if (!productId || !variantId || !Number.isFinite(qty)) continue;
    items.push({ productId, variantId, qty: clampQty(qty) });
  }
  const storeId = typeof record.storeId === "string" ? record.storeId : null;
  return { storeId: items.length ? storeId : null, items };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(empty);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const next = sanitize(JSON.parse(raw));
        stateRef.current = next;
        setState(next);
      }
    } catch {
      /* ignore a broken saved cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const value = useMemo<CartContextValue>(() => {
    function commit(next: CartState) {
      stateRef.current = next;
      setState(next);
    }

    return {
      storeId: state.storeId,
      items: state.items,
      ready,
      count: state.items.reduce((sum, item) => sum + item.qty, 0),
      addItem(storeId, productId, variantId, qty = 1) {
        const prev = stateRef.current;
        if (prev.storeId && prev.storeId !== storeId && prev.items.length > 0) {
          return "conflict";
        }
        const items = prev.storeId === storeId ? [...prev.items] : [];
        const index = items.findIndex(
          (item) => item.productId === productId && item.variantId === variantId,
        );
        if (index >= 0) {
          items[index] = { ...items[index], qty: Math.min(20, items[index].qty + qty) };
          commit({ storeId, items });
          return "updated";
        }
        items.push({ productId, variantId, qty: clampQty(qty) });
        commit({ storeId, items });
        return "added";
      },
      replaceAndAdd(storeId, productId, variantId, qty = 1) {
        commit({
          storeId,
          items: [{ productId, variantId, qty: clampQty(qty) }],
        });
      },
      setQty(productId, variantId, qty) {
        const prev = stateRef.current;
        const items =
          qty <= 0
            ? prev.items.filter(
                (item) => !(item.productId === productId && item.variantId === variantId),
              )
            : prev.items.map((item) =>
                item.productId === productId && item.variantId === variantId
                  ? { ...item, qty: clampQty(qty) }
                  : item,
              );
        commit({ storeId: items.length ? prev.storeId : null, items });
      },
      removeItem(productId, variantId) {
        const prev = stateRef.current;
        const items = prev.items.filter(
          (item) => !(item.productId === productId && item.variantId === variantId),
        );
        commit({ storeId: items.length ? prev.storeId : null, items });
      },
      clear() {
        commit(empty);
      },
    };
  }, [state, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
