---
path: "/integrate/terra-api"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-17"
sourceHash: "65fda8be5a97c6e5"
metaTitle: "API de dados de saúde Terra: integre com um webhook (2026)"
metaDescription: >-
  Integre o Terra uma vez para ler Garmin, Oura, WHOOP e mais de 500 fontes: o novo endpoint de sessão do widget, assinatura do webhook, backfill e preços.
h1: "Como integrar o Terra (agregador de dados de saúde) (2026)"
answer: >-
  O Terra é um agregador de dados de saúde: você integra uma vez e ele devolve dados normalizados de Garmin, Fitbit, Oura, WHOOP, Strava, Apple Health e, pela contagem dele, mais de 500 fornecedores (500+) sob um único esquema. O seu backend se autentica com os headers dev-id e x-api-key, cria uma sessão de widget em POST https://access.tryterra.co/api/widget/session para que o usuário escolha e autorize o fornecedor dele, e recebe eventos normalizados em um destino como um webhook, verificados com um header terra-signature HMAC-SHA256. Em 17 de outubro de 2026, o endpoint antigo /v2/auth/generateWidgetSession está fechado para contas criadas depois de 3 de setembro de 2026, com descontinuação prevista para 3 de novembro de 2026, e alguns fornecedores, entre eles WHOOP, Dexcom e Strava, ainda exigem o seu próprio app de desenvolvedor configurado no painel do Terra.
cta: >-
  Publicamos passo a passos de integração com wearables e agregadores e registramos mudanças de endpoint como o relançamento do widget do Terra, então assine e conecte o próximo dispositivo sem surpresas.
faqs:
  - q: "O que diferencia o Terra de integrar cada wearable diretamente?"
    a: >-
      O Terra é um agregador: você constrói uma integração e recebe Garmin, Fitbit, Oura, WHOOP, Strava, Apple Health e outras fontes normalizados em um único esquema, em um só destino, de um webhook a um banco de dados ou fila. Em vez de fluxos OAuth e parsers separados por dispositivo, você escreve um único receptor. As contrapartidas são uma conta baseada em créditos, a partir de US$ 399 por mês com cobrança anual em 17 de outubro de 2026, e o seu próprio app de desenvolvedor para alguns fornecedores.
  - q: "Ainda preciso das minhas próprias credenciais de desenvolvedor em cada fornecedor?"
    a: >-
      Para alguns. Em 17 de outubro de 2026, a documentação do Terra diz que ele gerencia as chaves de API dos fornecedores em geral, mas cita WHOOP, Dexcom, Huawei, Strava e Virtuagym como exigindo processos especiais; WHOOP e Dexcom exigem o seu próprio app nos portais de desenvolvedor deles, com URLs em um domínio seu. A tabela de integrações dele também marca Garmin e Samsung como Required [obrigatório], enquanto a página inicial diz que os dados da Garmin passam pela integração de parceiro do Terra, então confira a página Connections do seu painel.
  - q: "Como um usuário conecta o wearable dele pelo Terra?"
    a: >-
      O seu backend chama POST https://access.tryterra.co/api/widget/session com o seu dev-id e x-api-key, passando opcionalmente reference_id, uma lista de providers separada por vírgulas e URLs de redirecionamento. O Terra responde com HTTP 201 e uma url do widget válida por 24 horas. O usuário a abre em uma nova aba ou em um navegador dentro do app, não em uma WebView nem em um iframe, escolhe um fornecedor e faz login, e o Terra envia um evento auth com o user_id do Terra, que você guarda.
  - q: "Como verifico se um webhook do Terra é autêntico?"
    a: >-
      O Terra assina cada webhook com HMAC-SHA256 e envia um header terra-signature no formato t=timestamp,v1=signature. Concatene o timestamp, um ponto e o corpo bruto da requisição, calcule o HMAC com o signing secret do seu endpoint e compare em tempo constante com cada valor v1, ignorando os outros esquemas. Leia o corpo bruto antes de fazer o parse do JSON, ou use as bibliotecas oficiais do Terra para Python, JavaScript ou Java.
  - q: "Quanto custa o Terra?"
    a: >-
      Em 17 de outubro de 2026, a página de preços do Terra diz que as assinaturas começam em US$ 399 por mês com cobrança anual ou US$ 499 com cobrança mensal, incluindo 100.000 créditos por mês. Cada fonte de dados conectada custa 200 créditos por mês, os primeiros 400 eventos por fonte a cada mês são gratuitos, eventos extras custam 0,5 crédito, e créditos extras começam em US$ 0,005, caindo para US$ 0,003 acima de 1.000.000. Complementos como streaming têm preço à parte.
steps:
  - name: "Obtenha as credenciais e configure um destino"
    text: >-
      Crie uma conta no Terra para obter o seu dev-id e x-api-key, que você envia como headers em toda chamada feita pelo seu backend. Configure um destino, como uma URL de webhook, um banco SQL, um armazenamento em nuvem ou uma fila, onde o Terra entrega os eventos de todos os fornecedores.
  - name: "Registre as suas próprias credenciais nos fornecedores que exigem"
    text: >-
      O Terra gerencia a maioria das chaves de fornecedores, mas WHOOP e Dexcom exigem o seu próprio app nos portais de desenvolvedor deles, com URLs em um domínio seu, e o Strava precisa das chaves do seu próprio aplicativo. A tabela de integrações dele também marca Garmin e Samsung como Required, então confira a página Connections no seu painel.
  - name: "Crie uma sessão de widget a partir do seu backend"
    text: >-
      Chame POST https://access.tryterra.co/api/widget/session com os seus headers e, opcionalmente, reference_id, a lista de providers e URLs de redirecionamento. O Terra devolve HTTP 201 com uma url do widget válida por 24 horas; o endpoint legado generateWidgetSession está fechado para contas criadas depois de 3 de setembro de 2026.
  - name: "Leve o usuário ao widget e trate o evento auth"
    text: >-
      Abra a url em uma nova aba ou em um navegador dentro do app, não em uma WebView nem em um iframe, para que o usuário escolha e autorize o fornecedor. Guarde o user_id do Terra que vem no evento auth, e trate os eventos user_reauth, que trazem o user_id antigo e o novo quando um usuário reconecta.
  - name: "Receba os dados normalizados no seu destino"
    text: >-
      O Terra envia eventos activity, athlete, body, daily, hormone, menstruation, nutrition e sleep, cada um indicando o usuário e o fornecedor, no mesmo formato para todas as fontes. Escreva um handler por tipo, e sobrescreva os registros daily e body com o payload mais recente.
  - name: "Verifique a assinatura do webhook"
    text: >-
      Todo webhook traz um header terra-signature no formato t=timestamp,v1=signature. Calcule um HMAC-SHA256 sobre o timestamp, um ponto e o corpo bruto com o seu signing secret, compare em tempo constante com cada valor v1 e responda em até 8 segundos.
  - name: "Puxe os dados históricos via REST"
    text: >-
      Para o backfill, chame os endpoints por tipo, como /activity, com o user_id do Terra e um start_date; o end_date é exclusivo. O to_webhook tem true como padrão, então defina-o como false para uma resposta síncrona, e conte com intervalos acima de 28 dias chegando de forma assíncrona, em partes.
related:
  - href: "/fitness-apis/health-data-aggregator-apis"
    label: "Melhores APIs agregadoras de dados de saúde"
  - href: "/fitness-apis/terra-vs-vital"
    label: "Terra vs Vital (Junction)"
  - href: "/alternatives/terra-alternatives"
    label: "Alternativas ao Terra"
  - href: "/integrate/whoop-api"
    label: "Integrar a API do WHOOP"
  - href: "/integrate"
    label: "Como integrar uma API de fitness ou saúde"
---
O motivo de usar um agregador, e o que você deve guardar: **uma integração, muitos fornecedores, entregues em um só destino.** Você nunca escreve parsing específico de fornecedor. Para ver onde o Terra fica entre os agregadores, veja [APIs agregadoras de dados de saúde](/fitness-apis/health-data-aggregator-apis) e a comparação direta [Terra vs Vital](/fitness-apis/terra-vs-vital); a [visão geral da API do Terra](/apis/terra) reúne como obter acesso e todas as páginas deste site que tratam do Terra. Este guia também é um passo da [trilha de leitura para suportar todos os wearables por um único agregador](/paths), que põe as páginas desse trabalho na ordem em que você vai precisar delas.

Todo endpoint, campo e limite abaixo vem da documentação, da especificação OpenAPI e da página de preços do Terra, como as lemos em 17 de outubro de 2026.

## O que mudou nesta revisão

- **O endpoint do widget.** O Terra relançou o widget de conexão. As novas sessões são criadas em `POST https://access.tryterra.co/api/widget/session`. O antigo `/v2/auth/generateWidgetSession`, que uma versão anterior deste guia usava, "keeps working today, with deprecation planned for 3 November 2026" [continua funcionando hoje, com descontinuação prevista para 3 de novembro de 2026], e "Accounts created after 3 September 2026 cannot use it at all." [Contas criadas depois de 3 de setembro de 2026 não podem usá-lo de forma alguma.]
- **Quais fornecedores exigem as suas próprias credenciais.** Uma versão anterior listava Garmin, Whoop, Strava e Oura. A documentação atual do Terra cita WHOOP, Dexcom, Huawei, Strava e Virtuagym; a tabela de integrações dele também marca Garmin e Samsung como Required [obrigatório] e lista o Oura como Managed [gerenciado]. O passo 2 traz os detalhes.
- **Os preços** agora estão publicados por completo em tryterra.co/pricing; os números estão nas pegadinhas, abaixo.

## O que você vai precisar

- Uma **conta no Terra** com um plano; o painel dá a você um `dev-id` e uma `x-api-key`. O Terra mantém credenciais separadas para testes, staging e produção, e os ambientes de testes e de staging são limitados a 50 usuários cada.
- Um **destino** configurado no painel do Terra: uma URL de webhook, ou um banco de dados, bucket de armazenamento em nuvem ou fila em que o Terra escreve.
- Um **backend** para chamar a API do Terra. A documentação do Terra é direta: "Never share your x-api-key publicly or embed it directly in client-side code (e.g., mobile apps, frontend JavaScript)." [Nunca compartilhe a sua x-api-key publicamente nem a embuta diretamente em código do lado do cliente (por exemplo, apps móveis, JavaScript de frontend).]
- Para WHOOP, Dexcom, Strava e os outros fornecedores do passo 2, **o seu próprio app de desenvolvedor** naquele fornecedor.
- A superfície da API: a especificação OpenAPI do Terra descreve "The Terra API (v2 surface, served at access.tryterra.co/api/v2)" [a API do Terra (superfície v2, servida em access.tryterra.co/api/v2)].

## Passo 1: obtenha as credenciais e configure um destino

Crie a sua conta e copie o `dev-id` e a `x-api-key` da página API Keys do painel. Toda chamada à API envia os dois como headers:

```http
dev-id: YOUR_DEV_ID
x-api-key: YOUR_API_KEY
```

Depois escolha para onde os dados vão. Um webhook é o destino mais simples; o Terra também pode entregar em "SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore" [bancos SQL (Postgres e MySQL), Supabase, armazenamento em nuvem (S3, GCS e Azure Blob), serviços de fila (SQS e Kafka), MongoDB e Firestore]. Como tudo converge para um só destino, você constrói e testa um único receptor, e não um por wearable.

## Passo 2: registre as suas próprias credenciais nos fornecedores que exigem

A documentação do Terra diz que ele "manages API Keys of data sources, meaning you can connect users without having to apply for each API Key" [gerencia as chaves de API das fontes de dados, o que significa que você pode conectar usuários sem precisar pedir cada chave de API], mas "Some providers require special processes before being able to start using them" [alguns fornecedores exigem processos especiais antes de poderem ser usados]: WHOOP, Dexcom, Huawei, Strava e Virtuagym.

- **WHOOP e Dexcom.** Cada um "requires every company to connect users through its own app" [exige que toda empresa conecte os usuários pelo seu próprio app] no portal de desenvolvedor dele, com a URL de redirecionamento (e, no WHOOP, a URL do webhook) "on a domain that belongs to you" [em um domínio que pertence a você]. No painel, abra Connections, escolha o fornecedor e siga a configuração; ela configura o domínio personalizado e mostra as URLs para colar no seu app, e então você pede acesso de produção ao fornecedor.
- **Strava.** Crie um aplicativo em strava.com/settings/api e depois informe o client ID e o secret dele na configuração do Strava no painel.
- **Garmin e Samsung.** A tabela de integrações suportadas do Terra marca as duas como Required para credenciais de integração, enquanto o FAQ da página inicial diz que "Garmin data flows through Terra today" [os dados da Garmin passam pelo Terra hoje] por meio da integração de parceiro que o Terra mantém há tempos. Confira a página Connections da sua conta antes de prometer suporte à Garmin. Para a rota direta do Samsung Health, o Terra diz para se candidatar pelo portal de parcerias da Samsung e desenvolver na rota do Health Connect enquanto espera.

Planeje como se um fornecedor que exige configuração especial não pudesse ser conectado até que essa configuração termine. Isso é tempo de painel e de papelada, não de código, então comece por aí.

## Passo 3: crie uma sessão de widget a partir do seu backend

Para conectar um usuário, o seu backend cria uma **sessão de widget** hospedada e manda o usuário para a URL que ela devolve. Passe o seu próprio `reference_id` (o seu ID interno de usuário) para poder associar o usuário do Terra ao seu.

```bash
curl --request POST "https://access.tryterra.co/api/widget/session" \
  --header "dev-id: YOUR_DEV_ID" \
  --header "x-api-key: YOUR_API_KEY" \
  --header "Content-Type: application/json" \
  --data '{
    "reference_id": "user-1234",
    "providers": "GARMIN,FITBIT,OURA,WHOOP,STRAVA",
    "auth_success_redirect_url": "https://yourapp.com/success",
    "auth_failure_redirect_url": "https://yourapp.com/failure"
  }'
```

Todo campo do corpo é opcional. `providers` é uma lista separada por vírgulas "of providers to show, in the order given" [dos fornecedores a mostrar, na ordem dada]; se você o omitir, o widget mostra as fontes ativadas no seu painel. Uma chamada bem-sucedida devolve HTTP 201 com a `url` do widget, válida por `expires_in` segundos, que o Terra documenta como 24 horas. Crie uma sessão nova a cada tentativa de conexão em vez de guardar URLs. Não existe mais o campo `language`: "The widget follows the end user's browser language automatically." [O widget segue automaticamente o idioma do navegador do usuário final.]

Migrando do endpoint legado? Ele ficava em `POST https://api.tryterra.co/v2/auth/generateWidgetSession`, devolvia sessões válidas por 900 segundos e aceitava `language`, `"providers": "multi-auth"` e `"providers": "ALL"`; o novo endpoint usa `multi_auth: true` e um `providers` omitido no lugar disso. De resto, o formato da resposta (`session_id`, `url`, `status`, `expires_in`) não mudou.

## Passo 4: leve o usuário ao widget e trate o evento auth

Abra a `url` em uma nova aba ou em um navegador dentro do app. A documentação do Terra diz: "Do not use WebView or iFrame for the authentication flow" [não use WebView nem iFrame no fluxo de autenticação], porque o usuário não consegue ver em qual domínio está digitando a senha, e os fornecedores podem bloquear isso. O usuário escolhe um fornecedor e faz login com o login do próprio fornecedor; depois ele cai na sua URL de sucesso "with their Terra user_id and your reference_id as query parameters" [com o user_id dele no Terra e o seu reference_id como parâmetros de query].

O sinal que vale é o **evento auth** que o Terra envia ao seu destino, com o `user_id` do Terra, o seu `reference_id` e o `provider`. Guarde esse `user_id` associado à sua conta: ele é a chave de toda requisição posterior e a chave de roteamento de todo payload. Se um usuário reconecta o mesmo fornecedor sob o mesmo `reference_id`, o Terra "will delete the previous user record for that account and yield a new user_id" [apaga o registro de usuário anterior daquela conta e gera um novo user_id], e "Terra sends a user_reauth event containing both the old and new user_id" [o Terra envia um evento user_reauth com o user_id antigo e o novo], então trate esse evento ou os dados novos vão parar de bater com os seus registros.

## Passo 5: receba os dados normalizados no seu destino

A partir daí, o Terra **envia eventos de dados normalizados** conforme o fornecedor sincroniza. A referência de eventos dele lista os tipos de evento de dados como `activity`, `athlete`, `body`, `daily`, `hormone`, `menstruation`, `nutrition` e `sleep`, ao lado de eventos de ciclo de vida como `auth`, `deauth`, `user_reauth` e `access_revoked`. Cada payload indica o usuário e o fornecedor; o array `data` tem o mesmo formato, venha do wearable que vier. Um exemplo resumido:

```json
{
  "type": "activity",
  "user": {
    "user_id": "4735eac4-31a2-47ef-8b11-51e98d84c680",
    "reference_id": "user-1234",
    "provider": "GARMIN"
  },
  "data": [ { "metadata": {} } ]
}
```

Roteie por `type` e `user.user_id`. Como o esquema é idêntico entre fornecedores, você escreve um handler para `activity`, um para `sleep` e assim por diante, nunca um parser para a Garmin e outro para o WHOOP. A orientação do Terra para eventos `daily` e `body` é sobrescrever o dia guardado com o payload mais recente, porque eles chegam várias vezes por dia, como totais parciais.

## Passo 6: verifique a assinatura do webhook

"Every webhook sent by Terra includes an HMAC-based signature header" [todo webhook enviado pelo Terra inclui um header de assinatura baseado em HMAC], `terra-signature`, no formato `t=<timestamp>,v1=<signature>`. O Terra assina com HMAC-SHA256: o payload assinado é o timestamp, um `.` e depois "The actual JSON payload (that is, the request body)" [o payload JSON propriamente dito (ou seja, o corpo da requisição)], e a chave é o signing secret do seu endpoint. O Terra "requires the raw, unaltered body of the request to perform signature verification" [exige o corpo bruto e inalterado da requisição para verificar a assinatura], então leia o corpo bruto antes de qualquer parse de JSON. Ignore todo esquema que não seja `v1` e compare em tempo constante.

```js
const crypto = require("crypto");

function verifyTerraSignature(rawBody, header, secret) {
  // header example: "t=1723808700,v1=a5ee9dba..."
  let timestamp = null;
  const signatures = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2); // hex values never contain "="
    if (key === "t") timestamp = value;
    else if (key === "v1") signatures.push(value); // ignore other schemes
  }
  if (!timestamp || signatures.length === 0) return false;
  const expected = Buffer.from(
    crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")
  );
  return signatures.some((sig) => {
    const provided = Buffer.from(sig);
    // timingSafeEqual throws on a length mismatch, so check length first
    return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  });
}
```

Confira também o timestamp contra a sua própria tolerância, como a documentação do Terra sugere, para rejeitar replays. O Terra recomenda as bibliotecas oficiais dele em vez de uma checagem manual; a documentação de webhooks mostra versões com os SDKs para Python, JavaScript e Java.

Responda rápido: "Terra waits 8 seconds for your server to respond before considering the request timed out." [O Terra espera 8 segundos pela resposta do seu servidor antes de considerar que a requisição expirou.] Entregas que falham são repetidas "up to 10 times with exponential backoff" [até 10 vezes com backoff exponencial], ao longo de cerca de oito horas, e então "the event is dropped. There is no notification when this happens" [o evento é descartado. Não há notificação quando isso acontece], então devolva 200 na hora, processe de forma assíncrona e monitore o seu endpoint.

## Passo 7: puxe os dados históricos via REST (opcional)

Os webhooks entregam dados novos conforme chegam. Para o backfill na primeira conexão, chame os endpoints por tipo, como `/activity` (que "Returns completed workout sessions" [devolve sessões de treino concluídas]), `/sleep`, `/daily`, `/body`, `/nutrition`, `/menstruation` e `/athlete`, usando o `user_id` do Terra como chave.

```bash
curl --get "https://access.tryterra.co/api/v2/activity" \
  --header "dev-id: YOUR_DEV_ID" \
  --header "x-api-key: YOUR_API_KEY" \
  --data-urlencode "user_id=USER_ID" \
  --data-urlencode "start_date=2026-10-01" \
  --data-urlencode "end_date=2026-10-08" \
  --data-urlencode "to_webhook=false" \
  --data-urlencode "with_samples=true"
```

Quatro detalhes do guia de dados históricos do Terra pegam as pessoas desprevenidas:

- `user_id` e `start_date` são obrigatórios, e `end_date` "is exclusive on these endpoints" [é exclusivo nesses endpoints], então passe o dia seguinte ao último dia que você quer.
- `to_webhook` "will always be defaulted to true if not provided" [sempre terá true como padrão se não for informado], o que manda os dados para o seu destino em vez da resposta; defina-o como `false` para uma resposta síncrona.
- "For time ranges longer than 28 days, Terra will default to sending the data asynchronously" [para intervalos de tempo maiores que 28 dias, o Terra envia os dados de forma assíncrona por padrão], em partes de no máximo 10MB.
- `with_samples` precisa ser true para receber dados granulares.

## Pegadinhas e notas de produção

- **Comece cedo os cadastros nos fornecedores.** WHOOP e Dexcom exigem o seu próprio app nos portais deles e um domínio seu, e o acesso de produção é decisão do fornecedor, não do Terra.
- **Nunca exponha a chave de API.** Crie sessões de widget e puxe dados só a partir do seu backend; chamar a API de um navegador também falha por CORS.
- **Verifique as assinaturas desde o primeiro dia** e responda em até 8 segundos, ou os eventos começam a ser reenviados e, no fim, descartados.
- **Limites de requisições (rate limits).** A visão geral do Terra diz que ele "has no rate limits of its own" [não tem limites de requisições próprios], mas a referência de rate limits diz que ele "applies rate limits on data-read endpoints" [aplica limites de requisições nos endpoints de leitura de dados]: nenhuma requisição pode cobrir mais de cinco anos, e as requisições de um usuário não podem somar mais de 6.000 dias pedidos em uma hora. Divida os backfills de acordo.
- **O preço é baseado em créditos, então faça a conta.** Em 17 de outubro de 2026, as assinaturas "start from $399 per month billed annually, or $499 per month billed monthly" [começam em US$ 399 por mês com cobrança anual, ou US$ 499 por mês com cobrança mensal], incluindo 100.000 créditos por mês. Cada fonte de dados conectada custa 200 créditos por mês, os primeiros 400 eventos por fonte são gratuitos, e créditos extras começam em US$ 0,005. Pela nossa conta, 100.000 créditos cobrem 500 fontes conectadas antes dos eventos. Reconfira tryterra.co/pricing antes de fazer o orçamento.
- **Agregador, não mágica.** O Terra elimina o código OAuth e o parsing por fornecedor; ele não elimina a aprovação do app em cada fornecedor quando o fornecedor a exige. Essa troca, um pouco de papelada no painel em troca de uma base de código única para [muitos wearables](/fitness-apis/wearable-data-apis), é o que você está comprando.
