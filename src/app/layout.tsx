import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tenga — groceries to your gate",
    template: "%s · Tenga",
  },
  description:
    "Grocery delivery in Zambia. A rider picks up from the store you choose and brings the shopping to your door. Sample prices in Zambian kwacha.",
};

export const viewport: Viewport = {
  themeColor: "#0e6b3c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="min-h-[70vh] pb-28 md:pb-8">
            {children}
          </main>
          <SiteFooter />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
