---
path: "/integrate/strava-api"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-17"
sourceHash: "311bd5e263cb18c0"
metaTitle: "API do Strava (2026): níveis de acesso, OAuth, webhooks"
metaDescription: >-
  Integre a API do Strava: modo single-player, revisão para 10 atletas, escopos OAuth, tokens rotativos, um webhook por app, limites e mudanças de 2026.
h1: "Guia de integração da API do Strava (2026)"
answer: >-
  A API do Strava dá ao seu app as atividades, rotas, equipamentos e o perfil de um atleta via OAuth 2.0: você leva o atleta à tela de consentimento do Strava, troca o code devolvido por um access token de seis horas e um refresh token que pode mudar a cada renovação, e chama a API REST v3 com um token Bearer. O acesso tem um portão antes de qualquer código rodar: o Strava diz que uma assinatura é pré-requisito para criar um app, todo app novo começa no modo single-player, em que só a sua própria conta pode se conectar, um upgrade autosserviço eleva isso a 10 atletas, e mais de 10 exige a revisão do Strava. Use a única assinatura de webhook que cada app pode ter em vez de fazer polling, e leia os headers de limite de requisições geral e de não upload em toda resposta.
cta: >-
  Relemos a documentação e os termos de desenvolvedor do Strava periodicamente, então você fica sabendo de mudanças de nível de acesso, de limite de requisições e de endpoint, como a troca de URL base em 2027, antes que elas quebrem a sua sincronização.
faqs:
  - q: "A API do Strava exige aprovação para uso?"
    a: >-
      Não para começar, mas sim para escalar. O guia de primeiros passos do Strava diz que uma assinatura do Strava é pré-requisito para criar um app e que todo app novo começa no modo single-player, em que só a sua própria conta pode se autenticar. Um upgrade autosserviço no API Settings Dashboard eleva a capacidade para 10 atletas; acima de 10, você envia o formulário do Developer Program para revisão, e o Strava diz que o acesso ampliado não é garantido.
  - q: "Quais são os limites de requisições da API do Strava em 2026?"
    a: >-
      Conforme o Strava documentava em 17 de outubro de 2026, um app novo tem um limite geral de 200 requisições a cada 15 minutos e 2.000 por dia, e um limite de não upload de 100 a cada 15 minutos e 1.000 por dia. O upgrade autosserviço eleva esses números a 400 e 4.000 no geral e 200 e 2.000 para leituras. A janela de 15 minutos reinicia a cada quarto de hora, a diária à meia-noite UTC, e uma requisição acima do limite devolve 429.
  - q: "Quanto tempo duram os access tokens do Strava?"
    a: >-
      Os access tokens do Strava expiram seis horas depois de criados. Renovar devolve o token atual se ele ainda tiver mais de uma hora, e um novo se ele expirar dentro da próxima hora. O refresh token também pode mudar em qualquer renovação, e o Strava diz que o refresh token anterior é invalidado assim que um novo é devolvido, então guarde sempre o mais recente.
  - q: "Como obtenho as atividades privadas do Strava?"
    a: >-
      Peça o escopo activity:read_all. O activity:read simples cobre atividades visíveis para Everyone e Followers e exclui dados de zonas de privacidade, enquanto o activity:read_all acrescenta os dados de zonas de privacidade e as atividades definidas como Only You. A mesma divisão vale para os webhooks: um app só com activity:read recebe um evento delete quando uma atividade passa a Only You e um evento create quando ela volta a ficar visível.
  - q: "O webhook do Strava traz os dados da atividade?"
    a: >-
      Não. Os eventos do Strava trazem object_type, object_id, aspect_type, owner_id, subscription_id, event_time e um hash updates, não a atividade em si, então você busca o registro com o token daquele atleta. Responda com HTTP 200 em até dois segundos, porque o Strava tenta de novo um push que falhou até três tentativas no total, e lembre que cada aplicação tem direito a só uma assinatura.
steps:
  - name: "Crie o app e planeje o teto de atletas"
    text: >-
      Com uma conta do Strava assinante, crie um app na página de configurações da API do Strava para obter um Client ID, um Client Secret e um domínio de callback. Ele começa no modo single-player, então planeje o upgrade autosserviço para 10 atletas e a revisão para passar disso.
  - name: "Leve o atleta pelo OAuth com os escopos de que você precisa"
    text: >-
      Redirecione para o endpoint authorize do Strava com escopos separados por vírgula ou espaço, como read e activity:read_all, e leia o escopo concedido na volta, porque o atleta pode desmarcar escopos.
  - name: "Troque o code e guarde os dois tokens"
    text: >-
      Faça POST do code de uso único com as credenciais do seu cliente para o endpoint de token, a partir do seu servidor. Guarde por atleta o access token de seis horas, a validade dele e o refresh token.
  - name: "Busque as atividades com o token Bearer"
    text: >-
      Chame o endpoint de atividades do atleta com before, after, page e per_page, iterando até uma página vazia, e acompanhe tanto o header de limite geral quanto o de não upload.
  - name: "Renove e persista o refresh token mais recente"
    text: >-
      Renove antes que o access token expire e salve o refresh token que voltar, seja ele qual for, porque o Strava invalida o anterior assim que emite um novo. Serialize as renovações por atleta.
  - name: "Assine os webhooks e trate a desautorização"
    text: >-
      Crie a única assinatura de push do app, responda à validação hub.challenge em até dois segundos, busque você mesmo cada registro apontado e passe a desautorização para o endpoint oauth/revoke antes de 1º de junho de 2027.
related:
  - href: "/pricing/strava-api-pricing"
    label: "Preço da API do Strava"
  - href: "/alternatives/strava-api-alternatives"
    label: "Alternativas à API do Strava"
  - href: "/fix/strava-webhook-not-firing"
    label: "Solução: webhook do Strava não dispara"
  - href: "/migrate/adapt-to-strava-api-changes"
    label: "Adaptar-se às mudanças da API do Strava"
  - href: "/integrate"
    label: "Como integrar uma API de fitness ou saúde"
---
O Strava é a integração natural para um app social de corrida ou ciclismo, em que os atletas já registram atividades e esperam que elas sincronizem. Se você está construindo esse tipo de produto, isto combina bem com a camada mais ampla de [APIs de dados de wearables](/fitness-apis/wearable-data-apis) e com as decisões de formato de app em [como construir um app de corrida](/build/running-app). Os requisitos de acesso do Strava, e todas as páginas deste site que tratam dele, estão reunidos na [visão geral da API do Strava](/apis/strava).

> **Conferido contra as próprias páginas do Strava em 17 de outubro de 2026.** Todo limite, escopo e data abaixo vem de developers.strava.com ou das páginas jurídicas do Strava, como baixadas naquele dia. O Strava mudou o modelo de acesso, os limites de requisições e os termos em 2026, então trate tutoriais antigos (e versões antigas desta página) como desatualizados.

## Acesso e aprovação: primeiro o modo single-player

O guia de primeiros passos do Strava diz que uma assinatura do Strava é pré-requisito para criar um app, e que "All new applications start in single-player mode" [todos os aplicativos novos começam no modo single-player], o estado padrão em que só a sua própria conta do Strava pode se autenticar no app. Isso basta para construir e testar com os seus próprios dados, não para atender mais ninguém.

A partir daí o acesso cresce em dois passos:

| Etapa | Quem pode se conectar | Limites de requisições que o Strava documenta | Como chegar lá |
|---|---|---|---|
| Modo single-player | Só você (capacidade de 1 atleta) | Geral: 200 requisições / 15 min e 2.000 / dia; não upload: 100 / 15 min e 1.000 / dia | Crie um app em `https://www.strava.com/settings/api` |
| Upgrade autosserviço | Até 10 atletas | Geral: 400 / 15 min e 4.000 / dia; leitura: 200 / 15 min e 2.000 / dia | Faça o upgrade no API Settings Dashboard depois que o app estiver configurado |
| App revisado | Mais de 10 atletas | Aumentados caso a caso | Envie o formulário do Developer Program para revisão |

O formulário de revisão pede capturas de tela de todo lugar onde aparecem dados do Strava e do botão "Connect with Strava" [Conectar com o Strava], e o Strava diz com todas as letras que o acesso ampliado não é garantido. A API Policy dele, em vigor desde 1º de junho de 2026, acrescenta que a admissão no Developer Program fica a critério do Strava, sem compromisso fixo de prazo de revisão.

A mesma política divide os apps em níveis de acesso. O Standard Tier cobre apps limitados a 10 usuários registrados e apps limitados a 9.999, e está sujeito a requisitos de assinatura, "including a requirement that the developer or specified end users maintain an active Strava subscription" [incluindo a exigência de que o desenvolvedor ou usuários finais especificados mantenham uma assinatura ativa do Strava]. O Extended Access Tier, em geral para apps que atendem 10.000 usuários ou mais, é concedido caso a caso e não está sujeito a esses requisitos de assinatura, a menos que o Strava publique o contrário. Quanto custa a assinatura está em [preço da API do Strava](/pricing/strava-api-pricing).

## O que você vai precisar

- Uma conta do Strava com assinatura e um app registrado em `https://www.strava.com/settings/api`, que dá a você um **Client ID** e um **Client Secret**.
- Um **Authorization Callback Domain** no app. O Strava exige que o seu `redirect_uri` esteja dentro desse domínio, e libera `localhost` e `127.0.0.1` para desenvolvimento.
- Um backend para guardar o Client Secret e o refresh token de cada atleta. As chamadas de troca de token, renovação, revogação e assinatura de webhook precisam do secret, então ele nunca deve ficar em um cliente móvel ou de navegador.
- Para webhooks: um callback HTTPS público que consiga responder à requisição de validação do Strava em até dois segundos.

## Autenticação e escopos

O Strava usa o fluxo authorization code do OAuth 2.0. Apps web levam o atleta a `GET https://www.strava.com/oauth/authorize`; apps Android e iOS usam `https://www.strava.com/oauth/mobile/authorize`, que abre o app do Strava quando ele está instalado (versão 75.0 ou posterior) e, caso contrário, recorre à web móvel.

Peça só os escopos de que você precisa. O Strava documenta sete:

| Escopo | O que ele concede, segundo o Strava |
|---|---|
| `read` | Segmentos públicos, rotas públicas, dados públicos de perfil, posts públicos, eventos públicos, feeds de clubes e rankings |
| `read_all` | Rotas privadas, segmentos privados e eventos privados |
| `profile:read_all` | Todas as informações de perfil, mesmo com visibilidade Followers ou Only You |
| `profile:write` | Atualizar peso e FTP, favoritar ou desfavoritar segmentos |
| `activity:read` | Atividades visíveis para Everyone e Followers, excluindo dados de zonas de privacidade |
| `activity:read_all` | O mesmo que `activity:read`, mais dados de zonas de privacidade e atividades Only You |
| `activity:write` | Criar atividades manuais e uploads, e editar atividades visíveis para o app |

Os escopos vão no parâmetro `scope` "as a comma- or URL-safe space-delimited string" [como uma string delimitada por vírgulas ou por espaços seguros para URL], e o `activity:read` é obrigatório para webhooks de atividades. O atleta pode desmarcar qualquer escopo na tela de consentimento, então leia o que volta:

```
https://www.strava.com/oauth/authorize
  ?client_id=CLIENT_ID
  &redirect_uri=https://yourapp.example.com/exchange_token
  &response_type=code
  &approval_prompt=auto
  &scope=read,activity:read_all
```

`approval_prompt` é `auto` por padrão; `force` sempre mostra a tela. Uma recusa volta como `error=access_denied`; uma aprovação, como `code` mais o `scope` aceito. O code tem vida curta e é de uso único, então troque-o na hora, a partir do seu servidor:

```bash
curl -X POST "https://www.strava.com/oauth/token" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "code=AUTH_CODE" \
  -d "grant_type=authorization_code"
```

A resposta traz `access_token`, `refresh_token`, `expires_at`, `expires_in` e um resumo do atleta. Desde 23 de abril de 2026 ela também devolve um campo `scope`: uma lista delimitada por espaços do que foi concedido, que pode ser mais restrita do que o que você pediu.

### A renovação, e por que o refresh token muda

Os access tokens do Strava expiram seis horas depois de criados. Renove com `grant_type=refresh_token` no mesmo endpoint de token:

```bash
curl -X POST "https://www.strava.com/oauth/token" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=REFRESH_TOKEN"
```

Se o access token atual do atleta ainda tem mais de uma hora de vida, o Strava devolve esse mesmo token; dentro da última hora, ele emite um novo. Toda chamada bem-sucedida pode devolver um refresh token diferente, e o Strava diz que, assim que um novo refresh token é devolvido, o anterior é invalidado na hora. Persista o refresh token mais recente por atleta, e serialize as renovações para que um job em segundo plano e uma ação do usuário não disputem entre si e deixem o atleta desconectado.

## Dados: o endpoint de atividades

A API REST v3 cobre atletas, atividades, rotas e equipamentos. Para listar as atividades do atleta autenticado:

```bash
curl -X GET "https://www.strava.com/api/v3/athlete/activities?per_page=30&page=1" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

A especificação Swagger do Strava documenta `before` e `after` (timestamps epoch) para recortar os resultados, e a documentação diz que as listas são paginadas em 30 itens por padrão, com `per_page` até 200. Uma página pode ter menos itens que o pedido mesmo sem ser a última, então itere até voltar uma página vazia. O endpoint exige `activity:read`, e as atividades Only You são filtradas a menos que o token tenha `activity:read_all`. O Strava publica a especificação completa em `https://developers.strava.com/swagger/swagger.json`, que você pode passar ao Swagger Codegen 2.x para gerar um cliente.

## Webhooks: uma assinatura, eventos-ponteiro

O Strava incentiva todo app a usar a API de eventos de webhook, e o guia de primeiros passos dele diz que, pelos termos da API, você precisa de webhooks para saber quando um atleta desautorizou o seu app. Cada aplicação pode ter só uma assinatura, que recebe eventos de todos os atletas que a autorizaram. Crie-a com as credenciais do seu cliente:

```bash
curl -X POST "https://www.strava.com/api/v3/push_subscriptions" \
  -F client_id=CLIENT_ID \
  -F client_secret=CLIENT_SECRET \
  -F callback_url=https://yourapp.example.com/webhook \
  -F verify_token=YOUR_VERIFY_TOKEN
```

O Strava então envia um `GET` ao callback com `hub.mode=subscribe`, `hub.verify_token` e `hub.challenge`. Em até dois segundos, responda com HTTP 200 e o challenge ecoado de volta como JSON:

```json
{"hub.challenge":"15f7d1a91c1f40f8a748fd134752feb3"}
```

Depois de ativa, a assinatura recebe um POST do Strava quando uma atividade é criada ou apagada, quando o título, o tipo ou a privacidade dela mudam (privacidade exige `activity:read_all`), e quando um atleta revoga o acesso, o que chega com `"authorized": "false"` em `updates`. O evento é um ponteiro: `object_type`, `object_id`, `aspect_type`, `owner_id`, `subscription_id`, `event_time` e `updates`. Busque você mesmo a atividade com o token daquele atleta. Confirme todo POST com 200 em até dois segundos; o Strava tenta de novo um push que falhou até três tentativas no total, então processe de forma assíncrona e espere duplicatas, porque um único salvamento pode gerar vários eventos.

Apps com `activity:read` mas sem `activity:read_all` recebem um evento `delete` quando uma atividade passa a Only You, e um evento `create` quando ela volta a ficar visível. Trate esses eventos como as mudanças de privacidade que são, não como perda de dados.

## Desautorização: passe para o endpoint de revogação

O endpoint original, `POST https://www.strava.com/oauth/deauthorize`, invalida todos os tokens do atleta para o seu app. A documentação de autenticação do Strava diz que, a partir de 1º de junho de 2026, os apps podem usar `POST https://www.strava.com/oauth/revoke` no lugar, que ele é o método recomendado e que ele "will be the only endpoint supported for deauthorization effective June 1, 2027" [será o único endpoint suportado para desautorização a partir de 1º de junho de 2027]. Ele se autentica com HTTP Basic usando o seu client ID e secret, recebe o `token` a revogar (com um `token_type_hint` opcional) e devolve 200 tendo ou não encontrado o token:

```bash
curl -X POST "https://www.strava.com/oauth/revoke" \
  -H "Authorization: Basic BASE64_CLIENT_ID_COLON_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "token=ACCESS_OR_REFRESH_TOKEN"
```

## Limites de requisições e headers

Os limites de requisições (rate limits) são por aplicação, em uma janela de 15 minutos que reinicia aos 0, 15, 30 e 45 minutos de cada hora e uma janela diária que reinicia à meia-noite UTC. O Strava aplica um limite geral e outro separado para os endpoints de não upload (non-upload), que são todos os endpoints exceto os de criação de atividades, uploads e uploads de mídia. Requisições que estouram o limite de curto prazo ainda contam para o diário, e uma requisição acima do limite devolve 429 com um erro em JSON.

Toda resposta informa o consumo em `X-RateLimit-Limit` e `X-RateLimit-Usage` (geral), mais `X-ReadRateLimit-Limit` e `X-ReadRateLimit-Usage` (não upload), cada um um par "15-minute, daily" [15 minutos, diário]. Leia esses headers e recue; [o wrapper de fetch com controle de rate limit do cookbook](/cookbook/rate-limit-fetcher) é uma forma testada de fazer isso, com uma lista em que você acrescenta os nomes de header de cada fornecedor. O conselho do próprio Strava para apps com menos de 100 usuários que batem nos limites é implementar webhooks em vez de fazer polling de atividades, e controlar o ritmo dos backfills usando os headers.

## As regras que moldam o produto

A API Policy (2026) do Strava deixa pouca margem para ambiguidade. As partes com mais chance de mudar um design:

- **Exibição só para o próprio atleta.** Os dados do Strava (Strava Data) de um usuário só podem ser mostrados a esse usuário, mesmo dados que são públicos no Strava.
- **Proibido o uso em IA.** A política proíbe usar materiais ou dados da API do Strava "in connection with the development, training, evaluation, or operation of any AI Application" [em conexão com o desenvolvimento, treinamento, avaliação ou operação de qualquer aplicação de IA], incluindo embeddings, geração aumentada por recuperação (RAG) e janelas de contexto.
- **Cache curto.** Os dados do Strava não podem ficar em cache por mais de sete dias, e os dados que um atleta apaga precisam sumir do seu app em até 48 horas.
- **Proibida a reexposição.** Proxies de passagem, agregadores que reexpõem a API e servidores MCP que expõem dados do Strava são proibidos; o MCP do próprio Strava é a única interface de agente autorizada.
- **Atribuição à Garmin.** Se você exibe dados que vieram de um dispositivo Garmin, precisa atribuí-los à Garmin do jeito que as diretrizes de marca da Garmin exigem.

Se a sua integração atual é anterior a esses termos, [como se adaptar às mudanças da API do Strava](/migrate/adapt-to-strava-api-changes) cobre os passos práticos.

## O que mudou recentemente

| Data (changelog e documentação do Strava) | Mudança |
|---|---|
| 23 de abril de 2026 | As respostas de token incluem um campo `scope` delimitado por espaços |
| 21 de maio de 2026 | Mensagens de séries do FIT ingeridas para treino de força; uploads em JSON para treino com pesos |
| 1º de junho de 2026 | Novos API Agreement e API Policy; endpoint de revogação introduzido; nível da aplicação mostrado no painel; acesso ampliado autosserviço para desenvolvedores em modo single-player |
| 1º de setembro de 2026 | Endpoints Club Activities, Club Members e Club Admins removidos; Explore Segments restrito a desenvolvedores aprovados no Extended Access Tier |
| 4 de janeiro de 2027 | A nova URL base `https://api-v3.strava.com` passa a estar disponível, substituindo `https://www.strava.com/api/v3` |
| 1º de junho de 2027 | `oauth/revoke` passa a ser o único endpoint de desautorização suportado |

Planeje já a troca de URL base: faça do host um valor de configuração, e não um literal em cada chamada.

## Pegadinhas e notas de produção

- **A assinatura e o portão de 10 atletas vêm antes do código.** Um app novo conecta só você até o upgrade, e só 10 atletas até o Strava revisá-lo. Ponha a revisão no plano de lançamento.
- **Refresh tokens rotativos são o bug de integração número um.** Persista o mais recente a cada renovação e nunca rode duas renovações para o mesmo atleta ao mesmo tempo.
- **Atividades privadas exigem `activity:read_all`.** Tanto as listagens REST quanto os eventos de webhook escondem as atividades Only You sem ele; se os atletas relatam corridas "sumidas", esse escopo costuma ser o motivo.
- **Webhooks são ponteiros, e um por app.** Distribua os eventos entre os atletas do seu lado usando `owner_id`, e busque o registro antes de agir sobre ele.
- **Dois limites, dois headers.** O limite de não upload é o mais apertado para apps com muita leitura; acompanhe `X-ReadRateLimit-Usage`, não só `X-RateLimit-Usage`.

Para ver onde o Strava se encaixa entre as opções de dispositivos e agregadores, veja [APIs de dados de wearables](/fitness-apis/wearable-data-apis), e para apps que precisam de dados de sono ou recuperação que o Strava não modela, as [alternativas à API do Strava](/alternatives/strava-api-alternatives).
