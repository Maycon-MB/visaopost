// ─── src/data/content.js ───────────────────────────────────────────
// Centralised content constants for the VisaoPost React app.
// Move any copy that might change frequently here so components stay lean.

export const plans = [
  {
    name: 'Presença Digital',
    price: '97',
    setup: '800',
    description:
      'Foco em visibilidade constante. Ideal para óticas que precisam de um Instagram profissional e ativo sem esforço manual.',
    features: [
      '20 posts/mês no Instagram',
      'Identidade visual exclusiva',
      'Posts baseados no clima',
      'Aprovação via celular',
    ],
    featured: false,
  },
  {
    name: 'Vendas Ativas',
    price: '197',
    setup: '1.000',
    description:
      'Transforma seguidores em clientes reais. Inclui uma Landing Page de alta conversão e presença otimizada no Google.',
    features: [
      '30 posts/mês no Instagram',
      'Landing Page Premium',
      'Google Meu Negócio (SEO)',
      'Scripts para Reels de Autoridade',
    ],
    featured: true,
  },
  {
    name: 'Piloto Automático',
    price: '297',
    setup: '1.500',
    description:
      'O Ciclo Completo. Automação total de vendas, agendamento de exames e fidelização com Lembrete de Retorno.',
    features: [
      'Bot WhatsApp de Agendamento',
      'Lembrete de Retorno (1 Ano)',
      'QR Code de Balcão Integrado',
      'Relatório de Vendas Mensal',
    ],
    featured: false,
  },
];

export const innovationIdeas = [
  {
    title: 'Google Meu Negócio Automático',
    desc: 'Todo post do Instagram vai direto para o Google. Quem pesquisar "Exame de vista perto de mim" vai ver sua ótica ativa e atualizada.',
    iconName: 'Globe',
    badge: 'Venda Local',
  },
  {
    title: 'QR Code de Balcão',
    desc: 'Um adesivo elegante no seu balcão que cadastra o cliente no Lembrete de Retorno assim que ele termina a compra. Cliente fiel para sempre.',
    iconName: 'Zap',
    badge: 'Loja Física',
  },
  {
    title: 'Scripts de Autoridade',
    desc: 'Geração de roteiros para você gravar vídeos como profissional (Optometrista). Mostre seu laboratório e ganhe confiança total do paciente.',
    iconName: 'Wand2',
    badge: 'Autoridade',
  },
  {
    title: 'Lembrete de Retorno Inteligente',
    desc: 'O sistema "caça" clientes de 1 ano atrás e envia o convite via WhatsApp. O lucro da consulta e da nova armação garantidos.',
    iconName: 'MessageCircle',
    badge: 'Faturamento',
  },
  {
    title: 'Posts baseados no clima',
    desc: 'Dia de sol forte? Post de solar. Semana fria? Post de armações de grau. Conteúdo contextual em tempo real.',
    iconName: 'Sun',
    badge: 'Inovação',
  },
  {
    title: 'Avaliações viram posts',
    desc: 'Integração com Google: avaliações 5 estrelas são transformadas em posts de prova social automaticamente.',
    iconName: 'Star',
    badge: 'Confiança',
  },
];

export const strategySteps = [
  {
    title: '1. Atração',
    iconName: 'Camera',
    desc: 'Uso estratégico do Instagram e o Google Meu Negócio para colocar sua ótica na frente de novos clientes todos os dias com posts inteligentes e contextuais.',
    colorKey: 'blueLight',
  },
  {
    title: '2. Conversão',
    iconName: 'MousePointer',
    desc: 'A nova Landing Page profissional captura o contato do interessado e o direciona para o agendamento de exame ou visita, transformando seguidores em leads reais.',
    colorKey: 'gold',
    featured: true,
  },
  {
    title: '3. Retenção (Recall)',
    iconName: 'MessageCircle',
    desc: 'O grande segredo: O sistema identifica clientes que compraram há 1 ano e envia um convite automático via WhatsApp para renovar o exame. Dinheiro no caixa sem esforço.',
    colorKey: 'green',
  },
];

export const whatsappFeatures = [
  {
    title: 'Horário de funcionamento',
    desc: 'Responde instantaneamente, qualquer hora do dia ou da noite.',
  },
  {
    title: 'Exame de vista e serviços',
    desc: 'Informa o que oferece sem você precisar digitar uma única palavra.',
  },
  {
    title: 'Formas de pagamento e localização',
    desc: 'FAQ completo configurado no setup inicial da sua conta.',
  },
  {
    title: 'Encaminhamento inteligente',
    desc: 'Perguntas complexas chegam com contexto já fornecido para o vendedor.',
  },
];

export const landingBrands = [
  'RAY-BAN',
  'OAKLEY',
  'PRADA',
  'VOGUE',
  'CARRERA',
  'EMPORIO ARMANI',
  'GRAZI',
  'GUCCI',
];

export const landingReviews = [
  {
    name: 'Ana Beatriz',
    text: 'O atendimento visagista mudou minha autoestima! Encontrei óculos que realmente combinam comigo.',
    time: 'Cliente há 3 anos',
  },
  {
    name: 'Marcos Oliveira',
    text: 'Fiz meu exame e escolhi a armação no mesmo dia. Entrega rápida e o óculos é perfeito.',
    time: 'Cliente satisfeito',
  },
  {
    name: 'Juliana Costa',
    text: 'Ambiente super elegante e atendimento nota 1000. Não troco a Di Lorenzo por nenhuma outra.',
    time: 'Cliente fiel',
  },
];
