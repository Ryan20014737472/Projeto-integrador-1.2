/* Aplicado antes da pintura para evitar flashes de tema. Sem cookies ou rastreamento. */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.replace('no-js', 'js');
  const padrao = { contraste: false, dislexia: false, espaco: false,
    movimento: window.matchMedia('(prefers-reduced-motion: reduce)').matches, tamanho: 100 };
  let salvo = {};
  try { salvo = JSON.parse(localStorage.getItem('sol-agua-leitura') || '{}') || {}; } catch (_) { /* Armazenamento opcional. */ }
  const prefs = { ...padrao };
  for (const chave of ['contraste', 'dislexia', 'espaco', 'movimento']) {
    if (typeof salvo[chave] === 'boolean') prefs[chave] = salvo[chave];
  }
  if (Number.isFinite(salvo.tamanho)) prefs.tamanho = Math.min(150, Math.max(90, salvo.tamanho));
  function aplicar() {
    root.dataset.theme = prefs.contraste ? 'contrast' : 'light';
    root.dataset.font = prefs.dislexia ? 'dyslexic' : 'standard';
    root.dataset.spacing = prefs.espaco ? 'wide' : 'standard';
    root.dataset.reducedMotion = String(prefs.movimento);
    root.style.setProperty('--reading-size', `${prefs.tamanho}%`);
    try { localStorage.setItem('sol-agua-leitura', JSON.stringify(prefs)); } catch (_) { /* Continua sem armazenamento. */ }
  }
  window.LeituraSolAgua = { prefs, padrao, aplicar };
  aplicar();
})();

