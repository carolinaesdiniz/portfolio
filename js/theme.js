/* ==========================================================
   Ponto — light / dark theme
   Loaded in <head>, before the CSS paints, so there is no flash.
   Default: follows the system. The header button sets an explicit
   choice, kept on this device. Tokens react to [data-theme];
   <picture> sources written for the system theme follow the choice.
   ========================================================== */
(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");

  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) { return null; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* private mode: choice lasts for this page */ }
  }
  function current() {
    return root.getAttribute("data-theme") || saved() || (system.matches ? "dark" : "light");
  }

  /* Images with a dark variant are written as
     <source srcset="…-dark.webp" media="(prefers-color-scheme: dark)">.
     Point that media query at the chosen theme instead of the system. */
  function syncPictures(theme) {
    document.querySelectorAll("picture source[media], picture source[data-scheme]").forEach(function (s) {
      var m = s.getAttribute("data-scheme");
      if (!m) {
        var media = s.getAttribute("media") || "";
        if (media.indexOf("prefers-color-scheme") === -1) return;
        m = media.indexOf("dark") !== -1 ? "dark" : "light";
        s.setAttribute("data-scheme", m);
      }
      s.setAttribute("media", m === theme ? "all" : "not all");
    });
  }

  /* The switch shows an icon and the name of the theme it switches to.
     The label is written here, so pages whose markup has no label
     (the encrypted case) get it too. */
  function syncButtons(theme) {
    var next = theme === "dark" ? "light" : "dark";
    document.querySelectorAll(".theme-toggle").forEach(function (b) {
      var label = b.querySelector(".theme-label");
      if (!label) {
        label = document.createElement("span");
        label.className = "theme-label";
        b.appendChild(label);
      }
      label.textContent = next === "dark" ? "Dark" : "Light";
      b.setAttribute("aria-label", "Switch to " + next + " theme");
      b.removeAttribute("title");
    });
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    syncPictures(theme);
    syncButtons(theme);
  }

  root.classList.add("has-js");
  root.setAttribute("data-theme", saved() || (system.matches ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", function () { apply(current()); });

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".theme-toggle");
    if (!b) return;
    var next = current() === "dark" ? "light" : "dark";
    save(next);
    apply(next);
  });

  /* No explicit choice yet: keep following the system */
  function onSystem() { if (!saved()) apply(system.matches ? "dark" : "light"); }
  if (system.addEventListener) system.addEventListener("change", onSystem);
  else if (system.addListener) system.addListener(onSystem);
})();
