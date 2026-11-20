import Link from "next/link";
import { Clock3 } from "lucide-react";
import { storePlace, type Store } from "@/data/catalog";
import { formatK } from "@/lib/format";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "cn";

export function Monogram({
  initials,
  tint,
  className,
}: {
  initials: string;
  tint: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-semibold tracking-wide text-white",
        className,
      )}
      style={{ backgroundColor: tint }}
    >
      {initials}
    </span>
  );
}

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-shadow hover:shadow-md">
        <div className="flex items-start gap-3 px-(--card-spacing)">
          <Monogram initials={store.initials} tint={store.tint} />
          <div className="min-w-0">
            <h3 className="font-heading text-lg leading-tight">{store.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{storePlace(store)}</p>
          </div>
        </div>
        <p className="px-(--card-spacing) text-sm leading-relaxed text-muted-foreground">{store.note}</p>
        <CardFooter className="mt-auto justify-between gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock3 className="size-4 text-primary" />
            {store.deliveryMin}–{store.deliveryMax} min
          </span>
          <span className="font-medium">Delivery {formatK(store.deliveryFee)}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
