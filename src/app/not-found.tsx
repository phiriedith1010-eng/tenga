import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-heading text-3xl">That page is not on the route</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The store may have been a sample link that does not match this catalogue.
      </p>
      <Button asChild className="mt-6 h-11 px-5">
        <Link href="/">Back to stores</Link>
      </Button>
    </div>
  );
}
