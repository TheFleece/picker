// ============================================================================
// STORE NUMBERS available to the demo data generator.
//
// REAL_STORES: 7810 is transcribed from the photographed picking list (the
// demo's headline order, always shown as-is); the others are the sample
// numbers the public demo has used from day one. Add a number here once
// it is confirmed from real paperwork.
//
// EXTRA_STORES holds additional plausible numbers for bulk generation.
// Both demo.html and order-database.html combine these with
// buildSyntheticStores() from warehouse-generator.js to build a bigger,
// varied store pool for the rotating (non-headline) orders — so the
// demo spreads across a different set of stores on every run instead of
// cycling the same handful.
// ============================================================================
const REAL_STORES = ["7810", "7732", "7901", "7704", "7458"];
const EXTRA_STORES = [];
