(function () {
  'use strict';
  const modelos=window.ModelosPiscina;
  const f=(n,c=1)=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:c,minimumFractionDigits:c}).format(n);
  const $=id=>document.getElementById(id);
  const texto=(id,value)=>{ const el=$(id);if(el)el.textContent=value; };
  const metrica=(id,value,unit)=>{const el=$(id);if(el)el.innerHTML=`${value} <small>${unit}</small>`;};
  const ler=form=>Object.fromEntries(new FormData(form));
  const timers=new Map();
  function anunciar(id,message) {
    clearTimeout(timers.get(id));
    timers.set(id,setTimeout(()=>texto(id,message),500));
  }
  function atualizarFaixas(form) {
    form.querySelectorAll('input[type=range]').forEach(input=>{
      const unidade=input.dataset.unit || '';
      texto(`${input.id}-valor`,`${f(Number(input.value),0)} ${unidade}`);
      input.setAttribute('aria-valuetext',`${f(Number(input.value),0)} ${unidade}`);
    });
  }
  function prepararFormulario(formId,errorId,calcular,aoRestaurar=()=>{}) {
    const form=$(formId);if(!form)return null;
    function atualizar() {
      atualizarFaixas(form);
      if(!form.checkValidity()) {
        texto(errorId,'Revise os campos: os resultados exibidos correspondem ao último cenário válido.');
        return;
      }
      try { calcular(ler(form));texto(errorId,''); }
      catch(error) {texto(errorId,error.message);}
    }
    form.addEventListener('input',atualizar);
    form.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity())atualizar();});
    form.addEventListener('reset',()=>setTimeout(()=>{aoRestaurar();atualizar();},0));
    atualizar();return {form,atualizar};
  }
  const tabs=Array.from(document.querySelectorAll('[role=tab]'));
  function ativarAba(tab,focus=false,hash=true) {
    for(const button of tabs) {
      const ativa=button===tab;
      button.setAttribute('aria-selected',String(ativa));button.tabIndex=ativa?0:-1;
      const panel=$(button.getAttribute('aria-controls'));panel.hidden=!ativa;panel.classList.toggle('is-active',ativa);
    }
    if(focus)tab.focus();
    if(hash)history.replaceState(null,'',`#${tab.getAttribute('aria-controls')}`);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>ativarAba(tab));
    tab.addEventListener('keydown',event=>{
      let target=null;
      if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];
      if(event.key==='ArrowLeft')target=tabs[(index-1+tabs.length)%tabs.length];
      if(event.key==='Home')target=tabs[0];if(event.key==='End')target=tabs[tabs.length-1];
      if(target){event.preventDefault();ativarAba(target,true);}
    });
  });
  function abaDoHash(){return tabs.find(t=>t.getAttribute('aria-controls')===location.hash.slice(1));}
  if(tabs.length){ativarAba(abaDoHash() || tabs[0],false,false);window.addEventListener('hashchange',()=>{const tab=abaDoHash();if(tab)ativarAba(tab,false,false);});}

  let ultimoResultadoCalor=null;
  function desenharGrafico(r) {
    const svg=$('grafico-temperatura');if(!svg)return;
    ultimoResultadoCalor=r;
    const largura=Math.max(280,Math.round(svg.getBoundingClientRect().width));
    const esquerda=52,direita=largura-24;
    svg.setAttribute('viewBox',`0 0 ${largura} 270`);
    const projetavel=r.horas!==null && r.horas>0;
    const amplitude=r.delta>0 && projetavel?r.delta:0;
    const minimo=Math.max(0,r.inicial-1),maximo=Math.max(r.inicial+1,r.inicial+amplitude+1);
    const y=v=>210-(v-minimo)/(maximo-minimo)*160;
    const tempoMax=projetavel?r.horas:0;
    const pontos=Array.from({length:5},(_,i)=>({horas:tempoMax*i/4,temp:r.inicial+amplitude*i/4,x:esquerda+(direita-esquerda)*i/4}));
    const linha=pontos.map(p=>`${p.x},${y(p.temp)}`).join(' ');
    const titulo='Projeção de temperatura da piscina';
    const desc=projetavel?`A água passa de ${f(r.inicial)} para ${f(r.alvo)} graus Celsius em ${f(r.horas)} horas sob condições constantes. Os dados estão na tabela abaixo.`:r.delta===0?'A meta já foi atingida. O modelo não acrescenta calor.':'Sem irradiância, o modelo não prevê aquecimento. A temperatura mostrada permanece na condição inicial.';
    svg.innerHTML=`<title id="calor-grafico-titulo">${titulo}</title><desc id="calor-grafico-desc">${desc}</desc><text x="${esquerda}" y="22">Temperatura (°C)</text>${Array.from({length:5},(_,i)=>{const t=minimo+(maximo-minimo)*i/4;return `<line x1="${esquerda}" x2="${direita}" y1="${y(t)}" y2="${y(t)}" class="chart-grid"/><text x="${esquerda-12}" y="${y(t)+5}" text-anchor="end">${f(t,1)}</text>`;}).join('')}<path class="chart-area" d="M${esquerda} 210 L${linha.replaceAll(' ',' L')} L${direita} 210 Z"/><polyline class="chart-line" pathLength="1" points="${linha}"/>${pontos.map(p=>`<circle class="chart-point" cx="${p.x}" cy="${y(p.temp)}" r="5"/><text x="${p.x}" y="235" text-anchor="middle">${f(p.horas,1)}</text>`).join('')}<text x="${(esquerda+direita)/2}" y="264" text-anchor="middle" class="chart-axis-label">${projetavel?'Tempo de aquecimento (h)':'Sem evolução térmica'}</text>`;
    const dados=projetavel?pontos:[pontos[0]];
    $('tabela-temperatura').innerHTML=dados.map(p=>`<tr><td>${f(p.horas,1)}</td><td>${f(p.temp,1)}</td></tr>`).join('');
    texto('calor-grafico-nota',projetavel?'Curva idealizada com potência útil constante.':r.delta===0?'A meta foi atingida; não é necessário acrescentar calor.':'Sem energia solar disponível, não há projeção de aquecimento.');
  }
  const calor=prepararFormulario('form-calor','calor-erro',entrada=>{
    const r=modelos.aquecimento(entrada);
    metrica('calor-horas',r.horas===null?'—':f(r.horas),r.horas===null?'': 'h');
    metrica('calor-energia',f(r.energia),'kWh');metrica('calor-potencia',f(r.potenciaUtil,2),'kW');
    texto('calor-estado',r.horas===null?'Sem irradiância: não há aquecimento solar':r.delta===0?'Meta já atingida':'Sob condições solares constantes');
    document.querySelectorAll('[data-sun-preset]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.sunPreset)===r.irradiancia)));
    desenharGrafico(r);
    anunciar('calor-anuncio',r.horas===null?'Sem irradiância: não há aquecimento solar neste modelo.':`Energia necessária: ${f(r.energia)} quilowatt-hora. Tempo previsto: ${f(r.horas)} horas sob condições constantes.`);
  });
  if($('grafico-temperatura')) {
    let resizeTimer;
    new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(ultimoResultadoCalor)desenharGrafico(ultimoResultadoCalor);},80);}).observe($('grafico-temperatura'));
  }
  document.querySelectorAll('[data-sun-preset]').forEach(button=>button.addEventListener('click',()=>{calor.form.elements.irradiancia.value=button.dataset.sunPreset;calor.atualizar();}));

  prepararFormulario('form-agua','agua-erro',entrada=>{
    const r=modelos.agua(entrada);
    metrica('agua-poupada',f(r.economizada,0),'L');metrica('agua-sem',f(r.semCobertura,0),'L');metrica('agua-com',f(r.comCobertura,0),'L');
    texto('agua-reducao-texto',`${f(r.fracaoEvitada*100)}% menos evaporação no modelo`);
    texto('barra-agua-sem-label',`${f(r.semCobertura,0)} L`);texto('barra-agua-com-label',`${f(r.comCobertura,0)} L`);
    $('barra-agua-sem').style.width=r.semCobertura===0?'0%':'100%';$('barra-agua-com').style.width=r.semCobertura===0?'0%':`${100*(1-r.fracaoEvitada)}%`;
    texto('tabela-agua-sem',f(r.semCobertura,0));texto('tabela-agua-com',f(r.comCobertura,0));texto('tabela-agua-poupada',f(r.economizada,0));
    anunciar('agua-anuncio',`${f(r.economizada,0)} litros poupados em ${r.dias} dias. Reposição estimada com cobertura: ${f(r.comCobertura,0)} litros.`);
  });

  let bombaLigada=false,ultimoEvento='',contador=0;
  const auto=prepararFormulario('form-automacao','automacao-erro',entrada=>{
    entrada.falha=entrada.falha==='on';const r=modelos.automacao(entrada,bombaLigada);bombaLigada=r.ligada;
    texto('auto-estado',{aquecendo:'Aquecendo',aguardando:'Aguardando',bloqueada:'Bloqueada'}[r.estado]);$('auto-estado').dataset.state=r.estado;
    texto('auto-motivo',r.motivo);texto('auto-diferenca',`${f(r.diferenca)} °C`);texto('auto-nivel-resultado',`${f(Number(entrada.nivel),0)}%`);texto('auto-bomba',r.ligada?'Ligada':'Desligada');
    $('diagrama-automacao').classList.toggle('diagram-idle',!r.ligada);
    if(r.motivo!==ultimoEvento) {
      ultimoEvento=r.motivo;contador++;
      const li=document.createElement('li');const strong=document.createElement('strong');strong.textContent=`${contador}. ${r.ligada?'Bomba ligada':'Bomba desligada'} — `;li.append(strong,document.createTextNode(r.motivo));
      const lista=$('auto-historico');lista.prepend(li);while(lista.children.length>6)lista.lastElementChild.remove();
    }
  },()=>{bombaLigada=false;ultimoEvento='';contador=0;$('auto-historico').replaceChildren();});
  document.querySelectorAll('[data-auto-preset]').forEach(button=>button.addEventListener('click',()=>{
    const preset=button.dataset.autoPreset,form=auto.form;
    form.elements.piscina.value=22;form.elements.alvo.value=28;
    form.elements.coletor.value=preset==='frio'?23:34;
    form.elements.nivel.value=preset==='baixo'?25:80;
    form.elements.falha.checked=preset==='falha';auto.atualizar();
  }));

  prepararFormulario('form-comparativo','comparativo-erro',entrada=>{
    const r=modelos.comparacao({...entrada,area:12,eficiencia:65,perdas:15,bomba:100});
    const solar=r.energiaSolarRede===null;
    texto('comp-custo-solar',solar?'Sem previsão':`R$ ${f(r.custoSolar,2)}`);texto('comp-custo-eletrico',`R$ ${f(r.custoEletrico,2)}`);
    texto('comp-energia-solar',solar?'Sem aquecimento':`${f(r.energiaSolarRede,2)} kWh`);texto('comp-energia-eletrica',`${f(r.energiaEletrica,2)} kWh`);
    texto('comp-tempo-solar',solar?'Sem aquecimento':`${f(r.solar.horas)} h`);texto('comp-tempo-eletrico',`${f(r.horasEletrica)} h`);
    texto('comp-insight',solar?'Sem irradiância, o cenário solar não atinge a meta. Não é possível calcular a diferença de custo.':r.solar.delta===0?'A meta já foi atingida. Nenhum dos cenários precisa acrescentar calor.':r.economia>=0?`Neste cenário, a diferença de custo operacional é de R$ ${f(r.economia,2)} a favor do solar.`:`Neste cenário, o solar custa R$ ${f(-r.economia,2)} a mais em eletricidade, devido ao tempo de circulação.`);
    texto('comp-barra-solar-label',solar?'Sem previsão':`${f(r.energiaSolarRede,2)} kWh`);texto('comp-barra-eletrica-label',`${f(r.energiaEletrica,2)} kWh`);
    const maior=Math.max(r.energiaSolarRede||0,r.energiaEletrica);
    $('comp-barra-solar').style.width=maior===0?'0%':`${100*(r.energiaSolarRede||0)/maior}%`;
    $('comp-barra-eletrica').style.width=maior===0?'0%':`${100*r.energiaEletrica/maior}%`;
    texto('comp-tabela-q-solar',f(r.solar.energia));texto('comp-tabela-q-eletrica',f(r.solar.energia));
    texto('comp-tabela-e-solar',solar?'Sem previsão':f(r.energiaSolarRede,2));texto('comp-tabela-e-eletrica',f(r.energiaEletrica,2));
    texto('comp-tabela-t-solar',solar?'Sem previsão':f(r.solar.horas));texto('comp-tabela-t-eletrica',f(r.horasEletrica));
    texto('comp-tabela-c-solar',solar?'Sem previsão':f(r.custoSolar,2));texto('comp-tabela-c-eletrica',f(r.custoEletrico,2));
  });
})();
