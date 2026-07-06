// ============================================================================
// CONFIG — controls how big the synthetic warehouse/demo data is.
// Edit the numbers below and reload the page. No other file needs to change.
// Every range is [min, max] — the actual value is picked randomly inside
// that range each time the warehouse is (re)built, so even the *scale*
// varies a little from one demo run to the next.
// ============================================================================
const CONFIG = {
  // How many distinct products (SKUs) to synthesize in total, across all
  // chilled categories (cheese, meat, seafood, dairy, dessert, ready-meal,
  // juice). The real items transcribed from photographed picking lists are
  // always included on top of this — this range is for the *synthetic*
  // fill that makes the catalog feel like a real, large Netto nomenclature
  // instead of just the items we happened to photograph.
  // Ceiling with the current nomenclature-parts.js: ~4000. Asking for more
  // just returns that max (no crash) — to actually go bigger, add more
  // brands/product types/sizes to nomenclature-parts.js first.
  nomenclatureSize: [1200, 2500],

  // Warehouse floor size: number of aisles, and shelf positions per aisle.
  // Real photographed lists only ever showed aisles "001"–"004"; this range
  // lets the demo represent a much bigger distribution center.
  warehouse: {
    aisles: [6, 14],
    shelvesPerAisle: [15, 35],
    // Real lists always have gaps (not every shelf number is used) — this
    // is the fraction of shelf slots that stay empty, matching that.
    gapFraction: 0.18,
  },

  // How many store numbers the generator may synthesize on top of the
  // confirmed list in data/stores.js. Used by order-database.html for its
  // full pool; demo.html draws a smaller pool per run (see buildDemoData
  // in demo.html) so every restart shows a different spread of stores.
  stores: {
    totalStores: [80, 250],
  },

  // Order size tiers. `lines` = how many rows a generated order has,
  // `qtyBias` scales the per-row quantity distribution (1 = unchanged from
  // the real observed distribution, <1 = smaller numbers, >1 = bigger).
  // `weight`s should add up to 1.
  orderSize: {
    small: { lines: [4, 15], qtyBias: 0.6, weight: 0.4 },
    medium: { lines: [15, 35], qtyBias: 1.0, weight: 0.35 },
    large: { lines: [35, 80], qtyBias: 1.6, weight: 0.25 },
  },

  // How many orders (stores) land on the table per generated wave.
  ordersPerWave: [2, 6],

  // Chance that a generated order is a DRY/ODD SIZE pallet instead of a
  // SPOT CHILLED order (real photos showed DRY far less often than CHILLED).
  dryChance: 0.18,
};
