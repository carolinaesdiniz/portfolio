/* ==========================================================
   Ponto — glyph component
   Renders a 4×4 glyph as an SVG with a viewBox.

   Markup:
     <span data-glyph="organizing-payments" data-size="l" data-draw></span>

   Sizes (cell / gap / total):
     xs    3 / 1 / 15   list marker, favicon
     s     7 / 2 / 34   project list, navigation
     l    18 / 4 / 84   top of a case page
     hero 32 / 8 / 152  personal glyph on the home page
   ========================================================== */

(function () {
  var P = window.PONTO;
  var NS = "http://www.w3.org/2000/svg";

  var SIZES = {
    xs:   { cell: 3,  gap: 1 },
    s:    { cell: 7,  gap: 2 },
    l:    { cell: 18, gap: 4 },
    hero: { cell: 32, gap: 8 }
  };

  function cellState(level, col) {
    if (col >= level) return "empty";
    return level >= P.leadLevel ? "accent" : "ink";
  }

  function accentCount(rows) {
    return rows.reduce(function (n, lv) { return n + (lv >= P.leadLevel ? lv : 0); }, 0);
  }

  /* Written reading of the glyph, used as aria-label */
  function describe(id) {
    var g = P.glyphs[id];
    if (g.empty) return "Empty glyph: no project and no work at this address.";
    var lead = g.personal ? "How Carol works. " : g.name + ", Carol's role. ";
    return lead + g.rows.map(function (lv, i) {
      return P.phases[i] + ": " + P.levels[lv] + ", " + lv + " of 4";
    }).join(". ") + ".";
  }

  function build(id, sizeName, opts) {
    opts = opts || {};
    var g = P.glyphs[id];
    if (!g) throw new Error("Unknown glyph: " + id);
    var size = SIZES[sizeName];
    if (!size) throw new Error("Unknown glyph size: " + sizeName);

    if (accentCount(g.rows) > P.maxAccent) {
      console.warn("[ponto] " + id + " has more than 50% accent cells");
    }

    var total = size.cell * 4 + size.gap * 3;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + total + " " + total);
    svg.setAttribute("width", total);
    svg.setAttribute("height", total);
    svg.setAttribute("class", "glyph glyph--" + sizeName + (opts.draw ? " glyph--draw" : ""));
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", describe(id));
    svg.setAttribute("focusable", "false");

    var i = 0;
    g.rows.forEach(function (level, row) {
      for (var col = 0; col < 4; col++) {
        var state = cellState(level, col);
        var x = col * (size.cell + size.gap);
        var y = row * (size.cell + size.gap);
        var r = document.createElementNS(NS, "rect");
        if (state === "empty") {
          /* 1px outline drawn inside the cell so the total stays exact */
          r.setAttribute("x", x + 0.5);
          r.setAttribute("y", y + 0.5);
          r.setAttribute("width", size.cell - 1);
          r.setAttribute("height", size.cell - 1);
        } else {
          r.setAttribute("x", x);
          r.setAttribute("y", y);
          r.setAttribute("width", size.cell);
          r.setAttribute("height", size.cell);
        }
        r.setAttribute("class", "c-" + state);
        r.style.setProperty("--i", i++);
        svg.appendChild(r);
      }
    });
    return svg;
  }

  function mount(el) {
    var svg = build(el.getAttribute("data-glyph"), el.getAttribute("data-size") || "s", {
      draw: el.hasAttribute("data-draw")
    });
    el.replaceChildren(svg);
    return svg;
  }

  function mountAll(root) {
    (root || document).querySelectorAll("[data-glyph]").forEach(mount);
  }

  P.glyph = { build: build, mount: mount, mountAll: mountAll, describe: describe,
              accentCount: accentCount, sizes: SIZES };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { mountAll(); });
  } else {
    mountAll();
  }
})();
