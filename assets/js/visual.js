/* Interações visuais progressivas. O texto e a navegação funcionam sem este arquivo. */
(function () {
  'use strict';
  const root = document.documentElement;
  const movimentoReduzido = () => root.dataset.reducedMotion === 'true'
    || root.dataset.paused === 'true'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cena = document.querySelector('[data-pool-scene]');
  if (cena) {
    const legendas = {
      captar: 'O coletor recebe a radiação solar e transfere calor para a água.',
      circular: 'A bomba faz a água passar pelo coletor e retornar à piscina. Os traços mostram os dois trajetos.',
      conservar: 'Uma cobertura reduz a evaporação e ajuda a conservar o calor. No simulador, você escolhe por quantas horas ela é usada.'
    };
    cena.querySelectorAll('[data-scene-stage]').forEach(button => {
      button.addEventListener('click', () => {
        const etapa = button.dataset.sceneStage;
        cena.dataset.stage = etapa;
        cena.querySelectorAll('[data-scene-stage]').forEach(control => {
          control.setAttribute('aria-pressed', String(control === button));
        });
        document.getElementById('paisagem-legenda').textContent = legendas[etapa];
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const entradas = new IntersectionObserver(items => {
      items.forEach(item => {
        if (!item.isIntersecting) return;
        if (!movimentoReduzido()) item.target.classList.add('is-revealed');
        entradas.unobserve(item.target);
      });
    }, {threshold: .12});
    document.querySelectorAll('[data-reveal]').forEach(element => entradas.observe(element));

    const links = [...document.querySelectorAll('.local-nav a[href^="#"]')];
    const secoes = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
    if (secoes.length) {
      const indice = new IntersectionObserver(items => {
        const atual = items.find(item => item.isIntersecting);
        if (!atual) return;
        links.forEach(link => {
          if (link.hash === `#${atual.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, {rootMargin: '-18% 0px -58% 0px'});
      secoes.forEach(section => indice.observe(section));
    }
  }

  const progresso = document.querySelector('[data-reading-progress]');
  if (progresso) {
    let agendada = false;
    function atualizarProgresso() {
      const altura = root.scrollHeight - window.innerHeight;
      const fracao = altura > 0 ? Math.min(1, Math.max(0, window.scrollY / altura)) : 0;
      progresso.style.transform = `scaleX(${fracao})`;
      agendada = false;
    }
    function agendarProgresso() {
      if (agendada) return;
      agendada = true;
      window.requestAnimationFrame(atualizarProgresso);
    }
    window.addEventListener('scroll', agendarProgresso, {passive: true});
    window.addEventListener('resize', agendarProgresso, {passive: true});
    atualizarProgresso();
  }
})();
