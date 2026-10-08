import {cp,mkdir,rm,readdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const raiz=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const destino=resolve(raiz,'_site');
await rm(destino,{recursive:true,force:true});await mkdir(destino,{recursive:true});
for(const entrada of await readdir(raiz)) {
  if(entrada.endsWith('.html') || ['assets','dados','robots.txt','sitemap.xml','.nojekyll'].includes(entrada)) {
    await cp(resolve(raiz,entrada),resolve(destino,entrada),{recursive:true});
  }
}
console.log('Arquivos públicos preparados em _site/.');
