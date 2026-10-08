import {icon} from './layout.mjs';
import {paisagemPiscina,vinheta} from './ilustracoes.mjs';

export const inicio = {
  arquivo: 'index.html',
  titulo: 'O Sol aquece. A água ensina.',
  descricao: 'Uma piscina como laboratório: explore o aquecimento solar, a conservação da água e a automação com ciência, simuladores e recursos de acessibilidade.',
  conteudo: `
  <section class="hero" aria-labelledby="titulo-inicio">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow"><span class="eyebrow-rule" aria-hidden="true"></span>CIÊNCIA A CÉU ABERTO</p>
          <h1 id="titulo-inicio"><span>O Sol aquece.</span><em>A água ensina.</em></h1>
          <p class="hero-description">Uma piscina é o nosso laboratório. Investigamos como aproveitar a energia solar, conservar a água e automatizar o aquecimento.</p>
          <div class="button-row">
            <a href="simuladores.html" class="button button-primary">Entrar no laboratório <span class="button-arrow" aria-hidden="true">${icon('arrow-up')}</span></a>
            <a href="projeto-piscina.html" class="hero-text-link">Conhecer o projeto <span aria-hidden="true">→</span></a>
          </div>
          <p class="hero-note">${icon('access')}Com teclado, ajustes de leitura e VLibras.</p>
        </div>
        ${paisagemPiscina()}
      </div>
      <nav class="hero-index" aria-label="Caminhos para explorar o projeto">
        <span class="index-caption">COMECE POR AQUI <span aria-hidden="true">↓</span></span>
        <a href="ciencia.html"><span aria-hidden="true">01 /</span> Entenda a ciência <span aria-hidden="true">${icon('arrow-up')}</span></a>
        <a href="#experiencias"><span aria-hidden="true">02 /</span> Faça uma experiência <span aria-hidden="true">↓</span></a>
        <a href="comparativos.html"><span aria-hidden="true">03 /</span> Compare os resultados <span aria-hidden="true">${icon('arrow-up')}</span></a>
      </nav>
    </div>
  </section>

  <section class="section experiments-section" id="experiencias" aria-labelledby="titulo-experiencias">
    <div class="container">
      <div class="section-heading" data-reveal>
        <div><p class="eyebrow">O LABORATÓRIO</p><h2 id="titulo-experiencias">Uma pergunta.<br><em>Um jeito de descobrir.</em></h2></div>
        <p class="section-side-note">Mude as condições.<br>Observe o que acontece.<br>Confira a explicação.</p>
      </div>
      <ol class="experiment-list">
        <li data-reveal><a class="experiment-link experiment-heat" href="simuladores.html#aquecimento">
          <span class="experiment-number" aria-hidden="true">01</span>
          <div class="experiment-copy"><span class="experiment-label">ENERGIA SOLAR</span><h3>Quanto tempo para aquecer?</h3><p>Altere o volume, a temperatura e a radiação solar. Acompanhe a curva de aquecimento.</p></div>
          ${vinheta('calor')}<span class="experiment-arrow" aria-hidden="true">${icon('arrow-up')}</span>
        </a></li>
        <li data-reveal><a class="experiment-link experiment-water" href="simuladores.html#agua">
          <span class="experiment-number" aria-hidden="true">02</span>
          <div class="experiment-copy"><span class="experiment-label">CONSERVAÇÃO DA ÁGUA</span><h3>O que muda com uma cobertura?</h3><p>Compare a evaporação e descubra quantos litros podem ser poupados no cenário escolhido.</p></div>
          ${vinheta('agua')}<span class="experiment-arrow" aria-hidden="true">${icon('arrow-up')}</span>
        </a></li>
        <li data-reveal><a class="experiment-link experiment-control" href="simuladores.html#automacao">
          <span class="experiment-number" aria-hidden="true">03</span>
          <div class="experiment-copy"><span class="experiment-label">AUTOMAÇÃO</span><h3>Quando a bomba deve ligar?</h3><p>Teste temperaturas, nível de água e falhas de sensor. Veja como o controlador decide.</p></div>
          ${vinheta('controle')}<span class="experiment-arrow" aria-hidden="true">${icon('arrow-up')}</span>
        </a></li>
      </ol>
      <p class="experiment-footnote">Três modelos didáticos, com parâmetros ajustáveis e hipóteses documentadas. <a href="ciencia.html#metodologia">Leia a metodologia <span aria-hidden="true">${icon('arrow-up')}</span></a></p>
    </div>
  </section>

  <section class="section science-section" aria-labelledby="titulo-ciencia">
    <div class="container science-layout">
      <div class="formula-showcase" data-reveal>
        <div class="formula-sheet-heading"><span>FICHA DE CAMPO</span><span>01 / CALORIMETRIA</span></div>
        <span class="formula-sheet-label">A energia que a água precisa</span>
        <div class="formula-large" role="math" aria-label="Q igual a m vezes c vezes delta T">Q = mcΔT</div>
        <p>10.000 litros de água<br>Aumento de temperatura: 5 °C<br>Calor específico: 4.186 J/(kg · °C)</p>
        <div class="formula-result"><div><strong>58,1 <small>kWh</small></strong><p>de energia térmica</p></div><span>Exemplo teórico,<br>antes das perdas de calor.</span></div>
        <span class="sheet-corner" aria-hidden="true">${icon('arrow-up')}</span>
      </div>
      <div class="science-copy" data-reveal>
        <p class="eyebrow">POR TRÁS DOS NÚMEROS</p>
        <h2 id="titulo-ciencia">A resposta começa<br><em>com a ciência.</em></h2>
        <p>Uma piscina maior precisa de mais energia para o mesmo aumento de temperatura. A relação entre massa, calor e temperatura explica por quê.</p>
        <ul class="science-checklist"><li><span aria-hidden="true">01</span><div><strong>Entenda cada variável.</strong><p>As fórmulas trazem unidades e exemplos resolvidos.</p></div></li><li><span aria-hidden="true">02</span><div><strong>Compare nas mesmas condições.</strong><p>Use o mesmo volume e a mesma meta de aquecimento.</p></div></li><li><span aria-hidden="true">03</span><div><strong>Questione o resultado.</strong><p>Consulte as fontes e reconheça os limites do modelo.</p></div></li></ul>
        <a href="ciencia.html" class="text-arrow-link">Abrir o caderno de ciência <span aria-hidden="true">${icon('arrow-up')}</span></a>
      </div>
    </div>
  </section>

  <section class="section inclusion-section" aria-labelledby="titulo-inclusao">
    <div class="container">
      <div class="inclusion-banner dark" data-reveal>
        <div><p class="eyebrow">CONHECIMENTO COMPARTILHADO</p><h2 id="titulo-inclusao">Ciência se faz<br><em>com acesso.</em></h2><p>O projeto também é sobre quem pode participar. Escolha o contraste, ajuste a leitura, use o teclado e ative o tradutor VLibras.</p><a class="button button-primary" href="acessibilidade.html">Escolher minha forma de ler <span class="button-arrow" aria-hidden="true">${icon('arrow-up')}</span></a></div>
        <svg class="inclusion-art" viewBox="0 0 290 260" aria-hidden="true" focusable="false"><circle cx="184" cy="88" r="64" fill="var(--sun)"/><g fill="none" stroke="currentColor" stroke-width="2"><path d="M10 157q32-27 64 0t64 0 64 0 64 0M10 190q32-27 64 0t64 0 64 0 64 0M10 223q32-27 64 0t64 0 64 0 64 0" class="inclusion-waves"/></g></svg>
      </div>
    </div>
  </section>`
};
