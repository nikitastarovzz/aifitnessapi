---
path: "/alternatives/exercisedb-alternatives"
translatedOn: "2026-10-27"
sourceUpdated: "2026-10-22"
sourceHash: "4108122fd78c2060"
metaTitle: "Alternativas ao ExerciseDB (2026): 4 opções comparadas"
metaDescription: >-
  Alternativas ao ExerciseDB: free-exercise-db (domínio público), wger (auto-hospedado, AGPL), API Ninjas (a partir de US$ 39/mês) e bancos de vídeo.
h1: "As melhores alternativas ao ExerciseDB (2026)"
answer: >-
  As principais alternativas ao ExerciseDB, hoje vendido pela AscendAPI, são o free-exercise-db, um conjunto de dados em domínio público com 876 exercícios e imagens que você mesmo hospeda; o wger, uma aplicação sob licença AGPL que você hospeda por conta própria, com API REST; a API Ninjas Exercises, uma API hospedada com texto e fotos de início e fim do movimento, de US$ 39 a US$ 59 por mês para uso comercial; e bancos de mídia como o GymVisual, se você quer ser dono de arquivos de vídeo licenciados. Escolha pelo que está afastando você: licença e posse dos dados apontam para o free-exercise-db ou o wger, uma API hospedada mais simples aponta para a API Ninjas, e mídia sob seu controle aponta para um banco de mídia. Antes de trocar, confira os planos gratuitos da própria AscendAPI, que em 22 de outubro de 2026 incluíam 1.500 exercícios em GIF sem chave de API.
cta: >-
  Toda semana destrinchamos uma API de fitness ou de dados de exercícios — pegadinhas de licença, cobertura de mídia e os prós e contras de hospedar por conta própria —, então assine e evite surpresas.
faqs:
  - q: "O exercisedb.dev é o mesmo ExerciseDB do RapidAPI?"
    a: >-
      O exercisedb.dev hoje se apresenta como AscendAPI, antes ExerciseDB, e vende o ExerciseDB V1 e o V2 por anúncios próprios no RapidAPI, com o V1 também gratuito e sem chave em oss.exercisedb.dev. Existe ainda um anúncio mais antigo do ExerciseDB no RapidAPI, do publicador justin-WFnsXH_t6. Em 22 de outubro de 2026 não conseguimos ler esse anúncio nem confirmar se é o mesmo produto, então verifique qual host e qual anúncio um tutorial ou SDK usa.
  - q: "Qual é a melhor alternativa gratuita e aberta ao ExerciseDB?"
    a: >-
      Depende das suas necessidades de licença e de mídia. O free-exercise-db é de domínio público (o mais permissivo daqui): 876 exercícios em JSON com 1.746 imagens JPEG quando contamos em 22 de outubro de 2026, mas é um conjunto de dados estático, não uma API ao vivo. O wger é gratuito e pode ser auto-hospedado, mas é AGPL-3.0-or-later, com dados Creative Commons definidos por entrada. Se você só precisa de uma API hospedada gratuita, o ExerciseDB V1 da própria AscendAPI é gratuito e sem chave.
  - q: "Qual alternativa ao ExerciseDB tem GIFs ou vídeos de exercícios?"
    a: >-
      Nenhuma das alternativas em forma de API entrega vídeo. O free-exercise-db traz JPEGs estáticos, a API Ninjas devolve fotos de início e fim nos planos premium, e o código do wger aceita vídeos que você envia para o seu próprio servidor. Para arquivos de vídeo sob seu controle, um banco de mídia como o GymVisual vende clipes e GIFs royalty-free. Se você precisa de vídeo vindo de uma API, o ExerciseDB V2 da AscendAPI dá a cada exercício um MP4, com marca d'água no plano gratuito.
  - q: "Posso hospedar os dados de exercícios eu mesmo em vez de usar o RapidAPI?"
    a: >-
      Sim, com o wger ou o free-exercise-db. O wger é uma plataforma open source que pode ser auto-hospedada, com API REST (AGPL-3.0-or-later), e o free-exercise-db permite embutir um conjunto de dados JSON em domínio público e as imagens direto no seu app. O ExerciseDB não é uma opção de auto-hospedagem: em 22 de outubro de 2026 o repositório exercisedb-api continha apenas um README e um arquivo de licença AGPL-3.0. Hospedar por conta própria elimina as cotas do gateway, mas significa que você hospeda e mantém os dados.
  - q: "Preciso me preocupar com a licença AGPL?"
    a: >-
      Se você embute código AGPL-3.0 ou um serviço AGPL modificado em um produto que distribui ou oferece pela rede, os termos copyleft podem exigir que você disponibilize o código-fonte. O código do wger é AGPL-3.0-or-later, então revise as obrigações para o seu caso antes de lançar; o ExerciseDB é usado como API hospedada sob os termos de uso da AscendAPI, que não conseguimos ler. O free-exercise-db (domínio público) evita isso por completo, e a API Ninjas é um serviço hospedado com termos próprios. Isto não é aconselhamento jurídico — confirme com um advogado.
related:
  - href: "/fitness-apis/exercise-database-apis"
    label: "Melhores APIs de banco de exercícios"
  - href: "/compare/exercisedb-vs-free-exercise-db"
    label: "ExerciseDB vs free-exercise-db"
  - href: "/compare/exercisedb-vs-api-ninjas"
    label: "ExerciseDB vs API Ninjas"
  - href: "/alternatives/wger-alternatives"
    label: "Alternativas ao wger"
  - href: "/fitness-apis/exercise-video-apis"
    label: "APIs de vídeos de exercícios"
  - href: "/integrate/exercisedb-api"
    label: "Como integrar o ExerciseDB"
  - href: "/alternatives"
    label: "Todas as alternativas a APIs de fitness e saúde"
---
As pessoas deixam o ExerciseDB por um de quatro motivos: querem ser donas dos dados em vez de alugá-los, precisam de termos que consigam ler, a mídia de que precisam está atrás de um plano que não querem, ou o nome as confunde. Esta página lista as alternativas realistas, o que cada uma custa em licença, mídia e hospedagem, e onde o ExerciseDB ainda é a melhor escolha. Para tudo o que este site verificou sobre o ExerciseDB em um só lugar, veja a [visão geral da API do ExerciseDB](/apis/exercisedb); para chamá-lo em vez de substituí-lo, o [guia de integração da API do ExerciseDB](/integrate/exercisedb-api) cobre a configuração no RapidAPI.

## Primeiro, o que o ExerciseDB é hoje

A página inicial do exercisedb.dev mostra "Previously ExerciseDB" [Antes ExerciseDB] acima do nome AscendAPI, e a documentação da AscendAPI, lida em 22 de outubro de 2026, descreve dois produtos:

- **ExerciseDB V1**, gratuito e sem chave de API em `oss.exercisedb.dev`: "1,500 exercises with 180p GIFs. No authentication required" [1.500 exercícios com GIFs em 180p. Sem autenticação]. Um plano pago no RapidAPI acrescenta imagens e GIFs de 360p a 1080p.
- **ExerciseDB V2**, só no RapidAPI: a AscendAPI declara mais de 11.000 exercícios (11,000+) com um vídeo MP4 por exercício. O plano gratuito Basic dá 2.000 requisições por mês e 200 exercícios, com mídia com marca d'água.

Existe também um anúncio mais antigo do ExerciseDB no RapidAPI, do publicador justin-WFnsXH_t6. A página dele mostra apenas o título para um cliente que não é navegador, então não conseguimos reler os termos nem confirmar se é o mesmo produto dos anúncios da AscendAPI. Os preços pagos e os termos de uso da AscendAPI também ficaram fora do nosso alcance. E nada disso pode ser auto-hospedado: um git clone do [repositório exercisedb-api](https://github.com/ExerciseDB/exercisedb-api) em 22 de outubro de 2026 encontrou só um README e um LICENSE AGPL-3.0.

Se o seu problema era a cota do anúncio antigo, o plano gratuito V1 da AscendAPI pode resolver sem você sair. Se o problema é posse dos dados, termos ou custo em escala, continue lendo. Planos e preços são comparados em [preços de APIs de banco de exercícios](/pricing/exercise-database-api-pricing).

## As alternativas

Leia a linha da licença com o mesmo cuidado da linha de recursos: AGPL é copyleft, com obrigações se você modificar e implantar o código, e domínio público praticamente não tem nenhuma.

### free-exercise-db

Um conjunto de dados estático no GitHub (`yuhonas/free-exercise-db`) que o README chama de "Open Public Domain Exercise Dataset" [conjunto aberto de exercícios em domínio público], com mais de 800 exercícios (800+). Quando contamos o `dist/exercises.json` combinado em 22 de outubro de 2026, ele tinha 876 exercícios e 1.746 caminhos de imagens JPEG, duas por exercício em todos menos três. O LICENSE.md do repositório é a Unlicense, então você pode distribuir os dados e as imagens em um app de código fechado sem atribuição. Melhor para atrito zero de licença quando imagens estáticas bastam. Contrapartida: sem API, sem GIFs nem vídeo, só em inglês, e hospedagem, busca e correções ficam com você. Para o confronto direto, incluindo o que de fato há no conjunto, veja [ExerciseDB vs free-exercise-db](/compare/exercisedb-vs-free-exercise-db).

### wger

Uma aplicação de fitness open source que pode ser auto-hospedada (rotinas, registro de nutrição com base no Open Food Facts, peso corporal), com API REST. O código da aplicação é AGPL-3.0-or-later e os dados de exercícios são "Creative Commons (see individual entries)" [Creative Commons (veja cada entrada)]; no código do wger, cada imagem e vídeo de exercício carrega sua própria licença e autor, e novos envios usam CC-BY-SA 4 por padrão. As imagens precisam ser estáticas, e o modelo de vídeo aceita arquivos mp4, mov, webm, ogv e ogg que você fornece. Melhor para uma plataforma aberta completa sob seu controle, sem taxa por chamada. Contrapartida: você opera uma aplicação Django inteira, a AGPL se aplica ao código que você modifica e implanta, e boa parte dos dados exige atribuição e compartilhamento pela mesma licença. Não conseguimos ler o tamanho do catálogo ao vivo do wger.de, então esta página não dá uma contagem. Se a licença do wger é o obstáculo, compare as [alternativas ao próprio wger](/alternatives/wger-alternatives).

### API Ninjas Exercises

Uma API hospedada que, segundo o fabricante, cobre "over 3000 exercises" [mais de 3000 exercícios], devolvendo nome, tipo, músculo, dificuldade, instruções, equipamento e observações de segurança e, nos planos premium, um array `images` com fotos de início e fim. Cada chamada a `/v1/exercises` devolve até cinco resultados. O plano gratuito é "Evaluation and demo purposes only" [só para avaliação e demonstração], e a página de preços, lida em 22 de outubro de 2026, lista uso comercial a partir do plano Developer, a US$ 59 por mês ou US$ 39 por mês com cobrança anual; armazenar os dados é permitido a partir do plano Business, a US$ 149 ou US$ 99. Melhor para uma consulta hospedada simples, com fotos. Contrapartida: sem GIFs nem vídeo, páginas de resultados pequenas e uma regra de armazenamento a conferir se você guardar o catálogo em cache.

### Um banco de vídeos de exercícios

Se o que você quer do ExerciseDB é mídia de demonstração, comprar arquivos é o outro caminho. O GymVisual, por exemplo, vende "royalty-free workout animations, GIFs, and fitness illustrations" [animações de treino, GIFs e ilustrações de fitness royalty-free], e a licença dele lista apps Android e iOS entre os usos permitidos, enquanto proíbe revenda ou redistribuição e o uso "for training by any Artificial Intelligence (AI) systems" [para treinamento de quaisquer sistemas de inteligência artificial (IA)]. Você paga por arquivo e hospeda por conta própria; não há API. Bancos, formatos e marcas d'água são comparados em [opções de APIs de vídeos de exercícios](/fitness-apis/exercise-video-apis).

### Comparação

| Alternativa | Melhor para | Licença / custo | Mídia | Atenção |
| --- | --- | --- | --- | --- |
| free-exercise-db | Ser dono dos dados de vez | Unlicense; US$ 0 | 1.746 JPEGs | Arquivos estáticos, sem API, só em inglês |
| wger | Uma plataforma aberta auto-hospedada | Código AGPL-3.0-or-later, dados Creative Commons; US$ 0 mais hospedagem | Imagens estáticas; vídeo que você fornece | Você roda o app; compartilhamento pela mesma licença em boa parte dos dados |
| API Ninjas Exercises | Uma consulta hospedada simples | Uso comercial de US$ 39 a US$ 59 por mês | Fotos de início e fim (premium) | Cinco resultados por chamada; armazenar exige o Business |
| Banco de mídia (ex.: GymVisual) | Arquivos de vídeo sob seu controle | Licença royalty-free, por arquivo | Vídeo, GIFs, ilustrações | Sem API; sem redistribuição nem treino de IA |

## Qual escolher?

- **Você precisa de demonstrações em GIF ou vídeo vindas de uma API:** fique no ExerciseDB; nenhuma das alternativas em forma de API aqui entrega vídeo. Teste o plano gratuito do V2 e leia os preços pagos e os termos no RapidAPI.
- **Você quer mídia que seja sua:** um banco de mídia, depois de conferir a licença dele contra o seu produto.
- **Você quer atrito zero de licença e imagens estáticas bastam:** free-exercise-db.
- **Você quer uma plataforma open source completa:** wger, com as obrigações da AGPL e da Creative Commons.
- **Você só precisa de texto estruturado e fotos simples de uma API hospedada:** API Ninjas Exercises em um plano pago.
- **Você quer continuar no ExerciseDB, mas integrá-lo direito:** veja o [guia de integração da API do ExerciseDB](/integrate/exercisedb-api).

## Trocar é fácil?

É uma reintegração, não uma troca de URL. Os catálogos têm esquemas diferentes: os registros do ExerciseDB V1 trazem os arrays `bodyParts`, `targetMuscles` e `equipments`, o free-exercise-db usa `primaryMuscles` a partir de uma lista fixa de 17 valores, e a API Ninjas devolve um único `muscle` por registro. Conte com remapear músculos, equipamentos e IDs à mão. A mídia é o trabalho maior: passar de GIFs ou vídeo para imagens estáticas muda a sua interface, e passar a arquivos que você hospeda acrescenta armazenamento e uma CDN. Com o wger você também assume rodar a aplicação, além de uma revisão de licença se o seu produto for de código fechado.

A vantagem de ser dono dos dados é que você deixa de depender das cotas, dos preços e da disponibilidade de um gateway. Orce a migração como um projeto: mapeamento de campos, tratamento de mídia e uma checagem de licença.
