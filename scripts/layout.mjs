import {emblemaPagina} from './ilustracoes.mjs';
export const baseUrl = 'https://ryan20014737472.github.io/Projeto-integrador-1.2/';
const caminhos = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  water: '<path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  flask: '<path d="M9 3h6M10 3v7l-6 9a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-6-9V3M7 16h10"/>',
  sliders: '<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/>',
  leaf: '<path d="M20 3C8 2 3 7 5 14s13 8 15-11Z"/><path d="M3 21 15 9"/>',
  access: '<circle cx="12" cy="4" r="2"/><path d="M4 9h16m-8-1v7m0-1-5 7m5-7 5 7"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  compare: '<path d="M3 4h7v16H3zM14 4h7v16h-7zM3 12h7m4-4h7m-7 8h7"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  cloud: '<path d="M5 18a4 4 0 0 1-1-8 7 7 0 0 1 13-2 5 5 0 0 1 1 10Z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 9h6v6H9z"/>',
  map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/>',
  hands: '<path d="M8 13V5a1.5 1.5 0 0 1 3 0v7M11 5V3a1.5 1.5 0 0 1 3 0v9m0-7a1.5 1.5 0 0 1 3 0v8m0-4a1.5 1.5 0 0 1 3 0v7c0 4-3 6-6 6h-1c-3 0-5-2-7-5l-2-3a1.5 1.5 0 0 1 2-2l2 1Z"/>',
  reset: '<path d="M3 10a9 9 0 1 1 1 8M3 3v7h7"/>',
  'arrow-up': '<path d="M6 18 18 6M6 6h12v12"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
};
export function icon(nome, classe = '') {
  return `<svg class="icon ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${caminhos[nome] || caminhos.info}</svg>`;
}
export function marca() {
  return `<a class="brand" href="index.html" aria-label="Sol e Água — início"><svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="28" cy="15" r="10" fill="var(--sun)"/><path d="M6 28q9-8 18 0t18 0M6 37q9-8 18 0t18 0" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M28 1v3m14 11h3M14 7l-2-2m28 0-2 2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><div><div class="brand-name">Sol <span>&amp;</span> Água</div><span class="brand-caption">PROJETO DA PISCINA</span></div></a>`;
}
export function ajustes() {
  return `<div class="size-row"><strong>Tamanho do texto</strong><div class="size-actions"><button type="button" class="size-button" data-size="-1" aria-label="Diminuir tamanho do texto">A−</button><span class="size-label" data-size-label>100%</span><button type="button" class="size-button" data-size="1" aria-label="Aumentar tamanho do texto">A+</button></div></div>
  <label class="switch-row"><span><strong>Alto contraste</strong><small>Fundo preto, texto branco e destaques amarelos.</small></span><input type="checkbox" data-setting="contraste"></label>
  <label class="switch-row"><span><strong>Fonte OpenDyslexic</strong><small>Uma opção de fonte para sua preferência de leitura.</small></span><input type="checkbox" data-setting="dislexia"></label>
  <label class="switch-row"><span><strong>Espaçamento ampliado</strong><small>Mais espaço entre letras, palavras e linhas.</small></span><input type="checkbox" data-setting="espaco"></label>
  <label class="switch-row"><span><strong>Reduzir movimentos</strong><small>Desativa animações e transições.</small></span><input type="checkbox" data-setting="movimento"></label>
  <div class="button-row"><button type="button" class="button button-secondary button-small" data-reset-reading>${icon('reset')}Restaurar ajustes</button></div>`;
}
export function diagrama(id = 'circuito', animacao = true) {
  return `<figure class="hero-diagram dark" data-diagram>
    <div class="diagram-top"><span>CIRCUITO SOLAR TÉRMICO</span><span class="diagram-badge">Diagrama didático</span></div>
    <svg class="pool-diagram" viewBox="0 0 600 380" role="img" aria-labelledby="${id}-titulo ${id}-desc">
      <title id="${id}-titulo">Como o Sol aquece a água da piscina</title>
      <desc id="${id}-desc">A bomba retira água da piscina e a envia ao coletor solar. A radiação aquece o coletor, que transfere calor à água. A água retorna à piscina. Linhas azuis representam o trajeto de ida; linhas amarelas, o retorno aquecido.</desc>
      <defs><pattern id="${id}-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#335269" stroke-width=".6" opacity=".5"/></pattern></defs>
      <rect x="8" y="12" width="584" height="355" rx="12" fill="url(#${id}-grid)"/>
      <g class="sun-rays" stroke="#ffcc4d" stroke-width="2.5" stroke-linecap="round"><path d="M493 19v9m0 72v9m-45-45h9m72 0h9m-77-32 6 6m52 52 6 6m-64 0 6-6m52-52 6-6"/></g>
      <circle cx="493" cy="64" r="27" fill="#ffcc4d"/>
      <text x="493" y="123" text-anchor="middle" fill="#ffdc7a" font-size="15" font-weight="700">Energia do Sol</text>
      <path d="m455 100-18 35m45-21-18 35" stroke="#ffcc4d" stroke-width="2" stroke-dasharray="5 6" class="thermal-pulse"/>
      <rect x="355" y="150" width="175" height="102" rx="10" fill="#234b61" stroke="#80c5d1" stroke-width="2"/>
      <path d="M372 167h140v15H372v16h140v16H372v18h140" fill="none" stroke="#ffcc4d" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="441" y="281" text-anchor="middle" fill="#e4f4f8" font-size="16" font-weight="700">Coletor solar</text>
      <path d="M304 297h53q22 0 22 22h57q18 0 18-18v-49" fill="none" stroke="#214f65" stroke-width="11" stroke-linecap="round"/>
      <path d="M304 297h53q22 0 22 22h57q18 0 18-18v-49" fill="none" stroke="#76d8e8" stroke-width="4" stroke-linecap="round" class="flow-line"/>
      <path d="M355 183h-43q-24 0-24-24v-41H168q-18 0-18 18v75" fill="none" stroke="#65582d" stroke-width="11" stroke-linecap="round"/>
      <path d="M355 183h-43q-24 0-24-24v-41H168q-18 0-18 18v75" fill="none" stroke="#ffcc4d" stroke-width="4" stroke-linecap="round" class="flow-line"/>
      <text x="210" y="98" text-anchor="middle" fill="#ffdc7a" font-size="14" font-weight="700">Retorno aquecido</text>
      <rect x="48" y="209" width="258" height="116" rx="17" fill="#b7e9ee"/>
      <rect x="56" y="217" width="242" height="100" rx="11" fill="#007c96"/>
      <path d="M75 241q18-10 36 0t36 0t36 0t36 0t36 0M75 270q18-10 36 0t36 0t36 0t36 0t36 0M75 299q18-10 36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#7ae1eb" stroke-width="2" opacity=".65"/>
      <rect x="104" y="247" width="145" height="38" rx="19" fill="#0b2638"/>
      <text x="176" y="272" text-anchor="middle" fill="#fff" font-size="17" font-weight="800">Piscina</text>
      <circle cx="397" cy="319" r="22" fill="#123247" stroke="#76d8e8" stroke-width="2"/>
      <path d="m390 309 17 10-17 10Z" fill="#76d8e8"/>
      <text x="397" y="363" text-anchor="middle" fill="#d6f4f8" font-size="15" font-weight="700">Bomba</text>
      <text x="178" y="353" text-anchor="middle" fill="#a5e4ee" font-size="14">Água em circulação</text>
    </svg>
    <div class="diagram-footer"><figcaption>A luz se transforma em calor; a circulação distribui esse calor na água.</figcaption>${animacao ? `<button type="button" class="diagram-control js-only" data-toggle-motion aria-pressed="false">${icon('pause')}<span data-motion-label>Pausar animação</span></button>` : ''}</div>
  </figure>`;
}
const nav = [['index.html','Início'],['projeto-piscina.html','O projeto'],['ciencia.html','Ciência'],['simuladores.html','Simuladores'],['comparativos.html','Comparativos'],['sustentabilidade.html','Sustentabilidade']];
export function cabecalho(pagina) {
  return `<a href="#conteudo" class="skip-link">Pular para o conteúdo</a>
  <div class="utility-bar" role="region" aria-label="Recursos de acesso"><div class="container utility-inner"><p>Energia solar · Uso da água · Automação</p><div class="utility-actions js-only"><button type="button" class="utility-button motion-utility" data-toggle-motion aria-pressed="false">${icon('pause')}<span data-motion-label>Pausar animação</span></button><button type="button" class="utility-button" data-open-accessibility aria-haspopup="dialog">${icon('access')}<span>Acessibilidade</span></button><button type="button" class="utility-button" data-libras>${icon('hands')}<span class="libras-label" data-libras-label>Libras</span></button></div></div></div>
  <header class="site-header"><div class="container header-inner">${marca()}<button type="button" class="menu-toggle js-only" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="menu-principal">${icon('menu')}</button><nav class="site-nav" id="menu-principal" aria-label="Navegação principal">${nav.map(([href,label])=>`<a href="${href}"${href===pagina?' aria-current="page"':''}>${label}</a>`).join('')}</nav></div><div class="reading-progress" aria-hidden="true"><span data-reading-progress></span></div></header>`;
}
export function rodape() {
  return `<footer class="site-footer"><div class="container"><div class="footer-signature" aria-hidden="true"><span>Sol <em>&amp;</em> Água</span><svg viewBox="0 0 150 70" focusable="false"><path d="M2 21q18-17 36 0t36 0 36 0 36 0M2 44q18-17 36 0t36 0 36 0 36 0" fill="none" stroke="currentColor" stroke-width="2"/></svg></div><div class="footer-grid"><div class="footer-about">${marca()}<p>Uma piscina como ponto de encontro entre energia solar, ciência e uso responsável da água.</p></div><div><h2>Explore o projeto</h2><ul class="footer-links"><li><a href="projeto-piscina.html">Projeto da piscina</a></li><li><a href="ciencia.html">Fundamentos científicos</a></li><li><a href="simuladores.html">Laboratório de simuladores</a></li><li><a href="comparativos.html">Comparar cenários</a></li></ul></div><div><h2>Conteúdo para todos</h2><ul class="footer-links"><li><a href="acessibilidade.html">Acessibilidade e Libras</a></li><li><a href="mapa-do-site.html">Mapa do site</a></li><li><a href="ciencia.html#referencias">Fontes e metodologia</a></li><li><a href="https://github.com/Ryan20014737472/Projeto-integrador-1.2">Código no GitHub</a></li></ul></div></div><div class="footer-bottom"><span>Sol &amp; Água · Projeto Integrador</span><span>Simulações educativas, com hipóteses e fontes disponíveis.</span></div></div></footer>
  <dialog class="reading-dialog" id="ajustes-leitura" aria-labelledby="titulo-leitura" aria-describedby="descricao-leitura"><div class="dialog-heading"><h2 id="titulo-leitura">Sua forma de ler</h2><form method="dialog"><button class="close-button" aria-label="Fechar ajustes de leitura">${icon('close')}</button></form></div><p class="reading-description" id="descricao-leitura">Ajuste a leitura ao seu conforto. Suas preferências ficam salvas neste navegador.</p>${ajustes()}<hr><button type="button" class="button button-teal button-small" data-libras>${icon('hands')}<span data-libras-label>Ativar VLibras</span></button><p class="small" data-libras-status role="status"></p><p class="reading-description"><a href="acessibilidade.html">Conheça todos os recursos de acesso</a></p></dialog>
  <div id="anuncio-global" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>`;
}
export function tituloPagina(titulo, descricao, eyebrow = 'EXPLORE O PROJETO') {
  return `<div class="page-heading"><div class="container"><nav class="breadcrumbs" aria-label="Caminho da página"><a href="index.html">Início</a><span aria-hidden="true">/</span><span aria-current="page">${titulo}</span></nav><div class="page-heading-grid"><div><p class="eyebrow">${eyebrow}</p><h1>${titulo}</h1><p class="lead">${descricao}</p></div>${emblemaPagina()}</div></div></div>`;
}
export function nota(texto, solar=false){return `<div class="note${solar?' note-sun':''}">${icon('info')}<p>${texto}</p></div>`;}
export function campo(id,nome,label,valor,min,max,step=1,ajuda='') {
  return `<label for="${id}">${label}<input id="${id}" name="${nome}" type="number" value="${valor}" min="${min}" max="${max}" step="${step}" required inputmode="decimal"${ajuda?` aria-describedby="${id}-ajuda"`:''}>${ajuda?`<span id="${id}-ajuda" class="field-help">${ajuda}</span>`:''}</label>`;
}
export function faixa(id,nome,label,valor,min,max,step,unidade) {
  return `<div class="field-full"><div class="range-heading"><label for="${id}">${label}</label><output id="${id}-valor" for="${id}" data-range-output="${id}">${valor} ${unidade}</output></div><input id="${id}" name="${nome}" type="range" value="${valor}" min="${min}" max="${max}" step="${step}" data-unit="${unidade}" aria-describedby="${id}-limites"><div class="range-limits" id="${id}-limites"><span>${min} ${unidade}</span><span>${max} ${unidade}</span></div></div>`;
}
export function layout(pagina,titulo,descricao,conteudo,jsSimulacao=false) {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${descricao}"><meta name="theme-color" content="#f3f1e8"><title>${titulo} | Sol &amp; Água</title><link rel="icon" href="assets/imagens/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${baseUrl}${pagina}"><link rel="preload" href="assets/fontes/Fraunces.woff2" as="font" type="font/woff2" crossorigin><script src="assets/js/preferencias.js"></script><link rel="stylesheet" href="assets/css/estilos.css"><script src="assets/js/principal.js" defer></script><script src="assets/js/visual.js" defer></script>${jsSimulacao?'<script src="assets/js/modelos.js" defer></script><script src="assets/js/simuladores.js" defer></script>':''}</head>
<body>${cabecalho(pagina)}<main id="conteudo" tabindex="-1">${conteudo}</main>${rodape()}</body></html>\n`;
}
