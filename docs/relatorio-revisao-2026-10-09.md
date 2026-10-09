# Relatório de revisão — Sol & Água

**Data:** 9 de outubro de 2026  
**Site:** <https://ryan20014737472.github.io/Projeto-integrador-1.2/>  
**Repositório:** <https://github.com/Ryan20014737472/Projeto-integrador-1.2>

## Resultado

Todas as funções implementadas foram revisadas dentro do escopo descrito abaixo. Foram corrigidos quatro problemas confirmados no comportamento inicial, ampliada a leitura até 200% e simplificado o código. Os testes finais não detectaram erros JavaScript do site, violações nas regras de acessibilidade executadas ou transbordamento horizontal das páginas.

| Verificação | Resultado |
|---|---:|
| Páginas revisadas | 8 de 8 |
| Grupos funcionais em Chromium, Firefox e WebKit | 60 aprovados de 60 |
| Combinações de navegador, tela e leitura | 360 aprovadas de 360 |
| Auditorias automáticas de acessibilidade com axe-core | 30, sem violações detectadas |
| Verificações de conteúdo/navegação sem JavaScript | 24 aprovadas de 24 |
| Testes dos modelos científicos | 15 aprovados de 15 |
| Cenários do validador de catálogo/sitemap | 8 aprovados de 8 |
| Referências externas verificadas | 6 com resposta HTTP 200 |
| Erros JavaScript do site nos testes finais | 0 |

“Grupo funcional” reúne várias ações e verificações; não significa apenas um clique. Os resultados detalhados estão em [relatorio-acessibilidade.json](relatorio-acessibilidade.json).

## Problemas corrigidos

| Problema reproduzido | Correção | Verificação final |
|---|---|---|
| Escape não fechava o menu quando o foco estava no próprio botão de abertura. | Tratamento do Escape também fora dos links do menu, com retorno de foco. | Abertura e fechamento com foco no botão e nos links, nos três navegadores. |
| Reabrir o VLibras pelo modal deixava o modal na frente quando o tradutor já estava carregado. | Fechamento do modal em todos os caminhos de abertura do tradutor. | Caso automatizado e abertura real do serviço oficial. |
| A pausa das animações era perdida ao navegar para outra página. | Preferência de pausa salva junto dos ajustes de leitura. | Pausar, navegar, conferir estado e retomar. |
| Um vídeo com endereço inválido interrompia a apresentação dos vídeos válidos seguintes. | Validação por entrada, mantendo os itens válidos. | Catálogo simulado com entradas inválidas e um vídeo técnico válido. |

Ao acrescentar a leitura a 200%, o teste encontrou um transbordamento da barra de acessibilidade em 768 pixels com a mensagem de movimentos reduzidos. A barra passou a quebrar linha conforme o espaço disponível. A matriz final de 360 telas inclui esse cenário e passou integralmente.

## Melhorias no código

- **Uma folha de estilo:** `estilos.css` reúne componentes e identidade visual. Foram retiradas 293 declarações substituídas e 105 regras obsoletas ou esvaziadas pela limpeza, preservando a ordem da cascata.
- **Visual preservado:** antes do ajuste específico para leitura ampliada, foram comparados estilos calculados e dimensões dos elementos em 32 combinações de página, tema e largura; nenhuma diferença foi encontrada.
- **Menos CSS transferido:** os arquivos anteriores totalizavam 68.889 bytes; o arquivo final tem 68.357 bytes, formatado para facilitar manutenção. Em uma comparação local com gzip, a soma das duas folhas caiu de 14.872 para 12.800 bytes, redução de aproximadamente **13,9%**, além de eliminar uma requisição. A compressão efetiva do servidor pode variar.
- **Ajustes centralizados:** limites de tamanho e preferência de movimento são compartilhados. Os controles do modal e da página de acessibilidade permanecem sincronizados, e mudanças da preferência do sistema são respeitadas.
- **VLibras com nova tentativa:** falhas de conexão permitem repetir a operação. Um script já carregado não é reinserido quando a inicialização do aplicativo demora.
- **Validação numérica:** espaços em branco, objetos, listas e valores não finitos são rejeitados pelos modelos, evitando conversões indevidas para zero.
- **Comparativo consistente:** área coletora, eficiência, perdas e potência da bomba ficam em uma configuração compartilhada pelo HTML inicial e pela interface dinâmica. O controle de irradiância permite passos de 10 W/m² para explorar o caso de circulação muito longa.
- **Progresso de leitura:** atualização também quando muda a altura do conteúdo, como na ampliação do texto e abertura de conteúdos expansíveis.
- **Verificação antes de publicar:** além de links e relações ARIA, o validador confere sitemap, parâmetros documentados e catálogo de vídeos, incluindo existência dos arquivos e cabeçalho WEBVTT.
- **Publicação mantida:** as Actions foram atualizadas para versões oficiais que usam Node 24, mantendo Node 22 para gerar e testar o projeto. O site continua estático, sem dependências de aplicação ou backend.

## Cobertura das páginas e funções

| Página ou recurso | O que foi verificado |
|---|---|
| Início | Links das experiências, etapas Captar/Circular/Conservar, legendas, seleção por Espaço/Enter, animações e pausa. |
| Projeto da piscina | Navegação local, circuito, texto sobre sensores, protocolo experimental e download da ficha CSV. |
| Ciência | Fórmulas, unidades, hipóteses, referências, índice local, conteúdos expansíveis e disponibilidade sem JavaScript. |
| Simuladores — abas | Endereço com fragmento, setas esquerda/direita, volta entre extremos, Home/End, foco e painel ativo. |
| Simulador de aquecimento | Todos os parâmetros, dois exemplos de irradiância, restauração, validação, anúncio de resultados, gráfico redimensionável e tabela equivalente. |
| Simulador de água | Área, evaporação, período, redução, horas de cobertura, gráfico de barras, tabela, anúncio e restauração. |
| Simulador de automação | Quatro cenários, memória da histerese, falha, nível mínimo, temperatura desejada, histórico limitado a seis decisões e restauração. |
| Comparativos | Mesma energia térmica nos dois sistemas, consumo da bomba, custos, tarifa zero, Sol zero, meta atingida, pouca irradiância e validação dos campos. |
| Sustentabilidade | Organização do conteúdo, links, leitura ampliada e acesso pelo teclado. |
| Acessibilidade | Alto contraste, OpenDyslexic, espaçamento, tamanho de 90% a 200%, persistência, restauração, VLibras e catálogo de vídeos. |
| Mapa do site | Destinos para as outras páginas, âncoras das seções e links de dados/download. |
| Recursos compartilhados | Link de salto, menu em celular/computador, página atual, modal, ciclo de Tab/Shift+Tab, Escape, botão de fechar, clique fora e retorno de foco. |
| Falhas e condições alternativas | Preferências malformadas, armazenamento bloqueado, catálogo vazio/indisponível, entrada inválida, erro e atraso do VLibras, navegação sem JavaScript. |

## Conferência científica

Os testes usam exemplos calculados independentemente e relações físicas, incluindo conservação do balanço de água e comportamento nos limites.

- **Calorimetria:** 10.000 L com aumento de 5 °C exigem 209,3 MJ, aproximadamente 58,14 kWh. No cenário inicial da interface, o aumento é de 6 °C: aproximadamente 69,77 kWh e 13,15 horas sob potência útil constante de 5,304 kW.
- **Proporcionalidade:** dobrar o volume dobra a energia e o tempo; reduzir a irradiância pela metade dobra o tempo, mantendo as outras condições.
- **Cobertura:** 32 m², 5 mm/dia e 30 dias resultam em 4.800 L sem cobertura. Cobrir 16 h/dia com redução assumida de 80% evita 2.560 L e deixa 2.240 L para reposição.
- **Histerese:** liga em diferença de 4 °C; continua ligada em 3 °C; desliga em 2 °C. Partindo desligada em 3 °C, permanece desligada. Falha, nível insuficiente e meta atingida têm prioridade.
- **Comparação:** custo e consumo consideram a mesma meta térmica e a bomba durante cada tempo de aquecimento. Com pouca irradiância, a circulação prolongada pode tornar o custo elétrico do cenário solar maior; a interface apresenta esse resultado.
- **Limites explícitos:** irradiância constante, perdas simplificadas, água uniforme e ausência de sensores conectados. Horas sob Sol constante não são uma previsão de calendário.

As seis referências externas usadas no site responderam com HTTP 200 durante a revisão, incluindo OpenStax, EIA, EPA, W3C e documentação do VLibras.

O validador de publicação também foi executado em uma cópia temporária do projeto com catálogos vazio/válido, campos ausentes, endereço externo, arquivo inexistente, formato incorreto, legendas sem cabeçalho e sitemap incompleto. Aceitou os casos válidos e rejeitou os demais; os arquivos reais do catálogo não foram alterados nesses testes.

## Acessibilidade, navegadores e vídeos

Os navegadores automatizados foram **Chromium 151.0.7922.34, Firefox 153 e WebKit 26.5**, em Linux. As larguras verificadas foram **320, 390, 768, 1.024 e 1.440 pixels**. Em cada página, foram usados os perfis padrão, texto a 200% e texto a 200% com alto contraste, OpenDyslexic e espaçamento ampliado.

As 30 auditorias axe-core 4.10.3 cobrem oito páginas em dois temas (16), oito páginas com leitura combinada a 200% (8), abas de água e automação nos dois temas (4) e modal nos dois temas com leitura ampliada (2). Foram executadas regras WCAG A/AA e boas práticas, sem violações detectadas. Os resultados que exigem inspeção manual, incluindo textos de SVG, continuam registrados. Os pares principais de cores estão calculados na [documentação de acessibilidade](verificacao-acessibilidade.md).

O script oficial do VLibras, seu módulo de aplicativo e a página Unity responderam com HTTP 200, após os redirecionamentos oficiais. A abertura do painel e o fechamento do modal na reabertura foram confirmados. Os cenários de falha, atraso e nova tentativa foram reproduzidos com respostas simuladas para permitir testes consistentes.

A estrutura de vídeos foi testada com um arquivo técnico de três segundos: reprodução, pausa, seleção/carregamento das legendas, controles nativos e transcrição expansível funcionaram nos três navegadores. Esse arquivo não contém Libras, foi usado somente nos testes e não foi publicado. O catálogo real permanece vazio, com aviso claro no site.

## Limites da revisão

Não foram realizadas avaliação humana contínua com NVDA/VoiceOver, revisão linguística da tradução em Libras, execução em aparelhos físicos ou medições na piscina real. Testes automáticos e de teclado fornecem evidências de funcionamento, mas não certificam acessibilidade total nem garantem a nota da avaliação.

As gravações reais em Libras ainda não foram fornecidas. A estrutura preparada e a integração do VLibras foram verificadas; a ficha experimental permanece disponível para registrar medições verdadeiras.

## Reproduzir e consultar as evidências

```bash
node scripts/construir.mjs
node --test testes/modelos.test.cjs
node scripts/verificar.mjs
node scripts/publicar.mjs
python3 testes/navegador.py --axe /tmp/sol-agua-axe.min.js --saida test-results
python3 testes/revisao.py --navegadores chromium firefox webkit --saida test-results/revisao
```

Os comandos de navegador pressupõem um servidor em `http://127.0.0.1:4173/` e as ferramentas de teste instaladas. Instruções completas, incluindo a mídia técnica opcional: [verificacao-acessibilidade.md](verificacao-acessibilidade.md).

- [Resultados estruturados dos testes](relatorio-acessibilidade.json)
- [Testes funcionais e de regressão](../testes/revisao.py)
- [Auditoria de acessibilidade](../testes/navegador.py)
- [Testes científicos](../testes/modelos.test.cjs)
- [Histórico de publicação no GitHub Actions](https://github.com/Ryan20014737472/Projeto-integrador-1.2/actions/workflows/pages.yml)
