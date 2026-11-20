export const ORDER_STATUSES = [
  {
    id: "placed",
    label: "Order placed",
    detail: "The store has your list.",
  },
  {
    id: "assigned",
    label: "Rider assigned",
    detail: "A rider is heading to the store.",
  },
  {
    id: "picking",
    label: "Rider at store picking groceries",
    detail: "They are walking the aisles with your list.",
  },
  {
    id: "picked_up",
    label: "Picked up",
    detail: "The bag has left the store.",
  },
  {
    id: "on_the_way",
    label: "On the way",
    detail: "Heading to your doorstep.",
  },
  {
    id: "delivered",
    label: "Delivered",
    detail: "Handed over at your gate.",
  },
] as const;

export type StatusId = (typeof ORDER_STATUSES)[number]["id"];

/** Seconds after placement when the demo moves to each status. */
export const STATUS_AT_SECONDS = [0, 8, 16, 26, 36, 48] as const;

export const STATUS_PROGRESS = [0.08, 0.24, 0.4, 0.56, 0.78, 1] as const;

export function statusIndex(id: StatusId) {
  return ORDER_STATUSES.findIndex((status) => status.id === id);
}

export function statusMeta(id: StatusId) {
  return ORDER_STATUSES[statusIndex(id)] ?? ORDER_STATUSES[0];
}

export function statusIndexForElapsed(seconds: number) {
  let index = 0;
  for (let i = 0; i < STATUS_AT_SECONDS.length; i += 1) {
    if (seconds >= STATUS_AT_SECONDS[i]) index = i;
  }
  return index;
}
