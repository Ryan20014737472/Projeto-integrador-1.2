# Modelos, hipóteses e fontes

A fundamentação também está disponível em `ciencia.html`. Modelos: `assets/js/modelos.js`. Inventário: `dados/parametros.json`.

## Aquecimento

Massa em kg aproximada pelo volume em litros. Calor específico de 4.186 J/(kg·°C). ΔT = máximo de 0 e (meta − temperatura inicial).

```text
Q[J] = m × c × ΔT
Q[kWh] = Q[J] / 3.600.000
Pcoletada[kW] = G[W/m²] × A[m²] × η / 1.000
Pútil[kW] = Pcoletada × (1 − p)
t[h] = Q[kWh] / Pútil[kW]
```

η é a eficiência do coletor; p representa perdas adicionais após o coletor. As parcelas estão separadas para evitar contabilizar a mesma perda duas vezes.

Exemplo independente: 10.000 L, ΔT = 5 °C ⇒ 209.300.000 J ≈ 58,1389 kWh. Com G = 800 W/m², A = 12 m², η = 0,65 e p = 0,15, Pútil = 5,304 kW e t ≈ 11,0 h.

Sem irradiância e com necessidade de calor, tempo indisponível (`null`); meta atingida implica energia e tempo zero.

Fontes: [OpenStax, seção 14.2](https://openstax.org/books/college-physics-2e/pages/14-2-temperature-change-and-heat-capacity) e [EIA, coletores térmicos](https://www.eia.gov/energyexplained/solar/solar-thermal-collectors.php).

## Evaporação

1 mm × 1 m² = 0,001 m³ = 1 L.

```text
Vsem[L] = área[m²] × taxa[mm/dia] × dias
fração evitada = redução durante cobertura × horas cobertas / 24
Veconomizado = Vsem × fração evitada
Vcom = Vsem − Veconomizado
```

32 m² × 5 mm/dia × 30 dias = 4.800 L. Redução de 80% durante 16 h/dia ⇒ 2.560 L evitados e 2.240 L restantes.

Evaporação uniforme é uma simplificação. Chuva, vazamentos, limpeza e respingos são excluídos. A taxa padrão é ilustrativa.

A [EPA/WaterSense](https://www.epa.gov/watersense/pool-water-efficiency) relata até 95% de redução com cobertura adequada. O padrão de 80% é uma hipótese ajustável, não um dado atribuído à EPA.

## Automação

Prioridades: falha, nível abaixo de 40%, meta térmica e disponibilidade de calor. Liga com diferença ≥ 4 °C; já ligada, continua até diferença ≤ 2 °C. Entre os limites, preserva o estado anterior. Limiares didáticos, sem equipamento conectado. A rotina de filtragem é separada.

## Comparativo

Mesma massa, meta e perda adicional. Resistência de 6 kW elétricos, eficiência assumida de 95%; coletor de 12 m², eficiência assumida de 65%; bomba de 100 W durante o respectivo aquecimento.

```text
tresistência = Q / [6 × 0,95 × (1 − p)]
Erede,resistência = (6 + 0,1) × tresistência
Erede,solar = 0,1 × tsolar
custo = Erede × tarifa
```

Exclui investimento, instalação, manutenção, demanda tarifária e filtragem regular. Tarifa de exemplo: R$ 0,90/kWh. Sol muito fraco pode prolongar a circulação e aumentar o custo elétrico do solar; o modelo permite esse resultado.

## Limites

Água bem misturada, parâmetros constantes e ausência de mudança de fase. Perdas ambientais resumidas em uma fração. Horas sob Sol constante não equivalem a horas de calendário. Não há previsão de clima, resfriamento noturno ou dinâmica hidráulica.

Testes usam exemplos independentes, proporções e casos-limite. Para validação real, siga `projeto-piscina.html#experimento` e use `dados/registro-experimental.csv`.
