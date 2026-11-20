export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizePhone(value: string) {
  let digits = digitsOnly(value);
  if (digits.startsWith("260") && digits.length === 12) {
    digits = `0${digits.slice(3)}`;
  }
  return digits;
}

/** Airtel 097/077, MTN 096/076, Zamtel 095/075. */
export function isZambianMobile(value: string) {
  return /^0(9[5-7]|7[5-7])\d{7}$/.test(normalizePhone(value));
}

export function formatPhone(value: string) {
  const digits = normalizePhone(value);
  if (digits.length !== 10) return value.trim();
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

export type MobileNetwork = "airtel" | "mtn" | "zamtel";

export function guessNetwork(value: string): MobileNetwork | null {
  const digits = normalizePhone(value);
  if (/^0(97|77)/.test(digits)) return "airtel";
  if (/^0(96|76)/.test(digits)) return "mtn";
  if (/^0(95|75)/.test(digits)) return "zamtel";
  return null;
}
