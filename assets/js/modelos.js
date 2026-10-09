/* Modelos didáticos independentes da interface. Unidades e hipóteses em ciencia.html. */
(function (root) {
  'use strict';
  const CALOR_ESPECIFICO = 4186; // J / (kg · °C), água aproximada.
  const JOULES_POR_KWH = 3600000;
  const CENARIO_COMPARATIVO = Object.freeze({ area: 12, eficiencia: 65, perdas: 15, bomba: 100 });
  function numero(valor, nome, minimo, maximo) {
    if (!['number','string'].includes(typeof valor) || (typeof valor === 'string' && valor.trim() === '')) {
      throw new RangeError(`${nome}: informe um número.`);
    }
    const n = Number(valor);
    if (!Number.isFinite(n) || n < minimo || n > maximo) {
      throw new RangeError(`${nome}: valor fora do intervalo permitido.`);
    }
    return n;
  }
  function aquecimento(entrada) {
    const volume = numero(entrada.volume, 'Volume', 1, 1000000);
    const inicial = numero(entrada.inicial, 'Temperatura inicial', 0, 50);
    const alvo = numero(entrada.alvo, 'Temperatura desejada', 0, 50);
    const area = numero(entrada.area, 'Área coletora', 0.1, 1000);
    const irradiancia = numero(entrada.irradiancia, 'Irradiância', 0, 1500);
    const eficiencia = numero(entrada.eficiencia, 'Eficiência', 1, 100) / 100;
    const perdas = numero(entrada.perdas, 'Perdas adicionais', 0, 95) / 100;
    const delta = Math.max(0, alvo - inicial);
    // Aproximação: 1 litro de água = 1 kg na faixa de temperaturas usada.
    const energia = volume * CALOR_ESPECIFICO * delta / JOULES_POR_KWH;
    const potenciaColetada = irradiancia * area * eficiencia / 1000;
    const potenciaUtil = potenciaColetada * (1 - perdas);
    const horas = energia === 0 ? 0 : potenciaUtil === 0 ? null : energia / potenciaUtil;
    return { volume, inicial, alvo, area, irradiancia, eficiencia, perdas, delta,
      energia, potenciaColetada, potenciaUtil, horas };
  }
  function agua(entrada) {
    const area = numero(entrada.area, 'Área superficial', 0.1, 10000);
    const evaporacao = numero(entrada.evaporacao, 'Evaporação', 0, 30);
    const dias = numero(entrada.dias, 'Período', 1, 366);
    const horasCoberta = numero(entrada.horasCoberta, 'Horas de cobertura', 0, 24);
    const reducao = numero(entrada.reducao, 'Redução durante a cobertura', 0, 95) / 100;
    const semCobertura = area * evaporacao * dias; // 1 mm sobre 1 m² = 1 L.
    const fracaoEvitada = horasCoberta / 24 * reducao;
    const economizada = semCobertura * fracaoEvitada;
    return { area, evaporacao, dias, horasCoberta, reducao, semCobertura,
      fracaoEvitada, economizada, comCobertura: semCobertura - economizada };
  }
  function automacao(entrada, estavaLigada = false) {
    const piscina = numero(entrada.piscina, 'Temperatura da piscina', 0, 50);
    const coletor = numero(entrada.coletor, 'Temperatura do coletor', 0, 80);
    const alvo = numero(entrada.alvo, 'Temperatura desejada', 5, 40);
    const nivel = numero(entrada.nivel, 'Nível de água', 0, 100);
    const diferenca = coletor - piscina;
    // Limiares demonstrativos: nível mínimo 40%, ligar ΔT >= 4°C, desligar ΔT <= 2°C.
    if (entrada.falha) return { ligada: false, motivo: 'Falha de sensor: bomba desligada por segurança.', diferenca, estado: 'bloqueada' };
    if (nivel < 40) return { ligada: false, motivo: 'Nível abaixo de 40%: circulação bloqueada para proteger a bomba.', diferenca, estado: 'bloqueada' };
    if (piscina >= alvo) return { ligada: false, motivo: 'Temperatura desejada atingida: aquecimento desligado.', diferenca, estado: 'aguardando' };
    const ligada = estavaLigada ? diferenca > 2 : diferenca >= 4;
    const motivo = ligada
      ? estavaLigada && diferenca < 4 ? 'Bomba mantida ligada: diferença acima de 2 °C, dentro da faixa de histerese.' : 'Coletor pelo menos 4 °C mais quente: circulação de aquecimento ligada.'
      : estavaLigada ? 'Diferença de até 2 °C: circulação de aquecimento desligada.' : 'Aguardando diferença de pelo menos 4 °C para iniciar o aquecimento.';
    return { ligada, motivo, diferenca, estado: ligada ? 'aquecendo' : 'aguardando' };
  }
  function comparacao(entrada) {
    const solar = aquecimento(entrada);
    const tarifa = numero(entrada.tarifa, 'Tarifa', 0, 10);
    const bomba = numero(entrada.bomba, 'Potência da bomba', 0, 5000) / 1000;
    // Resistência: 6 kW elétricos, eficiência 95%; mesma perda adicional e mesma bomba.
    const potenciaEletrica = 6;
    const eficienciaEletrica = 0.95;
    const horasEletrica = solar.energia / (potenciaEletrica * eficienciaEletrica * (1 - solar.perdas));
    const energiaEletrica = (potenciaEletrica + bomba) * horasEletrica;
    const energiaSolarRede = solar.horas === null ? null : bomba * solar.horas;
    return { solar, tarifa, bomba, horasEletrica, energiaEletrica, energiaSolarRede,
      custoEletrico: energiaEletrica * tarifa,
      custoSolar: energiaSolarRede === null ? null : energiaSolarRede * tarifa,
      economia: energiaSolarRede === null ? null : (energiaEletrica - energiaSolarRede) * tarifa };
  }
  const api = { CALOR_ESPECIFICO, JOULES_POR_KWH, CENARIO_COMPARATIVO, aquecimento, agua, automacao, comparacao };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ModelosPiscina = Object.freeze(api);
})(typeof globalThis !== 'undefined' ? globalThis : this);

