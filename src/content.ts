/**
 * Todo o conteúdo do site fica aqui. Troque textos, trabalhos, depoimentos,
 * dúvidas e contatos sem mexer nos componentes.
 *
 * Fotos reais do portfólio: salve em src/assets/portfolio/ (WebP, retrato 3:4),
 * importe no topo deste arquivo e coloque no campo `image` do trabalho.
 * Sem `image`, o card usa a arte procedural do estilo.
 */
import type { StaticImageData } from 'next/image';

// Exemplo:
// import mandala from '@/assets/portfolio/mandala-solar.webp';

export type TattooStyle = 'blackwork' | 'fineline' | 'realismo';

export interface PortfolioItem {
  style: TattooStyle;
  title: string;
  /** Texto do lightbox */
  description: string;
  image?: StaticImageData;
}

export const site = {
  name: 'Vulto Ink',
  artist: 'Rafael Moraes',
  url: 'https://vultoink.com.br',
  title: 'Vulto Ink | Tatuagem autoral em São Paulo',
  description:
    'Rafael Moraes, tatuador autônomo em São Paulo. Blackwork, fine line e realismo em preto e cinza. Estúdio privado, sob agendamento.',
  city: 'São Paulo',
  region: 'SP',
  country: 'BR',
  locale: 'pt_BR',
};

export const contact = {
  /** Só números, com DDI e DDD */
  whatsapp: '', // TODO: preencher, ex.: '5511999999999'
  instagram: 'https://instagram.com',
  location: 'São Paulo, SP / sob agendamento',
};

export const nav = [
  { label: 'Trabalhos', href: '#port' },
  { label: 'Processo', href: '#proc' },
  { label: 'Agendar', href: '#ag' },
];

export const hero = {
  lines: ['Tinta', 'que fica.'],
  hint: 'Clique para derramar tinta',
  text: 'Rafael Moraes. Blackwork, fine line e realismo em preto e cinza. Estúdio particular em São Paulo, uma pessoa por vez.',
  cta: 'Agendar sessão',
};

export const marquee = ['Blackwork', 'Fine line', 'Realismo', 'Feito à mão', 'Autoral', 'São Paulo'];

export const about = {
  label: '01 / Sobre',
  title: { before: 'Cada traço é ', accent: 'permanente', after: '. Nenhum é por acaso.' },
  text: 'Onze anos transformando ideias em pele, em estúdio privado e sem pressa. Cada peça é desenhada do zero para o seu corpo, pensando no movimento e em como a tinta vai envelhecer.',
  stats: [
    { value: 11, label: 'Anos' },
    { value: 2400, label: 'Tatuagens' },
    { value: 100, label: '% autorais' },
  ],
};

export const styles = {
  label: '02 / Estilos',
  title: { before: 'Passe o mouse e ', accent: 'vire a carta', after: '.' },
  items: [
    {
      key: 'blackwork' as TattooStyle,
      tag: 'Estilo i',
      name: 'Blackwork',
      headline: 'Preto sólido e geometria',
      text: 'Sessões de 3 a 6 horas. Ideal para cobrir, fechar e marcar presença.',
    },
    {
      key: 'fineline' as TattooStyle,
      tag: 'Estilo ii',
      name: 'Fine line',
      headline: 'Agulha única, traço fino',
      text: 'Peças delicadas de 1 a 3 horas. Perfeito para a primeira tatuagem.',
    },
    {
      key: 'realismo' as TattooStyle,
      tag: 'Estilo iii',
      name: 'Realismo',
      headline: 'Luz, volume e textura',
      text: 'Retratos e esculturas em preto e cinza, em uma ou mais sessões.',
    },
  ],
};

export const styleLabels: Record<TattooStyle, string> = {
  blackwork: 'Blackwork',
  fineline: 'Fine line',
  realismo: 'Realismo',
};

export const portfolio = {
  label: '03 / Portfólio',
  title: { before: 'Trabalhos ', accent: 'em órbita', after: '' },
  hint: 'Arraste para girar. Clique para abrir',
  items: [
    { style: 'blackwork', title: 'Mandala solar', description: 'Peça autoral desenhada para as costas. Sessão única, cicatrização acompanhada.' },
    { style: 'fineline', title: 'Ramo de oliveira', description: 'Peça autoral desenhada para o antebraço. Sessão única, cicatrização acompanhada.' },
    { style: 'realismo', title: 'Olhar', description: 'Peça autoral desenhada para o braço. Sessão única, cicatrização acompanhada.' },
    { style: 'blackwork', title: 'Geometria sagrada', description: 'Peça autoral desenhada para a perna. Sessão única, cicatrização acompanhada.' },
    { style: 'fineline', title: 'Constelação', description: 'Peça autoral desenhada para a costela. Sessão única, cicatrização acompanhada.' },
    { style: 'realismo', title: 'Retrato em grafite', description: 'Peça autoral desenhada para o ombro. Sessão única, cicatrização acompanhada.' },
    { style: 'blackwork', title: 'Ornamento', description: 'Peça autoral desenhada para o antebraço. Sessão única, cicatrização acompanhada.' },
    { style: 'fineline', title: 'Linha contínua', description: 'Peça autoral desenhada para o pulso. Sessão única, cicatrização acompanhada.' },
    { style: 'realismo', title: 'Estátua clássica', description: 'Peça autoral desenhada para o braço. Sessão única, cicatrização acompanhada.' },
  ] as PortfolioItem[],
};

export const process = {
  label: '04 / Processo',
  title: { before: 'Do primeiro rabisco à ', accent: 'cicatrização', after: '.' },
  next: 'Próxima etapa',
  steps: [
    { title: 'Consulta', text: 'Conversa sobre ideia, referências, local e tamanho.' },
    { title: 'Arte', text: 'Desenho exclusivo, ajustado até ficar exatamente seu.' },
    { title: 'Sessão', text: 'Ambiente privado, material descartável e tempo sem pressa.' },
    { title: 'Cuidados', text: 'Guia de cicatrização e retoque incluso em até 60 dias.' },
  ],
};

export const testimonials = {
  label: '05 / Depoimentos',
  items: [
    { quote: 'Fui com uma ideia vaga e saí com a peça mais bonita que já vi. Ele escuta antes de desenhar.', author: 'Marina S. / fechamento de braço' },
    { quote: 'O fine line continua nítido dois anos depois. Isso diz tudo sobre a técnica.', author: 'Lucas T. / botânico no antebraço' },
    { quote: 'Ambiente calmo, zero pressa e um realismo que parece fotografia na pele.', author: 'Beatriz A. / retrato em preto e cinza' },
  ],
};

export const booking = {
  label: '06 / Agendamento',
  title: { before: 'Vamos desenhar ', accent: 'a sua', after: '?' },
  fields: {
    name: 'Seu nome',
    whatsapp: 'WhatsApp',
    idea: 'Conte a ideia da tatuagem',
    place: 'Local do corpo',
    size: 'Tamanho aproximado',
    file: 'Envie uma referência (opcional)',
    choose: 'Escolha',
  },
  places: ['Braço', 'Antebraço', 'Costas', 'Perna', 'Costela', 'Outro'],
  sizes: ['Pequena (até 8 cm)', 'Média (8 a 15 cm)', 'Grande (15 cm ou mais)', 'Fechamento'],
  errors: {
    name: 'Informe seu nome',
    whatsapp: 'Informe um WhatsApp com DDD',
    idea: 'Descreva a ideia em pelo menos uma frase',
    place: 'Escolha o local',
    size: 'Escolha o tamanho',
  },
  submit: 'Enviar pedido',
  whatsappButton: 'WhatsApp',
  /** Mensagem que abre no WhatsApp */
  message: {
    greeting: 'Olá, Rafael! Quero agendar uma tatuagem.',
    name: 'Nome',
    whatsapp: 'WhatsApp',
    idea: 'Ideia',
    place: 'Local',
    size: 'Tamanho',
    reference: (file: string) => `Tenho uma referência (${file}) e envio aqui na conversa.`,
  },
  success: (firstName: string) =>
    `Pedido pronto, ${firstName}. O WhatsApp abriu com a sua mensagem: é só enviar. Rafael responde em até 48 horas.`,
  successFallback: 'Não abriu? Toque aqui para abrir o WhatsApp.',
};

export const faq = {
  label: '07 / Dúvidas',
  items: [
    { q: 'Dói muito?', a: 'Depende da região e da sua sensibilidade. Costela e pés costumam incomodar mais; antebraço e coxa, menos. Fazemos pausas sempre que precisar.' },
    { q: 'Quanto custa?', a: 'O valor depende de tamanho, complexidade e tempo de sessão. O orçamento vem após a consulta, sem compromisso.' },
    { q: 'Como cuidar depois?', a: 'Você recebe um guia completo: higiene, hidratação, proteção solar e o que evitar nas primeiras semanas.' },
    { q: 'Qual a idade mínima?', a: 'Apenas maiores de 18 anos, com documento com foto no dia da sessão.' },
  ],
};

export const footer = {
  word: 'Vulto.Ink',
};

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
