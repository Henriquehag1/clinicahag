/* Medição de conversão · Clínica HAG
   Carrega a tag do Google e o pixel da Meta, e registra uma conversão em
   ambos quando alguém clica em qualquer link de WhatsApp do site.
   Não altera a navegação: o link abre normalmente.

   HAG_PIXEL_META_v1 (15/09/2026). PORQUE: o pixel foi criado em 15/09 para
   construir publico de remarketing enquanto a campanha do Google roda. Ele
   registra visita de pagina e clique no WhatsApp, e nada de saude da pessoa.
   Nao ha Conversions API: so navegador, de proposito. */
(function () {
  var TAG = 'AW-16754060976';
  var CONVERSAO = 'AW-16754060976/CY1WCKW22fgcELDd-rQ-';
  var PIXEL = '1261600872759410';

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

  /* Pixel da Meta, codigo base oficial. */
  (function (f, b, e, v, n, t, s2) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = true;
    t.src = 'https://connect.facebook.net/en_US/fbevents.js';
    s2 = b.getElementsByTagName(e)[0];
    s2.parentNode.insertBefore(t, s2);
  })(window, document, 'script');
  window.fbq('init', PIXEL);
  window.fbq('track', 'PageView');

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
    try {
      window.fbq('track', 'Contact');
    } catch (e) { /* silencioso, nunca atrapalha o clique */ }
  }, true);
})();
