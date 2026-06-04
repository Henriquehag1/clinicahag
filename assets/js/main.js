/* =====================================================================
   MÉTODO HAG — interações mínimas
   ---------------------------------------------------------------------
   Mantido enxuto de propósito (meta Lighthouse 95+). A revelação no
   carregamento é 100% CSS; aqui só tratamos a navegação mobile e o ano
   do rodapé. Tudo é "progressive enhancement": sem JS, o conteúdo e a
   navegação continuam funcionando.
   ===================================================================== */
(function () {
  "use strict";

  /* --- Navegação mobile (abre/fecha o menu) --- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.dataset.open = open ? "true" : "false";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      // trava o scroll do corpo enquanto o menu está aberto
      document.body.style.overflow = open ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      setOpen(nav.dataset.open !== "true");
    });

    // fecha ao clicar num link da navegação
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // fecha com a tecla Esc
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.dataset.open === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // reseta o estado ao voltar para o desktop
    var mq = window.matchMedia("(min-width: 56.0625rem)");
    var handleMq = function () {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener ? mq.addEventListener("change", handleMq)
                        : mq.addListener(handleMq);
  }

  /* --- Ano corrente no rodapé --- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
