/* Ilustrações vetoriais do projeto. A geometria é conceitual, sem escala física. */
export function paisagemPiscina() {
  return `<figure class="pool-scene" data-pool-scene data-stage="captar">
    <div class="scene-heading"><span>ESTUDO DO SISTEMA</span><span>Sol + Água / Fig. 01</span></div>
    <svg class="pool-landscape" viewBox="0 0 720 570" role="img" aria-labelledby="paisagem-titulo paisagem-descricao">
      <title id="paisagem-titulo">Piscina com coletor solar, circulação de água e cobertura</title>
      <desc id="paisagem-descricao">Desenho em perspectiva de uma piscina azul. Um coletor solar recebe radiação do Sol e transfere calor para a água. Tubos conectam o coletor à piscina por uma bomba. A etapa de conservação mostra uma cobertura sobre a superfície. A geometria é ilustrativa, sem escala.</desc>
      <defs>
        <clipPath id="paisagem-agua"><path d="M176 296 337 215 551 337 390 418Z"/></clipPath>
        <pattern id="paisagem-azulejos" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .57 -1 .5 340 215)"><path d="M36 0H0V36" fill="none" stroke="#a6daed" stroke-width="1" opacity=".42"/></pattern>
        <pattern id="paisagem-cobertura" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V18" stroke="#0e4a69" stroke-width="2" opacity=".35"/></pattern>
        <clipPath id="paisagem-cobertura-revela"><rect class="scene-cover-window" x="175" y="210" width="380" height="215"/></clipPath>
      </defs>
      <path class="scene-orbit" d="M450 129c-11-88 93-137 164-82s72 160-12 205" fill="none" stroke="#a2aaa0" stroke-width="1" stroke-dasharray="3 8"/>
      <g class="scene-sun">
        <circle cx="590" cy="111" r="55" fill="#efc44a"/>
        <g class="scene-sun-rays" fill="none" stroke="#b77900" stroke-width="2">
          <path d="M590 37v-15m0 178v-15M516 111h-15m178 0h-15M538 59l-11-11m126 126-11-11M538 163l-11 11M653 48l-11 11"/>
        </g>
      </g>
      <g class="scene-rays" stroke="#bb870e" stroke-width="2" fill="none" stroke-dasharray="8 10">
        <path d="M532 137 300 186M542 161 300 208" class="thermal-pulse"/>
      </g>
      <path d="M54 342 366 167 690 350 388 531Z" fill="#16343a" opacity=".07"/>
      <path d="M67 291 361 128 681 310 389 476v27L67 319Z" fill="#cfcebd"/>
      <path d="M67 291 361 128 681 310 389 476Z" fill="#e9e6d6" stroke="#bbc0b2" stroke-width="1.5"/>
      <path d="M389 476v27l292-166v-27" fill="#b7bbaa"/>
      <g stroke="#b8bdaf" stroke-width="1" opacity=".7"><path d="M137 252 457 433M209 212 531 391M283 171 605 350M135 330 427 165M212 373 502 208M291 420 580 251"/></g>
      <path d="M151 294 335 195 580 336 393 439Z" fill="#fbfaf5" stroke="#adbaad" stroke-width="2"/>
      <path d="M170 295 337 208 561 337 391 425Z" fill="#083f6b"/>
      <path d="M176 296 337 215 551 337 390 418Z" fill="#197bab"/>
      <g clip-path="url(#paisagem-agua)">
        <path d="M337 215v24L198 309l-22-13Z" fill="#124f76"/>
        <path d="M337 215 551 337l-21 12-193-110Z" fill="#135c88"/>
        <rect x="155" y="200" width="425" height="235" fill="url(#paisagem-azulejos)"/>
        <g class="scene-water-lines" fill="none" stroke="#bbe8ec" stroke-width="2" opacity=".58">
          <path d="M143 323q30-20 60-3t60-3 60-3 60-3 60-3 60-3 60-3 60-3"/>
          <path d="M123 354q30-20 60-3t60-3 60-3 60-3 60-3 60-3 60-3 60-3"/>
          <path d="M123 387q30-20 60-3t60-3 60-3 60-3 60-3 60-3 60-3 60-3"/>
        </g>
        <g class="scene-water-glints" fill="none" stroke="#e3f4f1" stroke-width="1.5" opacity=".65"><path d="m262 301 26 15m-13-19 3 23M395 342l23 13m-10-18-1 24M354 273l22 13m-10-18v23"/></g>
      </g>
      <g class="scene-cover" clip-path="url(#paisagem-cobertura-revela)"><path d="M176 296 337 215 551 337 390 418Z" fill="#90b6b6"/><path d="M176 296 337 215 551 337 390 418Z" fill="url(#paisagem-cobertura)"/><path d="M176 296 337 215 551 337 390 418Z" fill="none" stroke="#366871" stroke-width="2"/></g>
      <g class="scene-collector">
        <path d="M143 240v19m165-43v17" stroke="#616e66" stroke-width="5"/>
        <path d="M133 228 245 165 317 207 205 270Z" fill="#10303c" stroke="#6a7973" stroke-width="3"/>
        <path d="m150 231 98-55 13 8-98 55 14 8 98-55 13 8-98 55 14 8 98-55" fill="none" stroke="#dfb544" stroke-width="4" stroke-linejoin="round"/>
      </g>
      <path d="M204 265 124 311 124 364 143 375 194 345" fill="none" stroke="#345867" stroke-width="8" stroke-linejoin="round"/>
      <path d="M204 265 124 311 124 364 143 375 194 345" fill="none" stroke="#b5e1e5" stroke-width="3" class="flow-line scene-flow-cold"/>
      <path d="M310 214 365 183 614 325 563 354 523 332" fill="none" stroke="#a78127" stroke-width="7" stroke-linejoin="round"/>
      <path d="M310 214 365 183 614 325 563 354 523 332" fill="none" stroke="#fff0ad" stroke-width="3" class="flow-line scene-flow-warm"/>
      <g class="scene-pump"><circle cx="124" cy="354" r="17" fill="#fbfaf5" stroke="#345867" stroke-width="3"/><path d="m117 347 13 7-13 7Z" fill="#116386"/></g>
      <g fill="none" stroke="#f5f2e8" stroke-width="5" stroke-linecap="round"><path d="m459 297 8-5q8-4 15 5l15 20v24m-26-35 8-5q8-4 15 5l15 20v24"/><path d="m491 319 13 8m-5 3 9 5" stroke-width="3"/></g>
      <g class="scene-marker" data-scene-marker="captar"><path d="M125 180h48l19 15"/><circle cx="109" cy="180" r="16"/><text x="109" y="185">01</text></g>
      <g class="scene-marker" data-scene-marker="circular"><path d="M78 399h38l8-24"/><circle cx="62" cy="399" r="16"/><text x="62" y="404">02</text></g>
      <g class="scene-marker" data-scene-marker="conservar"><path d="M542 455h-46l-20-43"/><circle cx="558" cy="455" r="16"/><text x="558" y="460">03</text></g>
      <path d="M241 470 373 544l247-139" fill="none" stroke="#87968b" stroke-width="1"/>
      <path d="m236 477 10-17m122 76 10 17m236-155 10 16" stroke="#87968b" stroke-width="1"/>
    </svg>
    <div class="scene-controls js-only" role="group" aria-label="Etapas ilustradas do projeto"><button type="button" data-scene-stage="captar" aria-pressed="true" aria-controls="paisagem-legenda"><span>01</span> Captar</button><button type="button" data-scene-stage="circular" aria-pressed="false" aria-controls="paisagem-legenda"><span>02</span> Circular</button><button type="button" data-scene-stage="conservar" aria-pressed="false" aria-controls="paisagem-legenda"><span>03</span> Conservar</button></div>
    <figcaption id="paisagem-legenda" class="scene-caption" aria-live="polite" aria-atomic="true">O coletor recebe a radiação solar e transfere calor para a água.</figcaption>
    <div class="scene-footnote"><span>Ilustração conceitual · sem escala</span><button type="button" class="scene-motion js-only" data-toggle-motion aria-pressed="false"><span aria-hidden="true">Ⅱ</span><span data-motion-label>Pausar animação</span></button></div>
  </figure>`;
}

export function vinheta(tipo) {
  const desenhos = {
    calor: `<circle cx="59" cy="42" r="21" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M59 9V1m0 82v-8M26 42h-8m82 0h-8M35 18l-6-6m60 60-6-6M35 66l-6 6m60-60-6 6"/><path d="M130 17v45a15 15 0 1 1-15 0V17a7.5 7.5 0 0 1 15 0Z"/><path d="M122 37v41" stroke-width="5"/><path d="M142 25h12m-12 17h8m-8 17h12"/></g>`,
    agua: `<g fill="none" stroke="currentColor" stroke-width="2"><path d="M10 34q15-12 30 0t30 0 30 0 30 0 30 0M10 55q15-12 30 0t30 0 30 0 30 0 30 0M10 76q15-12 30 0t30 0 30 0 30 0 30 0" class="mini-waves"/><path d="M39 9v8m31-8v8m30-8v8m30-8v8"/></g>`,
    controle: `<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 49h34m48 0h30m15-14V19h25m-25 44v16h25"/><circle cx="25" cy="49" r="4" fill="currentColor" class="mini-signal"/><path d="m47 49 24-24 24 24-24 24Z"/><circle cx="139" cy="49" r="15"/><path d="m134 42 12 7-12 7Z" fill="currentColor"/></g>`
  };
  return `<svg class="experiment-sketch" viewBox="0 0 180 100" aria-hidden="true" focusable="false">${desenhos[tipo]}</svg>`;
}

export function emblemaPagina() {
  return `<svg class="page-emblem" viewBox="0 0 220 180" aria-hidden="true" focusable="false"><circle cx="144" cy="61" r="42" fill="var(--sun)"/><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 119q22-15 44 0t44 0 44 0 44 0M18 139q22-15 44 0t44 0 44 0 44 0M18 159q22-15 44 0t44 0 44 0 44 0"/><path d="M89 61H74m70-55V0m55 61h15m-30-40 10-10"/></g></svg>`;
}
