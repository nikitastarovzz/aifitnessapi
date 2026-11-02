---
path: "/fix/garmin-api-approval"
translatedOn: "2026-11-02"
sourceUpdated: "2026-11-02"
sourceHash: "a720189da90caf7b"
metaTitle: "Garmin Developer Program: acesso e aprovação (2026)"
metaDescription: >-
  Chaves da API da Garmin ainda exigem um pedido aprovado pela Garmin. Desde outubro de 2026: Starter e Enterprise Access, e uma Personal API autosserviço.
h1: "Acesso à API da Garmin em espera ou suspenso? Entenda o que está acontecendo"
answer: >-
  Se você não encontra um jeito de se cadastrar para obter chaves da API da Garmin, não está fazendo nada errado: o Connect Developer Program da Garmin ainda começa com um pedido que a Garmin precisa aprovar. A Garmin reorganizou o programa em outubro de 2026. Nas páginas lidas de novo em 2 de novembro, ela oferece o Starter Access, que segundo o FAQ dá "immediate access" [acesso imediato] a dados e ferramentas essenciais, e o Enterprise Access para empresas em escala, e as páginas não trazem mais o aviso "Stay tuned" [fique atento] nem dizem quanto tempo leva a análise. Se você só quer os seus próprios dados, a nova Personal API da Garmin dispensa o pedido por completo; para um produto, faça o pedido e, se estiver bloqueado, use um agregador como ponte só depois de confirmar de quem são as credenciais da Garmin que ele usa.
cta: >-
  Acompanhamos toda semana as mudanças de acesso às APIs de wearables, incluindo a reestruturação do programa da Garmin em outubro de 2026 e como se comparam os desvios via agregadores.
faqs:
  - q: "Por que não consigo me cadastrar para obter chaves da API da Garmin?"
    a: >-
      Porque o Connect Developer Program da Garmin não é autosserviço para dados de outras pessoas: você pede acesso e a Garmin aprova, e depois disso recebe o Garmin Developer Portal e começa com o Starter Access. A Garmin reorganizou o programa em outubro de 2026, e as páginas dele não informam mais o tempo de análise. Se você só quer os seus próprios dados, a Personal API da Garmin permite criar uma chave você mesmo no Garmin Connect Web.
  - q: "O programa de desenvolvedores da Garmin está mesmo fechado para novos pedidos?"
    a: >-
      Não, segundo as próprias páginas da Garmin. Lido em 17 de outubro de 2026, o FAQ do programa convidava pedidos sob um aviso que dizia "Stay tuned for more updates on the program." [Fique atento a novidades sobre o programa.] Em 22 de outubro a Garmin já tinha reorganizado o programa em Starter e Enterprise Access e retirado o aviso, e o FAQ, lido de novo em 2 de novembro, diz "please request access" [peça acesso]. A página inicial do Terra ainda diz que a Garmin pausou novos pedidos; as páginas da própria Garmin nunca disseram isso.
  - q: "Posso usar um agregador como o Terra para obter dados da Garmin sem aprovação?"
    a: >-
      Talvez, mas confirme fornecedor por fornecedor. A página inicial do Terra diz que os dados da Garmin passam pela integração de parceiro de longa data do Terra, mas a tabela de integrações suportadas dele marca as credenciais de integração da Garmin como Required [obrigatórias]. A página de fontes de dados da ROOK lista a Garmin como integração por API e não a inclui entre as fontes que exigem a sua própria conta de desenvolvedor. Caminhos abertos ou auto-hospedados que exigem as suas próprias credenciais da Garmin não ajudam, porque essas credenciais só se obtêm pela aprovação da Garmin. Peça a resposta de cada fornecedor por escrito.
  - q: "Quais são as minhas alternativas enquanto o acesso à Garmin está bloqueado?"
    a: >-
      Leia os dados da Garmin no Apple HealthKit ou no Google Health Connect, no celular; puxe as atividades da Garmin que são ressincronizadas no Strava depois que o usuário conecta a Garmin ao Strava; ou aceite arquivos FIT enviados pelo usuário, usando o FIT SDK da Garmin. Para um lançamento que não espere pela Garmin, Oura e WHOOP deixam você registrar um app por conta própria, dentro do limite de 10 usuários da Oura antes da aprovação e das regras de assinatura e de aprovação no lançamento da WHOOP. A antiga Fitbit Web API não é opção: o Google dá 2 de novembro de 2026 como a data de desligamento dela.
  - q: "Quanto tempo leva a aprovação da Garmin?"
    a: >-
      A Garmin não informa mais. O FAQ lido em 17 de outubro de 2026 dizia que ela confirmava o status de um pedido em até dois dias úteis; a versão lida em 22 de outubro diz apenas que, depois que o seu pedido é aprovado, você recebe o Garmin Developer Portal e pode começar na hora, e estima uma integração típica em uma a quatro semanas. Não construa contra a Garmin presumindo que será aprovado.
steps:
  - name: "Confirme primeiro o status atual do programa"
    text: >-
      Abra a visão geral do Connect Developer Program da Garmin e veja como ela diz para pedir acesso. Relatos da comunidade ficam desatualizados rápido, então a sua própria checagem decide todo o resto.
  - name: "Use a Personal API se os dados forem seus"
    text: >-
      Se você só precisa dos seus próprios dados da Garmin, crie uma chave no Garmin Connect Web para a Garmin Connect Personal API em vez de se candidatar ao programa de desenvolvedores.
  - name: "Peça o Starter Access e aguarde a aprovação"
    text: >-
      Para um produto que lê dados de outras pessoas, peça acesso ao Connect Developer Program. Depois da aprovação você recebe o Garmin Developer Portal e começa com o Starter Access; as páginas da Garmin não informam tempo de análise.
  - name: "Use um agregador que já tenha acesso à Garmin"
    text: >-
      Um agregador pode intermediar os dados da Garmin para que os usuários vinculem a conta Garmin pelo fluxo dele. Confirme por escrito de quem são as credenciais da Garmin que ele usa: a página inicial e a tabela de integrações do Terra divergem nesse ponto.
  - name: "Considere dispositivos ou rotas de ingestão alternativas"
    text: >-
      Leia os dados da Garmin no HealthKit ou no Google Health Connect, no celular; puxe as atividades da Garmin que são ressincronizadas no Strava; ou aceite arquivos FIT enviados pelo usuário. Esses caminhos evitam por completo a API em nuvem controlada da Garmin.
related:
  - href: "/fix/garmin-api-personal-use"
    label: "API da Garmin para uso pessoal"
  - href: "/fix/wearable-data-delayed"
    label: "Solução: dados do wearable ausentes ou atrasados"
  - href: "/integrate/garmin-api"
    label: "Integrar a API da Garmin"
  - href: "/fitness-apis/fitbit-api-vs-garmin-api"
    label: "API da Fitbit vs API da Garmin"
  - href: "/fix"
    label: "Solução de problemas de APIs de fitness e saúde"
---
Esta página trata de conseguir acesso. Para a API da Garmin em si (as cinco APIs, OAuth 2.0 e entrega por push ou ping/pull), veja o [guia de integração da API da Garmin](/integrate/garmin-api).

Se você preencheu um formulário, mandou e-mail para a Garmin ou procurou um botão "sign up for API keys" [cadastre-se para obter chaves de API] e não chegou a lugar nenhum, você não está fazendo nada errado. O programa de desenvolvedores da Garmin é **baseado em aprovação**: não existe chave autosserviço para ler dados de outras pessoas. O que mudou em outubro de 2026 foi o formato do programa em torno desse portão, e agora existe uma rota que não exige aprovação nenhuma: a Personal API da Garmin, para os seus próprios dados.

## O que está acontecendo de fato

A Garmin reorganizou o Connect Developer Program entre as leituras que este site fez das páginas dele em 17 e 22 de outubro de 2026. Uma captura da Wayback Machine do antigo FAQ do programa em 17 de outubro mostra o aviso "Stay tuned for more updates on the program" [fique atento a novidades sobre o programa] e a frase de que o programa "is only for business use" [é só para uso empresarial]. As páginas lidas em 22 de outubro, e de novo em 2 de novembro, substituem as duas coisas:

**1. O acesso empresarial vem em dois níveis.** O FAQ da Garmin agora descreve o Starter Access ("Developers can gain immediate access and launch with Garmin, with access to core data and tools" [desenvolvedores podem obter acesso imediato e lançar com a Garmin, com acesso a dados e ferramentas essenciais]) e o Enterprise Access ("For companies operating at scale" [para empresas que operam em escala]). Ele diz que o programa "supports a broad range of organizations, from individual developers and startups to companies operating at significant scale" [atende uma ampla gama de organizações, de desenvolvedores individuais e startups a empresas que operam em escala significativa].

**2. Tudo ainda começa com um pedido.** O FAQ diz que, depois que você pede acesso e "your request has been approved, you will be granted access to the Garmin Developer Portal and can get started on your integration right away" [seu pedido foi aprovado, você recebe acesso ao Garmin Developer Portal e pode começar a sua integração na hora], e estima uma integração típica em uma a quatro semanas. Ele não diz mais quanto tempo leva a análise; a versão de 17 de outubro dizia dois dias úteis.

**3. O uso pessoal tem a sua própria API.** O FAQ empresarial responde "What if I would like API access to my data for personal use?" [e se eu quiser acesso via API aos meus dados para uso pessoal?] apontando para a Garmin Connect Personal API, em que você mesmo cria uma chave no Garmin Connect Web. A Garmin diz que essa API não se destina a aplicações comerciais que atendem vários usuários finais. Se esse é o seu caso, [API da Garmin para uso pessoal](/fix/garmin-api-personal-use) mostra o passo a passo, e você pode parar por aqui.

**E a pausa relatada?** Relatos de que a Garmin parou de aceitar pedidos ainda circulam: a página inicial do Terra, lida em 2 de novembro de 2026, diz que a Garmin "has paused new applications to its Connect Developer Program while it completes updates" [pausou novos pedidos ao seu Connect Developer Program enquanto conclui atualizações]. Isso nunca foi declarado nas páginas da própria Garmin, que em 17 de outubro ainda convidavam pedidos sob o aviso "Stay tuned". O FAQ reestruturado, lido em 22 de outubro e de novo em 2 de novembro, diz "please request access to the Garmin Connect Developer Program" [peça acesso ao Garmin Connect Developer Program] e não diz nada sobre pausa.

O status do programa pode mudar, então **trate qualquer relato como "verifique", não como verdade absoluta**, esta página incluída. Antes de desistir ou dizer a alguém da empresa que a Garmin está fechada, abra `https://developer.garmin.com/gc-developer-program/overview/` e leia você mesmo as páginas atuais do programa.

## "Application suspended": o que podemos e não podemos dizer

Se você buscou acesso à API da Garmin com a palavra "suspended" [suspenso], provavelmente encontrou uma de duas situações: um relato de que a Garmin tinha parado de aceitar novos pedidos (a pausa relatada acima, que as páginas da própria Garmin nunca mencionaram), ou uma mensagem sobre o seu próprio app ou conta. O site de desenvolvedores da Garmin não é acessível a partir do nosso ambiente; execuções de snapshot de fontes leram as páginas do programa em 17 de outubro, 22 de outubro e 2 de novembro de 2026. Não podemos dizer o que leva à suspensão de um app específico nem como funciona a reativação. Trate qualquer coisa mais específica que você leia em outro lugar, este site incluído, como não verificada até que a Garmin a confirme.

O que vale nos dois casos, como recomendação nossa e não da Garmin:

- **Se o aviso é sobre novos pedidos em geral,** nada do seu lado muda isso. Planeje em torno dele com os passos de agregador e de dispositivos alternativos abaixo, e reconfira as páginas do programa de tempos em tempos.
- **Se é sobre o seu próprio app aprovado,** só a Garmin pode dizer o motivo. Os seus hosts, escopos e termos vêm do seu contrato com a Garmin (veja o [guia de integração da API da Garmin](/integrate/garmin-api)), então responda pelo canal que esse contrato indica e mantenha os usuários em uma alternativa, como a sincronização pelo app de saúde do celular ou um agregador, enquanto espera.

## Os motivos mais prováveis de você estar travado

Os motivos de sempre:

1. **Você esperava uma chave autosserviço para dados de outras pessoas.** Ela não existe. Você pede acesso ao programa e aguarda a aprovação.
2. **Você só quer os seus próprios dados.** Então o programa de desenvolvedores é a porta errada: o FAQ da Garmin manda o uso pessoal para a [Garmin Connect Personal API](/fix/garmin-api-personal-use).
3. **Você fez o pedido e está esperando.** As páginas atuais da Garmin não informam tempo de análise, então por elas você não tem como saber se está atrasado.
4. **Você tentou uma rota não oficial ou auto-hospedada que ainda exige as suas próprias credenciais da Garmin**, que só se obtêm pela aprovação da Garmin (o problema do ovo e da galinha, abaixo).

## Como se destravar

### Passo 1: confirme o status atual antes de qualquer coisa

Abra `https://developer.garmin.com/gc-developer-program/overview/` em um navegador e veja como as páginas do programa dizem para pedir acesso. Relatos da comunidade ficam desatualizados rápido, então a sua própria checagem é a fonte da verdade. Em 2 de novembro de 2026 o FAQ do programa ainda dizia "please request access" [peça acesso]; então, se você consegue pedir, vá para o Passo 2. Se não encontrar nenhum jeito de pedir, planeje em torno disso (Passos 3-4).

### Passo 2: peça o Starter Access e aguarde (o caminho oficial)

Peça acesso ao programa pelo link de pedido nas páginas do programa da Garmin. Se você pretende oferecer wearables da Garmin aos seus usuários, o FAQ da Garmin diz para também entrar em contato pelo formulário de consulta dela, com detalhes do projeto. Depois, **aguarde a aprovação**: uma vez aprovado, você recebe o Garmin Developer Portal, onde a Garmin diz que fica toda a documentação detalhada. A visão geral diz que você começa com o Starter Access e pode pedir o Enterprise Access pelo Developer Portal conforme as suas necessidades crescem; o Starter é só push, sem dados históricos e com capacidade limitada de usuários, então confronte isso com o seu produto antes de planejar um lançamento.

**Não construa contra a Garmin presumindo que será aprovado.** Confirme o acesso primeiro.

### Passo 3: considere um agregador que já tenha acesso de parceiro à Garmin

A forma usual de se destravar enquanto o acesso direto está fechado é um agregador de dados de wearables que já se conecta à Garmin: o usuário vincula a conta Garmin pelo fluxo do agregador, e o agregador entrega dados normalizados a você. O que você precisa confirmar é de quem são as credenciais da Garmin que esse fluxo usa, porque as próprias páginas de um fornecedor podem divergir nisso. A página inicial do **Terra**, lida em 2 de novembro de 2026, diz "Terra has maintained a Garmin integration for years as an established partner, so Garmin data flows through Terra today" [o Terra mantém há anos uma integração com a Garmin como parceiro estabelecido, então os dados da Garmin passam pelo Terra hoje], mas a tabela de integrações suportadas dele marca as credenciais de integração da Garmin como Required [obrigatórias] e aponta para o portal de desenvolvedores da Garmin. A página de fontes de dados da **ROOK** lista a Garmin como integração por API e cita só Dexcom, Samsung Health, Strava e Whoop como fontes em que você precisa trazer a sua própria conta de desenvolvedor. Peça a cada fornecedor, por escrito, antes de prometer suporte à Garmin.

**Cuidado com a armadilha do ovo e da galinha.** Algumas integrações open source ou auto-hospedadas ainda exigem que **você** forneça as suas próprias credenciais da API da Garmin, que só se obtêm pela aprovação da própria Garmin. Esse caminho não destrava você se é justamente a aprovação que você está esperando. Prefira um agregador que use as suas **próprias** credenciais aprovadas da Garmin, para que você nunca precise da aprovação direta da Garmin.

Para a mecânica da integração quando você tiver acesso (direto ou via agregador), veja o [guia de integração da API da Garmin](/integrate/garmin-api).

### Passo 4: considere, por enquanto, dispositivos ou rotas de ingestão alternativas

Se você não pode esperar, há alternativas honestas que não dependem da API em nuvem da Garmin:

- **Leia os dados da Garmin no app de saúde do celular.** Se os dados da Garmin de um usuário chegam ao **Apple HealthKit** ou ao **Google Health Connect**, você pode lê-los no aparelho sem a API da Garmin. Veja o [guia de integração do Apple HealthKit](/integrate/healthkit) e o [guia de integração do Google Health Connect](/integrate/google-health-connect).
- **Chegue às atividades da Garmin pelo Strava.** A API Policy do Strava (em vigor desde 1 de junho de 2026) diz que dados obtidos pela API do Strava podem incluir dados vindos da Garmin, e que um app que mostre informações derivadas deles precisa exibir atribuição à Garmin conforme as diretrizes de marca da Garmin. Atividades que um usuário sincroniza da Garmin para o Strava podem, portanto, chegar a você pela API do Strava, com esse dever de atribuição junto.
- **Aceite envio de arquivos `.fit`.** Para importações pontuais, deixe os usuários enviarem arquivos `.fit` da Garmin (o FIT SDK da Garmin, disponível para C, C++, C#, Java, JavaScript, Objective-C, Python e Swift, os decodifica) quando o acesso à API ao vivo não estiver disponível.
- **Lance em um ecossistema em que você mesmo pode começar.** Oura e WHOOP deixam você registrar um app sem se candidatar a um programa, dentro de limites: a referência da API da Oura limita um aplicativo a 10 usuários até que a Oura o aprove, e a WHOOP exige uma assinatura WHOOP para desenvolver e pede que você envie o app para aprovação no lançamento. A Fitbit não é mais essa opção: o Google dá 2 de novembro de 2026 como a data de desligamento da antiga Fitbit Web API e aponta os desenvolvedores para a Google Health API. [API da Fitbit vs API da Garmin](/fitness-apis/fitbit-api-vs-garmin-api) compara os dois fornecedores.

**Não** dependa de clientes não oficiais do Garmin Connect em produção; na nossa avaliação, eles são um risco para um produto. Eles entram com as credenciais do Garmin Connect do usuário, e não por um programa de desenvolvedores, e quebram quando a Garmin muda o login: o README do garth diz que a Garmin mudou o fluxo de autenticação, quebrando a abordagem de autenticação móvel de que o garth dependia, e que novos logins não vão funcionar, enquanto o README do python-garminconnect descreve tentar várias estratégias de login, algumas com imitação de TLS. Para a sua própria conta, a Personal API da Garmin agora faz oficialmente o que esses clientes faziam de forma não oficial; se você já usa um deles, [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth) cobre os dois clientes Python não oficiais, incluindo por que o garth não aceita mais novos logins.

## Ainda travado? Triagem rápida

- Abriu `developer.garmin.com/gc-developer-program/overview/` e viu como ela diz para pedir acesso agora? (Isso decide todo o resto.)
- Só precisa dos seus próprios dados? Use a Personal API em vez de se candidatar.
- Se consegue pedir: enviou o pedido, sabendo que as páginas atuais da Garmin não informam tempo de análise?
- Se não consegue: mudou para um agregador que fornece as suas **próprias** credenciais da Garmin (não um que peça a você chaves que você não consegue obter)?
- Se você conectou os dados mas nada chega, o problema pode ser latência de sincronização, não acesso; veja [dados do wearable atrasados ou ausentes](/fix/wearable-data-delayed).

O resumo honesto: o acesso à Garmin para produtos é baseado em aprovação, agora nos níveis Starter e Enterprise; o acesso aos seus próprios dados é autosserviço pela Personal API; e as páginas da própria Garmin nunca disseram que os novos pedidos estão pausados. Confira as páginas atuais do programa, faça o pedido, use um agregador como ponte se estiver bloqueado, depois que ele confirmar de quem são as credenciais da Garmin que usa, e apoie-se em HealthKit / Health Connect / Strava / arquivos FIT enquanto isso.
