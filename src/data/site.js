// Conteúdo central do site. Troque os valores entre colchetes [ ] pelos dados reais da Laberna Dulce.
// O catálogo de produtos (nomes, preços, fotos) mora no Supabase agora — edite pelo painel /admin.

export const brand = {
  name: 'Laberna Dulce',
  city: 'São Paulo',
  tagline: 'ateliê de confeitaria',
}

export const announcement = 'Frete grátis para pedidos acima de [VALOR] em São Paulo'

export const mainNav = [
  {
    label: 'Nossos produtos',
    href: '/bolos',
    children: [
      { label: 'Bolos', href: '/bolos' },
      { label: 'Sobremesas', href: '/sobremesas' },
      { label: 'Docinhos', href: '/docinhos' },
      { label: 'Linha To Go', href: '/linha-to-go' },
    ],
  },
  { label: 'Ateliê', href: '/atelie' },
  { label: 'Bolos', href: '/bolos' },
  { label: 'Festas & Eventos', href: '/festas-e-eventos' },
  { label: 'Personalizados', href: '/personalizados' },
  { label: 'Presenteáveis', href: '/presentes' },
  { label: 'Linha To Go', href: '/linha-to-go' },
]

// ---------- Home ----------

export const hero = {
  slides: [
    {
      eyebrow: 'bem-vindos à laberna dulce',
      title: '[Produto assinatura]: nosso clássico mais desejado.',
      cta: 'Conheça nosso Best Seller',
      href: '#best-sellers',
    },
    {
      eyebrow: 'novidade do ateliê',
      title: '[Nome do lançamento] chegou para adoçar sua semana.',
      cta: 'Ver lançamento',
      href: '/bolos',
    },
  ],
}

export const catalogIntro = {
  title: 'Produtos feitos para marcar cada momento com ',
  emphasis: 'doçura.',
  subtitle: 'intensos no sabor, delicados no acabamento.',
  cta: 'Conheça nosso catálogo',
  categories: [
    { label: 'Bolos', href: '/bolos' },
    { label: 'Docinhos', href: '/docinhos' },
    { label: 'Sobremesas', href: '/sobremesas' },
  ],
}

export const newIn = {
  title: 'New In',
  text: 'Conheça os lançamentos mais recentes do nosso ateliê.',
  emptyMessage: 'Não temos nenhum produto para mostrar no momento.',
}

export const seasonal = {
  eyebrow: 'faça sua encomenda!',
  title: '[Coleção sazonal] Laberna Dulce',
  subtitle: 'a época mais gostosa do ano!',
  cta: 'Catálogo da coleção',
  href: '/bolos',
}

export const homeBanners = [
  {
    tone: 'dark',
    reverse: false,
    title: 'Bolos que encantam em cada detalhe',
    body: 'Celebre seu dia com um bolo feito à mão, do jeitinho Laberna Dulce.',
    cta: 'Catálogo de bolos',
    href: '/bolos',
    imageLabel: 'Celebre seu dia',
  },
  {
    tone: 'light',
    reverse: true,
    title: 'Cuidado desde a escolha dos ingredientes até o acabamento',
    body: 'Adoce o paladar com nossas sobremesas artesanais.',
    cta: 'Nossas sobremesas',
    href: '/sobremesas',
    imageLabel: 'Adoce o paladar',
  },
]

export const about = {
  title: 'nossa história',
  paragraphs: [
    'A Laberna Dulce nasceu em [ANO] com o propósito de transformar ingredientes simples em momentos doces e inesquecíveis.',
    'Hoje, o ateliê é conduzido por [Nome da sócia 1], à frente do atendimento, e [Nome da sócia 2], responsável pela confeitaria.',
  ],
}

export const differentials = [
  {
    title: 'presentes especiais',
    text: 'Presenteie quem você ama com um doce Laberna Dulce.',
  },
  {
    title: 'projetos sob medida',
    text: 'Personalização completa para comemorar cada ocasião.',
  },
  {
    title: 'agende seu pedido',
    text: `Entregas em até 48h em São Paulo.`,
  },
  {
    title: 'vontade de um docinho?',
    text: 'Peça também pelo iFood ou Rappi.',
  },
]

export const instagram = {
  handle: '@[laberna.dulce]',
  cta: 'Follow us',
  href: '[LINK_INSTAGRAM]',
}

// ---------- Categorias (páginas /bolos, /sobremesas, /docinhos, /linha-to-go) ----------
// Os produtos de cada categoria vêm do Supabase (tabela `products`, coluna `category`).

export const categories = {
  bolos: {
    slug: 'bolos',
    label: 'Bolos',
    banner: {
      eyebrow: 'feitos para celebrar o agora',
      body: 'Na Laberna Dulce, acreditamos que o sabor tem o poder de marcar um dia, transformar uma ocasião e aquecer lembranças. [Complementar com texto institucional sobre a linha de bolos.]',
    },
  },
  sobremesas: {
    slug: 'sobremesas',
    label: 'Sobremesas',
    banner: {
      eyebrow: 'cuidado do começo ao fim',
      body: 'Cuidado desde a escolha dos ingredientes até o acabamento. [Complementar com texto institucional sobre a linha de sobremesas.]',
    },
  },
  docinhos: {
    slug: 'docinhos',
    label: 'Docinhos',
    banner: {
      eyebrow: 'no tamanho certo pra adoçar',
      body: 'Docinhos artesanais para qualquer ocasião. [Complementar com texto institucional sobre a linha de docinhos.]',
    },
  },
  'linha-to-go': {
    slug: 'linha-to-go',
    label: 'Linha To Go',
    banner: {
      eyebrow: 'praticidade com o sabor de sempre',
      body: 'Para levar a doçura da Laberna Dulce para onde você estiver. [Complementar com texto institucional sobre a linha to go.]',
    },
  },
}

// ---------- Páginas institucionais ----------

export const institutionalPages = {
  atelie: {
    slug: 'atelie',
    label: 'Ateliê',
    hero: { imageLabel: 'foto do ateliê' },
    sections: [
      {
        type: 'plain',
        title: 'nossa história',
        body: [
          'A Laberna Dulce nasceu em [ANO] com o propósito de transformar ingredientes simples em momentos doces e inesquecíveis.',
          'Hoje, o ateliê é conduzido por [Nome da sócia 1], à frente do atendimento, e [Nome da sócia 2], responsável pela confeitaria.',
        ],
        imageLabel: 'foto das sócias',
      },
      {
        type: 'gallery',
        count: 4,
      },
    ],
  },
  'festas-e-eventos': {
    slug: 'festas-e-eventos',
    label: 'Festas & Eventos',
    hero: { imageLabel: 'foto da mesa de doces' },
    sections: [
      {
        type: 'banner',
        title: 'Mesa de doces',
        body: 'A mesa de doces é um dos encantos da festa, um convite para celebrar, degustar e viver o momento com doçura. [Complementar com texto institucional sobre a mesa de doces.]',
        cta: 'Faça o orçamento do seu evento',
        href: '/personalizados',
        imageLabel: 'foto da mesa de doces',
      },
      {
        type: 'plain',
        title: 'Celebrações são ',
        emphasis: 'momentos únicos.',
        body: [
          'É um prazer para nós fazer parte de histórias tão especiais. Criamos cada pedido do jeitinho que você desejar, para tornar esse dia ainda mais inesquecível.',
        ],
        imageLabel: 'foto do evento',
        reverse: true,
      },
      { type: 'gallery', count: 4 },
    ],
  },
  personalizados: {
    slug: 'personalizados',
    label: 'Personalizados',
    hero: { imageLabel: 'foto de produto personalizado' },
    sections: [
      {
        type: 'banner',
        title: 'Feito especialmente para você',
        body: 'Cada comemoração é única, e por isso criamos projetos sob medida para o seu momento. [Complementar com texto institucional sobre personalização.]',
        cta: 'Solicite seu projeto',
        href: '[WHATSAPP]',
        imageLabel: 'foto de personalização',
      },
      { type: 'gallery', count: 4 },
    ],
  },
  presentes: {
    slug: 'presentes',
    label: 'Presenteáveis',
    hero: { imageLabel: 'foto de presente' },
    sections: [
      {
        type: 'banner',
        title: 'Presenteie com doçura',
        body: 'Presentear com um doce Laberna Dulce é presentear com afeto. [Complementar com texto institucional sobre a linha de presentes.]',
        cta: 'Ver opções de presentes',
        href: '/docinhos',
        imageLabel: 'foto de presente',
      },
      { type: 'gallery', count: 4 },
    ],
  },
}

// ---------- Footer ----------

export const footer = {
  hours: [
    'Segunda: 10h às 16h',
    'Terça a Sexta: 10h às 18h',
    'Sábado: 10h às 16h',
  ],
  social: [
    { label: 'Instagram', href: '[LINK_INSTAGRAM]' },
    { label: 'Facebook', href: '[LINK_FACEBOOK]' },
    { label: 'TikTok', href: '[LINK_TIKTOK]' },
  ],
  contact: {
    whatsapp: '[WHATSAPP]',
    phone: '[TELEFONE]',
    email: '[email@labernadulce.com.br]',
    address: '[ENDEREÇO COMPLETO]',
  },
  marketplaces: [
    { label: 'Compre pelo iFood', href: '[LINK_IFOOD]' },
    { label: 'Compre pelo Rappi', href: '[LINK_RAPPI]' },
  ],
  policies: [
    'Entrega e conservação',
    'Validade e conservação',
    'Privacidade',
    'Entregas',
    'Troca, devolução e reembolso',
    'Contato',
  ],
  legal: '© [ANO] por [Razão Social LTDA] | CNPJ [00.000.000/0001-00]',
}

export const faq = [
  {
    question: '[Com quantos dias de antecedência preciso encomendar?]',
    answer: '[Substituir por resposta real. Ex.: pedidos simples com 2 dias de antecedência, bolos personalizados com 7 dias.]',
  },
  {
    question: '[Vocês entregam em toda São Paulo?]',
    answer: '[Substituir por resposta real sobre área de entrega e taxa.]',
  },
  {
    question: '[Quais formas de pagamento vocês aceitam?]',
    answer: '[Substituir por resposta real: Pix, cartão de crédito e boleto pelo site.]',
  },
  {
    question: '[Vocês fazem bolos personalizados?]',
    answer: '[Substituir por resposta real sobre personalização de sabor, tamanho e decoração.]',
  },
  {
    question: '[Como funciona o cancelamento de um pedido?]',
    answer: '[Substituir por resposta real sobre prazo de cancelamento e reembolso.]',
  },
  {
    question: '[Como faço para retirar meu pedido no ateliê?]',
    answer: '[Substituir por resposta real sobre horário e endereço de retirada.]',
  },
]

