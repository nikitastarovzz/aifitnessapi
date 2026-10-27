---
path: "/fitness-apis/wearable-data-apis"
translatedOn: "2026-10-27"
sourceUpdated: "2026-07-08"
sourceHash: "4dd358532b1504c0"
metaTitle: "As melhores APIs de wearables: Fitbit, Garmin, Oura e mais"
metaDescription: >-
  Compare as melhores APIs de wearables de fitness em 2026 — Fitbit, Garmin, Oura, WHOOP e Polar — em dados, aprovação e preço para escolher a certa.
h1: "As melhores APIs de dados de saúde e fitness de wearables (2026)"
answer: >-
  A melhor API de wearable de fitness depende do seu caso de uso, já que as cinco principais opções — Fitbit (Google), Garmin, Oura, WHOOP e Polar — usam OAuth 2.0 com consentimento por usuário e são de uso gratuito em 2026. Escolha a Garmin para GPS e multiesporte a sério, com a maior variedade de métricas de saúde; o Oura ou o WHOOP para dados de sono e recuperação; a Fitbit para alcance amplo no grande público e dados intradiários; e a Polar se você quer o menor atrito de aprovação. O portão real não é o preço, e sim conseguir aprovação para ler dados de outros usuários, além de os seus usuários terem o hardware.
cta: >-
  Destrinchamos toda semana uma nova API de fitness e de wearables — com as peculiaridades de OAuth, os portões de aprovação e as pegadinhas de limite de requisições. Assine para receber a próxima.
faqs:
  - q: "As APIs de wearables de fitness são gratuitas?"
    a: >-
      Em 2026, Fitbit/Google, Garmin, Oura, WHOOP e Polar não publicam taxa por chamada e são documentadas como de uso gratuito. O custo real é passar por uma etapa de aprovação ou revisão e os seus usuários terem o hardware — e, no caso do WHOOP, uma assinatura paga. Confira os termos comerciais atuais para uso em escala.
  - q: "Qual API de wearable é melhor para dados de GPS e corrida?"
    a: >-
      A Garmin costuma ser a mais rica em GPS, multiesporte e métricas de resistência, com uma Activity API para dados por atividade, como corrida, ciclismo e natação, além do detalhe da sessão. A Polar é uma boa alternativa de baixo atrito e exporta atividades em TCX ou GPX. Note que a Garmin exige aprovação no Connect Developer Program dela para dados de outros usuários; para os seus próprios dados, ela agora oferece uma Personal API.
  - q: "As APIs de wearables enviam os dados para mim, ou eu preciso fazer polling?"
    a: >-
      Varia por fornecedor, e isso muda a sua arquitetura. A Garmin entrega por URLs de callback de push e de ping que você registra, então você constrói um consumidor de eventos em vez de um agendador, e o WHOOP documenta suporte a webhooks. A Fitbit é REST de requisição e resposta, que você consulta no seu próprio ritmo, e o Open AccessLink da Polar expõe só dados recentes, então você sincroniza com regularidade ou perde o histórico. Se você suporta várias delas, conte com rodar os dois padrões lado a lado atrás de uma camada de normalização, com proteções de idempotência e de ordenação nos eventos recebidos por push.
  - q: "As APIs de wearables me deixam puxar dados de todos os usuários de uma vez?"
    a: >-
      Não. São APIs OAuth 2.0 baseadas em consentimento, que devolvem dados só de usuários individuais que autorizam o seu app explicitamente — nenhuma é um feed de dados em massa ou populacional. A maioria também limita você a um número pequeno de usuários (muitas vezes 10) até você passar por uma revisão de aprovação para produção.
  - q: "Qual API de wearable tem o menor atrito de aprovação?"
    a: >-
      O Open AccessLink da Polar costuma ser o mais autosserviço: você mesmo registra um cliente e os tokens têm vida longa. A contrapartida é que ele expõe só dados recentes, então você precisa sincronizar ou exportar com regularidade para manter o histórico. Confira os termos atuais na documentação de desenvolvedores da Polar.
related:
  - href: "/fitness-apis/health-data-aggregator-apis"
    label: "Melhores APIs agregadoras de dados de saúde"
  - href: "/fitness-apis/fitbit-api-vs-garmin-api"
    label: "API da Fitbit vs API da Garmin"
  - href: "/fitness-apis"
    label: "Todas as APIs de fitness e treino"
---
Se você precisa de uma API de wearable de fitness, a escolha depende mais de uma coisa do que de dados ou de preço: da facilidade de conseguir aprovação para ler dados de outras pessoas. Todas as cinco principais opções aqui — Fitbit (agora Google), Garmin, Oura, WHOOP e Polar — usam `OAuth 2.0` com consentimento por usuário, e todas são documentadas como de uso gratuito em 2026 (sempre confira os termos comerciais atuais). O que de fato as separa é o portão de aprovação, a profundidade dos dados e, no caso da Fitbit, uma migração para a Google Health API que muda a forma de integrar.

Veio pelos passos de cadastro e OAuth de um fornecedor específico? Cada um tem o seu guia: os guias de integração da [API da Garmin](/integrate/garmin-api), da [API da Fitbit](/integrate/fitbit-api), da [API do Oura](/integrate/oura-api), da [API do WHOOP](/integrate/whoop-api) e da [API da Polar](/integrate/polar-api).

## O que observar em uma API de wearable

Quatro critérios decidem esta categoria. Pese-os nesta ordem:

- **Atrito de acesso e de aprovação.** Nenhuma delas é um feed de dados em massa. Cada uma devolve dados só de usuários individuais que autorizam o seu app, e a maioria condiciona o acesso de produção a um pedido ou a uma etapa de revisão. Essa é, na prática, a maior diferença entre elas — uma API autosserviço que você lança nesta semana versus uma que exige uma aprovação de parceiro que você pode não conseguir.
- **Adequação do modelo de dados.** Detalhe de GPS e multiesporte, métricas de bem-estar do dia todo, pontuações de sono e recuperação, HRV, `SpO2` — cada ecossistema de dispositivos pende para um ponto forte diferente. Combine a API com a métrica de que o seu produto realmente precisa.
- **Modelo de preço.** Em 2026, as cinco não publicam taxa por chamada. O custo real é (a) passar pela etapa de aprovação e (b) os seus usuários terem o hardware — e, no caso do WHOOP, uma assinatura paga. Sempre confira os termos comerciais atuais para uso em escala.
- **Migração e estabilidade.** APIs mudam. O [guia de migração do Fit](https://developer.android.com/health-and-fitness/health-connect/migration/fit) do Google, atualizado em 10 de setembro de 2026, lista a Google Health API como o caminho recomendado para integrações com a Fitbit Web API, então tudo o que você construir para a Fitbit deve mirar nela.

Uma observação sobre o atrito de aprovação em toda esta página: é um requisito factual de acesso, não uma crítica a nenhum produto. Um portão de revisão mais rígido muitas vezes reflete um tratamento mais rigoroso dos dados dos usuários. Para pôr duas delas lado a lado nesse portão, na cobrança do desenvolvedor e no que cada usuário precisa ter, use [a ferramenta de comparação de APIs](/compare-apis).

## APIs de wearables de fitness em resumo

| API | Melhor para | Modelo de acesso | Modelo de preço | Atenção |
|---|---|---|---|---|
| Fitbit / Google Health | Amplo alcance no consumidor, frequência cardíaca e sono intradiários | Autosserviço para os próprios dados; caso a caso para dados intradiários de outros usuários | Uso gratuito (confira os termos comerciais) | O suporte à Web API legada terminou em 30 de set. de 2026 e ela é desligada em 30 de out. de 2026; a Google Health API é o caminho recomendado; os tokens não podem ser transferidos |
| Garmin | GPS/esporte, maior variedade de métricas de saúde | Candidatura ao programa; aprovação de parceiro obrigatória | Sem preço publicado para o Starter Access; termos do Enterprise ajustados | Ping/pull, backfill e algumas métricas só no Enterprise |
| Oura | Sono, prontidão (readiness), HRV, recuperação | App OAuth autosserviço; aprovação para passar de 10 usuários | Gratuito para apps pessoais e comerciais; o usuário precisa de um anel Oura | Personal Access Tokens descontinuados em dez. de 2025 — agora só OAuth |
| WHOOP | Recuperação, esforço (strain), coaching de HRV | App de desenvolvedor autosserviço; nível Sandbox de 10 membros, níveis revisados acima dele | API hoje oferecida sem custo; os usuários são membros do WHOOP | Teto de 10 membros no Sandbox até o WHOOP aprovar o próximo nível |
| Polar | Treino/GPS de baixo atrito + Nightly Recharge | Registro de cliente autosserviço | Gratuito no momento, segundo o contrato de API da Polar | Só dados recentes são expostos — sincronize com regularidade ou perca o histórico |

## Fitbit Web API (Google)

A Fitbit é melhor para alcance amplo no grande público, com dados ricos de sono, frequência cardíaca e intradiários em uma grande base de dispositivos. Ela expõe os dados da conta Fitbit de um usuário — atividade e passos, frequência cardíaca (incluindo séries temporais intradiárias com granularidade de até 1 segundo ou 1 minuto), sono, `SpO2`, HRV e registros de treino — via `OAuth 2.0` (grant authorization code, PKCE recomendado). Registrar um app Personal para os seus próprios dados é autosserviço; o acesso a dados intradiários de alta resolução de outros usuários é concedido caso a caso, mediante pedido, e o limite de requisições é de 150 requisições por hora por usuário que consentiu, em 2026. A contrapartida a conhecer: a [página da Google Health API do Google](https://developers.google.com/health/about) (lida em 12 de outubro de 2026) lista o fim do suporte à Fitbit Web API legada em 30 de setembro de 2026 e o desligamento total em 30 de outubro de 2026, com a Google Health API e o `OAuth 2.0` do Google como substitutos. O guia de migração do Fit do Google, atualizado em 10 de setembro de 2026, lista a Google Health API como o caminho recomendado para integrações com a Fitbit Web API. Projetos novos devem mirar a Google Health API, e o guia de migração da Health API do Google diz que os tokens existentes não podem ser transferidos, então planeje que todo usuário consinta de novo. A nossa página de [status da descontinuação da API da Fitbit](/fitbit-api-shutdown) separa o que está confirmado do que é só relatado. Confira os termos atuais na documentação.

## Garmin (Health API + Connect Developer Program)

A Garmin oferece o conjunto mais amplo de métricas de GPS, multiesporte e saúde — pense em Body Battery, VO2 máx., oximetria de pulso e HRV —, o que a torna uma boa escolha para casos de uso de resistência e atletismo. Ela se divide em uma Health API para métricas de bem-estar do dia todo e uma Activity API para dados por atividade, como corrida, ciclismo e natação, com GPS, frequência cardíaca e detalhe da sessão, entregues por URLs de callback de push/ping que você registra. O acesso usa `OAuth 2.0` em todo o Connect Developer Program, mas o acesso completo do lado do servidor aos dados de saúde dos usuários exige se candidatar ao programa e ser aprovado — não é uma credencial autosserviço. Atenção: desde outubro de 2026 o programa da Garmin vem como Starter e Enterprise Access; o Starter é só push, e recursos como entrega por ping/pull, backfill e intervalo batimento a batimento aprimorado são marcados como disponíveis só com o Enterprise Access, em que a Garmin diz que os termos comerciais são ajustados. As páginas da Garmin não informam mais quanto tempo leva uma análise. Confirme que consegue ser aprovado antes de se comprometer com a Garmin; o [guia de integração da API da Garmin](/integrate/garmin-api) cobre o pedido de acesso e a configuração do OAuth 2.0. Se você só precisa dos seus próprios dados da Garmin, comece pela [Personal API oficial da Garmin para os seus próprios dados](/fix/garmin-api-personal-use); os dois clientes Python não oficiais são comparados em [garminconnect vs garth](/libraries/compare/garminconnect-vs-garth).

## API do Oura (v2)

O Oura é melhor para dados detalhados de sono, prontidão, HRV e recuperação a partir de uma API de anel bem documentada e de baixo atrito. A API v2 é o único ponto de integração suportado e devolve sono, prontidão e atividade diárias, frequência cardíaca, HRV, `SpO2`, treinos, sessões e estresse diário, tudo distribuído em oito escopos `OAuth 2.0` documentados que os usuários podem ligar e desligar um a um. Você registra uma aplicação OAuth em autosserviço; um app fica limitado a 10 usuários até você passar pela aprovação do Oura, depois da qual não há limite de usuários. Os limites de requisições valem por token e por aplicação, e o Oura documenta 5.000 requisições por período de 5 minutos. A contrapartida: os Personal Access Tokens foram descontinuados em dezembro de 2025, então agora é só `OAuth 2.0`, e os usuários precisam ter um anel Oura; a API devolve 403 quando a assinatura do Oura de um usuário expirou. Se um tutorial ainda manda você colar um token pessoal, a solução [tokens de acesso pessoal do Oura descontinuados](/fix/oura-personal-access-token-deprecated) cobre a passagem para o OAuth.

## API do WHOOP

O WHOOP é melhor para apps de coaching e de prontidão centrados em recuperação, esforço (strain) e HRV, construídos sobre o modelo fisiológico contínuo dele. A API expõe os ciclos de um membro, a recuperação (incluindo pontuação de recuperação, HRV e frequência cardíaca de repouso), o sono, os treinos com strain e as medidas corporais. Você cria um app no Developer Dashboard para obter um Client ID e um secret e pede consentimento por escopo via `OAuth 2.0`, com access tokens de vida curta e suporte a webhooks. Todo app novo começa no nível Sandbox do WHOOP, que permite até 10 membros do WHOOP; para lançar de forma mais ampla, você pede o próximo nível pelo Developer Dashboard, e o WHOOP pede que você tenha testado com pelo menos um membro e preenchido o nome do app, os e-mails de contato e a URL da política de privacidade. Os limites de requisições ficam em torno de 100 requisições por minuto e 10.000 por dia por cliente, em 2026, com aumentos disponíveis mediante pedido. Atenção: os níveis acima do Sandbox (100, 1.000, 5.000 e depois membros ilimitados) são conquistados um de cada vez, por meio de uma revisão manual, e todo usuário que se conecta é um membro do WHOOP.

## Polar (Open AccessLink)

A Polar é melhor para acesso autosserviço e de baixo atrito a dados de treino, frequência cardíaca e GPS, além do Nightly Recharge, com tokens de vida longa que simplificam a gestão de tokens. O Open AccessLink fica sobre os dados guardados no Polar Flow e devolve treinos e exercícios em mais de 100 tipos de esporte (100-plus) (com duração, distância, séries temporais e zonas de frequência cardíaca, cadência e altitude, exportáveis em `TCX` ou `GPX`), atividade diária, Nightly Recharge (carga do SNA, HRV, frequência respiratória), sono e frequência cardíaca contínua. Você registra um cliente em autosserviço no portal de administração do AccessLink usando as credenciais do Polar Flow; note um detalhe do fluxo — depois da autorização `OAuth 2.0`, você precisa registrar o usuário explicitamente com um POST no endpoint de usuários para vincular a conta dele ao seu app. A contrapartida a conhecer: a API expõe só dados recentes — o histórico mais antigo não pode ser recuperado —, então você precisa consultar ou exportar (JSON, `FIT`, `TCX` ou `GPX`) com regularidade para manter o histórico completo. O que fica do seu lado da conta está em [preço do Polar AccessLink](/pricing/polar-api-pricing).

## Qual escolher?

Combine a API com o seu caso de uso em vez de caçar um único vencedor:

- **Se você precisa de GPS e multiesporte a sério e das métricas de saúde mais profundas** (Body Battery, VO2 máx., oximetria de pulso) → escolha a Garmin, mas confirme antes que consegue passar pela aprovação da Garmin no nível de acesso de que precisa, já que o Starter Access é só push e ping/pull e backfill são só do Enterprise.
- **Se você precisa de dados profundos de sono, prontidão e recuperação com baixo atrito de entrada** → escolha o Oura, para o anel, ou o WHOOP, para um modelo contínuo de esforço e recuperação. Lembre que os dois limitam você a 10 usuários ou membros até passar pela aprovação, e que os usuários do WHOOP precisam de uma assinatura paga.
- **Se você quer o maior alcance de dispositivos no grande público e dados ricos de frequência cardíaca e sono intradiários** → escolha a Fitbit, mas construa sobre a Google Health API e planeje o novo consentimento dos usuários durante a migração.
- **Se você quer lançar rápido com o menor atrito de aprovação** → escolha a Polar, cujo registro de cliente autosserviço e tokens de vida longa fazem dela a opção mais autosserviço daqui, desde que você consiga conviver com apenas os dados recentes disponíveis e os sincronize com regularidade.
- **Se você está conectando uma força de trabalho inteira para um programa de bem-estar de uma empresa** → comece pela mistura de dispositivos e pelos portões de acesso, que [APIs de dados de wearables para programas de bem-estar corporativo](/fitness-apis/corporate-wellness-wearable-apis) mapeia rota por rota.

## Atenção às letras miúdas

Modelos de preço, limites de requisições, tetos de usuários e datas de migração mudam com frequência nesta categoria. Tudo o que é volátil acima está marcado como "as of 2026 — verify," [em 2026 — confira], e você deve confirmar os números e os termos comerciais atuais na documentação de desenvolvedores de cada fornecedor antes de construir, principalmente para qualquer coisa que rode em escala.
