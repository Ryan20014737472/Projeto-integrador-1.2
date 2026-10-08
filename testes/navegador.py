"""Verificação de integração e acessibilidade. Requer Playwright e axe-core local."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4173/')
parser.add_argument('--axe', required=True)
parser.add_argument('--saida', default='test-results')
args = parser.parse_args()
destino = Path(args.saida)
destino.mkdir(parents=True, exist_ok=True)
base = args.url.rstrip('/') + '/'
paginas = ['index.html','projeto-piscina.html','ciencia.html','simuladores.html',
           'comparativos.html','sustentabilidade.html','acessibilidade.html','mapa-do-site.html']
relatorio = {'axe': [], 'responsividade': [], 'interacoes': [], 'erros_js': []}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width':1440,'height':1000})
    page = context.new_page()
    page.on('pageerror', lambda error: relatorio['erros_js'].append(str(error)))
    for tema in ['light','contrast']:
        page.goto(base, wait_until='networkidle')
        page.evaluate('(contraste) => localStorage.setItem("sol-agua-leitura", JSON.stringify({contraste,tamanho:100,dislexia:false,espaco:false,movimento:true}))', tema == 'contrast')
        for nome in paginas:
            page.goto(base+nome, wait_until='networkidle')
            page.add_script_tag(path=args.axe)
            resultado = page.evaluate('''async () => {
              const r = await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});
              return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length};
            }''')
            relatorio['axe'].append({'pagina':nome,'tema':tema,**resultado})
            print(f"axe {tema} {nome}: {len(resultado['violations'])} violações", flush=True)
            if nome in ['index.html','comparativos.html','simuladores.html']:
                page.screenshot(path=str(destino/f'{nome.removesuffix(".html")}-{tema}-desktop.png'),full_page=True)
    page.evaluate('localStorage.clear()')
    for largura in [320,390,768,1024,1440]:
        page.set_viewport_size({'width':largura,'height':900})
        for nome in paginas:
            page.goto(base+nome,wait_until='networkidle')
            overflow=page.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
            relatorio['responsividade'].append({'pagina':nome,'largura':largura,'overflow':overflow})
            if largura==390 and nome in ['index.html','simuladores.html','comparativos.html']:
                page.screenshot(path=str(destino/f'{nome.removesuffix(".html")}-mobile.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.goto(base+'index.html',wait_until='networkidle')
    page.keyboard.press('Tab')
    assert page.evaluate('document.activeElement.classList.contains("skip-link")')
    page.keyboard.press('Enter')
    assert page.evaluate('document.activeElement.id') == 'conteudo'
    page.locator('.menu-toggle').click()
    expect(page.locator('.menu-toggle')).to_have_attribute('aria-expanded','true')
    page.locator('#menu-principal a').first.focus()
    page.keyboard.press('Escape')
    expect(page.locator('.menu-toggle')).to_have_attribute('aria-expanded','false')
    assert page.evaluate('document.activeElement.classList.contains("menu-toggle")')
    page.locator('[data-open-accessibility]').click()
    assert page.locator('dialog').evaluate('(e)=>e.open')
    for _ in range(20):
        page.keyboard.press('Tab')
        assert page.evaluate('document.activeElement.closest("dialog") !== null')
    for _ in range(20):
        page.keyboard.press('Shift+Tab')
        assert page.evaluate('document.activeElement.closest("dialog") !== null')
    page.keyboard.press('Escape')
    assert not page.locator('dialog').evaluate('(e)=>e.open')
    assert page.evaluate('document.activeElement.hasAttribute("data-open-accessibility")')
    relatorio['interacoes'].append('Link de salto, menu e modal operáveis pelo teclado, com retorno de foco.')

    page.goto(base+'simuladores.html',wait_until='networkidle')
    page.locator('#aba-aquecimento').focus()
    page.keyboard.press('ArrowRight')
    expect(page.locator('#aba-agua')).to_have_attribute('aria-selected','true')
    page.keyboard.press('End')
    expect(page.locator('#aba-automacao')).to_have_attribute('aria-selected','true')
    page.keyboard.press('Home')
    expect(page.locator('#aba-aquecimento')).to_have_attribute('aria-selected','true')
    expect(page.locator('#calor-horas')).to_contain_text('13,2')
    page.locator('#calor-volume').fill('20000')
    expect(page.locator('#calor-horas')).to_contain_text('26,3')
    page.locator('#calor-volume').fill('')
    expect(page.locator('#calor-erro')).to_contain_text('último cenário válido')
    page.locator('#form-calor button[type=reset]').click()
    expect(page.locator('#calor-volume')).to_have_value('10000')
    page.locator('#calor-sol').focus()
    page.keyboard.press('ArrowRight')
    expect(page.locator('#calor-sol')).to_have_value('850')
    page.locator('#calor-sol').fill('0')
    expect(page.locator('#calor-estado')).to_contain_text('não há aquecimento')
    page.locator('#calor-alvo').fill('20')
    expect(page.locator('#calor-estado')).to_have_text('Meta já atingida')
    relatorio['interacoes'].append('Abas, aquecimento, restauração, campo vazio, controle por setas, Sol zero e meta atingida.')

    page.locator('#aba-agua').click()
    expect(page.locator('#agua-poupada')).to_contain_text('2.560')
    page.locator('#agua-horas').fill('0')
    expect(page.locator('#agua-poupada')).to_have_text('0 L')
    page.locator('#agua-horas').fill('24')
    page.locator('#agua-reducao').fill('95')
    expect(page.locator('#agua-com')).to_contain_text('240')
    relatorio['interacoes'].append('Economia de água: cenário de referência, cobertura zero e cobertura integral.')

    page.locator('#aba-automacao').click()
    page.locator('#auto-coletor').fill('26')
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    page.locator('#auto-coletor').fill('25')
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    page.locator('#auto-coletor').fill('24')
    expect(page.locator('#auto-bomba')).to_have_text('Desligada')
    page.locator('[data-auto-preset=baixo]').click()
    expect(page.locator('#auto-motivo')).to_contain_text('Nível abaixo')
    page.locator('[data-auto-preset=falha]').click()
    expect(page.locator('#auto-motivo')).to_contain_text('Falha de sensor')
    page.locator('#form-automacao button[type=reset]').click()
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    relatorio['interacoes'].append('Automação: histerese, nível baixo, falha e restauração.')

    page.goto(base+'comparativos.html',wait_until='networkidle')
    page.locator('#comp-sol').fill('0')
    expect(page.locator('#comp-custo-solar')).to_have_text('Sem previsão')
    page.locator('#comp-alvo').fill('20')
    expect(page.locator('#comp-custo-solar')).to_have_text('R$ 0,00')
    relatorio['interacoes'].append('Comparativo: ausência de Sol e meta já atingida, sem custo fictício.')

    page.goto(base+'acessibilidade.html',wait_until='networkidle')
    page.locator('.settings-card [data-setting=contraste]').check()
    page.locator('.settings-card [data-setting=dislexia]').check()
    page.locator('.settings-card [data-setting=espaco]').check()
    page.locator('.settings-card [data-setting=movimento]').check()
    for _ in range(5):page.locator('.settings-card [data-size="1"]').click()
    expect(page.locator('html')).to_have_attribute('data-theme','contrast')
    expect(page.locator('html')).to_have_attribute('data-font','dyslexic')
    for largura in [320,390,768,1024,1440]:
        page.set_viewport_size({'width':largura,'height':900})
        for nome in ['index.html','simuladores.html','comparativos.html','acessibilidade.html']:
            page.goto(base+nome,wait_until='networkidle')
            overflow=page.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
            relatorio['responsividade'].append({'pagina':nome,'largura':largura,'leitura_ampliada':True,'overflow':overflow})
    page.goto(base+'index.html',wait_until='networkidle')
    expect(page.locator('html')).to_have_attribute('data-font','dyslexic')
    assert page.evaluate('document.documentElement.style.getPropertyValue("--reading-size")')=='150%'
    assert page.locator('.flow-line').first.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
    relatorio['interacoes'].append('Persistência de contraste, OpenDyslexic, espaçamento, ampliação de 150% e movimentos reduzidos.')
    page.set_viewport_size({'width':390,'height':900})
    for nome in ['index.html','simuladores.html','acessibilidade.html']:
        page.goto(base+nome,wait_until='networkidle')
        page.evaluate('document.documentElement.style.fontSize="200%"')
        page.locator('[data-open-accessibility]').click()
        page.locator('dialog [data-setting=espaco]').uncheck()
        page.keyboard.press('Escape')
        overflow=page.evaluate('document.documentElement.scrollWidth > window.innerWidth + 1')
        relatorio['responsividade'].append({'pagina':nome,'largura':390,'texto_200_percentual':True,'overflow':overflow})
    relatorio['interacoes'].append('Refluxo com texto ampliado a 200% nas páginas de início, simuladores e acessibilidade.')
    context.close()
    semjs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    offline=semjs.new_page()
    offline.goto(base+'ciencia.html',wait_until='networkidle')
    expect(offline.locator('h1')).to_have_text('A ciência por trás da piscina')
    expect(offline.locator('#referencias')).to_be_visible()
    relatorio['interacoes'].append('Conteúdo científico e referências disponíveis sem JavaScript.')
    semjs.close()
    browser.close()

(destino/'auditoria.json').write_text(json.dumps(relatorio,ensure_ascii=False,indent=2))
violacoes=sum(len(r['violations']) for r in relatorio['axe'])
overflow=sum(r['overflow'] for r in relatorio['responsividade'])
print(f"Resultado: {violacoes} violações axe; {overflow} telas com overflow; {len(relatorio['erros_js'])} erros JavaScript.",flush=True)
if violacoes or overflow or relatorio['erros_js']:
    raise SystemExit(1)
