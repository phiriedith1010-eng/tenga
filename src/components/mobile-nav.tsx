"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ReceiptText, ShoppingBasket } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { cn } from "cn";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/cart", label: "Cart", icon: ShoppingBasket },
  { href: "/orders", label: "Orders", icon: ReceiptText },
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-3 pb-[env(safe-area-inset-bottom)]">
        {links.map((link) => {
          const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
          const active = link.href === "/" ? path === "/" : path.startsWith(link.href);
          const Icon = link.icon;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {link.href === "/cart" && count > 0 ? (
                    <span className="absolute -top-1.5 -right-2 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                      {count}
                    </span>
                  ) : null}
                </span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
