import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { layout, baseUrl } from './layout.mjs';
import { paginas } from './paginas.mjs';
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const pagina of paginas) {
  await writeFile(resolve(raiz,pagina.arquivo),layout(pagina.arquivo,pagina.titulo,pagina.descricao,pagina.conteudo,pagina.simulacao));
}
await writeFile(resolve(raiz,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paginas.map(p=>`  <url><loc>${baseUrl}${p.arquivo}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`${paginas.length} páginas estáticas geradas para GitHub Pages.`);

