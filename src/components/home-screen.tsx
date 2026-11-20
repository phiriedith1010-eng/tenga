"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cityOrder, stores } from "@/data/catalog";
import { StoreCard } from "@/components/store-card";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

const steps = [
  {
    title: "Choose a store",
    body: "ShopRite in Kabulonga, Choppies in Chilenje, Spar in Roma, or a local store in Kitwe, Ndola or Livingstone.",
  },
  {
    title: "Fill the cart",
    body: "Tap a picture — mealie meal, water, salt, mayonnaise, noodles, soap. Pick a size if there is one, then add it. Sample prices are in kwacha.",
  },
  {
    title: "Pay the way you already pay",
    body: "Airtel Money, MTN MoMo and Zamtel Kwacha come first. Card and cash on delivery are there too. This demo never takes real money.",
  },
  {
    title: "A rider does the trip",
    body: "A delivery person picks up the groceries from the store you chose and brings them to your doorstep. You can follow the order until it is delivered.",
  },
];

export function HomeScreen() {
  const [city, setCity] = useState<string>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return stores.filter((store) => {
      if (city !== "All" && store.city !== city) return false;
      if (!words.length) return true;
      const hay = `${store.name} ${store.branch} ${store.area} ${store.city}`.toLowerCase();
      return words.every((word) => hay.includes(word));
    });
  }, [city, query]);

  const groups = cityOrder
    .map((name) => ({ city: name, stores: visible.filter((store) => store.city === name) }))
    .filter((group) => group.stores.length > 0);

  return (
    <div>
      <section className="hero-pattern text-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
            Grocery delivery · Zambia
          </p>
          <h1 className="mt-2 max-w-xl font-heading text-[2.35rem] leading-[1.05] text-white sm:text-5xl">
            Groceries at your gate.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            A delivery person picks up the groceries from the store you choose and brings them to
            your doorstep. Prices in kwacha. Mobile money first.
          </p>
          <a
            href="#stores"
            className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[#0e6b3c]"
          >
            See stores
          </a>
          <p className="mt-4 text-sm text-white/80">Lusaka · Kitwe · Ndola · Livingstone</p>
        </div>
      </section>

      <section id="stores" className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-3xl">Choose a store</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {stores.length} sample branches. Delivery time and fee are on each card.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-sm sm:flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ShopRite, Matero, Cheers…"
              className="h-11 pl-9 text-base"
              aria-label="Search stores"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="City">
            {["All", ...cityOrder].map((name) => {
              const selected = city === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCity(name)}
                  className={cn(
                    "h-10 shrink-0 rounded-full px-4 text-sm font-medium",
                    selected ? "bg-primary text-primary-foreground" : "border bg-card",
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card px-4 py-10 text-center">
            <p className="font-heading text-2xl">No stores match that</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try Lusaka, Kitwe, Ndola or Livingstone, or clear the search.
            </p>
            <button
              type="button"
              className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
              onClick={() => {
                setQuery("");
                setCity("All");
              }}
            >
              Show every store
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {groups.map((group) => (
              <div key={group.city}>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {group.city}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.stores.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="how-delivery-works" className="mx-auto max-w-5xl px-4 pb-4">
        <h2 className="font-heading text-3xl">How delivery works</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A delivery person picks up the groceries from the store you chose and brings them to your
          doorstep. You do not go to the shop. The rider does.
        </p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border bg-card p-4">
              <span className="grid size-8 place-items-center rounded-full bg-[#c4622d] text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-heading text-xl leading-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
