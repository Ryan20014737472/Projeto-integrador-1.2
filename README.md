# Sol & Água — Projeto Integrador

Site educacional sobre uma proposta de piscina sustentável: aquecimento solar térmico, conservação da água, automação e inclusão digital.

**Site publicado:** [Abrir Sol & Água](https://ryan20014737472.github.io/Projeto-integrador-1.2/)

## Conteúdo e tecnologia

Oito páginas em HTML semântico, CSS responsivo, JavaScript e SVG. Três simuladores, comparativos dinâmicos, fundamentos científicos, referências, sustentabilidade, acessibilidade e mapa do site. Fontes locais e VLibras sob demanda. Não há framework, dependência npm ou servidor de aplicação.

A identidade visual usa a linguagem de um caderno de campo, com títulos em Fraunces e uma piscina desenhada em SVG. A cena tem etapas de captação, circulação e conservação, água em movimento e cobertura animada. Há controle de pausa e respeito às preferências de movimentos reduzidos.

## Executar e verificar

```bash
python3 -m http.server 4173
```

Acesse http://localhost:4173/. Node.js 22 ou superior permite regenerar e verificar as páginas:

```bash
node scripts/construir.mjs
node --test testes/modelos.test.cjs
node scripts/verificar.mjs
```

As páginas HTML ficam na raiz e podem ser servidas diretamente. O workflow `.github/workflows/pages.yml` testa e publica `main`. Em **Settings → Pages**, a origem é **GitHub Actions**. `node scripts/publicar.mjs` prepara apenas os arquivos públicos em `_site/`, ignorado pelo Git.

O GitHub Pages já está habilitado com a origem **GitHub Actions**. Novos envios para `main` executam as verificações e atualizam o site automaticamente. Também é possível executar **Run workflow** em [Actions](https://github.com/Ryan20014737472/Projeto-integrador-1.2/actions/workflows/pages.yml).

## Editar

- Conteúdo: `scripts/paginas-conteudo.mjs` e `scripts/paginas-laboratorio.mjs`.
- Página inicial: `scripts/pagina-inicial.mjs`.
- Desenhos da piscina e das experiências: `scripts/ilustracoes.mjs`.
- Estrutura compartilhada: `scripts/layout.mjs`.
- Componentes e identidade visual: `assets/css/estilos.css`.
- Fórmulas: `assets/js/modelos.js`.
- Interações: `assets/js/simuladores.js` e `assets/js/principal.js`.
- Etapas da ilustração, entradas ao rolar e índice de leitura: `assets/js/visual.js`.
- Parâmetros e origem: `dados/parametros.json`.

Após editar templates, execute `node scripts/construir.mjs` e envie os HTML atualizados.

## Documentação

- [Relatório da revisão completa — 09/10/2026](docs/relatorio-revisao-2026-10-09.md)
- [Critérios da avaliação](docs/criterios-avaliacao.md)
- [Cálculos e fontes](docs/calculos-e-fontes.md)
- [Acessibilidade e verificação](docs/verificacao-acessibilidade.md)
- [Vídeos em Libras](docs/videos-libras.md)
- [Fontes e licenças](assets/fontes/FONTES.md)

Os cenários são didáticos, sem medições de campo ou sensores conectados. A estrutura para vídeos em Libras está pronta; as gravações reais ainda não foram fornecidas.

## Testar as funções no navegador

As instruções para instalar Playwright e axe-core estão na [documentação de verificação](docs/verificacao-acessibilidade.md). Com o servidor local em execução:

```bash
python3 testes/navegador.py --axe /tmp/sol-agua-axe.min.js --saida test-results
python3 testes/revisao.py --navegadores chromium firefox webkit --saida test-results/revisao
```

A revisão inclui teclado, ajustes de 90% a 200%, simuladores, comparativo, falhas de conexão simuladas, catálogo de vídeos e conteúdo sem JavaScript. As bibliotecas de teste não fazem parte do site publicado.
