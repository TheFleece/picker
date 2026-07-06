// ============================================================================
// NOMENCLATURE PARTS — the real building blocks the synthesizer recombines.
// Every brand name, product phrase, size, and article-number prefix below
// was read off an actual photographed CSPOT picking list. Nothing here is
// invented; what IS synthetic is the *combination* (e.g. pairing a real
// cheese brand with a real cheese descriptor it wasn't photographed with) —
// see data/README.md for what that means and why it's honest for demo data.
//
// Grouped by category so recombination stays sensible (a cheese brand only
// ever gets paired with a cheese descriptor, never with a beer descriptor).
// Add a brand or descriptor to grow the pool — nothing else needs to change.
// ============================================================================

// SPOT CHILLED categories.
const CHILLED_CATEGORIES = [
  {
    key: "cheese",
    brands: [
      "KLOVBORG",
      "KK",
      "LA CAMPAGNA",
      "ARLA",
      "SPOT ON",
      "SØHØJLAND",
      "H.C. ANDERSEN",
      "CASTELLO",
      "PHILADELPHIA",
      "PRESIDENT",
      "CMT",
      "GRØNNELUND",
      "ALLANS GULD",
      "CHEASY",
      "BORNHOLMS A.MEJERI",
      "ØKOLANDET",
      "ATHENA",
      "NORA",
      "PORT SALUT",
      "LØGISMOSE",
    ],
    descriptors: [
      "SKÆREOST 45+ ML",
      "RØD REVET CHEDDAR",
      "REVET GOUDA",
      "SKÆREOST 60+ HAVARTI",
      "REVET MEXI-MIX",
      "SLICED BUR/OST ØKO",
      "REVET GRATINERINGSMIX",
      "SKIVEOST ML",
      "HARD HAVARTI JALAPENO",
      "HÅRD MATURE CHEDDAR",
      "CREAM C. GARLIC",
      "FLØDEOST LIGHT",
      "BRIE 60+ INTENSE",
      "HÅRD EXTRA MATURE",
      "BRIE 62+ LE BRIE",
      "HÅRD AGED GOUDA",
      "HÅRD 27% LAGRET 4UGER",
      "FLØDEOST ORIGINAL",
      "SKÆREOST 30+ HAVARTI",
      "GRILLCHEESE",
      "REVET ØKO MOZZARELLA",
      "RYGEOST ORG 10%",
      "CREAM CHEESE M. LABNEH",
      "SLICED CHEESE HAV",
      "REVET CHEDDAR 32%",
      "SKIMMEL 40+ I STYKKER",
      "HÅRD AGED HAVARTI",
    ],
    sizes: ["150G", "175G", "200G", "300G", "400G", "135G"],
    articlePrefixes: ["10", "11", "88", "89", "96"],
  },
  {
    key: "meat",
    brands: ["LANGELÆNDER", "LAMPE CHEESE", "STEFF HOULBERG", "JENSENS", "STF"],
    descriptors: [
      "GRILLPØLSER",
      "BBQ FRANKFURTER",
      "SPARERIBS SOUS VIDE",
      "PULLED PORK",
      "FRANKFURTER (LX6)",
    ],
    sizes: ["500G", "800G", "875G", "1400G"],
    articlePrefixes: ["10", "11", "70"],
  },
  {
    key: "seafood",
    brands: ["LAUNIS", "SKAGEN FOOD", "POLAR", "POLAR SEAFOOD", "FWY"],
    descriptors: [
      "ISHAVSREJER MSC",
      "VARMRØGET LAKS",
      "HALEHÆNGT ØRRED",
      "RØGET DANSK LAKS",
      "REJER I LAGE",
      "VERTIKAL SKÅRET LAKS NATUR",
      "VERTIKAL SKÅRET LAKS DILD",
    ],
    sizes: ["100G", "350G", "650G"],
    articlePrefixes: ["10", "11"],
  },
  {
    key: "dairy",
    brands: [
      "LØGISMOSE",
      "DANONINO",
      "A-BALANCE",
      "EGELYKKE",
      "PROTEIN LAB",
      "ACTIMEL",
    ],
    descriptors: [
      "SKYR ÆBLE RABARBER",
      "VANILJE POUCH",
      "GRÆSK INSP SOL/ARONI",
      "ØKO SKYR MAN/PAS",
      "SKYR JORDBÆR/RABARBER",
      "SKYR PÆRE/BANAN ØKO",
      "DRIKKEYOG FERSKEN/MANGO",
      "DRIKKEYOG CITRON/LIME",
      "DRIKKEYOGHURT BLÅBÆR",
      "DRIKKEYOG PÆRE/BANAN",
      "KIDS STRAWBERRY-BANANA",
      "JORDBÆR 8X100G",
      "SKOVBÆR 8X100G",
      "DRIKKE JORDBÆR",
      "DRINKING VANILJE",
    ],
    sizes: ["70G", "100G", "200G", "300G"],
    articlePrefixes: ["10", "11", "93"],
  },
  {
    key: "dessert",
    brands: ["OREO", "SOLO ITALIA", "MILKA", "MUNCHMALLOW", "DR. OETKER"],
    descriptors: [
      "FRESH MILK-SNACK",
      "TIRAMISU (LX16)",
      "CHEESECAKE RASPBERRY",
      "CHEESECAKE LEMON",
      "CHOCO SNACK",
      "SNITTE",
      "BUDDING KAKAO",
      "MOUSSE VANILJE",
      "VANILLAMOUSSE",
      "PAULA CHOCO BUDDING",
    ],
    sizes: ["27G", "80G", "100G", "200G"],
    articlePrefixes: ["10", "11"],
  },
  {
    key: "readyMeal",
    brands: ["SALATMESTEREN", "RANA", "BERTAGNI", "FLENSTED"],
    descriptors: [
      "COLESLAW",
      "RAVIOLI TOMAT/MOZZARELLA",
      "RAVIOLI PESTO GENOVESE",
      "GIRASOLI RICOTTA/SPINAT",
      "OLES KARTOFFELSALAT",
    ],
    sizes: ["400G", "400GR"],
    articlePrefixes: ["10", "11"],
  },
  {
    key: "juice",
    brands: ["INNOCENT"],
    descriptors: ["ANANAS & JORDBÆR JUICE", "ÆBLE JUICE"],
    sizes: ["900ML"],
    articlePrefixes: ["10", "87"],
  },
];

// DRY/ODD SIZE - NEW PALLET categories — kept smaller & pool-based (see
// warehouse-generator.js): real "new pallet" waves don't have a fixed
// location per article the way chilled shelves do.
const DRY_CATEGORIES = [
  {
    key: "beer",
    brands: ["ANARKIST"],
    descriptors: ["HAZY IPA 0,5%", "NEW ENGLAND IPA"],
    sizes: ["44CL CAN", "44 CL"],
    articlePrefixes: ["10"],
  },
  {
    key: "cleaning",
    brands: ["ULTRA CLEAN"],
    descriptors: ["BIL SVAMPE 3 STK.", "SPRAY MOPPE"],
    sizes: [""],
    articlePrefixes: ["11"],
  },
  {
    key: "oil",
    brands: ["LE TERRAZZE", "TERRADELYSSA", "DANSK KOLDPRESSET"],
    descriptors: ["POMACE OLIVE OIL", "EXTRAVIRGIN OLIVE OIL", "RAPSOLIE"],
    sizes: ["1L", "500ML"],
    articlePrefixes: ["10", "88"],
  },
  {
    key: "seasoning",
    brands: ["AJINOMOTO"],
    descriptors: ["MSG SODIUM GLUTAMATE"],
    sizes: [""],
    articlePrefixes: ["11"],
  },
  {
    key: "seasonalMerch",
    brands: ["S2526", "S2626", "S2726", "S2226"],
    descriptors: [
      "GULVVENTILATOR UDEN BLAD",
      "PICNIC BORD 2 ASS. DESIGN",
      "ARBEJDSREOL MED 4 HYLDER",
      "UDENDØRS SANSELEGETØJ",
      "FARVEDE GLASBEHOLDERE",
      "OUTDOOR TOYS (MX6)",
      "KUNSTIG BUSK 35 DIA (MX2)",
      "SOLBRILLER, LICENS (MX7)",
      "BIO PEJS - 2 VARIANTER",
    ],
    sizes: [""],
    articlePrefixes: ["11"],
  },
];
