// Conteúdo central do site. Troque os valores entre colchetes [ ] pelos dados reais da Laberna Dulce.

export const brand = {
  name: 'Laberna Dulce',
  city: 'São Paulo',
  tagline: 'ateliê de confeitaria',
}

export const announcement = 'Frete grátis para pedidos acima de [VALOR] em São Paulo'

export const mainNav = [
  { label: 'Ateliê', href: '#historia' },
  {
    label: 'Nossos produtos',
    href: '#produtos',
    children: [
      { label: 'Bolos', href: '#produtos' },
      { label: 'Sobremesas', href: '#produtos' },
      { label: 'Docinhos', href: '#produtos' },
      { label: 'Linha Petite', href: '#produtos' },
      { label: 'Linha To Go', href: '#produtos' },
    ],
  },
  { label: 'Festas & Eventos', href: '#diferenciais' },
  { label: 'Personalizados', href: '#diferenciais' },
  { label: 'Presenteáveis', href: '#diferenciais' },
  { label: 'Linha To Go', href: '#produtos' },
]

export const hero = {
  eyebrow: 'bem-vindos à laberna dulce',
  title: '[Produto assinatura]: nosso clássico mais desejado.',
  cta: 'Conheça nosso Best Seller',
}

export const featureBanners = [
  {
    eyebrow: 'Celebre seu dia!',
    title: 'Bolos que encantam em cada detalhe',
    cta: 'Catálogo de bolos',
    href: '#produtos',
    align: 'left',
  },
  {
    eyebrow: 'Adoce o paladar',
    title: 'Cuidado desde a escolha dos ingredientes até o acabamento',
    cta: 'Nossas sobremesas',
    href: '#produtos',
    align: 'right',
  },
  {
    eyebrow: '[mês / época do ano]',
    title: '[Nome da coleção sazonal]',
    cta: 'Hora de torcer e celebrar!',
    href: '#produtos',
    align: 'left',
  },
]

export const catalogIntro = {
  title: 'Produtos feitos para marcar cada momento com doçura.',
  subtitle: 'intensos no sabor, delicados no acabamento.',
  cta: 'Conheça nosso catálogo',
  categories: ['Bolos', 'Docinhos', 'Sobremesas'],
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
}

export const bestSellers = [
  { name: '[Produto 1]', price: '[R$ 0,00]' },
  { name: '[Produto 2]', price: '[R$ 0,00]' },
  { name: '[Produto 3]', price: '[R$ 0,00]' },
  { name: '[Produto 4]', price: '[R$ 0,00]' },
  { name: '[Produto 5]', price: '[R$ 0,00]' },
  { name: '[Produto 6]', price: '[R$ 0,00]' },
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
    text: `Entregas em até 48h em ${'São Paulo'}.`,
  },
  {
    title: 'vontade de um docinho?',
    text: 'Peça também pelo iFood ou Rappi.',
  },
]

export const instagram = {
  handle: '@[laberna.dulce]',
  cta: 'Follow us',
}

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
