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

/* HAG_WHATS_FIXO_v1 (31/10/2026)
   PORQUE: no celular o botão "Falar com a equipe" some quando a pessoa rola a
   página, e o menu fica fechado atrás do ícone. Um botão fixo no rodapé da
   tela, só no celular, aparece depois que o primeiro botão sai de vista.
   Ele reusa o link de WhatsApp da própria página, então a frase de origem
   ("vim do conteúdo sobre...") continua a mesma e a medição de conversão
   (hag-ads.js) e a do HAG OS (hag-medida.js) contam o clique normalmente. */
(function () {
  "use strict";
  if (document.querySelector(".wa-fixo") || document.body.hasAttribute("data-sem-wa-fixo")) return;
  var base = document.querySelector("main a[href*='wa.me']") || document.querySelector("a[href*='wa.me']");
  if (!base) return;
  var a = document.createElement("a");
  a.className = "wa-fixo";
  a.href = base.getAttribute("href");
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Falar com a equipe pelo WhatsApp");
  a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z"/></svg><span>Falar com a equipe</span>';
  document.body.appendChild(a);
  document.body.classList.add("tem-wa-fixo");

  /* Aparece depois de rolar e some enquanto outro botão de WhatsApp da
     página estiver à vista, para nunca haver dois iguais na tela. */
  var visiveis = 0;
  var atualiza = function () {
    a.classList.toggle("is-on", visiveis === 0 && (window.scrollY || 0) > (window.innerHeight || 600) * 0.6);
  };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !e.target.__hagVis) { e.target.__hagVis = true; visiveis++; }
        else if (!e.isIntersecting && e.target.__hagVis) { e.target.__hagVis = false; visiveis--; }
      });
      atualiza();
    }, { rootMargin: "-90px 0px 0px 0px" });
    Array.prototype.forEach.call(document.querySelectorAll("a[href*='wa.me']"), function (l) {
      if (l !== a && !l.closest("header")) io.observe(l);
    });
  }
  window.addEventListener("scroll", atualiza, { passive: true });
  atualiza();
})();
