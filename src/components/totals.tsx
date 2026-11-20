import { Separator } from "@/components/ui/separator";
import { formatK } from "@/lib/format";

export function Totals({
  subtotal,
  deliveryFee,
  serviceFee,
  total,
}: {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd>{formatK(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>Delivery fee</dt>
        <dd>{formatK(deliveryFee)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>Service fee</dt>
        <dd>{formatK(serviceFee)}</dd>
      </div>
      <Separator />
      <div className="flex items-baseline justify-between gap-4 text-base font-semibold">
        <dt>Total</dt>
        <dd className="font-heading text-2xl">{formatK(total)}</dd>
      </div>
      <p className="text-xs text-muted-foreground">Service fee is a flat K10 on every demo order.</p>
    </dl>
  );
}
