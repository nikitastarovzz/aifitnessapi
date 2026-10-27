---
path: "/integrate/oura-api"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-17"
sourceHash: "284846353bbea6f5"
metaTitle: "API do Oura (2026): só OAuth, 10 usuários até a aprovação"
metaDescription: >-
  A API V2 do Oura é só OAuth: tokens de acesso pessoal saíram em dezembro de 2025, e um app novo tem 10 usuários até o Oura aprovar. Escopos e webhooks.
h1: "Guia de integração da API do Oura (2026)"
answer: >-
  A API V2 do Oura é o único jeito de ler dados do Oura: a especificação do Oura diz que a API V1 foi desativada e que os tokens de acesso pessoal (personal access tokens), descontinuados em dezembro de 2025, não estão mais disponíveis, então toda integração usa OAuth 2.0, com PKCE marcado como recomendado. Você registra uma aplicação de API, leva cada usuário pelo consentimento dos escopos de que precisa e depois lê os endpoints usercollection ou, como o Oura prefere, assina webhooks. Um app novo fica limitado a 10 usuários até o Oura aprová-lo, e um 403 muitas vezes significa que a assinatura do Oura do usuário expirou.
cta: >-
  Acompanhamos as integrações de wearables conforme os fornecedores as mudam, da passagem do Oura para acesso só via OAuth e PKCE aos webhooks assinados e ao portão de aprovação de 10 usuários.
faqs:
  - q: "A API do Oura ainda aceita tokens de acesso pessoal?"
    a: >-
      Não. A especificação da API do Oura diz que os tokens de acesso pessoal foram descontinuados em dezembro de 2025 e não estão mais disponíveis para uso, e que a API V2 é o único ponto de integração disponível. Construa no lugar o fluxo authorization code do OAuth 2.0, com PKCE, que a página de autenticação do Oura marca como recomendado.
  - q: "A API do Oura exige aprovação?"
    a: >-
      Só para passar de 10 usuários. A especificação do Oura diz que as aplicações de API ficam limitadas a 10 usuários antes de precisarem da aprovação do Oura e que não há limite depois que a aplicação é aprovada. Quando o desenvolvimento termina, você envia o app para revisão pela página dele no portal de desenvolvedores.
  - q: "Quais endpoints OAuth e escopos o Oura usa?"
    a: >-
      A autorização é em https://cloud.ouraring.com/oauth/authorize, ou no universal link mais novo https://developer.ouraring.com/authorize, e a troca ou renovação de tokens é em https://api.ouraring.com/oauth/token. A página de autenticação lista oito escopos: email, personal, daily, heartrate, workout, tag, session e spo2, e a especificação OpenAPI lista também heart_health. Os usuários podem desligar escopos no consentimento.
  - q: "Por que recebo um 403 de um endpoint usercollection?"
    a: >-
      A especificação do Oura diz que um 403 significa que o recurso pedido exige permissões adicionais ou que a assinatura do Oura do usuário expirou. Confira primeiro os escopos do token: um erro de escopo ausente lista os escopos de que você precisa, e a solução é pedir que o usuário autorize de novo. Se os escopos estão certos, a assinatura do usuário provavelmente venceu.
  - q: "A API do Oura tem webhooks e limites de requisições?"
    a: >-
      Sim, as duas coisas. O Oura chama os webhooks de forma preferida de consumir os dados dele: você assina por tipo de evento e tipo de dado, responde a um desafio de verificação e confere a assinatura HMAC de cada evento. Os limites de requisições valem por token de acesso e por aplicação, e o FAQ e a página de tratamento de erros do Oura informam 5.000 requisições por período de 5 minutos.
steps:
  - name: "Registre uma aplicação de API"
    text: >-
      Entre em cloud.ouraring.com com a sua conta Oura, registre uma aplicação de API e adicione as suas redirect URIs. O Oura emite um client ID e um client secret; mantenha o secret no seu servidor. Um app novo fica limitado a 10 usuários.
  - name: "Leve o usuário à URL de autorização"
    text: >-
      Redirecione para https://cloud.ouraring.com/oauth/authorize com response_type=code, o seu client_id, redirect_uri, um state aleatório, só os escopos de que precisa e um code_challenge PKCE com code_challenge_method=S256.
  - name: "Troque o code por tokens"
    text: >-
      No seu callback, confira o state e faça POST do code, do redirect_uri e do code_verifier para https://api.ouraring.com/oauth/token. Guarde o access token, o expires_in dele e o refresh token de uso único associados ao seu usuário.
  - name: "Faça o backfill do histórico e depois assine webhooks"
    text: >-
      Peça os dados históricos uma vez por tipo de dado, em intervalos de datas de um a três meses, paginando com next_token. Depois crie uma assinatura de webhook por tipo de evento e tipo de dado, responda ao desafio de verificação do Oura e confira o x-oura-signature em todo evento.
  - name: "Renove os tokens e trate os erros"
    text: >-
      Renove com grant_type=refresh_token e guarde o novo par toda vez, porque o refresh token antigo é invalidado. Em um 429, respeite o Retry-After; em um 403, confira os escopos e a assinatura do usuário antes de presumir um token ruim.
  - name: "Envie o app para revisão"
    text: >-
      Antes de precisar de mais de 10 usuários, envie o app para revisão pela página dele no portal de desenvolvedores. A especificação do Oura diz que não há limite de usuários depois que a aplicação é aprovada.
related:
  - href: "/integrate/whoop-api"
    label: "Integrar a API do WHOOP"
  - href: "/pricing/oura-api-pricing"
    label: "Preço da API do Oura"
  - href: "/fitness-apis/wearable-data-apis"
    label: "Melhores APIs de dados de wearables"
  - href: "/integrate/terra-api"
    label: "Integrar o Terra"
  - href: "/integrate"
    label: "Como integrar uma API de fitness ou saúde"
---
Três coisas definem um projeto com o Oura antes de qualquer código, todas tiradas da própria documentação do Oura, lida em 17 de outubro de 2026:

- **Só V2 e só OAuth.** A especificação do Oura descreve a API V2 como "the only available integration point for Oura data" [o único ponto de integração disponível para dados do Oura], diz que a API V1 foi desativada (a página de primeiros passos data a remoção em 22 de janeiro de 2024) e diz que os tokens de acesso pessoal "were deprecated in December 2025 and are no longer available for use" [foram descontinuados em dezembro de 2025 e não estão mais disponíveis para uso]. Se um tutorial manda você colar um token pessoal, ele está desatualizado; [tokens de acesso pessoal do Oura descontinuados](/fix/oura-personal-access-token-deprecated) cobre a migração.
- **Um limite de 10 usuários até o Oura aprovar o app.** As aplicações de API ficam limitadas a 10 usuários antes de precisarem da aprovação do Oura, sem limite depois de aprovadas, e você envia o app para revisão pela página dele no portal de desenvolvedores.
- **O consentimento é por tipo de dado, e a assinatura importa.** O Oura diz que os usuários precisam consentir em compartilhar cada tipo de dado a que o seu app tem acesso, e a API dele devolve 403 quando uma requisição precisa de mais permissões "or the user's Oura subscription has expired" [ou a assinatura do Oura do usuário expirou].

Se você ainda está escolhendo um fornecedor, veja [APIs de dados de wearables](/fitness-apis/wearable-data-apis); a integração vizinha, da pulseira de recuperação, está no [guia da API do WHOOP](/integrate/whoop-api). Os requisitos de acesso do Oura, e todas as páginas deste site que tratam do Oura, estão reunidos na [visão geral da API do Oura](/apis/oura). Programando em Python? [oura-ring vs oura (python-ouraring)](/libraries/compare/oura-ring-vs-oura-python) compara os dois clientes e mostra qual deles documenta o fluxo OAuth2.

## O que você vai precisar

- Uma **conta Oura**, criada no app do Oura para iOS ou Android, que você também usa para entrar em `https://cloud.ouraring.com`.
- Uma **aplicação de API** registrada em API Applications, que dá a você um **client ID** e um **client secret**. O Oura diz que o secret não deve ser compartilhado, então mantenha-o no seu servidor.
- Pelo menos uma **redirect URI** na aplicação; o Oura trata a lista como uma whitelist com a qual o parâmetro `redirect_uri` precisa bater exatamente.
- Um backend para a troca do code, a renovação de tokens e o endpoint de webhook.

## Autenticação e escopos

O Oura usa OAuth 2.0. A URL de autorização é `https://cloud.ouraring.com/oauth/authorize` e a URL de token é `https://api.ouraring.com/oauth/token`. O Oura agora também oferece `https://developer.ouraring.com/authorize` como URL de autorização alternativa para novos clientes OAuth; em dispositivos móveis com o app do Oura instalado, ela pode abrir a página de consentimento dentro do app.

A página de autenticação do Oura lista oito escopos. Peça só o que você usa, porque o usuário pode ativar e desativar escopos no consentimento:

| Escopo | O que o Oura diz que ele cobre |
|---|---|
| `email` | Endereço de e-mail do usuário |
| `personal` | Gênero, idade, altura, peso |
| `daily` | Resumos diários de sono, atividade e prontidão (readiness) |
| `heartrate` | Série temporal de frequência cardíaca para usuários Gen 3 |
| `workout` | Treinos detectados automaticamente e registrados pelo usuário |
| `tag` | Tags registradas pelo usuário |
| `session` | Sessões guiadas e não guiadas no app do Oura |
| `spo2` | Média diária de SpO2 registrada durante o sono |

A lista de escopos da própria especificação OpenAPI acrescenta um nono, `heart_health` ("Heart health data" [dados de saúde cardíaca]), que a página de autenticação ainda não menciona; teste-o antes de depender dele.

O parâmetro `scope` é separado por espaços, e deixá-lo em branco pede todos os escopos. O Oura marca o PKCE como recomendado: gere um `code_verifier` de 43 a 128 caracteres, envie o hash SHA-256 dele codificado em base64url como `code_challenge` com `code_challenge_method=S256`, e guarde o verifier para a troca de tokens.

```http
GET https://cloud.ouraring.com/oauth/authorize
  ?response_type=code
  &client_id=YOUR_CLIENT_ID
  &redirect_uri=https%3A%2F%2Fyourapp.example.com%2Fcallback
  &scope=daily%20heartrate%20workout%20spo2
  &state=RANDOM_ANTI_CSRF_STRING
  &code_challenge=BASE64URL_SHA256_OF_VERIFIER
  &code_challenge_method=S256
```

Com o consentimento, o Oura redireciona com `code` e o seu `state`; uma recusa devolve `error=access_denied`. O Oura diz que o parâmetro `scope` nesse redirecionamento está descontinuado e pode ser omitido, então não dependa dele. Troque o code a partir do seu servidor; as credenciais podem ir no corpo do formulário ou como HTTP Basic:

```bash
curl -s -X POST "https://api.ouraring.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://yourapp.example.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code_verifier=YOUR_CODE_VERIFIER"
```

A resposta traz `access_token`, `expires_in` e `refresh_token`. Leia o `expires_in` em vez de fixar uma validade no código: a especificação do Oura diz, em uma seção de troubleshooting, que os access tokens normalmente expiram depois de 24 horas, e no FAQ, que normalmente duram 30 dias. O refresh token do Oura é de uso único: ele "is invalidated after being used" [é invalidado depois de usado], então guarde o novo par a cada renovação, e a documentação de erros diz que um refresh token reutilizado volta como "Token already used or revoked" [token já usado ou revogado]. O Oura também documenta um fluxo do lado do cliente (`response_type=token`) sem refresh token, em que o token hoje expira depois de 30 dias e o usuário precisa se autenticar de novo; use-o só onde você não tem backend. Para revogar um token, por exemplo quando um usuário se desconecta, chame `https://api.ouraring.com/oauth/revoke?access_token=ACCESS_TOKEN`.

```bash
curl -s -X POST "https://api.ouraring.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=STORED_REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

## Dados: os endpoints usercollection

Todos os dados ficam em `https://api.ouraring.com/v2/usercollection/`. A especificação OpenAPI V2 do Oura, como publicada em 17 de outubro de 2026, lista estes tipos de dados, cada um como endpoint de lista e, exceto `heartrate`, `personal_info` e `ring_battery_level`, também como endpoint de documento único por `document_id`:

| Endpoint | O que a especificação do Oura diz que ele contém |
|---|---|
| `daily_activity`, `daily_sleep`, `daily_readiness` | Resumos diários de atividade e níveis de atividade, sono diário e prontidão |
| `daily_spo2` | Média diária de SpO2, disponível só para usuários com um anel Gen 3 |
| `daily_stress` | Minutos em estresse alto e em recuperação alta a cada dia |
| `daily_resilience`, `daily_cardiovascular_age`, `vO2_max` | Resiliência, estimativa de idade cardiovascular, VO2 máx. |
| `sleep` | Períodos de sono; um usuário pode ter vários por dia |
| `sleep_time` | Janela recomendada para ir dormir, calculada a partir dos dados de sono |
| `heartrate` | Série temporal de frequência cardíaca em incrementos de 5 minutos |
| `workout`, `session` | Treinos, e sessões guiadas ou não guiadas |
| `enhanced_tag`, `tag` | Tags registradas pelo usuário; `tag` está descontinuado em favor de `enhanced_tag` |
| `rest_mode_period`, `ring_configuration`, `ring_battery_level`, `personal_info` | Períodos em modo de descanso, modelo, tamanho e cor do anel, nível da bateria, o perfil do usuário |

```bash
curl -s -H "Authorization: Bearer ${OURA_ACCESS_TOKEN}" \
  "https://api.ouraring.com/v2/usercollection/daily_activity?start_date=2026-10-01&end_date=2026-10-16"
```

As respostas de lista embrulham os registros em um array `data` com um `next_token`; repita a requisição com ele até que venha `null`. A mesma especificação também tem um endpoint de sandbox para cada tipo de dado em `/v2/sandbox/usercollection/`, servindo dados falsos "that you can access without an Oura account" [que você pode acessar sem uma conta Oura], então dá para construir antes de ter usuários conectados. O Oura avisa que as chamadas de sandbox dividem o limite de requisições com os endpoints de dados reais.

Conte com os dados chegando no ritmo do usuário, não no seu: o Oura avisa que os dados de sono exigem que o usuário abra o app do Oura, enquanto a atividade diária e o estresse podem sincronizar em segundo plano.

## Webhooks

O Oura chama os webhooks de "the preferred way to consume Oura data" [a forma preferida de consumir dados do Oura] e diz que os clientes que os implementam direito não esbarraram em limites de requisições. O padrão recomendado é uma requisição de dados históricos quando o usuário se conecta pela primeira vez, e webhooks para tudo depois disso.

Crie uma assinatura por combinação de `event_type` (`create`, `update` ou `delete`) e `data_type` chamando `POST /v2/webhook/subscription` com os headers `x-client-id` e `x-client-secret` do seu app e um corpo JSON com `callback_url`, `verification_token`, `event_type` e `data_type`. Os tipos de dados que você pode assinar são `tag`, `enhanced_tag`, `workout`, `session`, `sleep`, `daily_sleep`, `daily_readiness`, `daily_activity`, `daily_spo2`, `sleep_time`, `rest_mode_period`, `ring_configuration`, `daily_stress`, `daily_cardiovascular_age`, `daily_resilience` e `vo2_max`.

O Oura verifica o endpoint com um `GET` que traz `verification_token` e `challenge`; responda com `{"challenge": "..."}` para ativar a assinatura. Depois disso, cada evento é um `POST` cujo corpo JSON traz `event_type`, `data_type`, `object_id` e `user_id`, com os headers `x-oura-signature` e `x-oura-timestamp`:

```js
// Oura's documented check: HMAC-SHA256 of timestamp + JSON body, keyed by the client secret, hex, upper-case
const crypto = require("crypto");
function verifyOuraSignature(headers, body, clientSecret) {
  const hmac = crypto.createHmac("sha256", clientSecret);
  hmac.update(headers["x-oura-timestamp"] + JSON.stringify(body));
  return hmac.digest("hex").toUpperCase() === headers["x-oura-signature"];
}
```

Responda com um 2xx em menos de 10 segundos e busque o registro pelo `object_id` depois. O Oura tenta de novo as entregas que falham (10 tentativas para cada caso: respostas 4xx, respostas 5xx e timeouts, por cerca de uma hora), e uma resposta 410 cancela a assinatura, assim como `DELETE /v2/webhook/subscription/{id}`. Toda assinatura tem um `expiration_time`; renove-a com `PUT /v2/webhook/subscription/renew/{id}` antes que expire. As notificações chegam cerca de 30 segundos depois que os dados sincronizam a partir do app; para quedas mais longas, rode um job de reconciliação.

## Limites de requisições

A especificação V2 do Oura descreve duas camadas de limite de requisições (rate limit): um limite por token de acesso e um limite por aplicação, somando todos os tokens de usuário de um app. Qualquer um dos dois devolve 429 com `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Window`, `X-RateLimit-Reset` e um header `X-RateLimit-Tier` que nomeia a camada que disparou, e o Oura diz para preferir esses headers a um backoff de intervalo fixo. Essa seção não dá um número; o FAQ da mesma especificação e a página de tratamento de erros do Oura dão um, 5.000 requisições por período de 5 minutos. O FAQ do Oura também sugere buscar o histórico em intervalos de datas de cerca de um a três meses por vez, paginando com `next_token`. Fale com o Oura pelo endereço de suporte da API se você prevê precisar de mais, e use webhooks primeiro.

## O que mudou recentemente

| Data | Mudança (documentação do Oura) |
|---|---|
| 22 de janeiro de 2024 | API V1 removida |
| Dezembro de 2025 | Tokens de acesso pessoal descontinuados; a especificação diz que não estão mais disponíveis para uso |
| Sem data, visto em 17 de outubro de 2026 | Uma URL de autorização por universal link em `developer.ouraring.com/authorize` que o Oura marca como nova; PKCE marcado como recomendado; limites de requisições em duas camadas com um header `X-RateLimit-Tier`; um escopo `heart_health` na especificação. Nada disso estava na versão deste guia de julho de 2026 |

## Pegadinhas e notas de produção

- **Só OAuth, PKCE recomendado.** Os tokens pessoais acabaram; construa o fluxo authorization code com PKCE desde o primeiro dia.
- **O limite de 10 usuários trava a escala, não os testes.** Envie o app para revisão pela página dele bem antes do lançamento.
- **Um 403 geralmente é escopo ou assinatura, não um token ruim.** O 403 do Oura significa que o recurso precisa de mais permissões ou que a assinatura do Oura do usuário expirou; um erro de escopo ausente lista os escopos de que o token precisa.
- **Refresh tokens são de uso único.** Guarde o novo par toda vez; reutilizar um falha como já usado ou revogado.
- **O sono chega quando o usuário abre o app.** Não trate uma noite faltando como erro até o usuário sincronizar.
- **Alguns dados exigem hardware mais novo.** A especificação do Oura diz que os dados diários de SpO2 só estão disponíveis para usuários com um anel Gen 3, e a página de autenticação descreve o escopo `heartrate` como série temporal para usuários Gen 3.
- **As datas são datas locais do usuário.** O Oura diz que os parâmetros de data são interpretados no fuso horário local do usuário, e os timestamps voltam em ISO 8601 com informação de fuso horário.

Para ver onde o Oura se encaixa entre as fontes de recuperação e sono, veja [APIs de dados de wearables](/fitness-apis/wearable-data-apis); para o quanto a assinatura custa aos seus usuários, veja [preço da API do Oura](/pricing/oura-api-pricing).
