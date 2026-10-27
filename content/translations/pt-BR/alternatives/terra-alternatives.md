---
path: "/alternatives/terra-alternatives"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-17"
sourceHash: "a52b07f535ca0653"
metaTitle: "Alternativas ao Terra (2026): 9 opções de dados de saúde"
metaDescription: >-
  Alternativas ao Terra (tryterra.co) em outubro de 2026: Junction, Rook, Spike, Thryve, Sahha, Validic, Open Wearables, APIs diretas ou dados no aparelho.
h1: "As melhores alternativas ao Terra (tryterra.co) (2026)"
answer: >-
  As principais alternativas ao Terra (tryterra.co), segundo as páginas delas em 17 de outubro de 2026, são o Junction (antigo Vital), para pedidos de exames laboratoriais nos EUA e um preço fixo de US$ 300 por mês para até 500 usuários; o Rook, com faixas por usuário ativo a partir de US$ 399 por mês; o Spike, para IoT médica, OCR de laudos laboratoriais e nutrição por foto de comida; o Thryve, para hospedagem na UE, na Alemanha; o Sahha, para dados e pontuações a partir do celular; o Validic, para monitoramento remoto corporativo; e o Open Wearables, se você quer um software com licença MIT que você mesmo hospeda. Você também pode largar o agregador e partir para integrações diretas por fornecedor ou para HealthKit e Health Connect no aparelho. Escolha pelo que está empurrando você para fora do Terra: os créditos por fonte conectada, a hospedagem ou uma fonte de dados com a qual ele não combina; exames laboratoriais por si só não são mais motivo, já que o Terra agora os vende nos EUA e no Reino Unido.
cta: >-
  Acompanhamos os preços e a cobertura dos agregadores e as pegadinhas de reconexão ao trocar de fornecedor. Assine e migre de olhos abertos.
faqs:
  - q: "Por que as equipes procuram uma alternativa ao Terra?"
    a: >-
      Principalmente pela unidade de cobrança. Em 17 de outubro de 2026, o Terra começa em US$ 399 por mês com cobrança anual, com 100.000 créditos, e cobra 200 créditos por mês por fonte de dados conectada, então um usuário com dois dispositivos custa o dobro. Outras precisam de hospedagem na UE, de dados que fiquem nos próprios servidores, de usuários sem wearables ou de programas corporativos de monitoramento remoto. O próprio Terra continua forte em cobertura, destinos de entrega e, agora, exames laboratoriais.
  - q: "Qual é a melhor alternativa ao Terra se eu também preciso de dados laboratoriais?"
    a: >-
      Depende de onde estão os seus usuários. Em 17 de outubro de 2026, o Junction pede exames laboratoriais em todos os 50 estados dos EUA por uma rede nacional de laboratórios, no plano Enterprise. O próprio Terra agora pede exames nos EUA e no Reino Unido, então laboratórios por si só não são mais motivo para trocar. Se você só precisa ler laudos que os usuários já têm, a Lab Data API do Rook e a Lab Reports API do Spike os convertem em resultados com códigos LOINC.
  - q: "Em que o Rook e o Spike diferem do Terra?"
    a: >-
      O Rook cobra por usuários ativos em faixas publicadas, a partir do Core, a US$ 399 por mês para até 750 usuários, e acrescenta APIs de dispositivos médicos e de laudos laboratoriais, com contrato padrão de 12 meses. O Spike chega a IoT médica, OCR de laudos laboratoriais, nutrição por foto de comida e dados de prontuário eletrônico (EMR), designa um engenheiro de implementação dedicado e começa em US$ 450 por mês, sem detalhar como a conta cresce. Os dois números são de 17 de outubro de 2026.
  - q: "Posso substituir o Terra sem nenhum agregador?"
    a: >-
      Sim, de três formas. Construa integrações diretas por fornecedor e seja dono do pipeline, ao custo de cada conector, fluxo OAuth e aprovação. Leia os dados no aparelho pelo HealthKit e pelo Health Connect, sem coleta do lado do servidor. Ou auto-hospede o Open Wearables, software com licença MIT da Momentum que é gratuito para rodar, mas exige o seu próprio cadastro de desenvolvedor em cada fornecedor, o que a documentação dele diz para Garmin, Suunto e Polar.
  - q: "Sair do Terra é fácil?"
    a: >-
      Normalmente é uma reintegração de verdade, não uma mudança de configuração. Conte com um novo cadastro de app no novo fornecedor e em todo fornecedor de dados que exija as suas próprias credenciais, com o remapeamento de campos para um esquema normalizado diferente, e com cada usuário existente reconectando o dispositivo pelo novo fluxo de conexão. Trocar de agregador é uma reintegração que ainda cobre muitos fornecedores; ir totalmente para o direto troca a taxa do agregador pela manutenção de cada conector por conta própria.
related:
  - href: "/fitness-apis/terra-vs-vital"
    label: "Terra vs Vital (Junction)"
  - href: "/fitness-apis/health-data-aggregator-apis"
    label: "Melhores APIs agregadoras de dados de saúde"
  - href: "/compare/terra-vs-open-wearables"
    label: "Terra vs Open Wearables"
  - href: "/integrate/terra-api"
    label: "Como integrar o Terra"
  - href: "/alternatives"
    label: "Todas as alternativas a APIs de fitness e saúde"
---
O Terra é um agregador forte: ampla cobertura de fornecedores, um esquema normalizado rico, muitos destinos de entrega e, agora, exames laboratoriais. A maioria das equipes que pesquisa o mercado não está insatisfeita com o produto; elas esbarraram em uma unidade de cobrança, em uma exigência de hospedagem ou em uma fonte de dados que outro fornecedor atende melhor. Tudo abaixo vem das páginas dos próprios fornecedores, como as lemos em 17 de outubro de 2026. Para o que este site verificou sobre o acesso ao Terra em um só lugar, veja a [visão geral da API do Terra](/apis/terra).

## Por que as equipes procuram uma alternativa ao Terra

O Terra cobra em **créditos**. A página de preços dele diz que as assinaturas "start from $399 per month billed annually, or $499 per month billed monthly" [começam em US$ 399 por mês com cobrança anual, ou US$ 499 por mês com cobrança mensal], incluindo 100.000 créditos por mês; "An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month" [uma autenticação ativa é uma fonte de dados conectada de um usuário final, e custa 200 créditos da Unified API por mês], os primeiros 400 eventos por autenticação ativa a cada mês são gratuitos, e créditos não usados não se acumulam para o mês seguinte. Pela nossa conta, isso dá cerca de US$ 899 por mês com 1.000 fontes conectadas na cobrança anual, e a conta cresce com cada fonte que um usuário conecta, não com cada pessoa.

Esse modelo funciona bem em escala estável, mas três coisas fazem as equipes procurarem alternativas:

- **A unidade.** Se os seus usuários conectam vários dispositivos cada um, um preço por pessoa pode sair mais barato que um preço por fonte.
- **Onde os dados ficam.** Alguns compradores precisam de hospedagem na UE ou precisam que os dados de saúde nunca saiam dos próprios servidores.
- **O que mais é preciso.** Usuários só com celular, sem wearable, programas de monitoramento remoto dentro de um prontuário eletrônico (EHR), ou um contrato com faixas fixas.

Exames laboratoriais costumavam estar nessa lista. Para a maioria das equipes, não estão mais: a página inicial do Terra agora oferece exames de sangue "through home kits, mobile phlebotomy, or lab walk-ins" [por kits domiciliares, coleta móvel ou atendimento presencial em laboratório], e a página de laboratórios dele diz "Nationwide US, plus the UK" [todo o território dos EUA, mais o Reino Unido].

## As alternativas

**Junction (antigo Vital).** Wearables mais pedidos de exames laboratoriais em todos os 50 estados dos EUA, por meio de "a nationwide network of labs (NY, NJ, and RI included)" [uma rede nacional de laboratórios (incluindo NY, NJ e RI)]. O plano Launch é "a flat $300 a month" [um valor fixo de US$ 300 por mês] para até 500 usuários conectados; laboratórios, usuários ilimitados e o BAA assinado ficam no Enterprise personalizado. *Contrapartida:* o lado laboratorial é só dos EUA nas páginas que lemos, e acima de 500 usuários você precisa de uma cotação. Veja [Terra vs Vital (Junction)](/fitness-apis/terra-vs-vital).

**Rook (tryrook.io).** Planos por usuário ativo com tetos publicados: Core a US$ 399 por mês para até 750 usuários ativos, Core+ a US$ 999 para 5.000, Business a US$ 1.999 para 15.000. Agora ele acrescenta uma Medical Device API e uma Lab Data API que interpreta laudos laboratoriais. *Contrapartida:* um contrato padrão de 12 meses, e Dexcom, Samsung Health, Strava e WHOOP exigem as suas próprias contas de desenvolvedor. Veja [Terra vs ROOK](/compare/terra-vs-rook).

**Spike (spikeapi.com).** Wearables mais IoT médica, OCR de laudos laboratoriais com códigos LOINC, nutrição por foto de comida e um servidor MCP, com um engenheiro de implementação dedicado a partir do plano Sandbox, que "Starts from $450 /month" [começa em US$ 450 por mês]. *Contrapartida:* o preço acima do ponto de partida não é detalhado, e o site dele anuncia "Raintree Systems Acquires Spike Technologies" [Raintree Systems adquire a Spike Technologies]. Veja [Terra vs Spike](/compare/terra-vs-spike).

**Thryve (thryve.health).** "Developed and hosted entirely in Europe" [desenvolvido e hospedado inteiramente na Europa], com dados "hosted in Germany" [hospedados na Alemanha]; o Start Up começa em 499 euros por mês para 500 usuários, mais 0,50 euro por usuário extra, e a página de certificações dele diz "Business Associate Agreements and Data Processing Agreements are standard on every plan" [Business Associate Agreements (BAA) e Data Processing Agreements (DPA) são padrão em todos os planos]. *Contrapartida:* o Start Up guarda os dados por duas semanas, e fornecedores sem um cliente OAuth compartilhado, como Dexcom e WHOOP, exigem o seu próprio. Veja [Terra vs Thryve](/compare/terra-vs-thryve).

**Sahha (sahha.ai).** Celular em primeiro lugar: ele "turns the smartphone itself into a passive sensor" [transforma o próprio smartphone em um sensor passivo], lê o Apple Health e o Health Connect, e devolve biomarcadores, pontuações e arquétipos. O Starter custa US$ 299 por mês com cobrança anual, com 1.000 usuários incluídos. *Contrapartida:* as integrações diretas em nuvem com Garmin, Oura e WHOOP "are in public beta and are Sandbox only" [estão em beta público e só no Sandbox]. Veja [Terra vs Sahha](/compare/terra-vs-sahha).

**Validic (validic.com).** A opção corporativa de monitoramento remoto, agora da ChartSpan, com "700+ devices" [mais de 700 dispositivos] e programas que escrevem no prontuário eletrônico (EHR); a Inform API dele tem um plano Developer gratuito para 5 usuários. *Contrapartida:* o uso em produção exige um contrato Enterprise negociado, e a lista de dispositivos dele mostra alguns fornecedores fechados a novos pedidos.

**Open Wearables (openwearables.io).** Licença MIT e auto-hospedado, da Momentum: o Core é "$0 Forever" [US$ 0 para sempre], e um plano Pro com pontuações de saúde começa em "From $999 a month, per deployment" [a partir de US$ 999 por mês, por implantação] (27 de outubro de 2026). *Contrapartida:* você mesmo se cadastra em cada fornecedor ("You must apply for Garmin Developer Program" [você precisa se candidatar ao Garmin Developer Program]), e o README o chama de "an early-stage project" [um projeto em estágio inicial]. Veja [Terra vs Open Wearables](/compare/terra-vs-open-wearables).

**Integrações diretas por fornecedor** (Garmin, Oura, WHOOP, Strava, Polar, a Google Health API). Melhor para ser dono do pipeline e não pagar taxa de agregador. *Contrapartida:* você constrói e mantém cada conector, fluxo OAuth e renovação de token por conta própria, e passa pela aprovação de cada fornecedor.

**Armazenamentos no aparelho via SDK: HealthKit (iOS) e Health Connect (Android).** Melhor para ler dados que já estão no celular do usuário, sem custo de API por usuário. *Contrapartida:* sem coleta do lado do servidor, uma plataforma cada. Veja [Apple HealthKit vs Google Health Connect](/fitness-apis/apple-healthkit-vs-google-health-connect).

| Alternativa | Melhor para | Atenção |
| --- | --- | --- |
| Junction (antigo Vital) | Pedidos de exames nos EUA em todos os 50 estados; preço fixo até 500 usuários | Laboratórios e BAA só no Enterprise |
| Rook | Faixas por usuário ativo que ficam fixas até 5.000 ou 15.000 usuários | Contrato padrão de 12 meses |
| Spike | IoT médica, OCR de laudos, fotos de comida, MCP | Preço não detalhado; aquisição anunciada |
| Thryve | Hospedagem na UE e um BAA em todos os planos | Duas semanas de armazenamento no Start Up |
| Sahha | Usuários sem wearables; pontuações prontas | Integrações em nuvem ainda em beta |
| Validic | Monitoramento remoto (RPM) corporativo dentro do EHR | Contratos negociados para produção |
| Open Wearables | Dados que nunca saem dos seus servidores | Todos os cadastros nos fornecedores ficam com você |
| Integrações diretas | Ser dono do pipeline, sem taxa de agregador | Você constrói cada conector |
| HealthKit / Health Connect | Mobile em primeiro lugar, sem custo por usuário | Sem coleta do lado do servidor |

## Qual escolher?

- **Exames laboratoriais para usuários dos EUA em todos os estados** → Junction; para usuários do Reino Unido também, o próprio Terra já faz isso.
- **Muitos usuários, um dispositivo cada, e uma conta fixa por faixas** → Rook ou Sahha.
- **Hospedagem na UE** → Thryve.
- **IoT médica, laudos laboratoriais e fotos de comida em um só contrato** → Spike.
- **Programas de monitoramento remoto de hospitais ou operadoras de saúde** → Validic.
- **Auto-hospedagem ou open source** → Open Wearables.
- **Só um ou dois fornecedores** → vá direto e seja dono do pipeline.

Se você ainda está decidindo entre agregadores em geral, a [comparação de APIs agregadoras de dados de saúde](/fitness-apis/health-data-aggregator-apis) cobre o campo inteiro, e [preços de agregadores](/pricing/health-data-aggregator-pricing) aplica as mesmas contagens de usuários a cada tabela de preços.

## Sair é fácil?

Normalmente é uma reintegração de verdade, não uma troca de configuração: novos cadastros de app no novo fornecedor (e em todo fornecedor de dados que exija as suas próprias credenciais), remapeamento de campos para um esquema normalizado diferente, e **todo usuário existente precisa se reconectar** pelo fluxo do novo fornecedor. Reserve orçamento para a campanha de reconexão, não só para o código.

Trocar de agregador ainda é uma reintegração só, e não muitas, porque cada novo fornecedor cobre muitas fontes por trás de uma API. Se a decisão for continuar com um agregador, o [guia de integração da API do Terra](/integrate/terra-api) mostra o formato do trabalho que você refaria contra o fornecedor que escolher.

*Os preços, planos e coberturas acima são de 17 de outubro de 2026 e mudam com frequência; reconfira as páginas atuais de preços e de integrações de cada fornecedor antes de se comprometer.*
