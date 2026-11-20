/**
 * Tenga sample catalogue — the one file to edit.
 *
 * Change a store, a price, or a product here. Prices are whole Zambian kwacha
 * (K) before the store's `priceAdjust` percent is applied. Negative means
 * cheaper than this list. Every store stocks this same shelf; delivery time,
 * delivery fee and priceAdjust differ.
 *
 * Demo data only. Not a live price list, and not affiliated with the
 * retailers or brands named below. Initials on store cards are not logos.
 */

export const SERVICE_FEE = 10;

export const categories = [
  { id: "staples", label: "Staples" },
  { id: "fresh", label: "Fresh & protein" },
  { id: "dairy", label: "Dairy & eggs" },
  { id: "mayo", label: "Mayonnaise" },
  { id: "noodles", label: "Noodles" },
  { id: "laundry", label: "Laundry" },
  { id: "bathing", label: "Bathing soap" },
  { id: "shower", label: "Shower gel" },
  { id: "drinks", label: "Drinks" },
  { id: "home", label: "Household" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type Variant = {
  id: string;
  size: string;
  price: number;
  option?: string;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  category: CategoryId;
  blurb: string;
  keywords: string;
  /** Chip label when variants have an option, e.g. Scent or Flavour. */
  chooserLabel?: string;
  variants: Variant[];
};

export type Store = {
  id: string;
  name: string;
  branch: string;
  city: string;
  area: string;
  initials: string;
  /** Plain colour behind the initials. Not a brand colour. */
  tint: string;
  deliveryMin: number;
  deliveryMax: number;
  deliveryFee: number;
  /** Percent added to every base price. Can be negative. */
  priceAdjust: number;
  hours: string;
  note: string;
};

export const cityOrder = ["Lusaka", "Kitwe", "Ndola", "Livingstone"] as const;

export const deliveryAreas: Record<string, string[]> = {
  Lusaka: [
    "Kabulonga",
    "Woodlands",
    "Chilenje",
    "Matero",
    "Roma",
    "Ibex Hill",
    "Northmead",
    "Arcades",
    "Kabwata",
    "Libala",
    "Chelstone",
    "Chalala",
    "Olympia",
    "Avondale",
    "Longacres",
    "Meanwood",
  ],
  Kitwe: ["Parklands", "Riverside", "Nkana East", "Buchi", "Chimwemwe", "Ndeke"],
  Ndola: ["Kansenshi", "Northrise", "Itawa", "Masala", "Hillcrest"],
  Livingstone: ["Town Centre", "Dambwa", "Highlands", "Maramba"],
};

export const stores: Store[] = [
  {
    id: "shoprite-kabulonga",
    name: "ShopRite",
    branch: "Kabulonga",
    city: "Lusaka",
    area: "Kabulonga",
    initials: "SR",
    tint: "#1f6b45",
    deliveryMin: 25,
    deliveryMax: 40,
    deliveryFee: 25,
    priceAdjust: -3,
    hours: "08:00–21:00",
    note: "Large supermarket. Sample shelf and sample prices.",
  },
  {
    id: "shoprite-kitwe",
    name: "ShopRite",
    branch: "Freedom Avenue",
    city: "Kitwe",
    area: "Parklands",
    initials: "SR",
    tint: "#1f6b45",
    deliveryMin: 30,
    deliveryMax: 50,
    deliveryFee: 30,
    priceAdjust: 3,
    hours: "08:00–20:00",
    note: "Kitwe branch of the same sample shelf.",
  },
  {
    id: "pnp-woodlands",
    name: "Pick n Pay",
    branch: "Woodlands",
    city: "Lusaka",
    area: "Woodlands",
    initials: "PP",
    tint: "#1e4d45",
    deliveryMin: 30,
    deliveryMax: 45,
    deliveryFee: 28,
    priceAdjust: 0,
    hours: "08:00–20:00",
    note: "Supermarket branch for a weekly shop.",
  },
  {
    id: "pnp-ndola",
    name: "Pick n Pay",
    branch: "Kansenshi",
    city: "Ndola",
    area: "Kansenshi",
    initials: "PP",
    tint: "#1e4d45",
    deliveryMin: 30,
    deliveryMax: 50,
    deliveryFee: 32,
    priceAdjust: 4,
    hours: "08:00–20:00",
    note: "Ndola branch. Sample prices run a little higher.",
  },
  {
    id: "choppies-chilenje",
    name: "Choppies",
    branch: "Chilenje",
    city: "Lusaka",
    area: "Chilenje",
    initials: "CH",
    tint: "#8a4324",
    deliveryMin: 20,
    deliveryMax: 35,
    deliveryFee: 18,
    priceAdjust: -6,
    hours: "07:30–21:00",
    note: "Often the lower sample prices in this demo.",
  },
  {
    id: "choppies-matero",
    name: "Choppies",
    branch: "Matero",
    city: "Lusaka",
    area: "Matero",
    initials: "CH",
    tint: "#8a4324",
    deliveryMin: 25,
    deliveryMax: 40,
    deliveryFee: 20,
    priceAdjust: -5,
    hours: "07:30–21:00",
    note: "Matero branch, same sample shelf.",
  },
  {
    id: "spar-roma",
    name: "Spar",
    branch: "Roma",
    city: "Lusaka",
    area: "Roma",
    initials: "SP",
    tint: "#1d5c48",
    deliveryMin: 25,
    deliveryMax: 40,
    deliveryFee: 30,
    priceAdjust: 5,
    hours: "07:00–22:00",
    note: "Roma supermarket. Open later than most.",
  },
  {
    id: "flm-ibex",
    name: "Food Lover's Market",
    branch: "Ibex Hill",
    city: "Lusaka",
    area: "Ibex Hill",
    initials: "FL",
    tint: "#6e3b32",
    deliveryMin: 30,
    deliveryMax: 50,
    deliveryFee: 35,
    priceAdjust: 8,
    hours: "08:00–20:00",
    note: "Grocer. Sample prices sit a bit higher.",
  },
  {
    id: "game-arcades",
    name: "Game",
    branch: "Arcades",
    city: "Lusaka",
    area: "Arcades",
    initials: "GM",
    tint: "#3a4634",
    deliveryMin: 35,
    deliveryMax: 55,
    deliveryFee: 32,
    priceAdjust: -1,
    hours: "09:00–19:00",
    note: "General store at Arcades. Sample groceries included.",
  },
  {
    id: "melissa-northmead",
    name: "Melissa",
    branch: "Northmead",
    city: "Lusaka",
    area: "Northmead",
    initials: "ME",
    tint: "#4c3d72",
    deliveryMin: 20,
    deliveryMax: 35,
    deliveryFee: 22,
    priceAdjust: 1,
    hours: "08:00–20:00",
    note: "Local store in Northmead.",
  },
  {
    id: "cheers-ndola",
    name: "Cheers",
    branch: "Kansenshi",
    city: "Ndola",
    area: "Kansenshi",
    initials: "CE",
    tint: "#1f5560",
    deliveryMin: 25,
    deliveryMax: 40,
    deliveryFee: 24,
    priceAdjust: 2,
    hours: "08:00–21:00",
    note: "Local store in Kansenshi.",
  },
  {
    id: "toppys-livingstone",
    name: "Toppy's",
    branch: "Town Centre",
    city: "Livingstone",
    area: "Town Centre",
    initials: "TO",
    tint: "#8a4b16",
    deliveryMin: 20,
    deliveryMax: 35,
    deliveryFee: 20,
    priceAdjust: 6,
    hours: "08:00–19:30",
    note: "Local store in Livingstone town.",
  },
  {
    id: "young-heroes-matero",
    name: "Young Heroes",
    branch: "Matero",
    city: "Lusaka",
    area: "Matero",
    initials: "YH",
    tint: "#1c4d34",
    deliveryMin: 20,
    deliveryMax: 35,
    deliveryFee: 15,
    priceAdjust: -4,
    hours: "07:00–20:00",
    note: "Local store in Matero. Lowest sample delivery fee.",
  },
];

function v(id: string, size: string, price: number, option?: string): Variant {
  return option ? { id, size, price, option } : { id, size, price };
}

function item(product: Product): Product {
  return product;
}

export const products: Product[] = [
  item({
    id: "breakfast-meal",
    brand: "National Milling",
    name: "Breakfast mealie meal",
    category: "staples",
    blurb: "The 25 kg bag for the month, or a smaller one.",
    keywords: "mealie meal nshima maize breakfast",
    chooserLabel: "Bag",
    variants: [
      v("breakfast-meal-25", "25 kg", 289),
      v("breakfast-meal-10", "10 kg", 128),
    ],
  }),
  item({
    id: "pembe-meal",
    brand: "Pembe",
    name: "Breakfast mealie meal",
    category: "staples",
    blurb: "Another breakfast bag for nshima.",
    keywords: "mealie meal nshima maize",
    variants: [v("pembe-meal-25", "25 kg", 279)],
  }),
  item({
    id: "roller-meal",
    brand: "Roller meal",
    name: "Roller mealie meal",
    category: "staples",
    blurb: "The roller bag, usually the cheaper nshima.",
    keywords: "mealie meal nshima roller maize",
    variants: [v("roller-meal-25", "25 kg", 236)],
  }),
  item({
    id: "zamanita",
    brand: "Zamanita",
    name: "Pure cooking oil",
    category: "staples",
    blurb: "The bottle next to the stove.",
    keywords: "cooking oil vegetable oil",
    variants: [
      v("zamanita-750", "750 ml", 42),
      v("zamanita-2", "2 L", 92),
      v("zamanita-25", "2.5 L", 112),
      v("zamanita-5", "5 L", 205),
    ],
  }),
  item({
    id: "zamgold",
    brand: "Zamgold",
    name: "Cooking oil",
    category: "staples",
    blurb: "A second cooking oil, in the usual sizes.",
    keywords: "cooking oil",
    variants: [
      v("zamgold-2", "2 L", 88),
      v("zamgold-25", "2.5 L", 108),
    ],
  }),
  item({
    id: "dlite",
    brand: "D'lite",
    name: "Vegetable cooking oil",
    category: "staples",
    blurb: "A plain 2 litre for everyday frying.",
    keywords: "cooking oil",
    variants: [v("dlite-2", "2 L", 78)],
  }),
  item({
    id: "whitespoon",
    brand: "Whitespoon",
    name: "White sugar",
    category: "staples",
    blurb: "Tea, porridge, and the baking tin.",
    keywords: "sugar",
    variants: [
      v("whitespoon-1", "1 kg", 38),
      v("whitespoon-2", "2 kg", 71),
    ],
  }),
  item({
    id: "mansa-sugar",
    brand: "Mansa",
    name: "Sugar",
    category: "staples",
    blurb: "A 2 kg bag of sugar.",
    keywords: "sugar",
    variants: [v("mansa-sugar-2", "2 kg", 69)],
  }),
  item({
    id: "nakonde-rice",
    brand: "Nakonde",
    name: "Golden grain rice",
    category: "staples",
    blurb: "Local rice for the pot.",
    keywords: "rice",
    variants: [
      v("nakonde-2", "2 kg", 58),
      v("nakonde-5", "5 kg", 135),
    ],
  }),
  item({
    id: "jasmine-rice",
    brand: "Aroma",
    name: "Jasmine rice",
    category: "staples",
    blurb: "A fragrant rice. Sample brand, not a mill label.",
    keywords: "rice",
    variants: [v("jasmine-2", "2 kg", 86)],
  }),
  item({
    id: "white-bread",
    brand: "Capital",
    name: "White bread",
    category: "staples",
    blurb: "A standard sliced loaf.",
    keywords: "bread loaf",
    variants: [v("white-bread-loaf", "Loaf", 18)],
  }),
  item({
    id: "brown-bread",
    brand: "Capital",
    name: "Brown bread",
    category: "staples",
    blurb: "A brown sliced loaf.",
    keywords: "bread loaf",
    variants: [v("brown-bread-loaf", "Loaf", 22)],
  }),
  item({
    id: "rolls",
    brand: "In-store bakery",
    name: "Bread rolls",
    category: "staples",
    blurb: "Six soft rolls.",
    keywords: "bread rolls",
    variants: [v("rolls-6", "Pack of 6", 16)],
  }),
  item({
    id: "salt",
    brand: "Table",
    name: "Iodised salt",
    category: "staples",
    blurb: "Fine iodised salt for the pot.",
    keywords: "salt iodised",
    variants: [
      v("salt-500", "500 g", 6),
      v("salt-1", "1 kg", 9),
    ],
  }),
  item({
    id: "sea-salt",
    brand: "Coast",
    name: "Sea salt",
    category: "staples",
    blurb: "Flaky sea salt.",
    keywords: "salt sea salt flakes",
    variants: [
      v("sea-salt-500", "500 g", 14),
      v("sea-salt-1", "1 kg", 24),
    ],
  }),
  item({
    id: "ocean-salt",
    brand: "Coast",
    name: "Ocean salt",
    category: "staples",
    blurb: "Coarse ocean salt crystals.",
    keywords: "salt ocean salt sea salt coarse",
    variants: [
      v("ocean-salt-500", "500 g", 16),
      v("ocean-salt-1", "1 kg", 28),
    ],
  }),
  item({
    id: "flour",
    brand: "Bakehouse",
    name: "Cake flour",
    category: "staples",
    blurb: "For fritters, scones and cake.",
    keywords: "flour baking",
    variants: [v("flour-25", "2.5 kg", 52)],
  }),
  item({
    id: "beans",
    brand: "Pantry",
    name: "Dried beans",
    category: "staples",
    blurb: "A kilo of sugar beans.",
    keywords: "beans",
    variants: [v("beans-1", "1 kg", 36)],
  }),
  item({
    id: "peanut",
    brand: "Zam Spread",
    name: "Peanut butter",
    category: "staples",
    blurb: "Smooth peanut butter for bread.",
    keywords: "peanut butter",
    variants: [v("peanut-400", "400 g", 34)],
  }),
  item({
    id: "tomato-paste",
    brand: "Pantry",
    name: "Tomato paste",
    category: "staples",
    blurb: "A tin for relish and stew.",
    keywords: "tomato paste",
    variants: [v("tomato-paste-410", "410 g", 22)],
  }),

  item({
    id: "kapenta-dried",
    brand: "Mpulungu",
    name: "Dried kapenta",
    category: "fresh",
    blurb: "Dried kapenta for relish.",
    keywords: "kapenta dagaa mpulungu fish",
    variants: [
      v("kapenta-250", "250 g", 95),
      v("kapenta-500", "500 g", 180),
      v("kapenta-1", "1 kg", 345),
    ],
  }),
  item({
    id: "kapenta-fresh",
    brand: "Lakeside",
    name: "Fresh kapenta",
    category: "fresh",
    blurb: "A small pack of fresh kapenta.",
    keywords: "kapenta fish",
    variants: [v("kapenta-fresh-400", "400 g", 52)],
  }),
  item({
    id: "chicken",
    brand: "Cold shelf",
    name: "Frozen mixed chicken",
    category: "fresh",
    blurb: "Mixed pieces for the pot.",
    keywords: "chicken",
    variants: [
      v("chicken-1", "1 kg", 78),
      v("chicken-2", "2 kg", 150),
    ],
  }),
  item({
    id: "tomatoes",
    brand: "Market",
    name: "Tomatoes",
    category: "fresh",
    blurb: "Ripe tomatoes for relish.",
    keywords: "tomato vegetables",
    variants: [v("tomatoes-1", "1 kg", 18)],
  }),
  item({
    id: "onions",
    brand: "Market",
    name: "Onions",
    category: "fresh",
    blurb: "A kilo of onions.",
    keywords: "onion vegetables",
    variants: [v("onions-1", "1 kg", 34)],
  }),
  item({
    id: "cabbage",
    brand: "Market",
    name: "Cabbage",
    category: "fresh",
    blurb: "One head of cabbage.",
    keywords: "cabbage vegetables",
    variants: [v("cabbage-1", "Each", 14)],
  }),
  item({
    id: "potatoes",
    brand: "Market",
    name: "Potatoes",
    category: "fresh",
    blurb: "Potatoes for chips or stew.",
    keywords: "potatoes",
    variants: [v("potatoes-1", "1 kg", 20)],
  }),
  item({
    id: "rape",
    brand: "Market",
    name: "Rape leaves",
    category: "fresh",
    blurb: "A bunch of rape for relish.",
    keywords: "rape vegetables relish greens",
    variants: [v("rape-bunch", "Bunch", 8)],
  }),

  item({
    id: "eggs",
    brand: "Farm",
    name: "Eggs",
    category: "dairy",
    blurb: "A half dozen, or a full tray of 30.",
    keywords: "eggs tray",
    variants: [
      v("eggs-6", "Half dozen", 22),
      v("eggs-30", "Tray of 30", 88),
    ],
  }),
  item({
    id: "fresh-milk",
    brand: "Dairy",
    name: "Fresh milk",
    category: "dairy",
    blurb: "Fresh milk for tea and porridge.",
    keywords: "milk",
    variants: [
      v("fresh-milk-500", "500 ml", 16),
      v("fresh-milk-1", "1 L", 29),
    ],
  }),
  item({
    id: "uht-milk",
    brand: "Dairy",
    name: "Long-life full cream milk",
    category: "dairy",
    blurb: "A litre that keeps in the cupboard.",
    keywords: "milk uht",
    variants: [v("uht-milk-1", "1 L", 34)],
  }),
  item({
    id: "mabisi",
    brand: "Dairy",
    name: "Mabisi",
    category: "dairy",
    blurb: "Traditional sour milk.",
    keywords: "mabisi sour milk",
    variants: [v("mabisi-500", "500 ml", 18)],
  }),
  item({
    id: "stork",
    brand: "Stork",
    name: "Country spread",
    category: "dairy",
    blurb: "A tub for bread and cooking.",
    keywords: "margarine spread",
    variants: [v("stork-500", "500 g", 48)],
  }),

  item({
    id: "nola-mayo",
    brand: "Nola",
    name: "Original mayonnaise",
    category: "mayo",
    blurb: "For chips, bread and coleslaw.",
    keywords: "mayonnaise mayo",
    variants: [
      v("nola-375", "375 g", 34),
      v("nola-750", "750 g", 55),
    ],
  }),
  item({
    id: "bwell-mayo",
    brand: "B-well",
    name: "Thick mayonnaise",
    category: "mayo",
    blurb: "A thick mayonnaise in two jars.",
    keywords: "mayonnaise mayo",
    variants: [
      v("bwell-370", "370 g", 38),
      v("bwell-740", "740 g", 62),
    ],
  }),
  item({
    id: "cb-mayo",
    brand: "Crosse & Blackwell",
    name: "Tangy mayonnaise",
    category: "mayo",
    blurb: "A tangy jar for salads.",
    keywords: "mayonnaise mayo",
    variants: [v("cb-750", "750 g", 68)],
  }),
  item({
    id: "goldcrest-mayo",
    brand: "Goldcrest",
    name: "Creamy mayonnaise",
    category: "mayo",
    blurb: "A sample brand. Creamy, in two sizes.",
    keywords: "mayonnaise mayo",
    variants: [
      v("goldcrest-375", "375 g", 29),
      v("goldcrest-750", "750 g", 49),
    ],
  }),
  item({
    id: "allsome-mayo",
    brand: "Allsome",
    name: "Salad mayonnaise",
    category: "mayo",
    blurb: "A sample brand in a 500 g jar.",
    keywords: "mayonnaise mayo",
    variants: [v("allsome-500", "500 g", 33)],
  }),

  item({
    id: "indomie-chicken",
    brand: "Indomie",
    name: "Chicken noodles",
    category: "noodles",
    blurb: "One packet, or a five-pack for the week.",
    keywords: "instant noodles indomie",
    variants: [
      v("indomie-chicken-1", "70 g", 8),
      v("indomie-chicken-5", "5 × 70 g", 36),
    ],
  }),
  item({
    id: "indomie-veg",
    brand: "Indomie",
    name: "Vegetable noodles",
    category: "noodles",
    blurb: "Vegetable flavour, single or five-pack.",
    keywords: "instant noodles indomie",
    chooserLabel: "Pack",
    variants: [
      v("indomie-veg-1", "70 g", 8),
      v("indomie-veg-5", "5 × 70 g", 36),
    ],
  }),
  item({
    id: "indomie-onion",
    brand: "Indomie",
    name: "Onion chicken noodles",
    category: "noodles",
    blurb: "Onion chicken, sold here as a five-pack.",
    keywords: "instant noodles indomie",
    variants: [v("indomie-onion-5", "5 × 70 g", 38)],
  }),
  item({
    id: "maggi-chicken",
    brand: "Maggi",
    name: "2-minute chicken noodles",
    category: "noodles",
    blurb: "Chicken 2-minute noodles.",
    keywords: "instant noodles maggi",
    variants: [
      v("maggi-chicken-1", "70 g", 9),
      v("maggi-chicken-5", "5 × 70 g", 40),
    ],
  }),
  item({
    id: "maggi-masala",
    brand: "Maggi",
    name: "Masala noodles",
    category: "noodles",
    blurb: "Masala flavour, five-pack.",
    keywords: "instant noodles maggi",
    variants: [v("maggi-masala-5", "5 × 70 g", 42)],
  }),
  item({
    id: "yumyum",
    brand: "Yum Yum",
    name: "Tom yum noodles",
    category: "noodles",
    blurb: "A hotter packet, in a five-pack.",
    keywords: "instant noodles",
    variants: [v("yumyum-5", "5-pack", 58)],
  }),
  item({
    id: "everyday-noodles",
    brand: "Everyday",
    name: "Beef instant noodles",
    category: "noodles",
    blurb: "A sample house brand. Beef flavour.",
    keywords: "instant noodles",
    variants: [
      v("everyday-1", "70 g", 7),
      v("everyday-5", "5 × 70 g", 30),
    ],
  }),

  item({
    id: "boom",
    brand: "Boom",
    name: "Washing powder",
    category: "laundry",
    blurb: "Powder for the week's wash.",
    keywords: "washing powder detergent",
    variants: [
      v("boom-400", "400 g", 28),
      v("boom-1", "1 kg", 54),
      v("boom-2", "2 kg", 92),
    ],
  }),
  item({
    id: "sunlight-powder",
    brand: "Sunlight",
    name: "Washing powder",
    category: "laundry",
    blurb: "Sunlight powder in 1 kg and 2 kg.",
    keywords: "washing powder detergent",
    variants: [
      v("sunlight-powder-1", "1 kg", 62),
      v("sunlight-powder-2", "2 kg", 105),
    ],
  }),
  item({
    id: "omo",
    brand: "Omo",
    name: "Auto washing powder",
    category: "laundry",
    blurb: "A machine powder in two bags.",
    keywords: "washing powder detergent",
    variants: [
      v("omo-1", "1 kg", 78),
      v("omo-2", "2 kg", 132),
    ],
  }),
  item({
    id: "sunlight-bar",
    brand: "Sunlight",
    name: "Laundry bar soap",
    category: "laundry",
    blurb: "Bar soap for handwashing clothes.",
    keywords: "washing soap bar soap laundry",
    variants: [
      v("sunlight-bar-250", "250 g", 9),
      v("sunlight-bar-500", "500 g", 15),
    ],
  }),
  item({
    id: "green-bar",
    brand: "Classic",
    name: "Green laundry bar soap",
    category: "laundry",
    blurb: "The green bar for a bucket wash.",
    keywords: "washing soap bar soap laundry",
    variants: [v("green-bar-500", "500 g", 12)],
  }),
  item({
    id: "strike-bar",
    brand: "Strike",
    name: "Washing bar soap",
    category: "laundry",
    blurb: "Another laundry bar.",
    keywords: "washing soap bar soap laundry",
    variants: [v("strike-400", "400 g", 13)],
  }),

  item({
    id: "geisha",
    brand: "Geisha",
    name: "Bathing soap",
    category: "bathing",
    blurb: "A bar for the bath. Two scents.",
    keywords: "bathing soap body soap",
    chooserLabel: "Scent",
    variants: [
      v("geisha-floral", "225 g", 18, "Floral"),
      v("geisha-lemon", "225 g", 18, "Lemon"),
    ],
  }),
  item({
    id: "dettol-bar",
    brand: "Dettol",
    name: "Bathing soap",
    category: "bathing",
    blurb: "An antibacterial bar.",
    keywords: "bathing soap body soap",
    chooserLabel: "Scent",
    variants: [
      v("dettol-bar-original", "175 g", 17, "Original"),
      v("dettol-bar-cool", "175 g", 18, "Cool"),
    ],
  }),
  item({
    id: "lifebuoy",
    brand: "Lifebuoy",
    name: "Bathing soap",
    category: "bathing",
    blurb: "A red bar for the whole family.",
    keywords: "bathing soap body soap",
    variants: [v("lifebuoy-175", "175 g", 15)],
  }),
  item({
    id: "lux-bar",
    brand: "Lux",
    name: "Bathing soap",
    category: "bathing",
    blurb: "A scented bathing bar.",
    keywords: "bathing soap body soap",
    chooserLabel: "Scent",
    variants: [
      v("lux-bar-soft", "175 g", 16, "Soft Touch"),
      v("lux-bar-orchid", "175 g", 16, "Magical Orchid"),
    ],
  }),
  item({
    id: "imperial",
    brand: "Imperial Leather",
    name: "Bathing soap",
    category: "bathing",
    blurb: "A richer bar, two versions.",
    keywords: "bathing soap body soap",
    chooserLabel: "Scent",
    variants: [
      v("imperial-classic", "175 g", 24, "Classic"),
      v("imperial-gentle", "175 g", 26, "Gentle Care"),
    ],
  }),
  item({
    id: "dove-bar",
    brand: "Dove",
    name: "Beauty bar",
    category: "bathing",
    blurb: "A cream bar for the bath.",
    keywords: "bathing soap body soap",
    chooserLabel: "Scent",
    variants: [
      v("dove-bar-cream", "100 g", 22, "Cream"),
      v("dove-bar-pink", "100 g", 22, "Pink"),
    ],
  }),

  item({
    id: "dettol-shower",
    brand: "Dettol",
    name: "Shower gel",
    category: "shower",
    blurb: "Choose a scent and a bottle size.",
    keywords: "shower gel body wash",
    chooserLabel: "Scent",
    variants: [
      v("dettol-shower-original-250", "250 ml", 45, "Original"),
      v("dettol-shower-original-500", "500 ml", 72, "Original"),
      v("dettol-shower-cool-250", "250 ml", 47, "Cool"),
      v("dettol-shower-cool-500", "500 ml", 75, "Cool"),
      v("dettol-shower-skincare-250", "250 ml", 49, "Skincare"),
    ],
  }),
  item({
    id: "lux-shower",
    brand: "Lux",
    name: "Body wash",
    category: "shower",
    blurb: "A scented body wash. Scent and size both change the price.",
    keywords: "shower gel body wash",
    chooserLabel: "Scent",
    variants: [
      v("lux-shower-rose-250", "250 ml", 39, "Soft Rose"),
      v("lux-shower-rose-400", "400 ml", 58, "Soft Rose"),
      v("lux-shower-orchid-250", "250 ml", 39, "Magical Orchid"),
      v("lux-shower-aqua-400", "400 ml", 60, "Aqua Sparkle"),
    ],
  }),
  item({
    id: "dove-shower",
    brand: "Dove",
    name: "Shower gel",
    category: "shower",
    blurb: "A richer gel. Deeply nourishing comes in two sizes.",
    keywords: "shower gel body wash",
    chooserLabel: "Scent",
    variants: [
      v("dove-shower-nourish-250", "250 ml", 55, "Deeply Nourishing"),
      v("dove-shower-nourish-500", "500 ml", 89, "Deeply Nourishing"),
      v("dove-shower-cucumber-250", "250 ml", 57, "Cucumber & Green Tea"),
      v("dove-shower-rosa-400", "400 ml", 82, "Pink Rosa"),
    ],
  }),
  item({
    id: "eva-shower",
    brand: "Eva",
    name: "Fresh shower gel",
    category: "shower",
    blurb: "A sample local brand. Vanilla, aloe or citrus.",
    keywords: "shower gel body wash",
    chooserLabel: "Scent",
    variants: [
      v("eva-vanilla-250", "250 ml", 29, "Vanilla"),
      v("eva-vanilla-500", "500 ml", 48, "Vanilla"),
      v("eva-aloe-250", "250 ml", 29, "Aloe Vera"),
      v("eva-aloe-500", "500 ml", 48, "Aloe Vera"),
      v("eva-citrus-400", "400 ml", 42, "Citrus Burst"),
    ],
  }),

  item({
    id: "maheu",
    brand: "Super Maheu",
    name: "Maheu",
    category: "drinks",
    blurb: "The carton for the road. Three flavours.",
    keywords: "maheu drink",
    chooserLabel: "Flavour",
    variants: [
      v("maheu-original", "500 ml", 9, "Original"),
      v("maheu-banana", "500 ml", 9, "Banana"),
      v("maheu-chocolate", "500 ml", 9, "Chocolate"),
    ],
  }),
  item({
    id: "cola",
    brand: "Coca-Cola",
    name: "Cola",
    category: "drinks",
    blurb: "A cold drink for the table.",
    keywords: "soda coke",
    variants: [
      v("cola-330", "330 ml", 8),
      v("cola-2", "2 L", 28),
    ],
  }),
  item({
    id: "sprite",
    brand: "Sprite",
    name: "Lemon-lime soda",
    category: "drinks",
    blurb: "A 2 litre lemon-lime soda.",
    keywords: "soda",
    variants: [v("sprite-2", "2 L", 28)],
  }),
  item({
    id: "mazoe",
    brand: "Mazoe",
    name: "Orange crush",
    category: "drinks",
    blurb: "Dilute it. A 2 litre bottle.",
    keywords: "squash juice",
    variants: [v("mazoe-2", "2 L", 42)],
  }),
  item({
    id: "water",
    brand: "Still",
    name: "Bottled water",
    category: "drinks",
    blurb: "Still water, single bottles or a six-pack.",
    keywords: "water",
    variants: [
      v("water-500", "500 ml", 5),
      v("water-1", "1 L", 7),
      v("water-15", "1.5 L", 8),
      v("water-6", "6 × 500 ml", 28),
    ],
  }),

  item({
    id: "tissue",
    brand: "Home",
    name: "Toilet tissue",
    category: "home",
    blurb: "A pack of 9 rolls.",
    keywords: "toilet paper tissue",
    variants: [v("tissue-9", "9 rolls", 58)],
  }),
  item({
    id: "dishwash",
    brand: "Home",
    name: "Dishwashing liquid",
    category: "home",
    blurb: "For the sink after nshima.",
    keywords: "dish soap washing up",
    variants: [v("dishwash-750", "750 ml", 32)],
  }),
  item({
    id: "scouring",
    brand: "Home",
    name: "Scouring powder",
    category: "home",
    blurb: "For pots and the sink.",
    keywords: "vim scouring",
    variants: [v("scouring-500", "500 g", 18)],
  }),
  item({
    id: "candles",
    brand: "Home",
    name: "Candles",
    category: "home",
    blurb: "A pack for load shedding.",
    keywords: "candles",
    variants: [v("candles-pack", "Pack", 28)],
  }),
  item({
    id: "matches",
    brand: "Home",
    name: "Matches",
    category: "home",
    blurb: "A carton of matches.",
    keywords: "matches",
    variants: [v("matches-carton", "Carton", 6)],
  }),
  item({
    id: "bin-liners",
    brand: "Home",
    name: "Bin liners",
    category: "home",
    blurb: "Twenty liners.",
    keywords: "bin bags",
    variants: [v("bin-liners-20", "Pack of 20", 24)],
  }),
];

export function variantImage(variantId: string) {
  // next/image leaves unoptimized src paths alone, so the Pages base path
  // has to be part of the URL. Keep this in step with `basePath` in next.config.ts.
  return `/tenga/products/${variantId}.webp`;
}

export function storePrice(base: number, priceAdjust: number) {
  return Math.max(1, Math.round((base * (100 + priceAdjust)) / 100));
}

export function getStore(id: string) {
  return stores.find((store) => store.id === id);
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

export function findVariant(productId: string, variantId: string) {
  const product = getProduct(productId);
  const variant = product?.variants.find((entry) => entry.id === variantId);
  if (!product || !variant) return null;
  return { product, variant };
}

export function storePlace(store: Store) {
  if (store.branch === store.area) return `${store.area}, ${store.city}`;
  return `${store.branch} · ${store.area}, ${store.city}`;
}
