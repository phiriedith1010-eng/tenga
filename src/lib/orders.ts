import { deliveryAreas, getStore } from "@/data/catalog";
import { formatPhone, isZambianMobile, normalizePhone } from "@/lib/phone";
import { isPaymentMethod, paymentMethod, type PaymentMethodId } from "@/lib/payments";
import type { PublicOrder } from "@/lib/order-types";
import { priceLines, type PricedLine } from "@/lib/pricing";
import {
  ORDER_STATUSES,
  statusIndex,
  statusIndexForElapsed,
  type StatusId,
} from "@/lib/status";

const STORAGE_KEY = "tenga-orders";

/** Fired in this tab after an order is created or stepped forward. */
export const ORDERS_EVENT = "tenga-orders";

const RIDERS = [
  { name: "Chanda Banda", vehicle: "Honda Ace with a green box", plate: "BAK 2148" },
  { name: "Mwansa Phiri", vehicle: "Boxer 150 with an orange crate", plate: "BAD 8821" },
  { name: "Luyando Mulenga", vehicle: "Yamaha Crux with an insulated box", plate: "ABB 4402" },
  { name: "Temwani Zulu", vehicle: "Bajaj Boxer with a red cooler", plate: "ALX 1190" },
  { name: "Gift Tembo", vehicle: "TVS HLX with a black box", plate: "BAJ 6733" },
  { name: "Natasha Mbewe", vehicle: "Honda Ace with a cream box", plate: "ABB 9055" },
];

export class OrderError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type { PublicOrder };

type StoredOrder = Omit<PublicOrder, "etaMinutes">;

function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function riderFor(id: string) {
  let n = 0;
  for (const char of id) n = (n + char.charCodeAt(0)) % RIDERS.length;
  return RIDERS[n];
}

function etaFor(status: StatusId, storeCityMinutes: { min: number; max: number }) {
  switch (status) {
    case "placed":
      return storeCityMinutes.max;
    case "assigned":
      return Math.max(storeCityMinutes.min, storeCityMinutes.max - 6);
    case "picking":
      return Math.max(15, Math.round((storeCityMinutes.min + storeCityMinutes.max) / 2));
    case "picked_up":
      return Math.max(12, storeCityMinutes.min - 8);
    case "on_the_way":
      return 8;
    case "delivered":
      return 0;
  }
}

function isStatus(value: string): value is StatusId {
  return ORDER_STATUSES.some((status) => status.id === value);
}

function paymentLabel(method: PaymentMethodId, phone: string) {
  if (method === "card") return "Card · demo, not stored";
  if (method === "cash") return "Cash on delivery";
  return `${paymentMethod(method).label} (demo) · ${formatPhone(phone)}`;
}

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") return false;
  const order = value as Partial<StoredOrder>;
  return typeof order.id === "string" && typeof order.phone === "string" && Array.isArray(order.items);
}

function readAll(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredOrder);
  } catch {
    return [];
  }
}

function saveAll(orders: StoredOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function notify() {
  window.dispatchEvent(new Event(ORDERS_EVENT));
}

function toPublic(order: StoredOrder): PublicOrder {
  const status: StatusId = isStatus(order.status) ? order.status : "placed";
  const store = getStore(order.storeId);
  const minutes = store
    ? { min: store.deliveryMin, max: store.deliveryMax }
    : { min: 25, max: 45 };
  return {
    ...order,
    status,
    etaMinutes: etaFor(status, minutes),
  };
}

function applyTick(order: StoredOrder) {
  const elapsed = (Date.now() - order.placedAt) / 1000;
  const autoIndex = statusIndexForElapsed(elapsed);
  const current: StatusId = isStatus(order.status) ? order.status : "placed";
  const currentIndex = statusIndex(current);
  const nextIndex = Math.max(currentIndex < 0 ? 0 : currentIndex, autoIndex);
  if (nextIndex !== currentIndex) {
    order.status = ORDER_STATUSES[nextIndex].id;
    order.updatedAt = Date.now();
    return true;
  }
  return false;
}

function withTicks(orders: StoredOrder[]) {
  let changed = false;
  for (const order of orders) {
    if (applyTick(order)) changed = true;
  }
  if (changed) saveAll(orders);
  return orders;
}

export function getOrder(id: string) {
  const orders = readAll();
  const order = orders.find((entry) => entry.id === id);
  if (!order) return null;
  if (applyTick(order)) saveAll(orders);
  return toPublic(order);
}

export function listOrdersByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  if (!isZambianMobile(normalized)) {
    throw new OrderError("Enter a Zambian mobile number, like 0977 123 456.");
  }
  return withTicks(readAll())
    .filter((order) => order.phone === normalized)
    .sort((a, b) => b.placedAt - a.placedAt)
    .map(toPublic);
}

export function listAllOrders() {
  return withTicks(readAll())
    .sort((a, b) => b.placedAt - a.placedAt)
    .map(toPublic);
}

export function advanceOrder(id: string) {
  const orders = readAll();
  const order = orders.find((entry) => entry.id === id);
  if (!order) return null;
  applyTick(order);
  const index = statusIndex(isStatus(order.status) ? order.status : "placed");
  if (index >= 0 && index < ORDER_STATUSES.length - 1) {
    order.status = ORDER_STATUSES[index + 1].id;
    order.updatedAt = Date.now();
  }
  saveAll(orders);
  notify();
  return toPublic(order);
}

function hasCardNumber(text: string) {
  const chunks = text.match(/\d[\d\s-]{11,24}\d/g) ?? [];
  return chunks.some((chunk) => {
    const digits = chunk.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19;
  });
}

export function assertNoCardNumber(raw: string) {
  if (hasCardNumber(raw)) {
    throw new OrderError(
      "Card numbers are not accepted here. The demo card form keeps the number in your browser and never sends it.",
    );
  }
}

function randomId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createOrder(input: unknown) {
  if (typeof window === "undefined") {
    throw new OrderError("Orders are saved in this browser.", 500);
  }
  assertNoCardNumber(JSON.stringify(input ?? ""));
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new OrderError("Could not read that order.");
  }
  const body = input as Record<string, unknown>;
  const store = getStore(clean(body.storeId, 80));
  if (!store) throw new OrderError("Choose a store that is still in the sample list.");

  const customerName = clean(body.customerName, 80);
  if (customerName.length < 2) throw new OrderError("Enter the name the rider should ask for.");

  const phone = normalizePhone(clean(body.phone, 20));
  if (!isZambianMobile(phone)) {
    throw new OrderError("Enter a Zambian mobile number, like 0977 123 456.");
  }

  const city = clean(body.city, 40);
  if (city !== store.city) {
    throw new OrderError(`This store delivers in ${store.city} only.`);
  }
  const areas = deliveryAreas[city] ?? [];
  const area = clean(body.area, 40);
  if (!areas.includes(area)) throw new OrderError("Choose an area in the store's city.");

  const address = clean(body.address, 160);
  if (address.length < 4) throw new OrderError("Enter a plot, street or landmark.");
  const notes = clean(body.notes, 280);

  const methodRaw = clean(body.paymentMethod, 20);
  if (!isPaymentMethod(methodRaw)) throw new OrderError("Choose a payment method.");

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new OrderError("Your cart is empty.");
  }
  if (body.items.length > 40) throw new OrderError("That cart is larger than this demo allows.");

  const merged = new Map<string, { productId: string; variantId: string; qty: number }>();
  for (const entry of body.items) {
    if (!entry || typeof entry !== "object") throw new OrderError("One of the cart lines could not be read.");
    const line = entry as Record<string, unknown>;
    const productId = clean(line.productId, 80);
    const variantId = clean(line.variantId, 80);
    const qty = Number(line.qty);
    if (!productId || !variantId || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      throw new OrderError("Each item needs a quantity from 1 to 20.");
    }
    const key = `${productId}:${variantId}`;
    const previous = merged.get(key);
    merged.set(key, {
      productId,
      variantId,
      qty: Math.min(20, (previous?.qty ?? 0) + qty),
    });
  }

  const priced = priceLines(store, [...merged.values()]);
  if (priced.missing.length || priced.lines.length === 0) {
    throw new OrderError("One item is no longer in the sample catalogue. Refresh and try again.");
  }

  const id = randomId();
  const code = `TG-${id.slice(0, 4).toUpperCase()}`;
  const rider = riderFor(id);
  const now = Date.now();
  const items: PricedLine[] = priced.lines.map((line) => ({
    productId: line.productId,
    variantId: line.variantId,
    qty: line.qty,
    brand: line.brand,
    name: line.name,
    label: line.label,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
    image: line.image,
  }));

  const order: StoredOrder = {
    id,
    code,
    storeId: store.id,
    storeName: store.name,
    storeBranch: store.branch,
    storeCity: store.city,
    storeArea: store.area,
    customerName,
    phone,
    city,
    area,
    address,
    notes,
    paymentMethod: methodRaw,
    paymentLabel: paymentLabel(methodRaw, phone),
    items,
    subtotal: priced.subtotal,
    deliveryFee: priced.deliveryFee,
    serviceFee: priced.serviceFee,
    total: priced.total,
    status: "placed",
    riderName: rider.name,
    riderVehicle: rider.vehicle,
    riderPlate: rider.plate,
    placedAt: now,
    updatedAt: now,
  };

  const orders = readAll();
  orders.push(order);
  saveAll(orders);
  notify();
  return toPublic(order);
}
