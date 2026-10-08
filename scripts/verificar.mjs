import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const raiz=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const arquivos=(await readdir(raiz)).filter(n=>n.endsWith('.html'));
const documentos=new Map();const erros=[];
for(const arquivo of arquivos){
  const html=await readFile(resolve(raiz,arquivo),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(ids.length!==new Set(ids).size)erros.push(`${arquivo}: IDs repetidos.`);
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)erros.push(`${arquivo}: deve ter um título principal.`);
  if(!html.includes('lang="pt-BR"') || !html.includes('id="conteudo"'))erros.push(`${arquivo}: idioma ou conteúdo principal ausente.`);
  documentos.set(arquivo,{html,ids:new Set(ids)});
}
for(const [arquivo,{html,ids}] of documentos){
  for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const url=m[1].replaceAll('&amp;','&');if(/^(https?:|data:|mailto:|tel:)/.test(url))continue;
    const [caminho,fragmento]=url.split('#');
    const destino=caminho || arquivo;
    if(caminho){try{await access(resolve(raiz,caminho));}catch{erros.push(`${arquivo}: arquivo ausente ${caminho}`);continue;}}
    if(fragmento && destino.endsWith('.html') && !documentos.get(destino)?.ids.has(fragmento))erros.push(`${arquivo}: seção ausente ${url}`);
  }
  for(const m of html.matchAll(/\b(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)){
    for(const id of m[1].split(' '))if(!ids.has(id))erros.push(`${arquivo}: referência de acessibilidade sem destino: ${id}`);
  }
}
const css=await readFile(resolve(raiz,'assets/css/estilos.css'),'utf8');
for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
  try{await access(resolve(raiz,'assets/css',m[1]));}catch{erros.push(`CSS: recurso ausente ${m[1]}`);}
}
const parametros=JSON.parse(await readFile(resolve(raiz,'dados/parametros.json'),'utf8'));
if(parametros.calor_especifico.valor!==4186)erros.push('Calor específico não corresponde ao modelo documentado.');
if(erros.length){console.error(erros.join('\n'));process.exit(1);}
console.log(`${arquivos.length} páginas: links, âncoras, recursos locais e referências de acessibilidade válidos.`);
