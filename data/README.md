# data/ — synthetic warehouse for the demo

`demo.html` gets its sample data from this folder. The demo builds a full
synthetic warehouse on every start and deals its order queue out of that
warehouse. Everything here is demo data assembled from real building
blocks; none of it is a live Netto order.

## Files

| File                     | What it is                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| `catalog-chilled-a.js`   | Real SPOT CHILLED items, transcribed 1:1 from a photographed picking list (the demo's headline order) |
| `catalog-dry.js`         | DRY/ODD SIZE base items the demo has always shipped with                                        |
| `stores.js`              | Store numbers the demo may show                                                                 |
| `nomenclature-parts.js`  | Raw building blocks per category: brands, product types, pack sizes, article prefixes           |
| `config.js`              | Min–max ranges that set the scale: how many SKUs, aisles, shelves, order sizes                  |
| `warehouse-generator.js` | The engine: builds the big warehouse from the blocks + config, then generates orders from it    |

## How it works

1. `config.js` sets the scale, e.g. "1,200–2,500 SKUs, 6–14 aisles,
   15–35 shelves per aisle".
2. `warehouse-generator.js` takes the transcribed real items as a mandatory
   base and fills the rest by recombining real brands with real product
   types from `nomenclature-parts.js`. Each brand name, product phrase and
   pack size comes from a real sheet; only the *combinations* are new.
   Each item gets a location (`007-014` style) and an article number in the
   real 8/11-digit format.
3. The warehouse stays fixed for the session: the same location holds the
   same item until you restart the demo, like on the real sheets.
4. An order is a random subset of the warehouse with realistic quantities:
   mostly 1–5 pieces with occasional big lines, the same distribution as
   the photographed sheets.

One exception to the randomness: the demo's headline order is the real
photographed list (Wave 2, Store 7810: 18 lines, 105 colli), reproduced
exactly, every time.

## Changing the scale

Edit the numbers in `config.js`, save, and reload the page.

The generator widens aisles when the SKU count needs more room, so
`aisles`/`shelvesPerAisle` shape the floor rather than cap it. The real
ceiling is the combinatorics of `nomenclature-parts.js`: brands × types ×
sizes, about 4,000 chilled SKUs with the current file. If you ask
`config.js` for more than that, the generator returns the maximum it can
build. Add more brands, types or sizes to `nomenclature-parts.js` to raise
the ceiling.

## Editing by hand

- Add a transcribed item: append a `["location","article","description"]`
  row to `catalog-chilled-a.js`, or drop in a `catalog-chilled-b.js` and
  the pages pick it up.
- Add a store number: append it to `REAL_STORES` in `stores.js`.
- Change order sizes or the dry/chilled mix: `config.js`.

All files are plain JavaScript arrays/objects loaded via
`<script src="data/...">` tags, so `demo.html` still opens from a double
click, no server needed. If the folder is missing (the demo file got copied
around alone), `demo.html` falls back to its built-in static seed.
