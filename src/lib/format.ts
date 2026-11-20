export function formatK(amount: number) {
  return `K${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatWhen(ts: number) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}
