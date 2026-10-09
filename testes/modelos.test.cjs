const test=require('node:test');
const assert=require('node:assert/strict');
const {aquecimento,agua,automacao,comparacao,CENARIO_COMPARATIVO}=require('../assets/js/modelos.js');
const base={volume:10000,inicial:22,alvo:27,area:12,irradiancia:800,eficiencia:65,perdas:15};
const perto=(valor,esperado)=>assert.ok(Math.abs(valor-esperado)<1e-9,`${valor} ≠ ${esperado}`);

test('calorimetria: 10.000 L e 5°C correspondem a 209,3 MJ',()=>{
  const r=aquecimento(base);perto(r.energia*3600000,209300000);perto(r.potenciaUtil,5.304);perto(r.horas,209300000/3600000/5.304);
});
test('duplicar a massa ou reduzir irradiância pela metade dobra o tempo',()=>{
  const a=aquecimento(base),b=aquecimento({...base,volume:20000}),c=aquecimento({...base,irradiancia:400});
  perto(b.energia,2*a.energia);perto(b.horas,2*a.horas);perto(c.horas,2*a.horas);
});
test('ausência de Sol retorna tempo indisponível, sem infinito',()=>{
  const r=aquecimento({...base,irradiancia:0});assert.equal(r.horas,null);assert.equal(r.potenciaUtil,0);assert.ok(r.energia>0);
});
test('meta atingida ou inferior dispensa acrescentar calor',()=>{
  for(const alvo of [22,20]){const r=aquecimento({...base,alvo,irradiancia:0});assert.equal(r.energia,0);assert.equal(r.horas,0);}
});
test('valores inválidos não são tratados como medições zero',()=>{
  for(const volume of ['', '   ', '\n', null,undefined,NaN,Infinity,-1,true, false, [], [10000], {}])assert.throws(()=>aquecimento({...base,volume}),RangeError);
  assert.throws(()=>aquecimento({...base,eficiencia:0}),RangeError);assert.throws(()=>aquecimento({...base,perdas:100}),RangeError);
});
test('dados numéricos dos formulários preservam unidades e resultados',()=>{
  const strings=Object.fromEntries(Object.entries(base).map(([chave,valor])=>[chave,String(valor)]));
  assert.deepEqual(aquecimento(strings),aquecimento(base));
  const dados={area:32,evaporacao:5,dias:30,horasCoberta:16,reducao:80};
  const dadosStrings=Object.fromEntries(Object.entries(dados).map(([chave,valor])=>[chave,String(valor)]));
  assert.deepEqual(agua(dadosStrings),agua(dados));
});
test('cobertura progressiva conserva o balanço e nunca cria água',()=>{
  for(const horasCoberta of [0,1,12,16,24])for(const reducao of [0,50,80,95]){
    const r=agua({area:32,evaporacao:5,dias:30,horasCoberta,reducao});
    perto(r.semCobertura,r.comCobertura+r.economizada);
    assert.ok(r.comCobertura>=0 && r.comCobertura<=r.semCobertura);
    assert.ok(r.economizada>=0 && r.economizada<=r.semCobertura);
  }
});
test('limites dos modelos rejeitam condições fora das hipóteses',()=>{
  const dados={area:32,evaporacao:5,dias:30,horasCoberta:16,reducao:80};
  for(const entrada of [{...dados,horasCoberta:25},{...dados,reducao:100},{...dados,dias:0}])assert.throws(()=>agua(entrada),RangeError);
  for(const bomba of ['',-1,5001])assert.throws(()=>comparacao({...base,tarifa:.9,bomba}),RangeError);
  assert.throws(()=>comparacao({...base,bomba:100,tarifa:11}),RangeError);
});
test('comparativo compartilhado permanece consistente com o cenário documentado',()=>{
  assert.ok(Object.isFrozen(CENARIO_COMPARATIVO));
  const r=comparacao({...base,...CENARIO_COMPARATIVO,tarifa:.9});
  const gratuito=comparacao({...base,...CENARIO_COMPARATIVO,tarifa:0});
  perto(r.solar.energia,gratuito.solar.energia);
  perto(r.energiaSolarRede,gratuito.energiaSolarRede);
  assert.equal(gratuito.custoSolar,0);assert.equal(gratuito.custoEletrico,0);
});
test('geometria e cobertura: cenário de 32 m² poupa 2.560 L',()=>{
  const r=agua({area:32,evaporacao:5,dias:30,horasCoberta:16,reducao:80});
  perto(r.semCobertura,4800);perto(r.economizada,2560);perto(r.comCobertura,2240);
});
test('cobertura ausente, total e evaporação zero respeitam os limites',()=>{
  const baseAgua={area:32,evaporacao:5,dias:30,horasCoberta:0,reducao:95};
  assert.equal(agua(baseAgua).economizada,0);perto(agua({...baseAgua,horasCoberta:24}).comCobertura,240);
  const zero=agua({...baseAgua,evaporacao:0});assert.equal(zero.semCobertura,0);assert.equal(zero.comCobertura,0);
});
test('histerese preserva memória entre 2°C e 4°C',()=>{
  const sensores={piscina:22,coletor:26,alvo:28,nivel:80,falha:false};
  assert.equal(automacao(sensores,false).ligada,true);
  assert.equal(automacao({...sensores,coletor:25},true).ligada,true);
  assert.equal(automacao({...sensores,coletor:25},false).ligada,false);
  assert.equal(automacao({...sensores,coletor:24},true).ligada,false);
});
test('falha, nível insuficiente e meta atingida têm prioridade',()=>{
  const s={piscina:22,coletor:40,alvo:28,nivel:80,falha:false};
  for(const item of [{...s,falha:true},{...s,nivel:39},{...s,piscina:28}])assert.equal(automacao(item,true).ligada,false);
  assert.equal(automacao({...s,nivel:40},false).ligada,true);
});
test('comparativo inclui a bomba e usa a mesma energia térmica',()=>{
  const r=comparacao({...base,tarifa:.9,bomba:100});
  perto(r.energiaEletrica,(6+.1)*(209300000/3600000)/(6*.95*.85));
  perto(r.energiaSolarRede,.1*aquecimento(base).horas);perto(r.custoEletrico,r.energiaEletrica*.9);
});
test('comparativo não promete economia sem Sol nem quando há consumo maior',()=>{
  const zero=comparacao({...base,irradiancia:0,tarifa:.9,bomba:100});assert.equal(zero.custoSolar,null);assert.equal(zero.economia,null);
  const poucoSol=comparacao({...base,irradiancia:1,tarifa:.9,bomba:100});assert.ok(poucoSol.economia<0);
  const meta=comparacao({...base,alvo:20,irradiancia:0,tarifa:.9,bomba:100});assert.equal(meta.energiaEletrica,0);assert.equal(meta.energiaSolarRede,0);
});
