/* =====================================================================
   MÉTODO HAG — camada de movimento (v2 "luxo tech")
   ---------------------------------------------------------------------
   Vanilla, sem dependências. Tudo em transform/opacity.
   - Revelação orquestrada no scroll (IntersectionObserver)
   - Parallax sutil (somente desktop, rAF, só transform)
   - Navegação mobile + ano do rodapé
   Respeita prefers-reduced-motion (desliga animações).
   Progressive enhancement: sem JS, todo o conteúdo aparece normalmente.
   ===================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navegação mobile ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.dataset.open = open ? "true" : "false";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(nav.dataset.open !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.dataset.open === "true") { setOpen(false); toggle.focus(); }
    });
    var mqDesktop = window.matchMedia("(min-width: 56.0625rem)");
    var onMq = function () { if (mqDesktop.matches) setOpen(false); };
    mqDesktop.addEventListener ? mqDesktop.addEventListener("change", onMq) : mqDesktop.addListener(onMq);
  }

  /* ---------- Ano do rodapé ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Revelação orquestrada (IntersectionObserver) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      // sem movimento: mostra tudo de imediato
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Parallax sutil (desktop, só transform) ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var canParallax = !reduce && window.matchMedia("(min-width: 48rem)").matches;

  if (parallaxEls.length && canParallax) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue; // fora da tela: ignora
        var delta = (rect.top + rect.height / 2) - vh / 2;
        var y = Math.max(-40, Math.min(40, -delta * speed)); // clamp ±40px
        el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      }
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }
})();
