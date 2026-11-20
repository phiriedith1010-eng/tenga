"use client";

import { Trash } from "lucide-react";
import Image from "next/image";
import { variantImage } from "@/data/catalog";
import type { PricedLine } from "@/lib/pricing";
import { formatK } from "@/lib/format";
import { QtyStepper } from "@/components/qty-stepper";

export function CartLines({
  lines,
  onQty,
  onRemove,
}: {
  lines: PricedLine[];
  onQty: (line: PricedLine, qty: number) => void;
  onRemove: (line: PricedLine) => void;
}) {
  return (
    <ul className="divide-y rounded-2xl border bg-card">
      {lines.map((line) => (
        <li key={`${line.productId}:${line.variantId}`} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <Image
            src={line.image || variantImage(line.variantId)}
            alt=""
            width={96}
            height={96}
            className="size-16 shrink-0 rounded-xl object-cover sm:size-20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{line.brand}</p>
            <p className="font-medium">{line.name}</p>
            <p className="text-sm text-muted-foreground">
              {line.label} · {formatK(line.unitPrice)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <QtyStepper qty={line.qty} onChange={(qty) => onQty(line, qty)} />
            <p className="w-16 text-right font-semibold tabular-nums">{formatK(line.lineTotal)}</p>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Remove ${line.brand} ${line.name}`}
              onClick={() => onRemove(line)}
            >
              <Trash className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
