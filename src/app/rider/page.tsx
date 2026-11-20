import type { Metadata } from "next";
import { RiderScreen } from "@/components/rider-screen";

export const metadata: Metadata = { title: "Rider desk" };

export default function RiderPage() {
  return <RiderScreen />;
}
