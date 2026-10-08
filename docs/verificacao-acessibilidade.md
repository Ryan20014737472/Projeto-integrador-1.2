# Acessibilidade e verificação

Referência: WCAG 2.2, nível AA. Ferramentas automáticas cobrem parte dos requisitos e não substituem avaliação com pessoas que usam tecnologias assistivas.

## Recursos

- Idioma, título principal único, regiões semânticas e títulos hierárquicos.
- Menu, página atual, navegação local e mapa.
- Link de salto e foco visível.
- Controles nativos com rótulos, unidades e ajuda.
- Abas com setas, Home/End, foco móvel e relações ARIA.
- Modal com Escape e retorno de foco.
- Gráficos com explicação e tabela equivalente.
- Estados relevantes anunciados em regiões de status.
- Contraste, fonte alternativa, ampliação e espaçamento persistentes.
- Animações pausáveis e movimentos reduzidos.
- Cena da piscina com etapas selecionáveis pelo teclado, legenda anunciada e cobertura animada.
- VLibras sob demanda, com estados de carregamento e falha.
- Estrutura de vídeos com legendas e transcrição.
- Texto científico e navegação disponíveis sem JavaScript.

## Executar os testes

Python, Playwright e axe-core 4.10.3 são usados apenas na verificação:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
curl -fsSL https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.3/axe.min.js -o /tmp/sol-agua-axe.min.js
python3 -m http.server 4173
```

Em outro terminal:

```bash
python3 testes/navegador.py --axe /tmp/sol-agua-axe.min.js --saida test-results
```

O script verifica oito páginas em dois temas, telas de 320 a 1.440 pixels, leitura ampliada, interações, teclado e persistência. Salva resultados e imagens em `test-results/`, sem publicá-los.

## Registro desta versão

Execução após a atualização visual, em 8 de outubro de 2026, com Chromium/Playwright e axe-core 4.10.3:

- 16 auditorias: oito páginas, temas normal e alto contraste, com zero violações detectadas nas regras executadas.
- 63 verificações de reflow: telas de 320, 390, 768, 1.024 e 1.440 pixels, leitura ampliada de 150% e verificações adicionais a 200%, sem transbordamento horizontal da página.
- Zero erros JavaScript.
- Interações de aquecimento, cobertura e automação, incluindo casos-limite, restaurar valores e histerese: aprovadas.
- Link de salto, abas, menu, modal, Escape, ciclo de foco e retorno de foco: aprovados.
- Persistência dos ajustes e respeito a movimentos reduzidos: aprovados.
- Cena ilustrada: seleção das etapas com Espaço/Enter, abertura da cobertura e pausa global aprovadas. A preferência do sistema por movimentos reduzidos também foi testada.
- Conteúdo científico sem JavaScript: confirmado.
- VLibras: carregamento real do script oficial e abertura do aplicativo confirmados. Isso não avalia a qualidade linguística da tradução.
- Onze testes independentes dos modelos científicos aprovados.

Relatório completo: [relatorio-acessibilidade.json](relatorio-acessibilidade.json). Os itens de contraste marcados para revisão manual pelo axe incluem textos dos SVG; os pares de cores foram conferidos por cálculo.

| Texto / fundo | Razão de contraste |
|---|---:|
| Texto principal #18343a / fundo #f3f1e8 | 11,66:1 |
| Texto secundário #455d60 / fundo #f3f1e8 | 6,21:1 |
| Azul de água #055a6a / fundo #f3f1e8 | 6,93:1 |
| Texto claro #fbfaf5 / botão #16343a | 12,67:1 |
| Texto escuro #18343a / amarelo solar #efc44a | 7,96:1 |
| Borda de campo #6b7e79 / superfície #fbfaf5 | 4,11:1 |
| Texto do rodapé #c2d5d4 / fundo #102c34 | 9,61:1 |
| Branco / preto no alto contraste | 21:1 |
| Amarelo / preto no alto contraste | 19,56:1 |

Foi inspecionada a árvore de acessibilidade do navegador para nomes e papéis de abas, controles e regiões. Isso não equivale a um teste humano completo com leitor de tela.

## Avaliação complementar

Verificar leitura contínua, títulos, campos, tabelas e anúncios com NVDA/Firefox e VoiceOver/Safari, e com pessoas com diferentes necessidades. Essa avaliação humana não foi realizada neste ambiente.

VLibras é externo e exige avaliação própria de disponibilidade, tradução e controles. Vídeos com pessoas fluentes em Libras complementam a tradução automática; as gravações ainda não foram fornecidas.
