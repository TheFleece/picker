// ============================================================================
// WAREHOUSE GENERATOR — turns config.js + nomenclature-parts.js (+ the real
// catalog-chilled-a.js, catalog-dry.js, stores.js) into one big synthetic
// warehouse, then generates realistic picking-list orders out of it.
//
// Shared by every page that needs demo orders — call buildWarehouse(CONFIG,
// realChilled, realDry) once, then generateOrder() as many times as you
// like. See data/README.md for the full picture.
// ============================================================================
"use strict";

const sum = (a) => a.reduce((s, x) => s + x.qty, 0);

function rnd(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffleArr(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- article numbers -------------------------------------------------------
// Real ones seen are 8 or 11 digits, most commonly starting "10" or "11".
function synthesizeArticle(prefixPool, used) {
  let art;
  do {
    const prefix = pick(prefixPool);
    const is11 = Math.random() < 0.12; // real data: 11-digit codes are the minority
    const totalLen = is11 ? 11 : 8;
    let digits = prefix;
    while (digits.length < totalLen) digits += String(rnd(0, 9));
    art = digits.slice(0, totalLen);
  } while (used.has(art));
  used.add(art);
  return art;
}

// ---- nomenclature synthesis -------------------------------------------------
// Cross-multiplies every (brand, descriptor) combo in a category with each of
// its sizes — a 150G and a 300G pack are different articles in real life,
// same as on the photographed lists. Cycles deterministically through sizes
// (round-robin) rather than retrying at random, so it reliably reaches the
// full combinatorial ceiling instead of stalling on collisions. That ceiling
// is brands × descriptors × sizes, summed per category — grow it by adding
// more brands/descriptors/sizes to nomenclature-parts.js, not by raising
// targetCount past what the pools can actually produce.
function synthesizeFromCategories(
  categories,
  targetCount,
  usedArticles,
  usedDesc,
) {
  const out = [];
  const combos = [];
  for (const cat of categories) {
    for (const brand of cat.brands) {
      for (const desc of cat.descriptors) combos.push({ cat, brand, desc });
    }
  }
  const shuffled = shuffleArr(combos);
  let round = 0;
  while (out.length < targetCount) {
    let addedThisRound = false;
    for (const c of shuffled) {
      if (out.length >= targetCount) break;
      const sizes = c.cat.sizes.length ? c.cat.sizes : [""];
      const size = sizes[round % sizes.length];
      const description = (
        c.brand +
        " " +
        c.desc +
        (size ? " " + size : "")
      ).trim();
      if (!usedDesc.has(description)) {
        usedDesc.add(description);
        out.push({
          article: synthesizeArticle(c.cat.articlePrefixes, usedArticles),
          desc: description,
          category: c.cat.key,
          real: false,
        });
        addedThisRound = true;
      }
    }
    round++;
    if (!addedThisRound) break; // every combo × every size is used — pool's ceiling reached
  }
  return out;
}

// ---- location grid -----------------------------------------------------------
// `minSlotsNeeded` is the nomenclature size we actually have to shelve —
// shelvesPerAisle grows past the configured range if the configured aisle
// count would otherwise be too small to fit it (so nomenclatureSize in
// config.js is always honored; it never silently gets trimmed down to
// whatever the warehouse shape happens to hold).
function buildLocationGrid(warehouseCfg, minSlotsNeeded) {
  const aisles = rnd(warehouseCfg.aisles[0], warehouseCfg.aisles[1]);
  const rawShelves = rnd(
    warehouseCfg.shelvesPerAisle[0],
    warehouseCfg.shelvesPerAisle[1],
  );
  const neededPerAisle =
    Math.ceil((minSlotsNeeded || 0) / aisles / (1 - warehouseCfg.gapFraction)) +
    1;
  const shelvesPerAisle = Math.max(rawShelves, neededPerAisle);
  const locs = [];
  for (let a = 1; a <= aisles; a++) {
    for (let s = 1; s <= shelvesPerAisle; s++) {
      if (Math.random() < warehouseCfg.gapFraction) continue; // real lists always have gaps
      locs.push(String(a).padStart(3, "0") + "-" + String(s).padStart(3, "0"));
    }
  }
  return locs;
}

// ---- full warehouse ------------------------------------------------------------
// realChilled: [[loc,article,desc], ...] from catalog-chilled-a.js (+ -b.js)
// realDry: [[article,desc], ...] from catalog-dry.js
function buildWarehouse(config, realChilled, realDry) {
  const usedArticles = new Set();
  const usedDesc = new Set();

  const realItems = realChilled.map(([, article, desc]) => {
    usedArticles.add(article);
    usedDesc.add(desc);
    return { article, desc, category: "real", real: true };
  });

  const targetTotal = rnd(
    config.nomenclatureSize[0],
    config.nomenclatureSize[1],
  );
  const synthCount = Math.max(0, targetTotal - realItems.length);
  const synthItems = synthesizeFromCategories(
    CHILLED_CATEGORIES,
    synthCount,
    usedArticles,
    usedDesc,
  );

  const nomenclature = shuffleArr(realItems.concat(synthItems));
  const locations = buildLocationGrid(config.warehouse, nomenclature.length);

  const n = Math.min(nomenclature.length, locations.length);
  const slots = [];
  for (let i = 0; i < n; i++) {
    slots.push({
      loc: locations[i],
      article: nomenclature[i].article,
      desc: nomenclature[i].desc,
      category: nomenclature[i].category,
      real: nomenclature[i].real,
    });
  }
  slots.sort((x, y) => x.loc.localeCompare(y.loc));

  const dryUsedArticles = new Set();
  const dryUsedDesc = new Set();
  const realDryItems = realDry.map(([article, desc]) => {
    dryUsedArticles.add(article);
    dryUsedDesc.add(desc);
    return { article, desc, category: "real", real: true };
  });
  const dryTarget = Math.round(targetTotal * 0.15); // dry pallets are a much smaller world than the chilled floor
  const synthDry = synthesizeFromCategories(
    DRY_CATEGORIES,
    Math.max(0, dryTarget - realDryItems.length),
    dryUsedArticles,
    dryUsedDesc,
  );
  const dryPool = realDryItems.concat(synthDry);

  return {
    slots,
    dryPool,
    skuCount: slots.length,
    dryCount: dryPool.length,
    realSkuCount: realItems.length,
  };
}

// Extra plausible store numbers for the prep tool only (never used by demo.html).
function buildSyntheticStores(count, realStores) {
  const out = new Set(realStores);
  let guard = 0;
  while (out.size < count && guard < count * 20) {
    guard++;
    out.add(String(rnd(7300, 7999)));
  }
  return [...out];
}

// ---- order generation --------------------------------------------------------
function sampleQty(bias) {
  const r = Math.random();
  let lo, hi;
  if (r < 0.46) {
    lo = 1;
    hi = 1;
  } else if (r < 0.85) {
    lo = 2;
    hi = 5;
  } else if (r < 0.92) {
    lo = 6;
    hi = 10;
  } else if (r < 0.96) {
    lo = 11;
    hi = 20;
  } else if (r < 0.99) {
    lo = 21;
    hi = 40;
  } else {
    lo = 41;
    hi = 95;
  }
  if (bias !== 1) {
    lo = Math.max(1, Math.round(lo * bias));
    hi = Math.max(lo, Math.round(hi * bias));
  }
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}
function pickSizeTier(orderSizeCfg) {
  const tiers = Object.values(orderSizeCfg);
  const r = Math.random();
  let acc = 0;
  for (const t of tiers) {
    acc += t.weight;
    if (r <= acc) return t;
  }
  return tiers[0];
}
function dryLocations(n) {
  const aisle = Math.random() < 0.5 ? "003" : "004";
  let cur = 1 + Math.floor(Math.random() * 3);
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(aisle + "-" + String(cur).padStart(3, "0"));
    cur += 1 + (Math.random() < 0.35 ? 1 + Math.floor(Math.random() * 3) : 0);
  }
  return out;
}

let _orderSeq = 1;
function resetOrderSeq() {
  _orderSeq = 1;
}

// forceDept ("dry" | "chilled") and tierName ("small" | "medium" | "large")
// are optional — omit both for the natural random mix; pass them when a page
// needs a scripted order (e.g. demo.html guarantees one small chilled order).
function generateOrder(warehouse, config, wave, store, forceDept, tierName) {
  const tier = tierName
    ? config.orderSize[tierName]
    : pickSizeTier(config.orderSize);
  const isDry = forceDept
    ? forceDept === "dry"
    : Math.random() < config.dryChance;
  if (isDry) {
    const n = Math.min(warehouse.dryPool.length, rnd(5, 14));
    const picks = shuffleArr(warehouse.dryPool).slice(0, n);
    const locs = dryLocations(picks.length);
    const items = picks
      .map((p, i) => ({
        loc: locs[i],
        qty: sampleQty(tier.qtyBias * 0.6),
        art: p.article,
        desc: p.desc,
      }))
      .sort((a, b) => a.loc.localeCompare(b.loc));
    return {
      id: "o" + _orderSeq++,
      wave,
      store,
      dept: "DRY/ODD SIZE - NEW PALLET",
      items,
      total: sum(items),
    };
  }
  const n = Math.min(warehouse.slots.length, rnd(tier.lines[0], tier.lines[1]));
  const picks = shuffleArr(warehouse.slots)
    .slice(0, n)
    .sort((a, b) => a.loc.localeCompare(b.loc));
  const items = picks.map((p) => ({
    loc: p.loc,
    qty: sampleQty(tier.qtyBias),
    art: p.article,
    desc: p.desc,
  }));
  return {
    id: "o" + _orderSeq++,
    wave,
    store,
    dept: "SPOT CHILLED",
    items,
    total: sum(items),
  };
}
