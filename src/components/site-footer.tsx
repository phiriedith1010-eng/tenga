import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t pb-8 md:pb-0">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          Store listings, branch details and prices are sample demo data. Tenga is not affiliated
          with ShopRite, Pick n Pay, Choppies, Spar, Food Lover&apos;s Market, Game, Melissa, Cheers,
          Toppy&apos;s, Young Heroes, or any product brand shown. The marks on store cards are plain
          initials, not logos.
        </p>
        <p>Payments are a sandbox. No wallet or card is charged, and card numbers are never stored.</p>
        <p>
          <Link href="/rider" className="font-medium text-foreground underline-offset-4 hover:underline">
            Rider desk
          </Link>
        </p>
      </div>
    </footer>
  );
}
