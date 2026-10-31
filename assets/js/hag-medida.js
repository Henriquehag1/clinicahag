/* HAG_SITE_MEDICAO_v1 (31/10/2026) · Medição própria do site
   PORQUE: o site não tinha medição de visitas, só a conversão do Google Ads e
   o pixel da Meta. Este arquivo manda para o HAG OS, sem cookie e sem nada que
   identifique a pessoa: a página, de onde a visita veio (Google, Instagram,
   ChatGPT...), o tipo de aparelho e o clique no WhatsApp. A sessão é um número
   aleatório guardado só nesta aba (sessionStorage) e some quando ela fecha.
   Nunca atrapalha a página: qualquer erro aqui é engolido. */
(function () {
  'use strict';
  var URL_FN = 'https://yutcnphwovqeiwcwzzhs.supabase.co/functions/v1/hag-site-visita';
  var host = window.location.hostname;
  var teste = window.HAG_MEDIDA_TESTE === true;
  if (!teste && !/(^|\.)clinicahag\.com$/.test(host)) return;
  if (navigator.webdriver && !teste) return;

  function ss(k, v) {
    try {
      if (v === undefined) return window.sessionStorage.getItem(k);
      window.sessionStorage.setItem(k, v);
    } catch (e) { return null; }
    return v;
  }

  var sessao = ss('hag_s');
  if (!sessao) {
    sessao = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 16);
    ss('hag_s', sessao);
  }

  /* A origem é a da ENTRADA na sessão: quem chega pelo Google e navega para
     a página Atendimento continua contando como Google. */
  var refHost = '';
  try { refHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
  var externo = refHost && !/(^|\.)clinicahag\.com$/.test(refHost);
  if (ss('hag_ref') === null || externo) ss('hag_ref', externo ? refHost : '');

  var cmp = {};
  try {
    var q = new URLSearchParams(window.location.search);
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) cmp.gclid = true;
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
      var v = q.get(k); if (v) cmp[k] = v.slice(0, 60);
    });
    if (Object.keys(cmp).length) ss('hag_cmp', JSON.stringify(cmp));
    else cmp = JSON.parse(ss('hag_cmp') || '{}');
  } catch (e) { cmp = {}; }

  function aparelho() {
    var w = Math.min(window.screen ? window.screen.width : 9999, window.innerWidth || 9999);
    var toque = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (toque && w < 768) return 'celular';
    if (toque) return 'tablet';
    return 'computador';
  }

  function envia(evento, rotulo) {
    try {
      var corpo = {
        evento: evento,
        pagina: window.location.pathname || '/',
        ref: ss('hag_ref') || '',
        disp: aparelho(),
        s: sessao
      };
      for (var k in cmp) corpo[k] = cmp[k];
      if (rotulo) corpo.rotulo = rotulo;
      var txt = JSON.stringify(corpo);
      if (navigator.sendBeacon && navigator.sendBeacon(URL_FN, txt)) return;
      fetch(URL_FN, { method: 'POST', body: txt, keepalive: true, mode: 'no-cors' }).catch(function () {});
    } catch (e) { /* medição nunca derruba a página */ }
  }
  window.__hagMedidaEnvia = envia;

  envia('visita');

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a || !/(?:^|\/\/)(?:api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)/.test(a.href)) return;
    var rotulo = a.classList.contains('wa-fixo') ? 'botão fixo do celular'
      : (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    envia('whatsapp', rotulo.replace(/[^\p{L}\p{N} .,:\-]/gu, ''));
  }, true);
})();
