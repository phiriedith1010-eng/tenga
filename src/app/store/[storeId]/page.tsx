import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreScreen } from "@/components/store-screen";
import { getStore, storePlace, stores } from "@/data/catalog";

export function generateStaticParams() {
  return stores.map((store) => ({ storeId: store.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}): Promise<Metadata> {
  const { storeId } = await params;
  const store = getStore(storeId);
  if (!store) return { title: "Store" };
  return {
    title: `${store.name} ${store.branch}`,
    description: `Order groceries from ${store.name} in ${storePlace(store)}. Sample prices in Zambian kwacha.`,
  };
}

export default async function StorePage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  if (!getStore(storeId)) notFound();
  return <StoreScreen storeId={storeId} />;
}
