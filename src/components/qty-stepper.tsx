"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  qty,
  onChange,
  min = 1,
}: {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border bg-card">
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full text-foreground disabled:opacity-40"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        disabled={qty <= min}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className="grid size-11 place-items-center rounded-full text-foreground disabled:opacity-40"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= 20}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
