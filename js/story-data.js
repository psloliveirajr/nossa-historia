/**
 * ====================================================================
 * DADOS DA HISTÓRIA DE VOCÊS (BASEADO NAS CONVERSAS REAIS!)
 * ====================================================================
 * Este arquivo contém os dados históricos reais extraídos do WhatsApp,
 * datas exatas e momentos divertidos da história de Paulo & Maria Clara.
 */

const STORY_DATA = {
  // --- INFORMAÇÕES BÁSICAS ---
  couple: {
    partner1: "Paulo Sérgio",
    partner2: "Maria Clara",
    title: "Nossa História de Amor",
    subtitle: "O começo do livro que estamos escrevendo juntos",
    // Início oficial do namoro: 13 de Julho de 2026 às 19:07
    startDate: new Date(2026, 6, 13, 19, 7), // Mês 6 = Julho
    startDateFormatted: "13 de Julho de 2026",
    firstChatDate: "6 de Maio de 2026",
  },

  // --- ESTATÍSTICAS REAIS DO CASAL ---
  stats: [
    { label: "Mensagens Trocadas", value: "+17.800", icon: "💬" },
    { label: "Vezes que nos chamamos de 'Amor'", value: "875+", icon: "❤️" },
    { label: "Áudios Compartilhados", value: "539", icon: "🎙️" },
    { label: "Risadas Registradas", value: "+1.470", icon: "😂" },
  ],

  // --- CAPA DO LIVRO / HERO ---
  cover: {
    badge: "Nossa História",
    quote: "O que nós têm é tão bom assim<br>Pra mim, fingir e deixar de lado",
    buttonOpen: "Ler Nosso Diário",
    scrollHint: "Role para reviver nossos momentos",
    // Foto de destaque da capa - Mais antiga tirada (12 de Maio)
    image: "assets/images/foto_07.jpg",
    imageCaption: "Paulo Sérgio<br>&<br>Maria Clara",
  },

  // --- CAPÍTULO 1: O PRÓLOGO (COMO TUDO COMEÇOU) ---
  prologue: {
    chapterNumber: "Capítulo I",
    title: "Onde Tudo Começou",
    subtitle: "5 de maio de 2026 às 20h05, no Instagram",
    text1: "'Qu deusa' foi a primeira mensagem que te enviei, apesar do erro de digitação você me respondeu com um 'Obrigada' e um emoji de coração. A partir daí tomei coragem e comecei a puxar assunto, e você foi me respondendo com muita simpatia e carinho. A cada mensagem trocada, eu percebia o quanto você era especial e divertida.",
    text2: "Saímos do Instagram e fomos para o WhatsApp, logo você me contou que quando era criança achava que tinha 'nome de velha' por causa das suas avós, mãe e tia, e até falava que ia mudar aos 18 anos! Não demorou para que marcássemos o primeiro encontro e muito nervoso eu fui. Apesar da minha péssima escolha de lugar, tivemos um espaço para nos conhecermos melhor e nos divertirmos. Mas foi somente no segundo encontro, em uma noite em Ipanema, que percebi o quão gostoso era estar ao seu lado.",
    text3: "",
    highlight: "“E foi ali, entre horas de conversas por mensagens, que a nossa história começou a ser escrita.”",
    badgeDate: "12 de Maio de 2026",
    image: "assets/images/foto_02.jpg",
    imageCaption: "Nossos primeiros sorrisos",
    // Recriação visual das primeiras mensagens
    firstMessages: [
      { sender: "clara", time: "17:41", text: "Oi" },
      { sender: "paulo", time: "17:44", text: "Oi linda" },
      { sender: "paulo", time: "17:44", text: "As pessoas te chamam de Maria Clara, Maria ou só Clara?" },
      { sender: "clara", time: "17:44", text: "Mais de Clara... mas tem os 3, não ligo não KKKKKK" },
      { sender: "clara", time: "17:55", text: "Já tive muitos problemas com meu nome, sempre falei para os meus pais que ia mudar com 18 anos KKKKKKKK" },
    ]
  },

  // --- CAPÍTULO 2: LINHA DO TEMPO & CONTADOR ---
  timeline: {
    chapterNumber: "Capítulo II",
    title: "Nossa Linha do Tempo",
    subtitle: "Dos primeiros papos de maio até a construção dos nossos sonhos a dois",
    counterDescription: "Tempo oficial de namoro contando cada segundo:",
    milestones: [
      {
        date: "06 de Maio",
        title: "A Primeira Faísca",
        description: "As primeiras mensagens no Instagram. O início de uma conversa que nunca mais parou.",
        icon: "instagram"
      },
      {
        date: "08 de Maio",
        title: "Primeiro 'Oi' no WhatsApp",
        description: "17h41: a conversa migrou para o WhatsApp e descobri a história do seu nome.",
        icon: "message"
      },
      {
        date: "12 de Maio",
        title: "Noite em Ipanema",
        description: "Aquele friozinho na barriga do começo, o passeio de moto e a certeza em Ipanema de que estar ao seu lado era bom demais.",
        icon: "sparkles"
      },
      {
        date: "12 de Junho",
        title: "Nosso Primeiro Dia dos Namorados",
        description: "Mesmo antes do pedido oficial, o coração já sabia: era o nosso último 12 de junho como 'solteiros'.",
        icon: "heart"
      },
      {
        date: "13 de Julho",
        title: "O Início Oficial do Namoro",
        description: "Aquele final de semana inesquecível e o primeiro 'Te amo' oficial. O começo do nosso 'nós'.",
        icon: "heart"
      },
      {
        date: "23 de Agosto",
        title: "Almoço na 'Chácara' em Família",
        description: "Aquele almoço especial em Queimados, muita comida boa e risadas.",
        icon: "heart"
      },
      {
        date: "06 de Setembro",
        title: "Rock in Rio: Do Festival pra Vida",
        description: "Nosso dia épico no festival: os lanches na mochila, as filas dos estandes, a roda gigante e a certeza de estarmos vivendo o melhor da vida lado a lado.",
        icon: "sparkles"
      }
    ]
  },

  // --- CAPÍTULO 3: MURAL DE POLAROIDS & MEMÓRIAS ---
  memories: {
    chapterNumber: "Capítulo III",
    title: "Registros Especiais & Memórias Inesquecíveis",
    subtitle: "Pequenos recortes de momentos que já viraram eternidade",
    photos: [
      {
        url: "assets/images/foto_03.jpg",
        caption: "Um começo de muitos sorvetes",
        date: "31 de Maio de 2026",
        rotation: "-2deg"
      },
      {
        url: "assets/images/foto_04.jpg",
        caption: "Aqui você já era minha futura namorada",
        date: "12 de Junho de 2026",
        rotation: "4deg"
      },
      {
        url: "assets/images/foto_05.jpg",
        caption: "Primeiro show juntos",
        date: "27 de Junho de 2026",
        rotation: "-1.5deg"
      },
      {
        url: "assets/images/foto_06.jpg",
        caption: "Cada dia mais conectados",
        date: "29 de Junho de 2026",
        rotation: "3deg"
      },
      {
        url: "assets/images/foto_07.jpg",
        caption: "O dia do nosso 'Sim' oficial ❤️",
        date: "13 de Julho de 2026",
        rotation: "-3deg"
      },
      {
        url: "assets/images/foto_08.jpg",
        caption: "Na nossa praia predileta",
        date: "18 de Julho de 2026",
        rotation: "2.5deg"
      },
      {
        url: "assets/images/foto_09.jpg",
        caption: "Noite leve e boas risadas",
        date: "18 de Julho de 2026",
        rotation: "-2deg"
      },
      {
        url: "assets/images/foto_12.jpg",
        caption: "Pousando como casal FIT",
        date: "23 de Julho de 2026",
        rotation: "3deg"
      },
      {
        url: "assets/images/foto_14.jpg",
        caption: "Rivalidade só entre os times",
        date: "01 de Agosto de 2026",
        rotation: "2.5deg"
      },
      {
        url: "assets/images/foto_17.jpg",
        caption: "Domingo de superação",
        date: "23 de Agosto de 2026",
        rotation: "-1.5deg"
      },
      {
        url: "assets/images/foto_18.jpg",
        caption: "Um Rock in Rio inesquecivél",
        date: "08 de Setembro de 2026",
        rotation: "3deg"
      },
    ]
  },

  // --- CAPÍTULO 4: O FUTURO (PÁGINAS EM BRANCO) ---
  future: {
    chapterNumber: "Capítulo IV",
    title: "As Páginas em Branco",
    subtitle: "Namoramos há pouco mais de 2 meses, e o melhor ainda está por vir",
    intro: "Temos pouco tempo de namoro no calendário, mas uma história inteira de amor esperando para ser escrita a dois.",
    dreams: [
      {
        icon: "plane",
        title: "Nossa 1ª Grande Viagem Juntos",
        desc: "Já estamos doidos pensando nos lugares que queremos conhecer, nas fotos que vamos tirar e nos momentos que vamos guardar para sempre."
      },
      {
        icon: "film",
        title: "Centenas de Noites de Séries e Filmes",
        desc: "Com muita pipoca, sorvete e abraços quentinhos no frio passaremos horas assistindo nossas séries e filmes favoritos, e descobrindo novos juntos."
      },
      {
        icon: "sun",
        title: "Nossos Domingos Preguiçosos",
        desc: "Acordar sem pressa, tomar café juntos e lembrar que o amor mora na leveza do dia a dia."
      },
      {
        icon: "book-heart",
        title: "Preencher Cada Nova Página Juntos",
        desc: "Celebrar cada mês, superar qualquer obstáculo e caminhar de mãos dadas sempre."
      }
    ]
  },

  // --- O GRAN FINALE: CARTÃO DE AMOR INTERATIVO ---
  finale: {
    chapterNumber: "Epílogo",
    title: "Para Você, meu Amor",
    subtitle: "Um cartão especial para o amor da minha vida",
    // Capa do Cartão com a Arte Personalizada da Foto 11 no tamanho A6
    cardCoverImage: "assets/images/card_cover_a6.jpg",
    cardCoverEyebrow: "Com Todo Meu Amor",
    cardCoverTitle: "Maria Clara",
    cardCoverPhrase: "Você é o melhor que me aconteceu",
    cardCoverCaption: "Nós dois, para sempre ❤️",
    // Mensagem interna da Carta
    salutation: "Minha princesa,",
    letterText: [
      "Desde aquela primeira mensagem no Instagram, meu mundo ficou infinitamente mais leve e feliz. A nossa história começou bem antes do dia 13 de julho, naquele instante em que nossos caminhos se cruzaram.",
      "Amo o seu abraço, seus beijos, suas chatices, suas crises de riso e toda a cumplicidade que a gente construiu em tão pouco tempo. Obrigado por ser essa pessoa incrível, doce e tão especial para mim.",
      "Esse site é só o início do nosso livro. Mal posso esperar para viver e escrever todos os próximos capítulos ao seu lado."
    ],
    closing: "Com todo o meu amor e carinho,",
    signature: "Paulinho ❤️",
    buttonText: "Celebrar Nosso Amor ✨",
    toastMessage: "Eu te amo, Clara! Nosso livro começou agora..."
  }
};

window.STORY_DATA = STORY_DATA;
