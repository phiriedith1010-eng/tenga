export const PAYMENT_METHODS = [
  {
    id: "airtel",
    label: "Airtel Money",
    detail: "A phone prompt, then a PIN. Sandbox only.",
    group: "momo",
  },
  {
    id: "mtn",
    label: "MTN MoMo",
    detail: "A phone prompt, then a PIN. Sandbox only.",
    group: "momo",
  },
  {
    id: "zamtel",
    label: "Zamtel Kwacha",
    detail: "A phone prompt, then a PIN. Sandbox only.",
    group: "momo",
  },
  {
    id: "card",
    label: "Card",
    detail: "Test numbers only. The card is never stored.",
    group: "other",
  },
  {
    id: "cash",
    label: "Cash on delivery",
    detail: "Pay the rider in cash at your gate.",
    group: "other",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function isPaymentMethod(value: string): value is PaymentMethodId {
  return PAYMENT_METHODS.some((method) => method.id === value);
}

export function paymentMethod(id: PaymentMethodId) {
  return PAYMENT_METHODS.find((method) => method.id === id)!;
}

export const TEST_CARD = "4242424242424242";
export const DECLINE_CARD = "4000000000000002";

export function validateCard(input: { number: string; expiry: string; cvc: string; name: string }) {
  const number = input.number.replace(/\D/g, "");
  if (number === DECLINE_CARD) {
    return "That demo card is declined. Use 4242 4242 4242 4242.";
  }
  if (number !== TEST_CARD) {
    return "Use the demo card 4242 4242 4242 4242. Real cards are not accepted.";
  }
  const match = input.expiry.trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);
  if (!match) return "Enter the expiry as MM/YY. Any future date works.";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const expires = new Date(year, month, 1);
  if (expires.getTime() <= Date.now()) return "That expiry is in the past.";
  if (!/^\d{3}$/.test(input.cvc.trim())) return "Enter any 3-digit CVC. It is not sent anywhere.";
  if (input.name.trim().length < 2) return "Enter the name on the card.";
  return null;
}

export function validatePin(pin: string) {
  if (!/^\d{4}$/.test(pin)) return "Enter the 4-digit demo PIN.";
  if (pin === "0000") return "That PIN was declined. Use any other 4 digits.";
  return null;
}
