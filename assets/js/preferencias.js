/* Aplicado antes da pintura para evitar flashes de tema. Sem cookies ou rastreamento. */
(function () {
  'use strict';
  const root = document.documentElement;
  root.classList.replace('no-js', 'js');
  const mediaMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const limitesTamanho = Object.freeze({ minimo: 90, maximo: 200, passo: 10 });
  const padrao = { contraste: false, dislexia: false, espaco: false,
    movimento: mediaMovimento.matches, pausado: false, tamanho: 100 };
  let salvo = {};
  try { salvo = JSON.parse(localStorage.getItem('sol-agua-leitura') || '{}') || {}; } catch (_) { /* Armazenamento opcional. */ }
  const prefs = { ...padrao };
  for (const chave of ['contraste', 'dislexia', 'espaco', 'movimento', 'pausado']) {
    if (typeof salvo[chave] === 'boolean') prefs[chave] = salvo[chave];
  }
  if (Number.isFinite(salvo.tamanho)) prefs.tamanho = Math.min(limitesTamanho.maximo, Math.max(limitesTamanho.minimo, salvo.tamanho));
  function movimentosReduzidos() { return prefs.movimento || mediaMovimento.matches; }
  function aplicar() {
    root.dataset.theme = prefs.contraste ? 'contrast' : 'light';
    root.dataset.font = prefs.dislexia ? 'dyslexic' : 'standard';
    root.dataset.spacing = prefs.espaco ? 'wide' : 'standard';
    root.dataset.reducedMotion = String(movimentosReduzidos());
    root.dataset.paused = String(prefs.pausado);
    root.style.setProperty('--reading-size', `${prefs.tamanho}%`);
    try { localStorage.setItem('sol-agua-leitura', JSON.stringify(prefs)); } catch (_) { /* Continua sem armazenamento. */ }
  }
  window.LeituraSolAgua = { prefs, padrao, aplicar, movimentosReduzidos, mediaMovimento, limitesTamanho };
  aplicar();
})();

