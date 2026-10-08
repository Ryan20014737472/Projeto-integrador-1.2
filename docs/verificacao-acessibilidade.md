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

Execução em 8 de outubro de 2026, com Chromium/Playwright e axe-core 4.10.3:

- 16 auditorias: oito páginas, temas normal e alto contraste, com zero violações detectadas nas regras executadas.
- 63 verificações de reflow: telas de 320, 390, 768, 1.024 e 1.440 pixels, leitura ampliada de 150% e verificações adicionais a 200%, sem transbordamento horizontal da página.
- Zero erros JavaScript.
- Interações de aquecimento, cobertura e automação, incluindo casos-limite, restaurar valores e histerese: aprovadas.
- Link de salto, abas, menu, modal, Escape, ciclo de foco e retorno de foco: aprovados.
- Persistência dos ajustes e respeito a movimentos reduzidos: aprovados.
- Conteúdo científico sem JavaScript: confirmado.
- VLibras: carregamento real do script oficial e abertura do aplicativo confirmados. Isso não avalia a qualidade linguística da tradução.
- Onze testes independentes dos modelos científicos aprovados.

Relatório completo: [relatorio-acessibilidade.json](relatorio-acessibilidade.json). Os itens de contraste marcados para revisão manual pelo axe incluem textos dos SVG; os pares de cores foram conferidos por cálculo.

| Texto / fundo | Razão de contraste |
|---|---:|
| Azul profundo #123247 / branco | 13,35:1 |
| Texto secundário #496373 / branco | 6,33:1 |
| Turquesa #006b74 / branco | 6,26:1 |
| Azul profundo / amarelo solar #ffcc4d | 8,90:1 |
| Rótulos claros do diagrama / #0b2638 | Pelo menos 11,07:1 |
| Branco / preto no alto contraste | 21:1 |
| Amarelo / preto no alto contraste | 19,56:1 |

Foi inspecionada a árvore de acessibilidade do navegador para nomes e papéis de abas, controles e regiões. Isso não equivale a um teste humano completo com leitor de tela.

## Avaliação complementar

Verificar leitura contínua, títulos, campos, tabelas e anúncios com NVDA/Firefox e VoiceOver/Safari, e com pessoas com diferentes necessidades. Essa avaliação humana não foi realizada neste ambiente.

VLibras é externo e exige avaliação própria de disponibilidade, tradução e controles. Vídeos com pessoas fluentes em Libras complementam a tradução automática; as gravações ainda não foram fornecidas.
