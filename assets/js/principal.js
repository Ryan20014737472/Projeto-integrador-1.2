(function () {
  'use strict';
  const root = document.documentElement;
  const leitura = window.LeituraSolAgua;
  const globalStatus = document.getElementById('anuncio-global');
  const dialog = document.getElementById('ajustes-leitura');
  function anunciar(texto) { globalStatus.textContent = texto; }
  function sincronizarLeitura() {
    document.querySelectorAll('[data-setting]').forEach(input => { input.checked = leitura.prefs[input.dataset.setting]; });
    document.querySelectorAll('[data-size-label]').forEach(label => { label.textContent = `${leitura.prefs.tamanho}%`; });
    document.querySelectorAll('[data-size]').forEach(button => { button.disabled = Number(button.dataset.size) < 0 ? leitura.prefs.tamanho <= 90 : leitura.prefs.tamanho >= 150; });
    root.dataset.largeText = String(parseFloat(getComputedStyle(root).fontSize) >= 19.2 || leitura.prefs.dislexia || leitura.prefs.espaco);
    sincronizarMovimento();
  }
  document.querySelectorAll('[data-open-accessibility]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controles = Array.from(dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(elemento => !elemento.disabled && elemento.getClientRects().length > 0);
    const primeiro = controles[0], ultimo = controles[controles.length - 1];
    if (event.shiftKey && document.activeElement === primeiro) { event.preventDefault(); ultimo.focus(); }
    else if (!event.shiftKey && document.activeElement === ultimo) { event.preventDefault(); primeiro.focus(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  document.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', () => {
    leitura.prefs[input.dataset.setting] = input.checked;
    leitura.aplicar(); sincronizarLeitura(); anunciar('Preferências de leitura atualizadas.');
  }));
  document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
    leitura.prefs.tamanho = Math.min(150, Math.max(90, leitura.prefs.tamanho + Number(button.dataset.size) * 10));
    leitura.aplicar(); sincronizarLeitura(); anunciar(`Tamanho do texto: ${leitura.prefs.tamanho} por cento.`);
  }));
  document.querySelectorAll('[data-reset-reading]').forEach(button => button.addEventListener('click', () => {
    Object.assign(leitura.prefs, leitura.padrao);
    leitura.prefs.movimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.dataset.paused = 'false'; leitura.aplicar(); sincronizarLeitura(); anunciar('Ajustes de leitura restaurados.');
  }));
  const menu = document.getElementById('menu-principal');
  const toggle = document.querySelector('.menu-toggle');
  function fecharMenu() { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Abrir menu de navegação'); }
  toggle.addEventListener('click', () => {
    const aberta = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded',String(aberta)); toggle.setAttribute('aria-label',aberta?'Fechar menu de navegação':'Abrir menu de navegação');
  });
  menu.addEventListener('keydown', event => { if (event.key==='Escape') { fecharMenu();toggle.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header-inner')) fecharMenu(); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', fecharMenu);
  function sincronizarMovimento() {
    const reduzido = leitura.prefs.movimento || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pausada = root.dataset.paused === 'true';
    document.querySelectorAll('[data-toggle-motion]').forEach(button => {
      button.disabled = reduzido;
      button.setAttribute('aria-pressed',String(pausada || reduzido));
      button.querySelector('[data-motion-label]').textContent = reduzido ? 'Movimentos reduzidos' : pausada ? 'Retomar animação' : 'Pausar animação';
    });
  }
  document.querySelectorAll('[data-toggle-motion]').forEach(button => button.addEventListener('click', () => {
    root.dataset.paused = root.dataset.paused === 'true' ? 'false' : 'true'; sincronizarMovimento();
  }));
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', sincronizarMovimento);
  sincronizarLeitura();

  let librasPromise = null;
  function statusLibras(texto) { document.querySelectorAll('[data-libras-status]').forEach(e=>{e.textContent=texto;}); anunciar(texto); }
  function esperarBotaoLibras() {
    return new Promise((resolve,reject) => {
      let tentativas = 0;
      const timer = setInterval(() => {
        const button = window.VLibrasWidget?.initBtn;
        if (button) { clearInterval(timer);resolve(button); }
        else if (++tentativas >= 80) { clearInterval(timer); reject(new Error('O tradutor não respondeu.')); }
      },250);
    });
  }
  async function ativarLibras() {
    if (window.VLibrasWidget?.initBtn) { window.VLibrasWidget.initBtn.click(); return; }
    if (!librasPromise) {
      statusLibras('Carregando o tradutor VLibras. É necessário acesso à internet.');
      document.querySelectorAll('[data-libras]').forEach(button=>{button.disabled=true;});
      librasPromise = new Promise((resolve,reject) => {
        const script = document.createElement('script');
        script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'; script.async = true;
        const timeout = setTimeout(()=>{script.remove();reject(new Error('Tempo de conexão excedido.'));},25000);
        script.onload=()=>{clearTimeout(timeout);resolve();};
        script.onerror=()=>{clearTimeout(timeout);script.remove();reject(new Error('Falha de conexão.'));};
        document.body.append(script);
      }).then(esperarBotaoLibras);
    }
    try {
      const button = await librasPromise;
      dialog.close(); button.click();
      statusLibras('VLibras ativado. Selecione um texto para solicitar a tradução.');
      document.querySelectorAll('[data-libras-label]').forEach(e=>{e.textContent='Abrir VLibras';});
    } catch (_) {
      librasPromise=null;
      statusLibras('Não foi possível carregar o VLibras. Verifique sua conexão e tente novamente. O conteúdo em texto continua disponível.');
    } finally { document.querySelectorAll('[data-libras]').forEach(button=>{button.disabled=false;}); }
  }
  document.querySelectorAll('[data-libras]').forEach(button=>button.addEventListener('click',ativarLibras));

  const videoContainer = document.getElementById('videos-libras');
  if (videoContainer) {
    fetch('dados/videos.json').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(dados=>{
      if(!Array.isArray(dados.videos) || !dados.videos.length)return;
      for(const item of dados.videos) {
        if(!item.titulo || !item.arquivo || !item.legendas || !item.transcricao)continue;
        const endereco = path => {
          const u = new URL(path,window.location.href);
          if(u.origin!==window.location.origin || !u.pathname.includes('/assets/videos/')) throw new Error('Arquivo de vídeo fora da pasta permitida.');
          return u.href;
        };
        const article=document.createElement('article');article.className='video-card';
        const h=document.createElement('h3');h.textContent=item.titulo;
        const video=document.createElement('video');video.controls=true;video.preload='metadata';video.setAttribute('aria-label',item.titulo);video.src=endereco(item.arquivo);
        const track=document.createElement('track');track.kind='captions';track.srclang='pt-BR';track.label='Português';track.src=endereco(item.legendas);track.default=true;video.append(track);
        const details=document.createElement('details'),summary=document.createElement('summary'),p=document.createElement('p');summary.textContent='Ler transcrição';p.textContent=item.transcricao;details.append(summary,p);article.append(h,video,details);
        videoContainer.append(article);
      }
      if(videoContainer.querySelector('.video-card')) document.getElementById('videos-vazio').hidden=true;
    }).catch(()=>{ /* O aviso estático e o conteúdo em texto permanecem acessíveis. */ });
  }
})();
