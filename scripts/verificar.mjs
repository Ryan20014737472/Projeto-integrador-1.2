import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import modelos from '../assets/js/modelos.js';
import {baseUrl} from './layout.mjs';
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
for(const arquivoCss of (await readdir(resolve(raiz,'assets/css'))).filter(n=>n.endsWith('.css'))){
  const css=await readFile(resolve(raiz,'assets/css',arquivoCss),'utf8');
  for(const m of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)){
    try{await access(resolve(raiz,'assets/css',m[1]));}catch{erros.push(`${arquivoCss}: recurso ausente ${m[1]}`);}
  }
}
const parametros=JSON.parse(await readFile(resolve(raiz,'dados/parametros.json'),'utf8'));
if(parametros.calor_especifico.valor!==modelos.CALOR_ESPECIFICO)erros.push('Calor específico não corresponde ao modelo documentado.');
if(parametros.comparativo.potencia_bomba_w!==modelos.CENARIO_COMPARATIVO.bomba)erros.push('Potência da bomba não corresponde ao comparativo documentado.');
const sitemap=await readFile(resolve(raiz,'sitemap.xml'),'utf8');
const destinos=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(destinos.length!==arquivos.length || arquivos.some(nome=>!destinos.includes(baseUrl+nome)))erros.push('O sitemap deve listar todas as páginas, uma vez cada.');
const catalogo=JSON.parse(await readFile(resolve(raiz,'dados/videos.json'),'utf8'));
if(!Array.isArray(catalogo.videos))erros.push('O catálogo deve conter uma lista de vídeos.');
else for(const [indice,item] of catalogo.videos.entries()){
  const prefixo=`Vídeo ${indice+1}:`;
  if(!item || !['titulo','arquivo','legendas','transcricao'].every(chave=>typeof item[chave]==='string' && item[chave].trim())){
    erros.push(`${prefixo} título, arquivo, legendas e transcrição são obrigatórios.`);continue;
  }
  for(const [chave,extensao] of [['arquivo',/\.(mp4|webm)$/i],['legendas',/\.vtt$/i]]){
    const url=new URL(item[chave],baseUrl);
    const pasta=new URL('assets/videos/',baseUrl);
    if(url.origin!==pasta.origin || !url.pathname.startsWith(pasta.pathname) || !extensao.test(url.pathname)){
      erros.push(`${prefixo} ${chave} deve ser um arquivo local de assets/videos/ com o formato correto.`);continue;
    }
    const caminho=decodeURIComponent(url.pathname.slice(new URL(baseUrl).pathname.length));
    try{
      await access(resolve(raiz,caminho));
      if(chave==='legendas' && !(await readFile(resolve(raiz,caminho),'utf8')).trimStart().startsWith('WEBVTT'))erros.push(`${prefixo} legendas sem cabeçalho WEBVTT.`);
    }catch{erros.push(`${prefixo} arquivo ausente ${caminho}`);}
  }
}
if(erros.length){console.error(erros.join('\n'));process.exit(1);}
console.log(`${arquivos.length} páginas: links, âncoras, recursos locais, sitemap, catálogo e referências de acessibilidade válidos.`);
