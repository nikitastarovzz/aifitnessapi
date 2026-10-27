---
path: "/fix/garmin-api-approval"
translatedOn: "2026-10-27"
sourceUpdated: "2026-07-09"
sourceHash: "cde577db1e109dea"
metaTitle: "Garmin Developer Program: acesso e aprovação (2026)"
metaDescription: >-
  Chaves da API da Garmin ainda exigem pedido de acesso aprovado pela Garmin. Desde outubro de 2026: Starter e Enterprise Access, e uma Personal API.
h1: "Acesso à API da Garmin em espera ou suspenso? Entenda o que está acontecendo"
answer: >-
  Se você não encontra um jeito de se cadastrar para obter chaves da API da Garmin, não está fazendo nada errado: o Connect Developer Program da Garmin ainda começa com um pedido que a Garmin precisa aprovar. A Garmin reorganizou o programa em outubro de 2026. Nas páginas lidas em 22 de outubro, ela oferece o Starter Access, que segundo o FAQ dá "immediate access" [acesso imediato] a dados e ferramentas essenciais, e o Enterprise Access para empresas em escala, e as páginas não trazem mais o aviso "Stay tuned" [fique atento] nem dizem quanto tempo leva a análise. Se você só quer os seus próprios dados, a nova Personal API da Garmin dispensa o pedido por completo; para um produto, faça o pedido e, se estiver bloqueado, use como ponte um agregador como o Terra, que tem o seu próprio acesso à Garmin.
cta: >-
  Acompanhamos toda semana as mudanças de acesso às APIs de wearables, incluindo a reestruturação do programa da Garmin em outubro de 2026 e como se comparam os desvios via agregadores.
faqs:
  - q: "Por que não consigo me cadastrar para obter chaves da API da Garmin?"
    a: >-
      Porque o Connect Developer Program da Garmin não é autosserviço para dados de outras pessoas: você pede acesso e a Garmin aprova, e depois disso recebe o Garmin Developer Portal e começa com o Starter Access. A Garmin reorganizou o programa em outubro de 2026, e as páginas dele não informam mais o tempo de análise. Se você só quer os seus próprios dados, a Personal API da Garmin permite criar uma chave você mesmo no Garmin Connect Web.
  - q: "O programa de desenvolvedores da Garmin está mesmo fechado para novos pedidos?"
    a: >-
      Não, segundo as próprias páginas da Garmin. Lido em 17 de outubro de 2026, o FAQ do programa convidava pedidos sob um aviso que dizia "Stay tuned for more updates on the program." [Fique atento a novidades sobre o programa.] Em 22 de outubro a Garmin já tinha reorganizado o programa em Starter e Enterprise Access, retirado o aviso e passado a convidar pedidos de Starter Access. Os relatos em fóruns, de meados de 2026, sobre um formulário de pedido removido nunca foram confirmados nas páginas da Garmin.
  - q: "Posso usar um agregador como o Terra para obter dados da Garmin sem aprovação?"
    a: >-
      Muitas vezes, sim. Agregadores como o Terra têm a sua própria parceria com a Garmin e deixam o usuário conectar a conta Garmin pelo fluxo do agregador, que depois envia dados normalizados para o seu webhook. O Terra anuncia conectividade com a Garmin descrita como sem exigir a sua própria aprovação no Garmin Developer Program. Cuidado com caminhos abertos ou auto-hospedados que ainda exigem que você forneça as suas próprias credenciais da Garmin, que só se obtêm pela aprovação da própria Garmin. Confira os termos atuais de cada fornecedor para a Garmin.
  - q: "Quais são as minhas alternativas enquanto o acesso à Garmin está bloqueado?"
    a: >-
      Leia os dados da Garmin no Apple HealthKit ou no Google Health Connect, no celular; puxe as atividades da Garmin que são ressincronizadas no Strava depois que o usuário conecta a Garmin ao Strava; ou aceite arquivos FIT enviados pelo usuário, usando o FIT SDK aberto da Garmin. Para um lançamento que não espere pela Garmin, ecossistemas autosserviço como Fitbit, Oura e WHOOP estão disponíveis hoje.
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
      Um agregador como o Terra pode intermediar os dados da Garmin para que os usuários vinculem a conta Garmin pelo widget dele. Prefira um que forneça as suas próprias credenciais aprovadas da Garmin, não um que peça a você chaves para as quais você não foi aprovado.
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

A Garmin reorganizou o Connect Developer Program entre as leituras que este site fez das páginas dele em 17 e 22 de outubro de 2026. Uma captura da Wayback Machine do antigo FAQ do programa em 17 de outubro mostra o aviso "Stay tuned for more updates on the program" [fique atento a novidades sobre o programa] e a frase de que o programa "is only for business use" [é só para uso empresarial]. As páginas lidas em 22 de outubro substituem as duas coisas:

**1. O acesso empresarial vem em dois níveis.** O FAQ da Garmin agora descreve o Starter Access ("Developers can gain immediate access and launch with Garmin, with access to core data and tools" [desenvolvedores podem obter acesso imediato e lançar com a Garmin, com acesso a dados e ferramentas essenciais]) e o Enterprise Access ("For companies operating at scale" [para empresas que operam em escala]). Ele diz que o programa "supports a broad range of organizations, from individual developers and startups to companies operating at significant scale" [atende uma ampla gama de organizações, de desenvolvedores individuais e startups a empresas que operam em escala significativa].

**2. Tudo ainda começa com um pedido.** O FAQ diz que, depois que você pede acesso e "your request has been approved, you will be granted access to the Garmin Developer Portal and can get started on your integration right away" [seu pedido foi aprovado, você recebe acesso ao Garmin Developer Portal e pode começar a sua integração na hora], e estima uma integração típica em uma a quatro semanas. Ele não diz mais quanto tempo leva a análise; a versão de 17 de outubro dizia dois dias úteis.

**3. O uso pessoal tem a sua própria API.** O FAQ empresarial responde "What if I would like API access to my data for personal use?" [e se eu quiser acesso via API aos meus dados para uso pessoal?] apontando para a Garmin Connect Personal API, em que você mesmo cria uma chave no Garmin Connect Web. A Garmin diz que essa API não se destina a aplicações comerciais que atendem vários usuários finais. Se esse é o seu caso, [API da Garmin para uso pessoal](/fix/garmin-api-personal-use) mostra o passo a passo, e você pode parar por aqui.

**E a pausa relatada?** Relatos de desenvolvedores de meados de 2026 (nos fóruns da própria Garmin e em uma issue pública no GitHub) descreviam o formulário de pedido de acesso como removido ou "under revision" [em revisão]. Isso nunca foi declarado nas páginas da própria Garmin, que em 17 de outubro ainda convidavam pedidos sob o aviso "Stay tuned". As páginas reestruturadas, lidas em 22 de outubro, convidam pedidos de Starter Access e não dizem nada sobre pausa.

O status do programa pode mudar, então **trate qualquer relato como "verifique", não como verdade absoluta**, esta página incluída. Antes de desistir ou dizer a alguém da empresa que a Garmin está fechada, abra `https://developer.garmin.com/gc-developer-program/overview/` e leia você mesmo as páginas atuais do programa.

## "Application suspended": o que podemos e não podemos dizer

Se você buscou acesso à API da Garmin com a palavra "suspended" [suspenso], provavelmente encontrou uma de duas situações: um relato de que a Garmin tinha parado de aceitar novos pedidos (a pausa relatada acima, que as páginas da própria Garmin nunca mencionaram), ou uma mensagem sobre o seu próprio app ou conta. O site de desenvolvedores da Garmin não é acessível a partir do nosso ambiente; execuções de snapshot de fontes leram as páginas do programa em 17 e 22 de outubro de 2026. Não podemos dizer o que leva à suspensão de um app específico nem como funciona a reativação. Trate qualquer coisa mais específica que você leia em outro lugar, este site incluído, como não verificada até que a Garmin a confirme.

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

Abra `https://developer.garmin.com/gc-developer-program/overview/` em um navegador e veja como as páginas do programa dizem para pedir acesso. Relatos da comunidade ficam desatualizados rápido, então a sua própria checagem é a fonte da verdade. Em 22 de outubro de 2026 a visão geral oferecia um pedido de Starter Access; então, se você consegue pedir, vá para o Passo 2. Se não encontrar nenhum jeito de pedir, planeje em torno disso (Passos 3-4).

### Passo 2: peça o Starter Access e aguarde (o caminho oficial)

Peça acesso ao programa, contando que vai precisar descrever a sua empresa, o seu app e o uso pretendido das Health e/ou Activity APIs. Se você pretende oferecer wearables da Garmin aos seus usuários, o FAQ da Garmin diz para também entrar em contato pelo formulário de consulta dela, com detalhes do projeto. Depois, **aguarde a aprovação**: uma vez aprovado, você recebe o Garmin Developer Portal, onde a Garmin diz que fica toda a documentação detalhada. A visão geral diz que você começa com o Starter Access e pode pedir o Enterprise Access pelo Developer Portal conforme as suas necessidades crescem; o Starter é só push, sem dados históricos e com capacidade limitada de usuários, então confronte isso com o seu produto antes de planejar um lançamento.

**Não construa contra a Garmin presumindo que será aprovado.** Confirme o acesso primeiro.

### Passo 3: considere um agregador que já tenha acesso de parceiro à Garmin

A forma padrão de se destravar enquanto o acesso direto está fechado é passar por um agregador de dados de wearables que já tenha parceria com a Garmin. Fornecedores como o **Terra** (e outros, como Rook, Validic, Spike ou Vital) deixam o usuário vincular a conta Garmin pelo widget de autenticação do agregador; o agregador cuida do OAuth e envia dados normalizados da Garmin para o seu webhook. O Terra, por exemplo, anuncia conectividade com a Garmin descrita como **sem exigir a sua própria aprovação no Garmin Developer Program**. Confira o suporte e os termos atuais de cada fornecedor para a Garmin, porque isso muda.

**Cuidado com a armadilha do ovo e da galinha.** Algumas integrações open source ou auto-hospedadas ainda exigem que **você** forneça as suas próprias credenciais da API da Garmin, que só se obtêm pela aprovação da própria Garmin. Esse caminho não destrava você se é justamente a aprovação que você está esperando. Prefira um agregador que use as suas **próprias** credenciais aprovadas da Garmin, para que você nunca precise da aprovação direta da Garmin.

Para a mecânica da integração quando você tiver acesso (direto ou via agregador), veja o [guia de integração da API da Garmin](/integrate/garmin-api).

### Passo 4: considere, por enquanto, dispositivos ou rotas de ingestão alternativas

Se você não pode esperar, há alternativas honestas que não dependem da API em nuvem da Garmin:

- **Leia os dados da Garmin no app de saúde do celular.** Se os dados da Garmin de um usuário chegam ao **Apple HealthKit** ou ao **Google Health Connect**, você pode lê-los no aparelho sem a API da Garmin. Veja o [guia de integração do Apple HealthKit](/integrate/healthkit) e o [guia de integração do Google Health Connect](/integrate/google-health-connect).
- **Chegue às atividades da Garmin pelo Strava.** Depois que um usuário conecta a Garmin ao Strava, muitas atividades vindas da Garmin são ressincronizadas no Strava, e você recebe esses dados pela API do Strava, que dá para obter hoje.
- **Aceite envio de arquivos `.fit`.** Para importações pontuais, deixe os usuários enviarem arquivos `.fit` da Garmin (o FIT SDK aberto da Garmin os interpreta) quando o acesso à API ao vivo não estiver disponível.
- **Escolha um ecossistema autosserviço para o lançamento.** Fitbit, Oura e WHOOP são autosserviço; compare a Garmin com eles em [API da Fitbit vs API da Garmin](/fitness-apis/fitbit-api-vs-garmin-api) antes de se comprometer com a espera.

**Não** dependa de clientes não oficiais ou de scraping do Garmin Connect em produção. A Garmin implantou fingerprinting de TLS que bloqueia clientes de terceiros, e isso viola os termos de serviço dela. Para a sua própria conta, a Personal API da Garmin agora faz oficialmente o que esses clientes faziam de forma não oficial; se você já usa um deles, [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth) cobre os dois clientes Python não oficiais, incluindo por que o garth não aceita mais novos logins.

## Ainda travado? Triagem rápida

- Abriu `developer.garmin.com/gc-developer-program/overview/` e viu como ela diz para pedir acesso agora? (Isso decide todo o resto.)
- Só precisa dos seus próprios dados? Use a Personal API em vez de se candidatar.
- Se consegue pedir: enviou o pedido, sabendo que as páginas atuais da Garmin não informam tempo de análise?
- Se não consegue: mudou para um agregador que fornece as suas **próprias** credenciais da Garmin (não um que peça a você chaves que você não consegue obter)?
- Se você conectou os dados mas nada chega, o problema pode ser latência de sincronização, não acesso; veja [dados do wearable atrasados ou ausentes](/fix/wearable-data-delayed).

O resumo honesto: o acesso à Garmin para produtos é baseado em aprovação, agora nos níveis Starter e Enterprise; o acesso aos seus próprios dados é autosserviço pela Personal API; e as páginas da própria Garmin nunca disseram que os novos pedidos estão pausados. Confira as páginas atuais do programa, faça o pedido, use como ponte um agregador que tenha a sua própria parceria com a Garmin se estiver bloqueado, e apoie-se em HealthKit / Health Connect / Strava / arquivos FIT enquanto isso.
