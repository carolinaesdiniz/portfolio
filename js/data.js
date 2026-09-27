/* ==========================================================
   Ponto — glyph data
   One glyph per project, defined once, used everywhere.
   Source: glifos-cases.md + decisions of 2026-09-23.
   ========================================================== */

window.PONTO = window.PONTO || {};

/* Rows, top to bottom */
PONTO.phases = [
  "Research and discovery",
  "Definition and strategy",
  "Design and systems",
  "Delivery and measurement"
];

/* Depth per row, 0–4, filled left to right */
PONTO.levels = {
  0: "did not work on this phase",
  1: "took a small part",
  2: "shared the work",
  3: "led, with input from others",
  4: "led with full autonomy"
};

/* Decision (b): only level 4 cells are accent. Levels 1–3 are ink. */
PONTO.leadLevel = 4;

/* Rule from the spec: at most 50% of cells in accent */
PONTO.maxAccent = 8;

PONTO.glyphs = {
  "carol": {
    name: "Carolina Diniz",
    personal: true,
    rows: [2, 4, 4, 3]
  },
  "unrecognized-debts": {
    name: "Unrecognized Debts",
    meta: "serasa experian, 2023",
    rows: [4, 3, 2, 2]
  },
  "whatsapp-consent-journey": {
    name: "Consent & Invitation Journey via WhatsApp",
    meta: "sensorama design, 2025–2026",
    rows: [3, 4, 2, 3]
  },
  "not-found": {
    name: "Page not found",
    empty: true,
    rows: [0, 0, 0, 0]
  },
  "organizing-payments": {
    name: "Organizing Payments",
    meta: "serasa experian, 2023",
    rows: [1, 3, 2, 4]
  }
};
