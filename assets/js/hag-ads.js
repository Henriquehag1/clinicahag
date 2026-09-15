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

  /* HAG_ORIGEM_ANUNCIO_v1 (15/09/2026)
     PORQUE: quem clica no anuncio do Google cai no site, e o botao do site
     manda a frase "vim pelo site". O lead pago chegava no WhatsApp com cara
     de trafego organico, e a campanha aparecia com menos resultado do que
     tem, justamente agora que ela gasta todo dia util.
     O Google marca a visita vinda de anuncio com gclid, gbraid ou wbraid na
     URL, quando a marcacao automatica esta ligada na conta. Guardamos isso
     por 30 dias, a mesma janela de atribuicao da campanha, e trocamos apenas
     a frase generica do site. Frases de tema, do Instagram e do checklist
     ficam como estao, porque dizem mais do que "veio do Google".
     Sem cookie, sem dado da pessoa: so a marca de que a visita veio de
     anuncio, no proprio navegador dela. */
  var CHAVE_ADS = 'hag_origem_anuncio';
  var JANELA_ADS = 30 * 24 * 60 * 60 * 1000;
  var FRASE_SITE = encodeURIComponent('vim pelo site');
  var FRASE_ADS = encodeURIComponent('vim do an\u00fancio do Google');

  function guardaSeVeioDeAnuncio() {
    try {
      var q = new URLSearchParams(window.location.search);
      var pago = q.get('gclid') || q.get('gbraid') || q.get('wbraid') ||
        (q.get('utm_source') === 'google' && q.get('utm_medium') === 'cpc');
      if (pago) window.localStorage.setItem(CHAVE_ADS, String(Date.now()));
    } catch (e) { /* navegador sem armazenamento: segue sem marcar */ }
  }

  function veioDeAnuncio() {
    try {
      var t = parseInt(window.localStorage.getItem(CHAVE_ADS), 10);
      return !!t && (Date.now() - t) < JANELA_ADS;
    } catch (e) { return false; }
  }

  function trocaFrase(link) {
    if (!link || !ehWhatsApp(link.href)) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf(FRASE_SITE) === -1) return;
    link.setAttribute('href', href.replace(FRASE_SITE, FRASE_ADS));
  }

  function marcaLinksDoSite() {
    if (!veioDeAnuncio()) return;
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) trocaFrase(links[i]);
  }

  guardaSeVeioDeAnuncio();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', marcaLinksDoSite);
  } else {
    marcaLinksDoSite();
  }

  document.addEventListener('click', function (ev) {
    var alvo = ev.target;
    var link = alvo && alvo.closest ? alvo.closest('a') : null;
    if (!link || !ehWhatsApp(link.href)) return;
    /* HAG_ORIGEM_ANUNCIO_v1: rede de seguranca, caso o link tenha entrado na
       pagina depois da varredura inicial. Roda na fase de captura, antes da
       navegacao, entao o href trocado e o que o navegador usa. */
    if (veioDeAnuncio()) trocaFrase(link);
    try {
      window.gtag('event', 'conversion', { send_to: CONVERSAO });
    } catch (e) { /* silencioso, nunca atrapalha o clique */ }
    try {
      window.fbq('track', 'Contact');
    } catch (e) { /* silencioso, nunca atrapalha o clique */ }
  }, true);
})();
