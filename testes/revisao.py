"""Casos funcionais e de regressão. Os serviços externos são simulados neste script.

Uso: python3 testes/revisao.py --navegadores chromium firefox webkit
O vídeo opcional é uma mídia técnica de teste, sem conteúdo em Libras.
"""
import argparse
import json
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4173/')
parser.add_argument('--navegadores', nargs='+', choices=['chromium', 'firefox', 'webkit'], default=['chromium'])
parser.add_argument('--saida', default='test-results/revisao')
parser.add_argument('--video-tecnico', type=Path)
parser.add_argument('--casos', nargs='+', type=int, choices=range(20), help='Índices dos casos, começando em 0; omita para a revisão completa.')
args = parser.parse_args()
base = args.url.rstrip('/') + '/'
saida = Path(args.saida)
saida.mkdir(parents=True, exist_ok=True)
paginas = ['index.html', 'projeto-piscina.html', 'ciencia.html', 'simuladores.html',
           'comparativos.html', 'sustentabilidade.html', 'acessibilidade.html', 'mapa-do-site.html']
relatorio = {'navegadores': [], 'casos': [], 'responsividade': [], 'sem_javascript': [], 'erros_js': []}


def ir(page, nome='index.html'):
    resposta = page.goto(base + nome)
    assert resposta.status == 200
    page.evaluate('document.fonts.ready')


def navegar(page):
    for nome in paginas:
        ir(page, nome)
        expect(page.locator('h1')).to_have_count(1)
        expect(page.locator('main')).to_have_attribute('id', 'conteudo')
        expect(page.locator('html')).to_have_attribute('lang', 'pt-BR')
        atual = page.locator('#menu-principal [aria-current=page]')
        if nome in paginas[:6]:
            expect(atual).to_have_attribute('href', nome)
        assert page.title().endswith('| Sol & Água')
        assert not page.evaluate('''() => [...document.querySelectorAll('a[href^="#"]')]
            .some(a => a.hash && !document.getElementById(decodeURIComponent(a.hash.slice(1))))''')
    ir(page, 'mapa-do-site.html')
    destinos = page.locator('main a[href$=".html"]').evaluate_all('(links)=>links.map(a=>a.getAttribute("href"))')
    assert set(paginas[:-1]).issubset(set(destinos))
    for nome in ['dados/registro-experimental.csv', 'dados/parametros.json', 'dados/videos.json']:
        assert page.request.get(base + nome).status == 200


def menu(page):
    ir(page)
    page.keyboard.press('Tab')
    assert page.evaluate('document.activeElement.classList.contains("skip-link")')
    page.keyboard.press('Enter')
    assert page.evaluate('document.activeElement.id') == 'conteudo'
    toggle = page.locator('.menu-toggle')
    for foco_link in [False, True]:
        toggle.click()
        expect(toggle).to_have_attribute('aria-expanded', 'true')
        if foco_link:
            page.locator('#menu-principal a').first.focus()
        page.keyboard.press('Escape')
        expect(toggle).to_have_attribute('aria-expanded', 'false')
        expect(toggle).to_be_focused()
    toggle.click()
    page.mouse.click(1, 800)
    expect(toggle).to_have_attribute('aria-expanded', 'false')
    toggle.click()
    page.set_viewport_size({'width': 1440, 'height': 1000})
    expect(toggle).to_have_attribute('aria-expanded', 'false')
    page.locator('#menu-principal a').first.focus()
    page.set_viewport_size({'width': 390, 'height': 844})
    expect(toggle).to_be_focused()


def modal(page):
    ir(page, 'acessibilidade.html')
    abrir = page.locator('[data-open-accessibility]')
    dialog = page.locator('dialog')
    abrir.click()
    assert dialog.evaluate('(e)=>e.open')
    for tecla in ['Tab', 'Shift+Tab']:
        for _ in range(25):
            page.keyboard.press(tecla)
            assert page.evaluate('document.activeElement.closest("dialog") !== null')
    dialog.locator('[data-setting=contraste]').check()
    expect(page.locator('.settings-card [data-setting=contraste]')).to_be_checked()
    dialog.locator('[data-size="1"]').click()
    expect(page.locator('.settings-card [data-size-label]')).to_have_text('110%')
    page.keyboard.press('Escape')
    assert not dialog.evaluate('(e)=>e.open')
    expect(abrir).to_be_focused()
    abrir.click()
    dialog.locator('.close-button').click()
    expect(abrir).to_be_focused()
    abrir.click()
    page.mouse.click(1, 1)
    assert not dialog.evaluate('(e)=>e.open')
    expect(abrir).to_be_focused()


def leitura(page):
    ir(page, 'acessibilidade.html')
    card = page.locator('.settings-card')
    for chave in ['contraste', 'dislexia', 'espaco', 'movimento']:
        card.locator(f'[data-setting={chave}]').check()
    for _ in range(10):
        card.locator('[data-size="1"]').click()
    expect(card.locator('[data-size-label]')).to_have_text('200%')
    expect(card.locator('[data-size="1"]')).to_be_disabled()
    ir(page, 'simuladores.html')
    expect(page.locator('html')).to_have_attribute('data-theme', 'contrast')
    expect(page.locator('html')).to_have_attribute('data-font', 'dyslexic')
    expect(page.locator('html')).to_have_attribute('data-spacing', 'wide')
    expect(page.locator('html')).to_have_attribute('data-reduced-motion', 'true')
    assert page.evaluate('document.documentElement.style.getPropertyValue("--reading-size")') == '200%'
    page.locator('[data-open-accessibility]').click()
    for _ in range(11):
        page.locator('dialog [data-size="-1"]').click()
    expect(page.locator('dialog [data-size-label]')).to_have_text('90%')
    expect(page.locator('dialog [data-size="-1"]')).to_be_disabled()
    page.locator('dialog [data-reset-reading]').click()
    expect(page.locator('dialog [data-size-label]')).to_have_text('100%')
    expect(page.locator('html')).to_have_attribute('data-theme', 'light')
    expect(page.locator('html')).to_have_attribute('data-font', 'standard')
    expect(page.locator('html')).to_have_attribute('data-spacing', 'standard')
    expect(page.locator('html')).to_have_attribute('data-reduced-motion', 'false')


def armazenamento_invalido(page):
    ir(page)
    for valor in ['{malformado', 'null', '42', '"texto"', '{"tamanho":999,"contraste":"sim"}']:
        page.evaluate('(v)=>localStorage.setItem("sol-agua-leitura",v)', valor)
        ir(page)
        expect(page.locator('h1')).to_be_visible()
        expect(page.locator('html')).to_have_attribute('data-theme', 'light')
        tamanho = page.evaluate('window.LeituraSolAgua.prefs.tamanho')
        assert tamanho == (200 if '999' in valor else 100)


def armazenamento_bloqueado(page):
    page.add_init_script('''Object.defineProperty(window, 'localStorage', {
        get() { throw new DOMException('Bloqueado para teste', 'SecurityError'); }
    });''')
    ir(page)
    page.locator('[data-open-accessibility]').click()
    page.locator('dialog [data-setting=contraste]').check()
    expect(page.locator('html')).to_have_attribute('data-theme', 'contrast')
    page.keyboard.press('Escape')
    page.locator('[data-scene-stage=conservar]').click()
    expect(page.locator('[data-pool-scene]')).to_have_attribute('data-stage', 'conservar')


def movimento(page):
    ir(page)
    page.locator('.motion-utility').click()
    expect(page.locator('html')).to_have_attribute('data-paused', 'true')
    ir(page, 'ciencia.html')
    expect(page.locator('html')).to_have_attribute('data-paused', 'true')
    expect(page.locator('.motion-utility')).to_have_attribute('aria-label', 'Retomar animação')
    page.locator('.motion-utility').click()
    expect(page.locator('html')).to_have_attribute('data-paused', 'false')
    page.emulate_media(reduced_motion='reduce')
    expect(page.locator('html')).to_have_attribute('data-reduced-motion', 'true')
    expect(page.locator('.motion-utility')).to_be_disabled()
    page.emulate_media(reduced_motion='no-preference')
    expect(page.locator('html')).to_have_attribute('data-reduced-motion', 'false')
    expect(page.locator('.motion-utility')).to_be_enabled()
    page.locator('[data-open-accessibility]').click()
    page.locator('dialog [data-setting=movimento]').check()
    page.keyboard.press('Escape')
    expect(page.locator('.motion-utility')).to_be_disabled()
    ir(page)
    expect(page.locator('.scene-water-lines')).to_have_css('animation-name', 'none')


def cena(page):
    ir(page)
    for etapa, tecla, legenda in [('circular', 'Space', 'A bomba faz a água'),
                                  ('conservar', 'Enter', 'Uma cobertura reduz'),
                                  ('captar', 'Space', 'O coletor recebe')]:
        controle = page.locator(f'[data-scene-stage={etapa}]')
        controle.focus()
        page.keyboard.press(tecla)
        expect(controle).to_have_attribute('aria-pressed', 'true')
        expect(page.locator('[data-pool-scene]')).to_have_attribute('data-stage', etapa)
        expect(page.locator('#paisagem-legenda')).to_contain_text(legenda)
    page.locator('.motion-utility').click()
    expect(page.locator('.scene-water-lines')).to_have_css('animation-play-state', 'paused')
    expect(page.locator('.scene-sun-rays')).to_have_css('animation-play-state', 'paused')
    page.locator('.motion-utility').click()
    expect(page.locator('.scene-water-lines')).to_have_css('animation-play-state', 'running')


def abas(page):
    ir(page, 'simuladores.html#agua')
    expect(page.locator('#aba-agua')).to_have_attribute('aria-selected', 'true')
    page.locator('#aba-agua').focus()
    for tecla, destino in [('End', 'automacao'), ('ArrowRight', 'aquecimento'),
                           ('ArrowLeft', 'automacao'), ('Home', 'aquecimento'), ('ArrowRight', 'agua')]:
        page.keyboard.press(tecla)
        expect(page.locator('#aba-' + destino)).to_be_focused()
        expect(page.locator('#aba-' + destino)).to_have_attribute('aria-selected', 'true')
        expect(page.locator('#' + destino)).to_be_visible()
    page.evaluate('location.hash="automacao"')
    expect(page.locator('#aba-automacao')).to_have_attribute('aria-selected', 'true')
    assert page.locator('[role=tab][tabindex="0"]').count() == 1


def aquecimento(page):
    ir(page, 'simuladores.html')
    expect(page.locator('#calor-horas')).to_contain_text('13,2')
    expect(page.locator('#calor-energia')).to_contain_text('69,8')
    page.locator('#calor-volume').fill('20000')
    expect(page.locator('#calor-horas')).to_contain_text('26,3')
    page.locator('#calor-area').fill('24')
    expect(page.locator('#calor-horas')).to_contain_text('13,2')
    page.locator('#calor-inicial').fill('20')
    expect(page.locator('#calor-horas')).to_contain_text('17,5')
    page.locator('#calor-alvo').fill('30')
    expect(page.locator('#calor-horas')).to_contain_text('21,9')
    page.locator('#form-calor button[type=reset]').click()
    expect(page.locator('#calor-volume')).to_have_value('10000')
    page.locator('#form-calor details summary').click()
    page.locator('#calor-eficiencia').fill('50')
    expect(page.locator('#calor-potencia')).to_contain_text('4,08')
    page.locator('#calor-perdas').fill('0')
    expect(page.locator('#calor-potencia')).to_contain_text('4,80')
    page.locator('#form-calor button[type=reset]').click()
    page.locator('[data-sun-preset="300"]').click()
    expect(page.locator('#calor-horas')).to_contain_text('35,1')
    expect(page.locator('[data-sun-preset="300"]')).to_have_attribute('aria-pressed', 'true')
    page.locator('[data-sun-preset="800"]').click()
    page.locator('#calor-sol').focus()
    page.keyboard.press('ArrowRight')
    expect(page.locator('#calor-sol')).to_have_value('850')
    expect(page.locator('#calor-sol')).to_have_attribute('aria-valuetext', '850 W/m²')
    page.locator('#calor-sol').fill('800')
    expect(page.locator('#calor-anuncio')).to_contain_text('13,2 horas')
    expect(page.locator('#tabela-temperatura tr')).to_have_count(5)
    page.locator('.chart-card details summary').first.click()
    expect(page.locator('#tabela-temperatura')).to_be_visible()
    antes = page.locator('#grafico-temperatura').get_attribute('viewBox')
    page.set_viewport_size({'width': 1440, 'height': 1000})
    expect(page.locator('#grafico-temperatura')).not_to_have_attribute('viewBox', antes)


def calor_limites(page):
    ir(page, 'simuladores.html')
    for valor in ['', '10001', '101000', '-1']:
        page.locator('#calor-volume').fill(valor)
        expect(page.locator('#calor-erro')).to_contain_text('último cenário válido')
        expect(page.locator('#calor-horas')).to_contain_text('13,2')
    page.locator('#form-calor button[type=reset]').click()
    expect(page.locator('#calor-erro')).to_have_text('')
    page.locator('#calor-sol').fill('0')
    expect(page.locator('#calor-estado')).to_contain_text('não há aquecimento')
    expect(page.locator('#tabela-temperatura tr')).to_have_count(1)
    expect(page.locator('#calor-grafico-desc')).to_contain_text('Sem irradiância')
    page.locator('#calor-alvo').fill('20')
    expect(page.locator('#calor-estado')).to_have_text('Meta já atingida')
    expect(page.locator('#calor-energia')).to_contain_text('0,0')
    expect(page.locator('#calor-horas')).to_contain_text('0,0')


def agua(page):
    ir(page, 'simuladores.html#agua')
    expect(page.locator('#agua-poupada')).to_contain_text('2.560')
    page.locator('#agua-area').fill('64')
    expect(page.locator('#agua-poupada')).to_contain_text('5.120')
    page.locator('#agua-dias').fill('15')
    expect(page.locator('#agua-poupada')).to_contain_text('2.560')
    page.locator('#agua-horas').fill('0')
    expect(page.locator('#agua-poupada')).to_have_text('0 L')
    page.locator('#agua-horas').fill('24')
    page.locator('#agua-reducao').fill('95')
    expect(page.locator('#agua-com')).to_contain_text('240')
    expect(page.locator('#tabela-agua-com')).to_have_text('240')
    page.locator('#agua-evaporacao').fill('0')
    for id_ in ['agua-sem', 'agua-com', 'agua-poupada']:
        expect(page.locator('#' + id_)).to_have_text('0 L')
    assert page.locator('#barra-agua-sem').evaluate('(e)=>e.style.width') == '0%'
    assert page.locator('#barra-agua-com').evaluate('(e)=>e.style.width') == '0%'
    page.locator('#agua-dias').fill('0')
    expect(page.locator('#agua-erro')).to_contain_text('último cenário válido')
    page.locator('#form-agua button[type=reset]').click()
    expect(page.locator('#agua-poupada')).to_contain_text('2.560')
    expect(page.locator('#agua-anuncio')).to_contain_text('2.560 litros')
    page.locator('#agua .chart-card details summary').click()
    expect(page.locator('#tabela-agua-poupada')).to_be_visible()


def automacao(page):
    ir(page, 'simuladores.html#automacao')
    for preset, estado in [('sol', 'Aquecendo'), ('frio', 'Aguardando'), ('baixo', 'Bloqueada'), ('falha', 'Bloqueada')]:
        page.locator(f'[data-auto-preset={preset}]').click()
        expect(page.locator('#auto-estado')).to_have_text(estado)
    page.locator('#form-automacao button[type=reset]').click()
    expect(page.locator('#auto-historico li')).to_have_count(1)
    for coletor, bomba in [('26', 'Ligada'), ('25', 'Ligada'), ('24', 'Desligada'), ('25', 'Desligada'), ('26', 'Ligada')]:
        page.locator('#auto-coletor').fill(coletor)
        expect(page.locator('#auto-bomba')).to_have_text(bomba)
    page.locator('#auto-nivel').fill('35')
    expect(page.locator('#auto-bomba')).to_have_text('Desligada')
    page.locator('#auto-nivel').fill('40')
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    page.locator('#auto-piscina').fill('28')
    expect(page.locator('#auto-motivo')).to_contain_text('desejada atingida')
    page.locator('#auto-alvo').fill('30')
    page.locator('#auto-coletor').fill('34')
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    page.locator('#auto-falha').check()
    expect(page.locator('#auto-motivo')).to_contain_text('Falha de sensor')
    for _ in range(4):
        page.locator('#auto-falha').uncheck()
        page.locator('#auto-falha').check()
    expect(page.locator('#auto-historico li')).to_have_count(6)
    historico = page.locator('#auto-historico').inner_text()
    page.locator('#form-automacao button[type=submit]').click()
    assert page.locator('#auto-historico').inner_text() == historico
    page.locator('#auto-piscina').fill('')
    expect(page.locator('#automacao-erro')).to_contain_text('último cenário válido')
    page.locator('#form-automacao button[type=reset]').click()
    expect(page.locator('#auto-bomba')).to_have_text('Ligada')
    expect(page.locator('#auto-historico li')).to_have_count(1)


def comparativo(page):
    ir(page, 'comparativos.html')
    assert page.locator('#comp-tabela-q-solar').inner_text() == page.locator('#comp-tabela-q-eletrica').inner_text()
    page.locator('#comp-volume').fill('20000')
    expect(page.locator('#comp-tabela-q-solar')).to_have_text('139,5')
    page.locator('#comp-inicial').fill('20')
    page.locator('#comp-alvo').fill('30')
    expect(page.locator('#comp-tabela-q-solar')).to_have_text('232,6')
    page.locator('#comp-tarifa').fill('0')
    expect(page.locator('#comp-custo-solar')).to_have_text('R$ 0,00')
    expect(page.locator('#comp-custo-eletrico')).to_have_text('R$ 0,00')
    page.locator('#form-comparativo button[type=reset]').click()
    expect(page.locator('#comp-volume')).to_have_value('10000')
    page.locator('#comp-sol').fill('10')
    expect(page.locator('#comp-insight')).to_contain_text('a mais em eletricidade')
    assert page.locator('#comp-barra-solar').evaluate('(e)=>e.style.width') == '100%'
    page.locator('#comp-sol').fill('0')
    expect(page.locator('#comp-custo-solar')).to_have_text('Sem previsão')
    expect(page.locator('#comp-tabela-e-solar')).to_have_text('Sem previsão')
    page.locator('#comp-alvo').fill('20')
    expect(page.locator('#comp-custo-solar')).to_have_text('R$ 0,00')
    expect(page.locator('#comp-custo-eletrico')).to_have_text('R$ 0,00')
    page.locator('#comp-volume').fill('')
    expect(page.locator('#comparativo-erro')).to_contain_text('último cenário válido')


def indice(page):
    ir(page, 'ciencia.html')
    links = page.locator('.local-nav a')
    for i in range(links.count()):
        link = links.nth(i)
        link.click()
        id_ = link.get_attribute('href')[1:]
        expect(page.locator('#' + id_)).to_be_in_viewport()
    page.evaluate('scrollTo(0, document.documentElement.scrollHeight)')
    expect(page.locator('[data-reading-progress]')).to_have_css('transform', 'matrix(1, 0, 0, 1, 0, 0)')
    page.locator('[data-open-accessibility]').click()
    page.locator('dialog [data-size="1"]').click()
    page.keyboard.press('Escape')
    page.evaluate('scrollTo(0, 0)')
    expect(page.locator('[data-reading-progress]')).to_have_css('transform', 'matrix(0, 0, 0, 1, 0, 0)')


def libras_carregado(page):
    ir(page)
    page.evaluate('''window.aberturasLibras=0;
        window.VLibrasWidget={initBtn:{click(){window.aberturasLibras++}}};''')
    page.locator('[data-open-accessibility]').click()
    page.locator('dialog [data-libras]').click()
    assert not page.locator('dialog').evaluate('(e)=>e.open')
    assert page.evaluate('window.aberturasLibras') == 1
    expect(page.locator('.utility-bar [data-libras-label]')).to_have_text('Abrir VLibras')


def libras_falha(page):
    pedidos = []
    def tratar(route):
        pedidos.append(route.request.url)
        if len(pedidos) == 1:
            route.abort()
        else:
            route.fulfill(content_type='application/javascript', body='''
                window.VLibrasWidget={initBtn:{click(){window.aberturasLibras=1}}};''')
    page.route('https://vlibras.gov.br/app/vlibras-plugin.js', tratar)
    ir(page)
    assert not pedidos  # Integração sob demanda: nada é solicitado antes do clique.
    button = page.locator('.utility-bar [data-libras]')
    button.click()
    expect(page.locator('#anuncio-global')).to_contain_text('Não foi possível')
    expect(button).to_be_enabled()
    button.click()
    expect(page.locator('#anuncio-global')).to_contain_text('VLibras ativado')
    assert len(pedidos) == 2
    button.click()
    assert len(pedidos) == 2


def libras_atrasado(page):
    pedidos = []
    page.clock.install()
    def tratar(route):
        pedidos.append(route.request.url)
        route.fulfill(content_type='application/javascript', body='window.scriptLibrasTestado=true;')
    page.route('https://vlibras.gov.br/app/vlibras-plugin.js', tratar)
    ir(page)
    button = page.locator('.utility-bar [data-libras]')
    button.click()
    expect(page.locator('script[src*="vlibras-plugin"]')).to_have_count(1)
    page.wait_for_function('window.scriptLibrasTestado===true')
    page.clock.run_for(21000)
    expect(page.locator('#anuncio-global')).to_contain_text('Não foi possível')
    expect(button).to_be_enabled()
    button.click()
    page.evaluate('window.VLibrasWidget={initBtn:{click(){}}}')
    page.clock.run_for(1000)
    expect(page.locator('#anuncio-global')).to_contain_text('VLibras ativado')
    assert len(pedidos) == 1


def catalogo_indisponivel(page):
    for status, body in [(404, '{}'), (200, '{invalido'), (200, '{"videos":[]}'), (200, '{"videos":null}')]:
        def tratar(route):
            route.fulfill(status=status, body=body, content_type='application/json')
        page.route('**/dados/videos.json', tratar)
        with page.expect_response('**/dados/videos.json') as resposta:
            ir(page, 'acessibilidade.html')
        resposta.value.body()
        expect(page.locator('#videos-vazio')).to_be_visible()
        expect(page.locator('.video-card')).to_have_count(0)
        page.unroute('**/dados/videos.json')


def catalogo_misto(page):
    valido = {'titulo': 'Vídeo técnico de teste', 'arquivo': 'assets/videos/teste.mp4',
              'legendas': 'assets/videos/teste.vtt', 'transcricao': '<img onerror="erro()"> Texto literal de teste.'}
    invalidos = [None, {}, {**valido, 'titulo': 42}, {**valido, 'arquivo': 'https://example.org/video.mp4'},
                 {**valido, 'arquivo': 'assets/outro.mp4'}, {**valido, 'legendas': 'assets/videos/teste.txt'}]
    page.route('**/dados/videos.json', lambda route: route.fulfill(json={'videos': [*invalidos, valido]}))
    if args.video_tecnico:
        page.route('**/assets/videos/teste.mp4', lambda route: route.fulfill(path=str(args.video_tecnico), content_type='video/mp4'))
    else:
        page.route('**/assets/videos/teste.mp4', lambda route: route.fulfill(status=204))
    page.route('**/assets/videos/teste.vtt', lambda route: route.fulfill(content_type='text/vtt', body='WEBVTT\n\n00:00:00.000 --> 00:00:02.500\nLegenda técnica de teste.\n'))
    ir(page, 'acessibilidade.html')
    expect(page.locator('.video-card')).to_have_count(1)
    expect(page.locator('#videos-vazio')).to_be_hidden()
    expect(page.locator('video')).to_have_attribute('controls', '')
    expect(page.locator('track')).to_have_attribute('srclang', 'pt-BR')
    page.locator('.video-card summary').click()
    expect(page.locator('.video-card details p')).to_have_text(valido['transcricao'])
    expect(page.locator('.video-card img')).to_have_count(0)
    if args.video_tecnico:
        page.wait_for_function('document.querySelector("video").readyState>=2')
        page.locator('video').evaluate('(v)=>v.play()')
        assert page.locator('video').evaluate('(v)=>!v.paused')
        page.locator('video').evaluate('(v)=>v.pause()')
        assert page.locator('video').evaluate('(v)=>v.paused')
        page.locator('video').evaluate('(v)=>{v.textTracks[0].mode="showing";}')
        page.wait_for_function('document.querySelector("track").readyState===2')
        assert page.locator('video').evaluate('(v)=>v.textTracks[0].cues.length') == 1


casos = [('Navegação, mapa, âncoras e downloads', navegar), ('Menu, salto e retorno de foco', menu),
         ('Modal, ciclo de foco, fechamento e sincronização', modal), ('Leitura de 90% a 200%, ajustes e restauração', leitura),
         ('Preferências malformadas', armazenamento_invalido), ('Armazenamento bloqueado', armazenamento_bloqueado),
         ('Pausa persistente e mudanças da preferência do sistema', movimento), ('Cena interativa e animação', cena),
         ('Abas: setas, Home, End e URL', abas), ('Aquecimento: todos os parâmetros, exemplos, gráfico e anúncio', aquecimento),
         ('Aquecimento: entradas inválidas, Sol zero e meta atingida', calor_limites), ('Água: parâmetros, limites, tabela e anúncio', agua),
         ('Automação: presets, histerese, bloqueios e histórico', automacao), ('Comparativo: custos, tarifa zero e pouca irradiância', comparativo),
         ('Índice de leitura e progresso após redimensionamento', indice), ('VLibras já carregado: modal e abertura', libras_carregado),
         ('VLibras: carregamento sob demanda, falha e nova tentativa', libras_falha), ('VLibras: inicialização atrasada sem duplicar script', libras_atrasado),
         ('Vídeos: catálogo vazio ou indisponível', catalogo_indisponivel), ('Vídeos: itens inválidos, transcrição, legendas e reprodução', catalogo_misto)]

with sync_playwright() as p:
    for motor in args.navegadores:
        browser = getattr(p, motor).launch(headless=True, **({'args': ['--no-sandbox']} if motor == 'chromium' else {}))
        relatorio['navegadores'].append({'motor': motor, 'versao': browser.version})
        for nome, teste in casos:
            if args.casos is not None and casos.index((nome, teste)) not in args.casos:
                continue
            inicio = time.monotonic()
            contexto = browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='no-preference')
            page = contexto.new_page()
            erros = []
            page.on('pageerror', lambda erro: erros.append(str(erro)))
            resultado = {'navegador': motor, 'caso': nome, 'aprovado': True}
            try:
                teste(page)
                assert not erros, '\n'.join(erros)
            except Exception as exc:
                resultado.update(aprovado=False, erro=str(exc))
                page.screenshot(path=str(saida / f'{motor}-{casos.index((nome, teste))}-falha.png'), full_page=True)
            resultado['duracao_s'] = round(time.monotonic() - inicio, 2)
            relatorio['casos'].append(resultado)
            relatorio['erros_js'].extend({'navegador': motor, 'caso': nome, 'erro': erro} for erro in erros)
            print(f'{motor}: {"OK" if resultado["aprovado"] else "FALHOU"} — {nome}', flush=True)
            if not resultado['aprovado']:
                print(resultado['erro'][:1800], flush=True)
            (saida / 'revisao.json').write_text(json.dumps(relatorio, ensure_ascii=False, indent=2))
            contexto.close()
        if args.casos is not None:
            browser.close()
            continue
        contexto = browser.new_context(reduced_motion='reduce')
        page = contexto.new_page()
        for perfil, prefs in [('padrão', {'tamanho': 100}), ('texto200', {'tamanho': 200}),
                              ('combinado200', {'tamanho': 200, 'contraste': True, 'espaco': True, 'dislexia': True})]:
            ir(page)
            page.evaluate('(p)=>localStorage.setItem("sol-agua-leitura", JSON.stringify(p))', prefs)
            for largura in [320, 390, 768, 1024, 1440]:
                page.set_viewport_size({'width': largura, 'height': 900})
                for nome in paginas:
                    ir(page, nome)
                    overflow = page.evaluate('document.documentElement.scrollWidth > innerWidth + 1')
                    relatorio['responsividade'].append({'navegador': motor, 'perfil': perfil, 'largura': largura, 'pagina': nome, 'overflow': overflow})
                    if overflow:
                        print(f'{motor}: transbordamento — {perfil} {largura}px {nome}', flush=True)
        contexto.close()
        contexto = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
        page = contexto.new_page()
        for nome in paginas:
            resposta = page.goto(base + nome)
            aprovado = resposta.status == 200 and page.locator('h1').count() == 1 and page.locator('#menu-principal').is_visible()
            relatorio['sem_javascript'].append({'navegador': motor, 'pagina': nome, 'aprovado': aprovado})
        contexto.close()
        browser.close()

(saida / 'revisao.json').write_text(json.dumps(relatorio, ensure_ascii=False, indent=2))
falhas = (sum(not r['aprovado'] for r in relatorio['casos']) + sum(r['overflow'] for r in relatorio['responsividade'])
          + sum(not r['aprovado'] for r in relatorio['sem_javascript']))
print(f'{len(relatorio["casos"])} casos; {len(relatorio["responsividade"])} telas; {len(relatorio["sem_javascript"])} páginas sem JavaScript; {falhas} falhas.', flush=True)
raise SystemExit(1 if falhas else 0)
