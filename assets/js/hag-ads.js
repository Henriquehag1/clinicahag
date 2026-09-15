/* Medição de conversão do Google Ads · Clínica HAG
   Carrega a tag do Google e registra uma conversão quando alguém
   clica em qualquer link de WhatsApp do site.
   Não altera a navegação: o link abre normalmente. */
(function () {
  var TAG = 'AW-16754060976';
  var CONVERSAO = 'AW-16754060976/CY1WCKW22fgcELDd-rQ-';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG;
  (document.head || document.documentElement).appendChild(s);

  window.gtag('js', new Date());
  window.gtag('config', TAG);

  function ehWhatsApp(href) {
    return /(?:^|\/\/)(?:api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)/.test(href || '');
  }

  document.addEventListener('click', function (ev) {
    var alvo = ev.target;
    var link = alvo && alvo.closest ? alvo.closest('a') : null;
    if (!link || !ehWhatsApp(link.href)) return;
    try {
      window.gtag('event', 'conversion', { send_to: CONVERSAO });
    } catch (e) { /* silencioso, nunca atrapalha o clique */ }
  }, true);
})();
