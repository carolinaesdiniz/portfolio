/* ==========================================================
   Ponto — annotated screens
   Links each numbered mark, its region on the screen and its note.
   Large screens: every note is visible; pointing at a mark or a note
   outlines its region and quiets the other notes.
   Small screens (≤ 640px): one note at a time, first one open;
   tapping a mark shows its note.
   ========================================================== */
(function () {
  var small = window.matchMedia("(max-width: 640px)");

  function setup(fig) {
    var parts = fig.querySelectorAll("[data-n]");
    var marks = fig.querySelectorAll("button.annot-mark");
    var notes = fig.querySelectorAll(".annot-notes li");
    var first = notes.length ? notes[0].getAttribute("data-n") : null;

    function activate(n) {
      fig.classList.toggle("has-active", n != null);
      parts.forEach(function (el) {
        var on = n != null && el.getAttribute("data-n") === String(n);
        el.classList.toggle("is-active", on);
        if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", String(on));
      });
    }

    function reset() { activate(small.matches ? first : null); }

    function hoverable(el) {
      var n = el.getAttribute("data-n");
      el.addEventListener("mouseenter", function () { if (!small.matches) activate(n); });
      el.addEventListener("mouseleave", function () { if (!small.matches) activate(null); });
      el.addEventListener("focus", function () { if (!small.matches) activate(n); });
      el.addEventListener("blur", function () { if (!small.matches) activate(null); });
    }
    marks.forEach(hoverable);
    notes.forEach(hoverable);

    marks.forEach(function (b) {
      b.addEventListener("click", function () {
        var n = b.getAttribute("data-n");
        if (small.matches) { activate(n); return; }
        /* large screens without hover (tablets): tap toggles */
        if (!window.matchMedia("(hover: hover)").matches) {
          activate(b.classList.contains("is-active") ? null : n);
        }
      });
    });

    reset();
    if (small.addEventListener) small.addEventListener("change", reset);
  }

  function init() { document.querySelectorAll(".annot").forEach(setup); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
