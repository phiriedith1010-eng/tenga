/**
 * Draws an original illustration for every catalogue variant and writes WebP
 * files to public/products. These are not photographs and not brand packs.
 *
 *   npx tsx scripts/render-products.ts
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { products, type Product, type Variant } from "../src/data/catalog";

type Look = {
  kind:
    | "sack"
    | "bottle"
    | "jar"
    | "bar"
    | "cup"
    | "loaf"
    | "rolls"
    | "eggs"
    | "produce"
    | "leaf"
    | "fish"
    | "tray"
    | "tub"
    | "tin"
    | "clear"
    | "six"
    | "tissue"
    | "candles"
    | "matches"
    | "liners";
  fill: string;
  accent: string;
  word: string;
  detail?: string;
};

const looks: Record<string, Look> = {
  "breakfast-meal": { kind: "sack", fill: "#f0d078", accent: "#c4551a", word: "MEAL" },
  "pembe-meal": { kind: "sack", fill: "#f6e7a0", accent: "#1f6b45", word: "MEAL" },
  "roller-meal": { kind: "sack", fill: "#e4d2a4", accent: "#6a4a2c", word: "ROLLER" },
  zamanita: { kind: "bottle", fill: "#f0c14a", accent: "#8a5a12", word: "OIL" },
  zamgold: { kind: "bottle", fill: "#e8b23a", accent: "#1f4e3a", word: "OIL" },
  dlite: { kind: "bottle", fill: "#f6d56a", accent: "#c47a2a", word: "OIL" },
  whitespoon: { kind: "sack", fill: "#f7f4ee", accent: "#d7c4a4", word: "SUGAR" },
  "mansa-sugar": { kind: "sack", fill: "#f3efe4", accent: "#8a6a3a", word: "SUGAR" },
  "nakonde-rice": { kind: "sack", fill: "#f3e6c4", accent: "#c4922a", word: "RICE" },
  "jasmine-rice": { kind: "sack", fill: "#f7f1e4", accent: "#6a8a4a", word: "RICE" },
  "white-bread": { kind: "loaf", fill: "#f3d7a4", accent: "#e7c48a", word: "BREAD" },
  "brown-bread": { kind: "loaf", fill: "#c48a52", accent: "#8a5a32", word: "BROWN" },
  rolls: { kind: "rolls", fill: "#f0d2a0", accent: "#e8c088", word: "ROLLS" },
  salt: { kind: "sack", fill: "#f7f7f4", accent: "#b9c4ce", word: "SALT", detail: "fine" },
  "sea-salt": { kind: "sack", fill: "#e7eef2", accent: "#7aa0b4", word: "SEA", detail: "flakes" },
  "ocean-salt": { kind: "jar", fill: "#d5e6f2", accent: "#2f6f92", word: "OCEAN", detail: "coarse" },
  flour: { kind: "sack", fill: "#f4efe6", accent: "#d2c2a4", word: "FLOUR" },
  beans: { kind: "sack", fill: "#efe2c8", accent: "#8a5a32", word: "BEANS" },
  peanut: { kind: "jar", fill: "#e8b15a", accent: "#8a4e16", word: "NUTS" },
  "tomato-paste": { kind: "tin", fill: "#d64532", accent: "#f2e4c8", word: "PASTE" },
  "kapenta-dried": { kind: "fish", fill: "#c4a06a", accent: "#8a6230", word: "DRIED" },
  "kapenta-fresh": { kind: "fish", fill: "#d8c4a0", accent: "#6a8aa0", word: "FRESH" },
  chicken: { kind: "tray", fill: "#f2c8b0", accent: "#e8e4dc", word: "CHICKEN" },
  tomatoes: { kind: "produce", fill: "#d64532", accent: "#3d8a32", word: "TOMATO" },
  onions: { kind: "produce", fill: "#c48ad4", accent: "#f2e6c0", word: "ONION" },
  cabbage: { kind: "produce", fill: "#7dae4a", accent: "#e8f0d4", word: "CABBAGE" },
  potatoes: { kind: "produce", fill: "#c4a06a", accent: "#8a6238", word: "POTATO" },
  rape: { kind: "leaf", fill: "#3d8a32", accent: "#1f5c24", word: "RAPE" },
  eggs: { kind: "eggs", fill: "#f6f1e4", accent: "#e6d3a4", word: "EGGS" },
  "fresh-milk": { kind: "bottle", fill: "#f7f4ee", accent: "#c8d4ea", word: "MILK" },
  "uht-milk": { kind: "clear", fill: "#f4f7fb", accent: "#3a6ea8", word: "MILK" },
  mabisi: { kind: "tub", fill: "#f3efe4", accent: "#e6d8b0", word: "MABISI" },
  stork: { kind: "tub", fill: "#f6e27a", accent: "#e23b2f", word: "SPREAD" },
  "nola-mayo": { kind: "jar", fill: "#f6f1dc", accent: "#c4551a", word: "MAYO" },
  "bwell-mayo": { kind: "jar", fill: "#f7f3e4", accent: "#1f6b45", word: "MAYO" },
  "cb-mayo": { kind: "jar", fill: "#f4efe0", accent: "#1e3a5c", word: "MAYO" },
  "goldcrest-mayo": { kind: "jar", fill: "#f8f2d8", accent: "#c4a03a", word: "MAYO" },
  "allsome-mayo": { kind: "jar", fill: "#f6f0e2", accent: "#e07a2a", word: "MAYO" },
  "indomie-chicken": { kind: "cup", fill: "#f0a04a", accent: "#c4551a", word: "CHICKEN" },
  "indomie-veg": { kind: "cup", fill: "#8fbf5a", accent: "#2f6b32", word: "VEG" },
  "indomie-onion": { kind: "cup", fill: "#e8c06a", accent: "#a86a22", word: "ONION" },
  "maggi-chicken": { kind: "cup", fill: "#f2d24a", accent: "#c49212", word: "CHICKEN" },
  "maggi-masala": { kind: "cup", fill: "#e07038", accent: "#8a3018", word: "MASALA" },
  yumyum: { kind: "cup", fill: "#e07a9a", accent: "#a83a58", word: "TOM YUM" },
  "everyday-noodles": { kind: "cup", fill: "#7aa0d4", accent: "#2a4a78", word: "BEEF" },
  boom: { kind: "sack", fill: "#7ec8ea", accent: "#1a6a9a", word: "WASH" },
  "sunlight-powder": { kind: "sack", fill: "#f2e27a", accent: "#e0a020", word: "WASH" },
  omo: { kind: "sack", fill: "#9fd4f2", accent: "#1a5a9a", word: "WASH" },
  "sunlight-bar": { kind: "bar", fill: "#f2e27a", accent: "#e08a14", word: "BAR" },
  "green-bar": { kind: "bar", fill: "#7dae4a", accent: "#2f6b28", word: "BAR" },
  "strike-bar": { kind: "bar", fill: "#f0c14a", accent: "#c4551a", word: "BAR" },
  geisha: { kind: "bar", fill: "#f3c1d4", accent: "#d07098", word: "SOAP" },
  "dettol-bar": { kind: "bar", fill: "#e8f2ea", accent: "#1f6b45", word: "SOAP" },
  lifebuoy: { kind: "bar", fill: "#e23b2f", accent: "#f2d2a0", word: "SOAP" },
  "lux-bar": { kind: "bar", fill: "#f3b6d0", accent: "#c45a88", word: "SOAP" },
  imperial: { kind: "bar", fill: "#f3e2b8", accent: "#c4a04a", word: "SOAP" },
  "dove-bar": { kind: "bar", fill: "#f7f4ee", accent: "#d8d0ea", word: "SOAP" },
  "dettol-shower": { kind: "bottle", fill: "#d7eadc", accent: "#1f6b45", word: "GEL" },
  "lux-shower": { kind: "bottle", fill: "#f8d0e0", accent: "#c45a88", word: "WASH" },
  "dove-shower": { kind: "bottle", fill: "#f6efe6", accent: "#c8b8d8", word: "GEL" },
  "eva-shower": { kind: "bottle", fill: "#f6e2b0", accent: "#e08a2a", word: "GEL" },
  maheu: { kind: "clear", fill: "#f3e6c0", accent: "#c4922a", word: "MAHEU" },
  cola: { kind: "bottle", fill: "#6a2a22", accent: "#e8e4dc", word: "COLA" },
  sprite: { kind: "bottle", fill: "#d8f2c4", accent: "#3d8a32", word: "SODA" },
  mazoe: { kind: "bottle", fill: "#f08a2a", accent: "#c4551a", word: "JUICE" },
  water: { kind: "clear", fill: "#d7eef8", accent: "#3a8ec4", word: "WATER" },
  tissue: { kind: "tissue", fill: "#f7f4ee", accent: "#d8cfc2", word: "TISSUE" },
  dishwash: { kind: "bottle", fill: "#b7e0a0", accent: "#2f6b32", word: "DISH" },
  scouring: { kind: "tin", fill: "#e8e4dc", accent: "#8a8478", word: "SCOUR" },
  candles: { kind: "candles", fill: "#f6f1e4", accent: "#e8d8b0", word: "LIGHT" },
  matches: { kind: "matches", fill: "#f2e2a0", accent: "#c4551a", word: "MATCH" },
  "bin-liners": { kind: "liners", fill: "#d8e4c8", accent: "#3d6b3a", word: "BAGS" },
};

const scentFill: Record<string, string> = {
  Cool: "#7ec8ea",
  Original: "#e7f0dc",
  Floral: "#f0b6d0",
  Lemon: "#f2d24a",
  "Soft Touch": "#f6c6d8",
  "Magical Orchid": "#c9a6e0",
  "Aqua Sparkle": "#7ed4d8",
  "Deeply Nourishing": "#f3dcc8",
  "Cucumber & Green Tea": "#9dcc78",
  "Pink Rosa": "#f0a0bc",
  Vanilla: "#f6e7c0",
  "Aloe Vera": "#9dcc8a",
  "Citrus Burst": "#f0b429",
  Skincare: "#f3d0b8",
  Banana: "#f0d24a",
  Chocolate: "#8a5a32",
  Cream: "#f7f1e6",
  Pink: "#f3b8cc",
  Classic: "#f0ddb0",
  "Gentle Care": "#f6e4d4",
  Total: "#e23b2f",
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function scaleFor(size: string) {
  const text = size.toLowerCase();
  if (/6\s*×|5\s*×|pack of|5-pack/.test(text)) return 1;
  const ml = text.match(/([\d.]+)\s*ml/);
  const litres = text.match(/([\d.]+)\s*l\b/);
  const kg = text.match(/([\d.]+)\s*kg/);
  const grams = text.match(/([\d.]+)\s*g\b/);
  let t = 0.7;
  if (ml) t = Number(ml[1]) / 500;
  else if (litres) t = Number(litres[1]) / 2;
  else if (kg) t = Number(kg[1]) / 12;
  else if (grams) t = Number(grams[1]) / 600;
  else if (/tray/.test(text)) t = 1.15;
  else if (/half/.test(text)) t = 0.55;
  return Math.min(1.28, Math.max(0.62, 0.58 + t * 0.48));
}

function sack(fill: string, accent: string, word: string) {
  return `
    <path d="M-90,-40 C-90,-110 -50,-150 0,-150 C50,-150 90,-110 90,-40 L78,150 C78,176 48,190 0,190 C-48,190 -78,176 -78,150 Z" fill="${fill}" stroke="#1c2418" stroke-opacity="0.18" stroke-width="3"/>
    <path d="M-70,-118 C-30,-90 30,-90 70,-118 L54,-78 C24,-58 -24,-58 -54,-78 Z" fill="${accent}"/>
    <rect x="-58" y="-10" width="116" height="78" rx="10" fill="#fffdf8" fill-opacity="0.92"/>
    <text x="0" y="38" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="26" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function bottle(fill: string, accent: string, word: string) {
  return `
    <rect x="-18" y="-188" width="36" height="28" rx="6" fill="${accent}"/>
    <path d="M-22,-162 h44 l16,36 c22,10 36,36 36,70 v150 c0,26 -20,44 -46,44 h-56 c-26,0 -46,-18 -46,-44 v-150 c0,-34 14,-60 36,-70 z" fill="#f7f4ee" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>
    <path d="M-48,-40 h96 v164 c0,18 -14,30 -32,30 h-32 c-18,0 -32,-12 -32,-30 z" fill="${fill}"/>
    <rect x="-40" y="8" width="80" height="64" rx="8" fill="#fffdf8"/>
    <text x="0" y="48" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="20" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function jar(fill: string, accent: string, word: string) {
  return `
    <rect x="-78" y="-150" width="156" height="28" rx="8" fill="${accent}"/>
    <rect x="-70" y="-126" width="140" height="250" rx="28" fill="${fill}" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>
    <rect x="-48" y="-20" width="96" height="70" rx="8" fill="#fffdf8"/>
    <text x="0" y="22" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function bar(fill: string, accent: string, word: string) {
  return `
    <rect x="-120" y="-70" width="240" height="150" rx="36" fill="${fill}" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>
    <ellipse cx="0" cy="0" rx="46" ry="32" fill="${accent}" fill-opacity="0.85"/>
    <text x="0" y="8" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function cup(fill: string, accent: string, word: string, count: number) {
  const one = (x: number, y: number, s: number) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-46,-70 h92 l-12,150 h-68 z" fill="${fill}" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>
      <ellipse cx="0" cy="-70" rx="46" ry="14" fill="${accent}"/>
      <rect x="-34" y="-10" width="68" height="40" rx="6" fill="#fffdf8"/>
      <text x="0" y="16" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="14" font-weight="700" fill="#1c2418">${esc(word)}</text>
    </g>`;
  if (count <= 1) return one(0, 10, 1.35);
  const cols = Math.min(count, 3);
  const rows = Math.ceil(Math.min(count, 6) / cols);
  let out = "";
  let n = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols && n < Math.min(count, 6); c += 1) {
      out += one(-70 + c * 70, -20 + r * 36, 0.72);
      n += 1;
    }
  }
  return out;
}

function loaf(fill: string) {
  return `
    <path d="M-130,40 C-130,-80 -60,-120 0,-120 C70,-120 140,-70 140,40 C140,90 90,110 0,110 C-90,110 -130,90 -130,40 Z" fill="${fill}" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>
    <path d="M-90,-20 C-40,-70 40,-70 90,-20" fill="none" stroke="#1c2418" stroke-opacity="0.25" stroke-width="4"/>
    <path d="M-40,-10 C-10,-40 20,-40 50,-8" fill="none" stroke="#1c2418" stroke-opacity="0.2" stroke-width="4"/>
  `;
}

function rolls(fill: string) {
  return [-70, 0, 70]
    .map(
      (x) =>
        `<circle cx="${x}" cy="10" r="52" fill="${fill}" stroke="#1c2418" stroke-opacity="0.16" stroke-width="3"/>`,
    )
    .join("");
}

function eggs(fill: string, many: boolean) {
  const spots = many
    ? [
        [-80, -20],
        [0, -36],
        [80, -20],
        [-40, 40],
        [40, 48],
      ]
    : [
        [-36, 0],
        [36, 8],
      ];
  return `
    <rect x="-130" y="-70" width="260" height="180" rx="18" fill="#f3efe6" stroke="#1c2418" stroke-opacity="0.12" stroke-width="3"/>
    ${spots
      .map(
        ([x, y]) =>
          `<ellipse cx="${x}" cy="${y}" rx="34" ry="44" fill="${fill}" stroke="#e0d3b4" stroke-width="3"/>`,
      )
      .join("")}
  `;
}

function produce(fill: string, accent: string) {
  return `
    <circle cx="-40" cy="10" r="78" fill="${fill}"/>
    <circle cx="48" cy="24" r="64" fill="${fill}" fill-opacity="0.92"/>
    <path d="M-10,-70 C10,-110 40,-90 24,-60" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
  `;
}

function leaf(fill: string) {
  return `
    <path d="M0,120 C-90,40 -110,-40 -20,-130 C80,-40 70,40 0,120 Z" fill="${fill}"/>
    <path d="M0,100 C-10,20 0,-40 -8,-110" fill="none" stroke="#e8f2d8" stroke-width="4"/>
  `;
}

function fish(fill: string) {
  return `
    <ellipse cx="-10" cy="10" rx="110" ry="48" fill="${fill}"/>
    <path d="M90,-10 L150,10 L90,40 Z" fill="${fill}"/>
    <circle cx="-70" cy="0" r="6" fill="#1c2418"/>
  `;
}

function tray(fill: string) {
  return `
    <rect x="-140" y="-40" width="280" height="160" rx="16" fill="#f7f4ee" stroke="#d9d0c2" stroke-width="3"/>
    <ellipse cx="-40" cy="30" rx="50" ry="32" fill="${fill}"/>
    <ellipse cx="40" cy="36" rx="46" ry="28" fill="${fill}" fill-opacity="0.9"/>
    <path d="M-140,-40 H140 V10 H-140 Z" fill="#f2f6fb" fill-opacity="0.55"/>
  `;
}

function tub(fill: string, accent: string, word: string) {
  return `
    <ellipse cx="0" cy="-90" rx="90" ry="24" fill="${accent}"/>
    <path d="M-90,-90 H90 L76,120 H-76 Z" fill="${fill}" stroke="#1c2418" stroke-opacity="0.14" stroke-width="3"/>
    <ellipse cx="0" cy="120" rx="76" ry="20" fill="${fill}"/>
    <text x="0" y="20" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function tin(fill: string, word: string) {
  return `
    <ellipse cx="0" cy="-100" rx="70" ry="22" fill="${fill}"/>
    <path d="M-70,-100 H70 V90 H-70 Z" fill="${fill}"/>
    <ellipse cx="0" cy="90" rx="70" ry="22" fill="${fill}" stroke="#1c2418" stroke-opacity="0.15"/>
    <rect x="-46" y="-30" width="92" height="50" rx="6" fill="#fffdf8"/>
    <text x="0" y="2" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="16" font-weight="700" fill="#1c2418">${esc(word)}</text>
  `;
}

function clearBottle(fill: string, accent: string, word: string) {
  return `
    <rect x="-16" y="-180" width="32" height="22" rx="5" fill="${accent}"/>
    <path d="M-24,-160 h48 l10,28 c18,8 28,28 28,52 v140 c0,22 -16,36 -38,36 h-48 c-22,0 -38,-14 -38,-36 v-140 c0,-24 10,-44 28,-52 z" fill="#f4fbff" fill-opacity="0.55" stroke="${accent}" stroke-width="4"/>
    <path d="M-40,-20 h80 v120 c0,16 -12,26 -28,26 h-24 c-16,0 -28,-10 -28,-26 z" fill="${fill}" fill-opacity="0.85"/>
    <text x="0" y="40" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="700" fill="#1c3a4a">${esc(word)}</text>
  `;
}

function sixPack(fill: string, accent: string) {
  return [-90, 0, 90, -45, 45]
    .map((x, i) => {
      const y = i < 3 ? -20 : 70;
      return `<g transform="translate(${x} ${y}) scale(0.42)">${clearBottle(fill, accent, "")}</g>`;
    })
    .join("");
}

function tissue() {
  return `
    <rect x="-120" y="-50" width="240" height="140" rx="16" fill="#f7f4ee" stroke="#e0d8cc" stroke-width="3"/>
    ${[-70, 0, 70].map((x) => `<ellipse cx="${x}" cy="20" rx="28" ry="40" fill="#fff" stroke="#e6dfd4"/>`).join("")}
  `;
}

function candles(fill: string) {
  return [-60, 0, 60]
    .map(
      (x, i) => `
      <rect x="${x - 16}" y="${-20 + i * 8}" width="32" height="${120 - i * 8}" rx="6" fill="${fill}" stroke="#e6dcc4"/>
      <path d="M${x} ${-28 + i * 8} c8,-16 8,-16 0,-28 c-8,12 -8,12 0,28" fill="#f0b429"/>
    `,
    )
    .join("");
}

function matches(fill: string, accent: string) {
  return `
    <rect x="-70" y="-90" width="140" height="200" rx="8" fill="${fill}" stroke="#1c2418" stroke-opacity="0.15" stroke-width="3"/>
    <rect x="-70" y="-90" width="140" height="36" fill="${accent}"/>
    <text x="0" y="20" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="700" fill="#1c2418">MATCH</text>
  `;
}

function liners(fill: string) {
  return `
    <ellipse cx="0" cy="0" rx="70" ry="70" fill="${fill}"/>
    <ellipse cx="0" cy="0" rx="28" ry="28" fill="#f7f4ee"/>
    <rect x="60" y="-16" width="70" height="32" rx="6" fill="${fill}"/>
  `;
}

function bodyFor(look: Look, variant: Variant) {
  const fill = (variant.option && scentFill[variant.option]) || look.fill;
  const multi = /×|pack of|5-pack/i.test(variant.size);
  const count = multi ? Number(variant.size.match(/\d+/)?.[0] ?? 5) : 1;
  switch (look.kind) {
    case "sack":
      return sack(fill, look.accent, look.word);
    case "bottle":
      return bottle(fill, look.accent, look.word);
    case "jar":
      return jar(fill, look.accent, look.word);
    case "bar":
      return bar(fill, look.accent, look.word);
    case "cup":
      return cup(fill, look.accent, look.word, count);
    case "loaf":
      return loaf(fill);
    case "rolls":
      return rolls(fill);
    case "eggs":
      return eggs(fill, /30|tray/i.test(variant.size));
    case "produce":
      return produce(fill, look.accent);
    case "leaf":
      return leaf(fill);
    case "fish":
      return fish(fill);
    case "tray":
      return tray(fill);
    case "tub":
      return tub(fill, look.accent, look.word);
    case "tin":
      return tin(fill, look.word);
    case "clear":
      return /6\s*×/.test(variant.size) ? sixPack(fill, look.accent) : clearBottle(fill, look.accent, look.word);
    case "six":
      return sixPack(fill, look.accent);
    case "tissue":
      return tissue();
    case "candles":
      return candles(fill);
    case "matches":
      return matches(fill, look.accent);
    case "liners":
      return liners(fill);
    default:
      return sack(fill, look.accent, look.word);
  }
}

function svgFor(product: Product, variant: Variant) {
  const look = looks[product.id];
  if (!look) throw new Error(`No picture look for ${product.id}`);
  const scale = scaleFor(variant.size);
  const caption = variant.option ? `${variant.option} · ${variant.size}` : variant.size;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbf7f0"/>
      <stop offset="100%" stop-color="#e6dfd2"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <ellipse cx="320" cy="520" rx="150" ry="18" fill="#1c2418" opacity="0.08"/>
  <g transform="translate(320 300) scale(${scale.toFixed(3)})">
    ${bodyFor(look, variant)}
  </g>
  <text x="320" y="600" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="28" font-weight="700" fill="#3c4636">${esc(caption)}</text>
</svg>`;
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "products");
  fs.mkdirSync(outDir, { recursive: true });

  let count = 0;
  for (const product of products) {
    for (const variant of product.variants) {
      const file = path.join(outDir, `${variant.id}.webp`);
      const svg = svgFor(product, variant);
      await sharp(Buffer.from(svg)).webp({ quality: 78 }).toFile(file);
      count += 1;
    }
  }

  const missing = Object.keys(looks).filter((id) => !products.some((product) => product.id === id));
  if (missing.length) throw new Error(`Unused looks: ${missing.join(", ")}`);
  console.log(`Wrote ${count} product pictures to public/products`);
}

main();
