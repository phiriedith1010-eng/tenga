# Tenga

Grocery delivery for Zambia, in the style of a store-to-door app. You pick a shop, fill a cart, pay in a clearly labelled demo sandbox, and watch a rider take the order from the shelf to your gate.

**Live demo:** [https://phiriedith1010-eng.github.io/tenga/](https://phiriedith1010-eng.github.io/tenga/)

Sample prices are in Zambian kwacha (K). Mobile money is the first way to pay. Nothing here charges a real wallet or card. Store names, branch details and prices are sample data. Tenga is not affiliated with ShopRite, Pick n Pay, Choppies, Spar, Food Lover's Market, Game, Melissa, Cheers, Toppy's, Young Heroes, or the product brands on the shelf.

## Run it locally

Requires Node.js 22 or newer.

```bash
npm install && npm run dev
```

Open [http://127.0.0.1:4317/tenga/](http://127.0.0.1:4317/tenga/). The app is built for the GitHub Pages subpath `/tenga`, including in dev.

## Static site

`npm run build` writes a static export to `out/` (`output: 'export'`). There is no Node server at runtime. Orders, tracking and the rider desk are stored in this browser's `localStorage`.

Preview the export the way Pages serves it, under `/tenga`:

```bash
npm run build
mkdir -p /tmp/tenga-pages
ln -sfn "$(pwd)/out" /tmp/tenga-pages/tenga
python3 -m http.server 4317 --directory /tmp/tenga-pages
```

Open [http://127.0.0.1:4317/tenga/](http://127.0.0.1:4317/tenga/).

## Deploys

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow installs dependencies, runs `npm run build`, and publishes `out/` with `actions/configure-pages` (`enablement: true`), `actions/upload-pages-artifact` and `actions/deploy-pages`.

GitHub Pages has to use **GitHub Actions** as the source (Settings → Pages → Build and deployment → Source: GitHub Actions). That is a one-time repository setting. The workflow tries to turn it on; if the job token cannot, the Actions log says so and someone needs to flip that setting in the browser.

## Try the full order

1. Choose a store. Lusaka branches include Kabulonga, Woodlands, Chilenje, Matero, Roma and Ibex Hill. Kitwe, Ndola and Livingstone are on the list too.
2. In a store, tap a picture. Shower gel, mayonnaise, noodles, bottled water and salt (iodised, sea and ocean) are on the shelf with the other staples. Choose a size or scent if you want one, then add it. That is two or three taps.
3. Open the cart, then checkout. Use a name, a Zambian mobile such as `0977 123 456`, an area, and a plot or street.
4. Pick **Airtel Money**, send the demo phone prompt, and enter any 4-digit PIN except `0000`.
5. Tracking opens at `/orders/?id=…` and moves on its own: Order placed, Rider assigned, Rider at store picking groceries, Picked up, On the way, Delivered. That takes about 50 seconds. The [rider desk](https://phiriedith1010-eng.github.io/tenga/rider/) can step an order forward immediately.

Other demo payments:

- **MTN MoMo** and **Zamtel Kwacha** use the same prompt and PIN.
- **Card** accepts only `4242 4242 4242 4242`, any future expiry, and any 3-digit CVC. `4000 0000 0000 0002` is declined. The card number stays in the browser and is never sent or stored.
- **Cash on delivery** is paid to the rider in the story of the demo. No money moves.

Orders are remembered in this browser against the phone number. Open **Orders** here, or enter the same number again on this device. There is no password, and another browser does not share the list. That is the guest account for the demo.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/catalog.ts` | The only catalogue. Stores, areas, products, variants and base prices. |
| `public/products` | Illustrated WebP pictures, one per variant. See `CREDITS.md`. |
| `scripts/render-products.ts` | Regenerates those pictures (`npm run images`). |
| `src/lib/orders.ts` | Create, list, and advance orders in `localStorage`. Demo statuses tick forward on read. |
| `src/app/page.tsx` | Home: store list and how delivery works. |
| `src/app/store/[storeId]/page.tsx` | A store's shelf, search and variants. Every store is pre-rendered. |
| `src/app/cart/page.tsx` | Cart. |
| `src/app/checkout/page.tsx` | Address and sandbox payment. |
| `src/app/orders/page.tsx` | Order history by phone number, and tracking when the URL has `?id=`. |
| `src/app/rider/page.tsx` | Rider desk. |
| `.github/workflows/deploy.yml` | Build and deploy to GitHub Pages. |

To change a price or add a product, edit `src/data/catalog.ts`. Each store has a `priceAdjust` percent, so the same base price lands a little differently in each branch. `deliveryFee`, `deliveryMin` and `deliveryMax` are per store. In dev, the next page load picks the file up. A new store id is included in the static export on the next build.

## What this is not

Store names, branch details and prices are sample data for the demo. Tenga is not affiliated with ShopRite, Pick n Pay, Choppies, Spar, Food Lover's Market, Game, Melissa, Cheers, Toppy's, Young Heroes, or the product brands on the shelf. The marks on the store cards are plain initials, not logos. There is no payment processor. Product pictures are original illustrations; see `CREDITS.md`.
