---
path: "/pricing/exercise-database-api-pricing"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-22"
sourceHash: "d000c4b833a39ecb"
metaTitle: "Preço de APIs de banco de exercícios: grátis vs planos pagos"
metaDescription: >-
  ExerciseDB grátis: 1.500 exercícios em GIF sem chave, ou 200 com vídeo. API Ninjas: US$ 39-59/mês para uso comercial. wger, free-exercise-db: US$ 0.
h1: "Preço de APIs de banco de exercícios: quanto custa?"
answer: >-
  Em 22 de outubro de 2026 você pode começar com dados de exercícios por US$ 0: a AscendAPI, empresa que antes usava a marca ExerciseDB, oferece 1.500 exercícios com GIFs de graça e sem chave de API, e o ExerciseDB V2 dela tem um plano gratuito Basic no RapidAPI com 2.000 requisições por mês, 200 exercícios e vídeo com marca d'água. O plano gratuito da API Ninjas é só para avaliação, então o uso comercial começa no plano Developer, listado a US$ 59 por mês ou US$ 39 por mês com cobrança anual, e armazenar os dados dela exige o plano Business, a US$ 149 ou US$ 99. O wger e o free-exercise-db não custam nada pelos dados, mas a hospedagem é sua, e o código do wger é AGPL. Os preços pagos da AscendAPI ficam em páginas do RapidAPI que não conseguimos ler.
cta: >-
  Planos gratuitos, marcas d'água e licenças de APIs de exercícios mudam sem alarde — assine para receber atualizações em linguagem simples quando os preços e os termos de dados de exercícios mudarem.
faqs:
  - q: "Existe uma API de banco de exercícios gratuita?"
    a: >-
      Sim, várias, em 22 de outubro de 2026. A AscendAPI, antes ExerciseDB, oferece o conjunto V1 de graça em oss.exercisedb.dev: 1.500 exercícios com GIFs em 180p, sem cadastro e sem chave de API. O ExerciseDB V2 dela tem um plano gratuito Basic no RapidAPI com 2.000 requisições por mês, 200 exercícios e imagens e vídeos com marca d'água. O wger (AGPL, auto-hospedado) e o free-exercise-db (domínio público) são gratuitos quanto ao software e aos dados, embora você pague a sua própria hospedagem. O plano gratuito da API Ninjas é só para avaliação.
  - q: "Quanto custa o ExerciseDB?"
    a: >-
      É grátis para começar. A AscendAPI, empresa que hoje está por trás do exercisedb.dev, oferece o ExerciseDB V1 gratuito e sem chave (1.500 exercícios, GIFs em 180p) e um plano gratuito ExerciseDB V2 Basic no RapidAPI (2.000 requisições por mês, 200 exercícios, mídia com marca d'água). Os planos pagos acrescentam os catálogos completos, mídia em resolução maior e sem marca d'água, e nenhum limite de requisições rígido, mas os preços estão nos anúncios da AscendAPI no RapidAPI, que não conseguimos ler em 22 de outubro de 2026, então confira lá.
  - q: "Qual é a implicação da licença AGPL para APIs de exercícios?"
    a: >-
      O software do wger é licenciado sob a GNU AGPL, uma licença copyleft forte com gatilho de uso em rede: rodar uma versão modificada como serviço de rede pode obrigar você a liberar as suas modificações sob a mesma licença. Para um produto comercial de código fechado, isso é uma questão real de arquitetura e jurídica. O free-exercise-db, por outro lado, é de domínio público (Unlicense), sem obrigações. Faça revisar qualquer dependência AGPL antes de construir em cima dela.
  - q: "Posso usar essas APIs de exercícios em um produto comercial?"
    a: >-
      Depende do plano, independentemente do preço. O plano gratuito da API Ninjas exclui uso comercial e o plano Developer exclui armazenar dados, então um catálogo que você guarda localmente exige o plano Business. Os termos de uso da AscendAPI estavam ilegíveis a partir do nosso ambiente em 22 de outubro de 2026, então pergunte a ela se os planos gratuitos permitem uso comercial. O free-exercise-db é de domínio público, sem restrições, e o wger pode ser usado comercialmente de graça, mas traz obrigações da AGPL se você rodar código modificado. Isto não é aconselhamento jurídico.
  - q: "Quanto custa a API Exercises da API Ninjas?"
    a: >-
      A API Ninjas cobra por plano de conta. A página de preços, lida em 22 de outubro de 2026, lista um plano Free só para avaliação (3.000 chamadas por mês, sem uso comercial), o Developer a US$ 59 por mês ou US$ 39 com cobrança anual (100.000 chamadas, uso comercial, sem armazenar dados), o Business a US$ 149 ou US$ 99 (1.000.000 de chamadas, armazenamento permitido) e o Professional a US$ 299 ou US$ 199. Imagens de exercícios e paginação além dos cinco primeiros resultados são recursos premium.
related:
  - href: "/fitness-apis/exercise-database-apis"
    label: "Melhores APIs de banco de exercícios"
  - href: "/fitness-apis/exercise-video-apis"
    label: "APIs de vídeos de exercícios"
  - href: "/alternatives/exercisedb-alternatives"
    label: "Alternativas ao ExerciseDB"
  - href: "/compare/exercisedb-vs-free-exercise-db"
    label: "ExerciseDB vs free-exercise-db"
  - href: "/compare/exercisedb-vs-api-ninjas"
    label: "ExerciseDB vs API Ninjas"
  - href: "/integrate/exercisedb-api"
    label: "Integrar o ExerciseDB"
  - href: "/pricing"
    label: "Todos os preços de APIs de fitness e saúde"
---
Procurando o próprio ExerciseDB? O [guia de integração da API do ExerciseDB](/integrate/exercisedb-api) cobre a assinatura e as consultas pelo RapidAPI; esta página compara quanto custa cada banco de exercícios.

## Quanto custa cada opção

Leia o mercado como dois tipos de negócio: alugar uma API hospedada, ou pegar um conjunto de dados aberto e servi-lo você mesmo. Tudo nesta tabela foi lido nas páginas ou no repositório do próprio fornecedor em 22 de outubro de 2026.

| Opção | Porta de entrada gratuita | Pago | Licença ou termos | Mídia |
|---|---|---|---|---|
| ExerciseDB V1 (AscendAPI) | 1.500 exercícios, sem chave, sem cadastro, em `oss.exercisedb.dev` | Plano V1 pago no RapidAPI; preço não lido | Termos de uso ilegíveis a partir do nosso ambiente | GIFs: 180p grátis, 360p a 1080p pagos |
| ExerciseDB V2 (AscendAPI) | Plano Basic no RapidAPI: 2.000 requisições por mês, 200 exercícios, sem cartão de crédito | Planos pagos no RapidAPI, sem marca d'água; preços não lidos | Idem | Vídeo MP4 e imagens; mídia do plano gratuito com marca d'água |
| Anúncio do ExerciseDB por justin-WFnsXH_t6 (RapidAPI) | Não foi possível ler: o anúncio mostra só o título | Não foi possível ler | Não foi possível ler | GIFs animados (nossa revisão de julho) |
| API Ninjas Exercises | Plano Free: 3.000 chamadas por mês, 100 por hora, só avaliação e demonstração | Developer US$ 59 por mês (US$ 39 com cobrança anual); Business US$ 149 (US$ 99); Professional US$ 299 (US$ 199) | Plano Free: sem uso comercial, sem armazenar dados, atribuição obrigatória | Imagens estáticas, só nos planos premium |
| wger | Gratuito, open source; você hospeda, ou lê a instância pública em wger.de | Nenhum | Código AGPL-3.0-or-later; dados de exercícios Creative Commons por entrada | Imagens estáticas; vídeo suportado no código |
| free-exercise-db | Gratuito; 876 exercícios em JSON no GitHub | Nenhum | The Unlicense (domínio público) | 1.746 imagens JPEG |

A divisão que importa: uma API hospedada entrega busca, hospedagem de mídia e atualizações e cobra por chamadas ou planos, enquanto um conjunto de dados aberto não custa nada e transfere para você a hospedagem, a busca e a manutenção.

## Planos, plano gratuito e limites de requisições do ExerciseDB

"ExerciseDB" hoje significa AscendAPI para quase todos os efeitos. A página inicial do exercisedb.dev mostra "Previously ExerciseDB" [Antes ExerciseDB] acima do nome AscendAPI, e a documentação da AscendAPI aponta o repositório `ExerciseDB/exercisedb-api` como o seu GitHub. A documentação, lida em 22 de outubro de 2026, descreve dois produtos de exercícios.

- **ExerciseDB V1, gratuito e sem chave.** "1,500 exercises with 180p GIFs. No authentication required, just call the hosted API directly" [1.500 exercícios com GIFs em 180p. Sem autenticação: basta chamar a API hospedada diretamente], em `oss.exercisedb.dev/api/v1/exercises`. O próprio endpoint informou um total de 1.500 quando o chamamos pelo nosso executor de snapshots. A AscendAPI descreve o conjunto V1 completo como "over 2,000" [mais de 2.000] exercícios, e um plano V1 pago no RapidAPI acrescenta imagens e GIFs de 360p a 1080p, níveis de dificuldade e tipos de exercício.
- **ExerciseDB V2, plano gratuito Basic.** O quickstart da AscendAPI diz que o plano Basic é "completely free" [totalmente gratuito]: 2.000 requisições por mês, 200 exercícios na biblioteca, imagens e vídeos dos exercícios, e sem cartão de crédito. A documentação do V2 diz que os dois planos passam pelo RapidAPI e "The only difference is that free tier media is watermarked" [a única diferença é que a mídia do plano gratuito tem marca d'água]; o plano pago "serves clean, watermark-free assets" [entrega arquivos limpos, sem marca d'água]. Os números da própria AscendAPI para o catálogo V2 completo são mais de 11.000 exercícios (11,000+), mais de 15.000 vídeos (15,000+) e mais de 20.000 imagens (20,000+), números do fornecedor que não contamos.
- **Limites de requisições (rate limits).** O guia de rate limiting da AscendAPI diz que "All free plans include a limit of 1,000 requests per hour per API key" [todos os planos gratuitos incluem um limite de 1.000 requisições por hora por chave de API], que "Paid plans have no strict rate limit" [os planos pagos não têm limite de requisições rígido], e que a mídia servida pela CDN dela "is generally unlimited" [geralmente é ilimitada]. O teto mensal de 2.000 requisições do plano V2 Basic é o limite mais apertado na prática.
- **O que não conseguimos ler.** Os preços pagos da AscendAPI estão nos anúncios dela no RapidAPI, que não mostram nada sem um navegador, e os termos de uso ficam atrás de um link curto que respondeu ao nosso executor de snapshots com uma checagem anti-bot. Por isso não podemos informar um preço pago, nem se os planos gratuitos permitem uso comercial. Pergunte à AscendAPI antes de lançar em um plano gratuito.
- **Ainda nada para auto-hospedar.** Quando clonamos [o repositório exercisedb-api](https://github.com/ExerciseDB/exercisedb-api) em 22 de outubro de 2026, ele tinha um README e um LICENSE AGPL-3.0 e nenhum código, em três commits, o último em 25 de novembro de 2025.

O anúncio mais antigo no RapidAPI, publicado por justin-WFnsXH_t6, é o que a nossa revisão de julho descreveu como um plano gratuito com teto, planos pagos e cobrança excedente por requisição. Hoje a página dele mostra só a palavra "ExerciseDB" para um cliente que não é navegador, então não conseguimos reconferir esses termos nem se é o mesmo produto dos anúncios da AscendAPI.

Então o ExerciseDB é gratuito? Sim, para começar: o V1 gratuito e sem chave, ou o plano Basic do V2 com vídeo com marca d'água. Nenhum dos dois planos gratuitos vem com termos legíveis, e uma biblioteca de 200 exercícios é um teste, não um catálogo. Para ver quais dessas APIs de fato entregam vídeo, leia [APIs de vídeos de exercícios comparadas](/fitness-apis/exercise-video-apis).

## Preço da API Ninjas Exercises

A API Ninjas vende uma única chave para todo o catálogo de APIs dela, então a API Exercises é cobrada pelo plano da conta. A página de preços, lida em 22 de outubro de 2026:

| Plano | Preço (mensal, ou por mês com cobrança anual) | Chamadas por mês | Uso comercial | Cache ou armazenamento de dados |
|---|---|---|---|---|
| Free | US$ 0 | 3.000 (e 100 por hora) | Não | Não |
| Developer | US$ 59, ou US$ 39 no anual | 100.000 | Sim | Não |
| Business | US$ 149, ou US$ 99 no anual | 1.000.000 | Sim | Sim |
| Professional | US$ 299, ou US$ 199 no anual | 10.000.000 | Sim | Sim |
| Enterprise | Sob consulta | Sob consulta | Sim | Sim |

A página de preços lista os dois valores de cada plano ao lado de um seletor "Monthly Yearly 34% off" [mensal / anual com 34% de desconto]; lemos o menor como o valor anual porque essa é a diferença que o seletor anuncia. O plano Free é "Evaluation and demo purposes only" [só para avaliação e demonstração] e exige atribuição.

Três coisas na referência da Exercises mudam o que você paga. `/v1/exercises` "Returns up to 5 exercises" [devolve até 5 exercícios] por chamada, e paginar além disso usa um parâmetro `offset` marcado como premium. O campo `images`, fotos de início e fim "in movement order" [na ordem do movimento], é só premium. E `/v1/allexercises`, a lista completa de nomes de um grupo muscular, exige "Business tier and above, or any annual plan" [o plano Business ou superior, ou qualquer plano anual]. Se o seu app guarda uma cópia local do catálogo, como a maioria dos apps de exercícios faz, note que o plano Developer não permite cache nem armazenamento de dados; o Business permite.

## O porém: AGPL, cotas e custos escondidos

- **Copyleft da AGPL (wger).** O código da aplicação wger é AGPL-3.0-or-later. A AGPL é uma licença copyleft forte com cláusula de rede: se você roda uma versão modificada como serviço, pode ser obrigado a publicar as suas modificações. Para um produto de código fechado, isso é uma questão de arquitetura e jurídica, não uma nota de rodapé. O repositório exercisedb-api traz o mesmo arquivo de licença, mas nenhum código, então você usa o ExerciseDB como API hospedada sob os termos de uso dela. O free-exercise-db é de domínio público e não traz esse tipo de obrigação.
- **Marcas d'água e tetos nos planos gratuitos.** A mídia gratuita do V2 da AscendAPI tem marca d'água e é limitada a 200 exercícios; a mídia gratuita do V1 para em GIFs de 180p. Planeje o upgrade antes de desenhar a interface em torno deles.
- **Termos de uso comercial e de armazenamento.** O plano gratuito da API Ninjas exclui uso comercial, e o plano Developer exclui armazenar dados. As duas coisas são restrições ao que você pode lançar, separadas do preço.
- **A sua própria infraestrutura.** Auto-hospedar o wger ou o free-exercise-db ainda custa servidores, banda, disponibilidade e o tempo de engenharia para buscar, corrigir e atualizar os dados.
- **As contagens variam conforme a fonte.** A AscendAPI informa 1.500 para o V1 gratuito, "over 2,000" [mais de 2.000] para o V1 e mais de 11.000 (11,000+) para o V2; o README do free-exercise-db diz mais de 800 (800+), enquanto o arquivo tinha 876 quando contamos. Trate qualquer número de destaque como específico de uma versão.

## Como se comparam e caminhos mais baratos

Se você precisa de uma API hospedada com volume baixo, os planos gratuitos da AscendAPI ou o plano Developer da API Ninjas colocam você no ar gastando pouco; confira os termos antes do lançamento. Se você não quer custo recorrente e consegue hospedar arquivos, as opções abertas são de fato gratuitas, e o fator decisivo é a licença.

- Para o panorama completo, veja a [comparação de APIs de banco de exercícios](/fitness-apis/exercise-database-apis).
- Saindo do ExerciseDB? Veja [alternativas ao ExerciseDB](/alternatives/exercisedb-alternatives).
- Escolhendo entre pagar pelo ExerciseDB e hospedar o free-exercise-db? Veja [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db).
- Já está no wger e esbarrando nos termos da AGPL ou de compartilhamento pela mesma licença? Veja [alternativas ao wger](/alternatives/wger-alternatives).
- Pronto para conectar uma delas? O [guia de integração da API do ExerciseDB](/integrate/exercisedb-api) mostra o passo a passo.
- Para o quadro mais amplo, veja [APIs de fitness gratuitas](/fitness-apis/free-fitness-apis) e o [detalhamento geral do custo de APIs de fitness](/pricing/how-much-does-a-fitness-api-cost).

## Fechamento honesto

Preços de conteúdo de exercícios mudam do lado pago e dependem de licença do lado gratuito. Esta página foi reconferida contra a documentação e a página inicial da AscendAPI, as páginas de preços e da Exercises da API Ninjas, e os repositórios free-exercise-db, wger e exercisedb-api em 22 de outubro de 2026. Os preços pagos e os termos de uso da AscendAPI, e o anúncio mais antigo no RapidAPI, não puderam ser lidos. Reabra as páginas ao vivo antes de fazer o orçamento.
