---
path: "/integrate/garmin-api"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-22"
sourceHash: "eb5d75d308115ab6"
metaTitle: "API da Garmin (2026): aprovação, cinco APIs e OAuth 2.0"
metaDescription: >-
  A API da Garmin é o Connect Developer Program: peça acesso, depois Starter ou Enterprise Access, cinco APIs, OAuth 2.0 e entrega por push ou ping/pull.
h1: "Guia de integração da API da Garmin (2026)"
answer: >-
  O Connect Developer Program da Garmin é um conjunto de APIs (Health, Activity, Women's Health, Training e Courses) para organizações que constroem apps sobre dados da Garmin de outras pessoas. Você pede acesso, começa com o Starter Access depois que a Garmin aprova, e pode passar para o Enterprise Access, que acrescenta entrega por ping/pull, dados históricos e outros recursos; a Garmin estima uma integração típica em uma a quatro semanas. Todas as APIs usam OAuth 2.0, e os dados chegam até você depois que os usuários sincronizam os dispositivos. Só para os seus próprios dados, a Garmin agora oferece uma Personal API separada.
cta: >-
  Acompanhamos o acesso às APIs de wearables conforme os fornecedores o mudam, incluindo os níveis Starter e Enterprise da Garmin, a Personal API dela e como se comparam as alternativas via agregadores.
faqs:
  - q: "A Garmin exige aprovação para usar a API dela?"
    a: >-
      Para dados de outros usuários, sim. O FAQ da Garmin diz que, depois que você pede acesso ao Garmin Connect Developer Program e o seu pedido é aprovado, você recebe o Garmin Developer Portal e pode começar na hora, a partir do Starter Access. A Garmin estima uma integração típica em uma a quatro semanas. A Personal API dela, para os seus próprios dados, não exige pedido.
  - q: "A Garmin cobra pelo acesso à API?"
    a: >-
      As páginas da Garmin, lidas em 22 de outubro de 2026, não informam preço para o Starter Access e dizem que as opções Enterprise e os termos comerciais são ajustados aos requisitos técnicos e de negócio. A frase anterior do FAQ, de que não havia taxas de licenciamento nem de manutenção, com taxas de licença para algumas métricas, não está mais no site da Garmin, então obtenha os termos por escrito.
  - q: "Qual autenticação a API da Garmin usa?"
    a: >-
      OAuth 2.0: o FAQ da Garmin diz que todas as APIs do Developer Program o usam. Os endpoints de autorização e de token, os escopos e a validade dos tokens estão na documentação que os desenvolvedores aprovados recebem no Garmin Developer Portal, e não nas páginas públicas da Garmin, então tire esses valores de lá, e não de textos de terceiros.
  - q: "Como a Garmin entrega os dados, e eu preciso fazer polling?"
    a: >-
      No Starter Access, a Garmin envia os dados para você por push; a visão geral lista a entrega do Starter como só push. Entrega por ping/pull, suporte a vários projetos e backfill de dados de usuários são marcados como disponíveis só com o Enterprise Access. Em qualquer caso, os dados ficam disponíveis depois que o usuário sincroniza o dispositivo com o Garmin Connect, e você pode assinar só os feeds de que precisa.
  - q: "Posso usar a API da Garmin em um projeto pessoal?"
    a: >-
      Sim, pela Personal API da Garmin, e não pelo Connect Developer Program: o FAQ empresarial da Garmin agora manda as perguntas de uso pessoal para lá, e você mesmo cria a chave no Garmin Connect Web. O Connect IQ, com o SDK gratuito para mostradores, campos de dados, widgets e apps no próprio dispositivo, é um programa separado, que as Connect APIs não exigem.
steps:
  - name: "Peça acesso ao Connect Developer Program"
    text: >-
      Peça acesso pelo site de desenvolvedores da Garmin. Se você pretende oferecer wearables da Garmin, o FAQ da Garmin diz para também entrar em contato pelo formulário de consulta dela, com detalhes do projeto.
  - name: "Obtenha acesso ao portal e crie um app Starter"
    text: >-
      Depois que o seu pedido é aprovado, a Garmin dá acesso ao Garmin Developer Portal, onde fica a documentação detalhada, e você cria um app com o Starter Access.
  - name: "Conecte os usuários com OAuth 2.0"
    text: >-
      Implemente o fluxo OAuth 2.0 da documentação de desenvolvedores da Garmin para conectar cada usuário, e guarde os tokens associados ao seu próprio ID de usuário.
  - name: "Receba os dados por push e assine os feeds"
    text: >-
      No Starter, os dados são enviados por push a um endpoint que você hospeda; assine só os feeds de que precisa. Peça o Enterprise Access se precisar de entrega por ping/pull, backfill ou dados históricos.
  - name: "Verifique a integração e vá para produção"
    text: >-
      Use a verificação automática da sua integração oferecida pela Garmin antes da produção. A Garmin estima uma integração típica em uma a quatro semanas.
related:
  - href: "/pricing/garmin-api-pricing"
    label: "Preço da API da Garmin"
  - href: "/fix/garmin-api-personal-use"
    label: "API da Garmin para uso pessoal"
  - href: "/libraries/garminconnect"
    label: "Biblioteca Python garminconnect"
  - href: "/integrate/fitbit-api"
    label: "Integrar a API da Fitbit"
  - href: "/fitness-apis/fitbit-api-vs-garmin-api"
    label: "API da Fitbit vs API da Garmin"
  - href: "/fitness-apis/wearable-data-apis"
    label: "Melhores APIs de dados de wearables"
  - href: "/integrate"
    label: "Como integrar uma API de fitness ou saúde"
---
A Garmin não é uma API em que você se cadastra e já lança. Tudo abaixo vem das páginas públicas do Connect Developer Program da Garmin, lidas em 22 de outubro de 2026, depois que a Garmin as reorganizou em seções Business e Personal; a referência detalhada da API só está disponível para desenvolvedores aprovados, então, quando um valor fica atrás desse login, este guia diz isso em vez de adivinhar. A [visão geral da API da Garmin](/apis/garmin) acompanha o portão de acesso junto com todas as páginas deste site que tratam da Garmin.

Duas armadilhas de nome antes. O Connect IQ, a plataforma e o SDK gratuito da Garmin para apps que rodam no próprio relógio, é um programa diferente das APIs em nuvem tratadas aqui, e a Garmin diz que um não exige o outro; [Connect IQ vs as Health e Activity APIs](/fitness-apis/garmin-connect-iq-vs-health-api) explica a divisão. E, se tudo de que você precisa são os dados da sua própria conta, e não os de outros usuários, a Garmin agora tem uma Personal API com uma chave que você mesmo cria; veja [API da Garmin para uso pessoal](/fix/garmin-api-personal-use).

## Acesso e aprovação

O FAQ da Garmin diz que o programa "supports a broad range of organizations, from individual developers and startups to companies operating at significant scale" [atende uma ampla gama de organizações, de desenvolvedores individuais e startups a empresas que operam em escala significativa]. O acesso vem em dois níveis:

| Nível | O que a Garmin diz |
|---|---|
| Starter Access | "Developers can gain immediate access and launch with Garmin, with access to core data and tools." [Desenvolvedores podem obter acesso imediato e lançar com a Garmin, com acesso a dados e ferramentas essenciais.] A visão geral lista as APIs Activity, Courses, Health, Training e Women's Health, entrega por push, sem dados históricos e com capacidade limitada de usuários |
| Enterprise Access | "For companies operating at scale" [para empresas que operam em escala], com acesso ampliado a dados, confiabilidade e suporte de nível empresarial. A visão geral acrescenta uma Golf API, entrega por push ou ping/pull, um mês ou mais de histórico, capacidade ilimitada de usuários e suporte técnico, com "commercial terms" [termos comerciais] ajustados aos seus requisitos |

O caminho que o FAQ descreve é curto: peça acesso e, depois que o seu pedido for aprovado, você recebe o Garmin Developer Portal e "can get started on your integration right away" [pode começar a sua integração na hora]. "All detailed technical information and documentation is available within the Garmin Developer Portal." [Todas as informações técnicas detalhadas e a documentação estão disponíveis no Garmin Developer Portal.] A Garmin diz: "A typical integration takes between 1 and 4 weeks." [Uma integração típica leva entre 1 e 4 semanas.] A visão geral diz para criar um app com o Starter Access e pedir o Enterprise Access pelo Developer Portal conforme as suas necessidades crescem. A página da Health API acrescenta um ambiente de avaliação para testes depois da aprovação.

A Garmin não informa mais quanto tempo leva a análise. Até outubro de 2026 o FAQ prometia uma decisão em até dois dias úteis e uma call de integração; nenhum dos dois está nas páginas atuais.

## As cinco APIs

A Garmin diz que você pode usar qualquer uma das APIs do programa, ou todas, em uma única aplicação:

| API | Direção | O que a página da Garmin diz que ela cobre |
|---|---|---|
| Health API | Da Garmin para você | Métricas do dia todo: passos, minutos de intensidade, sono, calorias, frequência cardíaca, estresse, Pulse Ox, Body Battery, composição corporal, respiração, pressão arterial e intervalo batimento a batimento aprimorado (só Enterprise) |
| Activity API | Da Garmin para você | Dados de fitness detalhados capturados durante uma atividade, com corrida, ciclismo, natação, yoga e treino de força citados na página, como resumos em JSON ou arquivos de atividade nos formatos FIT, GPX e TCX |
| Women's Health API | Da Garmin para você | Acompanhamento do ciclo menstrual e da gravidez, incluindo agendas e detalhes da gestação |
| Training API | De você para a Garmin | Treinos e planos de treino publicados no calendário do Garmin Connect para os usuários sincronizarem com dispositivos compatíveis |
| Courses API | De você para a Garmin | Percursos e pontos de percurso que os usuários podem seguir pelo menu padrão Courses de um wearable ou ciclocomputador |

O Enterprise Access acrescenta uma sexta, a Golf API, no cartão de planos da visão geral; ela não tem página própria no menu do programa. A página da Health API posiciona a API para bem-estar corporativo, saúde populacional e monitoramento de pacientes. A Garmin diz que novos dispositivos são suportados automaticamente e que ela tenta acrescentar novos tipos de dados conforme os dispositivos são lançados, mas que "it's not always possible to offer every metric" [nem sempre é possível oferecer todas as métricas].

A página da Activity API da Garmin não informa mais uma contagem de tipos de atividade. Versões anteriores deste guia citavam o "over 30 activity types" [mais de 30 tipos de atividade] da visão geral; essa frase não está nas páginas reorganizadas.

## Autenticação e escopos

O FAQ da Garmin responde à pergunta de autenticação em uma linha: "All APIs in the Developer Program use OAUTH 2.0." [Todas as APIs do Developer Program usam OAuth 2.0.] Os endpoints de autorização e de token, os escopos e a validade dos tokens estão na documentação que os desenvolvedores aprovados recebem, não nas páginas públicas da Garmin, então este guia não os reproduz. Tire esses valores do Developer Portal quando tiver acesso.

## Obtendo os dados: push ou ping/pull

As páginas das APIs da Garmin descrevem o modelo de entrega e marcam parte dele com um asterisco que diz "Supported with Enterprise Access only" [disponível só com o Enterprise Access]:

- **Push, ou ping/pull no Enterprise.** As páginas da Health e da Women's Health oferecem "Push or *Ping/Pull Architecture" [arquitetura push ou ping/pull, esta última marcada com o asterisco]; a visão geral lista a entrega do Starter como só push.
- **Feeds de dados personalizados.** "Only subscribe to the data you need." [Assine só os dados de que precisa.]
- **Suporte a vários projetos (só Enterprise).** Cada app é criado e configurado de forma independente.
- **Ferramentas web para desenvolvedores.** Onboarding, dados de exemplo, backfill de dados de usuários (só Enterprise) e verificação automática da sua integração antes da produção.

Os dados chegam no ritmo do usuário: depois do consentimento inicial, os usuários sincronizam o dispositivo com o Garmin Connect, "at which point it is accessible via the API" [momento em que os dados ficam acessíveis pela API]. A Health API entrega resumos em JSON do que o usuário enviou, incluindo resumos detalhados de estresse, Pulse Ox e por época (epoch) da atividade do dia todo. No Starter, planeje um endpoint para o qual a Garmin possa fazer push e um caminho de ingestão que tolere dados chegando sempre que um usuário calhar de sincronizar, sem backfill histórico para se apoiar.

No sentido inverso, as APIs Training e Courses publicam na conta Garmin Connect do usuário depois que ele consente, e o Garmin Connect cuida do lado do dispositivo: o usuário sincroniza e o treino ou percurso chega ao relógio ou ao ciclocomputador.

## Limites de requisições

As páginas públicas da Garmin não publicam limites de requisições (rate limits). A visão geral dá ao Starter uma capacidade de usuários "Limited" [limitada] e ao Enterprise uma "Unlimited" [ilimitada], sem dizer qual é o limite do Starter; peça isso por escrito.

## Taxas

As páginas da Garmin, lidas em 22 de outubro de 2026, não informam preço para o Starter Access e dizem que as opções Enterprise e os termos comerciais "are tailored based on business and technical requirements" [são ajustados conforme os requisitos técnicos e de negócio]. A frase do FAQ que este guia citava, de que não havia taxas de licenciamento nem de manutenção, com taxas de licença para algumas métricas, sumiu. Se você pretende fornecer wearables da Garmin aos seus usuários, o FAQ agora diz para pedir acesso ao programa e usar o formulário de consulta da Garmin. A página [preço da API da Garmin](/pricing/garmin-api-pricing) detalha isso.

## O que mudou recentemente

A Garmin não publica um changelog público do programa. Comparando as páginas dela em 22 de outubro de 2026 com a versão deste guia de 17 de outubro:

- **Starter e Enterprise Access.** O programa agora tem dois níveis, com entrega por ping/pull, suporte a vários projetos, backfill, dados históricos e intervalo batimento a batimento aprimorado do lado Enterprise.
- **Uma Personal API.** Pessoas físicas podem criar a sua própria chave para os seus próprios dados; o FAQ empresarial manda as perguntas de uso pessoal para lá.
- **Novos endereços.** O FAQ do programa e as páginas das cinco APIs mudaram para `/gc-developer-program/enterprise/`; os endereços antigos devolvem 404.
- **Saíram das páginas:** o aviso "Stay tuned for more updates on the program" [fique atento a novidades sobre o programa], a frase de uso só empresarial e sem taxa de licenciamento, a decisão em dois dias úteis, a call de integração e a linha "over 30 activity types" [mais de 30 tipos de atividade].
- **OAuth 2.0 em todas as APIs,** como antes.

## Pegadinhas e notas de produção

- **O Starter é só push, sem histórico.** Se você precisa de ping/pull, backfill ou mais do que uma capacidade limitada de usuários, está planejando para o Enterprise e os termos ajustados dele.
- **A Personal API não é atalho para produtos.** A Garmin diz que ela não se destina a aplicações comerciais que atendem vários usuários finais.
- **A sincronização define o frescor dos dados.** Nada chega à API até que o usuário sincronize o dispositivo com o Garmin Connect.
- **Considere um agregador se a aprovação emperrar.** Um agregador de dados de wearables que já tenha acesso à Garmin pode cobri-la com uma única integração; compare esse caminho em [APIs de dados de wearables](/fitness-apis/wearable-data-apis) e veja como a Garmin se sai contra opções autosserviço em [API da Fitbit vs API da Garmin](/fitness-apis/fitbit-api-vs-garmin-api).
