"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tenga-profile";
const EVENT = "tenga-profile";

export type Profile = { name: string; phone: string };

export function readProfile(): Profile {
  if (typeof window === "undefined") return { name: "", phone: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: "", phone: "" };
    const parsed = JSON.parse(raw) as { name?: unknown; phone?: unknown };
    return { name: String(parsed.name ?? ""), phone: String(parsed.phone ?? "") };
  } catch {
    return { name: "", phone: "" };
  }
}

export function writeProfile(profile: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(EVENT));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({ name: "", phone: "" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setProfile(readProfile());
    load();
    setReady(true);
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return { profile, ready, save: writeProfile };
}
