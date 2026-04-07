// ============================================================
//  translations.ts
//  Portfolio – Gustavo Barros
//  Usage:
//    import { t } from "@/i18n/translations";
//    const { hero, loader, ... } = t("pt");  // or "en"
// ============================================================

export type Locale = "pt" | "en";

const translations = {
  // ── SHARED / GLOBAL ────────────────────────────────────────
  global: {
    pt: {
      sound: "SOM",
      soundOff: "OFF",
      soundOn: "ON",
      scrollHint: "ROLAR ▶▶",
      scrollHintMobile: "ROLAR ▶",
      topSecret: "TOP SECRET",
    },
    en: {
      sound: "SOUND",
      soundOff: "OFF",
      soundOn: "ON",
      scrollHint: "SCROLL ▶▶",
      scrollHintMobile: "SCROLL ▶",
      topSecret: "TOP SECRET",
    },
  },

  // ── HERO ───────────────────────────────────────────────────
  hero: {
    pt: {
      nav: {
        about: "SOBRE",
        projects: "PROJETOS",
        stack: "STACK",
        contact: "CONTATO",
      },
      mobileLogoLabel: "PORTFÓLIO",
    },
    en: {
      nav: {
        about: "ABOUT",
        projects: "PROJECTS",
        stack: "STACK",
        contact: "CONTACT",
      },
      mobileLogoLabel: "PORTFOLIO",
    },
  },

  // ── LOADER ─────────────────────────────────────────────────
  loader: {
    pt: {
      // Intertitle
      ornament: "✦ ✦ ✦",
      subjectName: "Gustavo Barros",
      presents: "apresenta",
      titleLine1: "DESENVOLVEDOR",
      titleLine2: "F.U.L.L.S.T.A.C.K.",
      portfolioLabel: "— Portfólio —",
      copyright: "Copyright © 2026",
    },
    en: {
      ornament: "✦ ✦ ✦",
      subjectName: "Gustavo Barros",
      presents: "presents",
      titleLine1: "FULL STACK",
      titleLine2: "D.E.V.E.L.O.P.E.R.",
      portfolioLabel: "— Portfolio —",
      copyright: "Copyright © 2026",
    },
  },

  // ── ABOUT SCROLL SECTION ───────────────────────────────────
  about: {
    pt: {
      // Scene 1 – Identity
      cursiveIntro: "Desenvolvedor Full Stack",
      name: "Gustavo Barros",
      descIdentity:
        "Desenvolvedor Full Stack & Analista de Sistemas.\nTransformando lógica binária em experiências digitais atemporais.",

      // Scene 2 – The Craft
      sceneTitle2: "O Ofício",
      detailCoreExpertiseLabel: "Especialidade Principal",
      detailCoreExpertiseValue: "Sistemas Full Stack",
      detailDevelopmentLabel: "Desenvolvimento",
      detailDevelopmentValue: "Arquitetura Robusta",

      // Scene 3 – The Vision
      sceneTitle3: "A Visão",
      visionText:
        "Em um mundo de ruído, eu escolho a precisão.\nO design é a ponte entre a emoção humana e a lógica da máquina.\nMinha missão é construir software tão sólido quanto ele performa.",
      cursiveSignature: "Gustavo M. de Barros",

      // Decorative / editorial
      sidebarLeft1: "Full Stack",
      sidebarLeft2: "Mococa - SP, BR",
      footerRef: "Ref. Código: 01-BRL-ARQUIVO",
      footerDate: "M.M.XXVI",
    },
    en: {
      cursiveIntro: "Full Stack Developer",
      name: "Gustavo Barros",
      descIdentity:
        "Full Stack Developer & Systems Analyst.\nTransforming binary logic into timeless digital experiences.",

      sceneTitle2: "The Craft",
      detailCoreExpertiseLabel: "Core Expertise",
      detailCoreExpertiseValue: "Full Stack Systems",
      detailDevelopmentLabel: "Development",
      detailDevelopmentValue: "Robust Architecture",

      sceneTitle3: "The Vision",
      visionText:
        "In a world of noise, I choose precision.\nDesign is the bridge between human emotion and machine logic.\nMy mission is to build software that feels as solid as it performs.",
      cursiveSignature: "Gustavo M. de Barros",

      sidebarLeft1: "Full Stack",
      sidebarLeft2: "Mococa - SP, BR",
      footerRef: "Ref. Code: 01-BRL-ARCHIVE",
      footerDate: "M.M.XXVI",
    },
  },

  // ── BOOT INTRO SECTION ─────────────────────────────────────
  bootIntro: {
    pt: {
      connectionFound: "CONEXÃO ENCONTRADA",
    },
    en: {
      connectionFound: "CONNECTION FOUND",
    },
  },

  // ── BOOT SECTION (Pip-Boy / Projects) ──────────────────────
  boot: {
    pt: {
      panelTitle: "▸ LOG DE PROJETOS",
      drawerToggleLabel: "LOG",
      spriteLabel: "◆ INTERFACE DE PROJETOS ◆",
      spriteTitle: "TERMINAL DO DESENVOLVEDOR",
      spriteDefaultDesc:
        "Uma seleção curada de projetos. Passe o cursor sobre um projeto para acessar esquemáticos e dados da missão.",
      spriteHint: "[ CLIQUE PARA ACESSAR ESQUEMÁTICOS ]",
      closeBtnLabel: "Fechar",

      // Mini stats
      miniStatExperience: "EXPERIÊNCIA",
      miniStatCompletion: "CONCLUSÃO",
      miniStatReputation: "REPUTAÇÃO",

      // Expanded view
      missionObjectiveLabel: "▸ OBJETIVO DA MISSÃO",
      outcomeLabel: "▸ RESULTADO",
      repoBtn: "⌥ REPOSITÓRIO",
      videoBtn: "▶ VÍDEO DEMO",
      unavailableBtn: "⊘ INDISPONÍVEL",

      // Footer
      footerCenter: "◈ CORE-TEC ◈",
      footerHp: "HP",
      footerAp: "AP",
      footerHpVal: "140/140",
      footerApVal: "85/85",
      footerLvl: "▸ NÍV 24",

      // Lightbox
      lightboxClose: "Fechar",
      lightboxPrev: "Anterior",
      lightboxNext: "Próximo",

      // Mobile logo bar
      mobileLogoBarLabel: "▸ PROJETOS",

      // Projects
      projects: {
        GitGraph: {
          description:
            "Dashboard full-stack para repositórios GitHub. Visualiza histórico de commits e estruturas de branches por meio de renderização interativa com D3.",
          problem:
            "Dados brutos do GitHub estão fragmentados entre repositórios — devs carecem de uma superfície única para ler sinais e agir.",
          result:
            "Plataforma SaaS de analytics de alto nível com OAuth GitHub, entregando um dashboard completo com métricas de repositório, stars, forks, issues abertas e histórico de commits.",
        },
        AlphaWeb: {
          description:
            "Plataforma full-stack para criação e gestão de chatbots de IA via configuração por formulário. Suporte multi-modelo LLM com biblioteca pública de chatbots.",
          problem:
            "Implantar um chatbot de IA personalizado exige conhecimento profundo de ML, colocando a tecnologia fora do alcance da maioria das equipes.",
          result:
            "Uma plataforma de biblioteca de chatbots que reduz a criação a um formulário — nome, dataset, prompt, categoria — abstraindo toda a complexidade do modelo.",
        },
        ExpertInvest: {
          description:
            "Plataforma full-stack de otimização de investimentos implementando alocação de investimento pelo método Simplex via PuLP.",
          problem:
            "A alocação de portfólio geralmente é guiada pela intuição em vez de matemática, levando a razões risco/retorno subótimas.",
          result:
            "Motor de otimização alimentado pelo método Simplex — insira ativos e restrições, obtenha a alocação matematicamente ótima com gráficos interativos.",
        },
        HealthTrack: {
          description:
            "Plataforma full-stack de monitoramento de saúde rastreando IMC, TMB e composição corporal com definição de metas personalizadas e mecânicas de sequência diária.",
          problem:
            "Aplicativos genéricos de fitness ignoram biomarcadores individuais, entregando conselhos padronizados que falham para a maioria dos usuários.",
          result:
            "Plataforma de saúde gerando metas diárias personalizadas — hidratação, sono, dieta — com sistema de ofensiva (sequência) para impulsionar o engajamento diário.",
        },
        "Old Portfolio": {
          description:
            "Primeira iteração do portfólio com tema cyberpunk. Arquivada após restrições de performance exigirem uma reconstrução do zero.",
          problem:
            "Pipelines pesados de GSAP e Three.js empurraram os tempos de frame além de 60ms em hardware mid-range, tornando a experiência inutilizável.",
          result:
            "Arquivado como ponto de referência — as lições de performance aprendidas aqui guiaram as decisões de arquitetura do build atual.",
        },
        "Retail Chatbot": {
          description:
            "Webhook de chatbot RAG conversacional integrado à plataforma Blip, servindo como assistente de IA para uma loja de varejo fictícia.",
          problem:
            "Bots de suporte no varejo dependem de árvores rígidas de palavras-chave, falhando quando clientes formulam consultas de forma natural.",
          result:
            "Webhook conversacional RAG na Blip — busca de produtos baseada em embeddings permite que o bot responda a consultas livres como 'vocês têm regata?' com dados reais do catálogo.",
        },
      },
    },
    en: {
      panelTitle: "▸ PROJECTS LOG",
      drawerToggleLabel: "LOG",
      spriteLabel: "◆ PROJECTS INTERFACE ◆",
      spriteTitle: "DEVELOPER TERMINAL",
      spriteDefaultDesc:
        "A curated selection of projects. Hover a project from the log to access schematics and mission data.",
      spriteHint: "[ CLICK TO ACCESS SCHEMATICS ]",
      closeBtnLabel: "Close",

      miniStatExperience: "EXPERIENCE",
      miniStatCompletion: "COMPLETION",
      miniStatReputation: "REPUTATION",

      missionObjectiveLabel: "▸ MISSION OBJECTIVE",
      outcomeLabel: "▸ OUTCOME",
      repoBtn: "⌥ REPOSITORY",
      videoBtn: "▶ DEMO VIDEO",
      unavailableBtn: "⊘ UNAVAILABLE",

      footerCenter: "◈ CORE-TEC ◈",
      footerHp: "HP",
      footerAp: "AP",
      footerHpVal: "140/140",
      footerApVal: "85/85",
      footerLvl: "▸ LVL 24",

      lightboxClose: "Close",
      lightboxPrev: "Previous",
      lightboxNext: "Next",

      mobileLogoBarLabel: "▸ PROJECTS",

      projects: {
        GitGraph: {
          description:
            "Full-stack dashboard for GitHub repositories. Visualizes commit history and branch structures through interactive D3 graph rendering.",
          problem:
            "Raw GitHub data is fragmented across repos — devs lack a single surface to read signals and act on them.",
          result:
            "High-end SaaS analytics platform with GitHub OAuth, delivering a full dashboard for repo metrics, stars, forks, open issues, and commit history at a glance.",
        },
        AlphaWeb: {
          description:
            "Full-stack platform for building and managing AI chatbots via form-based configuration. Multi-model LLM support with a public chatbot library.",
          problem:
            "Deploying a custom AI chatbot requires deep ML knowledge, putting the technology out of reach for most teams.",
          result:
            "A chatbot library platform that reduces creation to a form — name, dataset, prompt, category — abstracting all model complexity behind a clean UI.",
        },
        ExpertInvest: {
          description:
            "Full-stack investment optimization platform implementing portfolio allocation via the Simplex method through PuLP.",
          problem:
            "Portfolio allocation is usually driven by intuition rather than mathematics, leading to suboptimal risk/return ratios.",
          result:
            "Optimization engine powered by the Simplex method — input assets and constraints, get the mathematically optimal allocation with interactive charts.",
        },
        HealthTrack: {
          description:
            "Full-stack health monitoring platform tracking BMI, BMR, and body composition with personalized goal setting and daily streak mechanics.",
          problem:
            "Generic fitness apps ignore individual biometrics, delivering one-size-fits-all advice that fails most users.",
          result:
            "Health platform generating personalized daily targets — hydration, sleep, diet — based on user profile, with a streak system to drive daily engagement.",
        },
        "Old Portfolio": {
          description:
            "First portfolio iteration with a cyberpunk theme. Archived after performance constraints required a ground-up rebuild.",
          problem:
            "Heavy GSAP and Three.js pipelines pushed frame times past 60ms on mid-range hardware, making the experience unusable.",
          result:
            "Archived as a reference point — performance lessons learned here drove the architecture decisions behind the current, more resilient build.",
        },
        "Retail Chatbot": {
          description:
            "Conversational RAG chatbot webhook integrated with the Blip platform, serving as AI assistant for a fictional retail store.",
          problem:
            "Retail support bots rely on rigid keyword trees, failing when customers phrase queries naturally.",
          result:
            "RAG-powered conversational webhook on Blip — embedding-based product search lets the bot answer free-form queries like 'do you have a tank top?' with real catalogue data.",
        },
      },
    },
  },

  // ── CONNECTION LOST SECTION ────────────────────────────────
  connectionLost: {
    pt: {
      headline: "CONEXÃO PERDIDA",
      subtext: "sinal perdido — nó relay inacessível — fim da transmissão",
      hudNodeLabel: "NÓ",
      hudNodeValue: "RELAY-07 // SJRP-SP-111",
      hudStatusLabel: "STATUS",
      hudStatusValue: "DESCONECTANDO",
      hudSigLabel: "SIG",
      bottomLeft: "◈ CORE-TEC",
      bottomRight: "FIM DA LINHA",
    },
    en: {
      headline: "CONNECTION LOST",
      subtext: "signal lost — relay node unreachable — end of transmission",
      hudNodeLabel: "NODE",
      hudNodeValue: "RELAY-07 // SJRP-SP-111",
      hudStatusLabel: "STATUS",
      hudStatusValue: "DISCONNECTING",
      hudSigLabel: "SIG",
      bottomLeft: "◈ CORE-TEC",
      bottomRight: "END OF LINE",
    },
  },

  // ── CONTACT SECTION ────────────────────────────────────────
  contact: {
    pt: {
      // Heading
      headingPre: "◎ TRANSMISSÃO FINAL",
      headingTitle: "Entre em contato.",
      headingDesc:
        "conexão instável — sinal roteado pelo nó relay.\na transmissão será entregue após a estabilização.",

      // Social links
      socialLinksTitle: "▸ CANAIS ABERTOS",
      socialLinks: {
        linkedin: { label: "LINKEDIN", sub: "canal aberto" },
        github:   { label: "GITHUB",   sub: "código aberto" },
        email:    { label: "EMAIL",    sub: "linha direta" },
        phone:    { label: "TELEFONE", sub: "enviar mensagem" },
      },

      // Radar meta
      radarFreqLabel:  "FREQ",
      radarFreqValue:  "118.3 MHz",
      radarModeLabel:  "MODO",
      radarModeValue:  "TX",
      radarSigLabel:   "SIG",
      radarStatusText: "TRANSMITINDO",

      // Form fields
      fieldNameLabel:    "NOME",
      fieldEmailLabel:   "EMAIL",
      fieldMessageLabel: "PAYLOAD DA MENSAGEM",
      namePlaceholder:   "SUA DESIGNAÇÃO",
      emailPlaceholder:  "ENDEREÇO DE RETORNO",
      messagePlaceholder:"CODIFIQUE SUA MENSAGEM AQUI...",

      // Char counter
      charReady: "◆ pronto",
      charWarn:  "◇ mín 10",
      charCount: (n: number) => `${n} chars`,

      // Validation errors
      errorRequired:  "OBRIGATÓRIO",
      errorInvalid:   "INVÁLIDO",
      errorMinChars:  "MÍN 10 CHARS",

      // Submit states
      statusIdle:    "> TRANSMITIR",
      statusLoading: "> ENVIANDO...",
      statusSuccess: "> MENSAGEM TRANSMITIDA",
      statusError:   "> FALHA NA TRANSMISSÃO — TENTAR NOVAMENTE?",
      confirmNote:   "// sinal confirmado. aguarde resposta.",
      retryBtn:      "TENTAR NOVAMENTE",

      // Wave panel
      wavePanelLabel:  "◈ FORMA DE ONDA DO SINAL",
      wavePanelMeta:   "CH-01 · 118.3 MHz · AO VIVO",
      waveFooterRate:  "TAXA DE AMOSTRA: 44.1 kHz",
      waveFooterDepth: "PROFUNDIDADE: 24 bits",
      waveFooterBuf:   "BUFFER: OK",

      // Bottom bar
      bottomLeft:  "◈ CORE-TEC // LOC: SJRP-SP-111",
      bottomRight: "FIM DA LINHA",
    },
    en: {
      headingPre: "◎ FINAL TRANSMISSION",
      headingTitle: "Get in touch.",
      headingDesc:
        "connection unstable — signal routed through relay node.\ntransmission will be delivered upon stabilization.",

      socialLinksTitle: "▸ OPEN CHANNELS",
      socialLinks: {
        linkedin: { label: "LINKEDIN", sub: "open channel" },
        github:   { label: "GITHUB",   sub: "open source" },
        email:    { label: "EMAIL",    sub: "direct line" },
        phone:    { label: "PHONE",    sub: "send message" },
      },

      radarFreqLabel:  "FREQ",
      radarFreqValue:  "118.3 MHz",
      radarModeLabel:  "MODE",
      radarModeValue:  "TX",
      radarSigLabel:   "SIG",
      radarStatusText: "TRANSMITTING",

      fieldNameLabel:    "NAME",
      fieldEmailLabel:   "EMAIL",
      fieldMessageLabel: "MESSAGE PAYLOAD",
      namePlaceholder:   "YOUR DESIGNATION",
      emailPlaceholder:  "RETURN ADDRESS",
      messagePlaceholder:"ENCODE YOUR MESSAGE HERE...",

      charReady: "◆ ready",
      charWarn:  "◇ min 10",
      charCount: (n: number) => `${n} chars`,

      errorRequired:  "REQUIRED",
      errorInvalid:   "INVALID",
      errorMinChars:  "MIN 10 CHARS",

      statusIdle:    "> TRANSMIT",
      statusLoading: "> SENDING...",
      statusSuccess: "> MESSAGE TRANSMITTED",
      statusError:   "> TRANSMISSION FAILED — RETRY?",
      confirmNote:   "// signal confirmed. standby for response.",
      retryBtn:      "RETRY",

      wavePanelLabel:  "◈ SIGNAL WAVEFORM",
      wavePanelMeta:   "CH-01 · 118.3 MHz · LIVE",
      waveFooterRate:  "SAMPLE RATE: 44.1 kHz",
      waveFooterDepth: "BIT DEPTH: 24",
      waveFooterBuf:   "BUFFER: OK",

      bottomLeft:  "◈ CORE-TEC // LOC: SJRP-SP-111",
      bottomRight: "END OF LINE",
    },
  },

  // ── JOURNAL SECTION (3-page dossier) ──────────────────────
  journal: {
    pt: {
      // Page 1
      p1ClassifiedBadge:   "CLASSIFICADO",
      p1ConfidentialReport:"Relatório Confidencial",
      p1DossierTitle:      "Dossiê do Sujeito",
      p1Vol:               "Vol. MMXXVI // S-14",
      p1Location:          "São José do Rio Pardo\nSP // Brasil",
      p1HeadlineLeft:      "Registro\nPúblico",
      p1ClearedBadge:      "Liberado para\nAnálise",
      p1RoleLabel:         "Cargo Principal // Especialização",
      p1RoleTitle:         "Desenvolvedor Full Stack // Especializado",
      p1RoleDesc:
        "Design de arquiteturas de alto desempenho e estética web avançada. Expertise em desenvolvimento de APIs customizadas e protocolos de autenticação seguros. Especializado em integração de IA, ecossistemas em nuvem e implantação de sistemas full-cycle.",
      p1StatusLabel:       "Status do Sujeito",
      p1StatusValue:       "Ativo // Operacional",
      p1ClearanceLabel:    "Habilitação de Segurança",
      p1ClearanceValue:    "Nível 4 (Admin)",
      p1TechStackLabel:    "Stack Tecnológico",
      p1PageIndicator:     "PÁGINA 1/3 →",

      // Page 2
      p2AngleMark:         "45°",
      p2TechSpecs:         "Especificações Técnicas e Formação",
      p2ArchiveRef:        "Arquivo Ref: MMXXVI-B",
      p2SystemsPersonnel:  "Arquivo de Pessoal de Sistemas",
      p2EduLabel:          "Formação Acadêmica",
      p2Fatec:             "Fatec Mococa // Análise de Sistemas",
      p2FatecBody:
        "tarted in 2023, graduating July 2026. Advanced Software Engineering focus: Data Structures, Cloud Computing, Full-Stack lifecycle management, scalable system reliability, and modern development patterns.",
      p2FatecBodyFull:
        "Iniciado em 2023, conclusão em julho de 2026. Foco avançado em Engenharia de Software: Estruturas de Dados, Computação em Nuvem, gestão full-stack do ciclo de vida, confiabilidade de sistemas escaláveis e padrões modernos de desenvolvimento.",
      p2Etec:              "Etec // Informática para Internet",
      p2EtecBody:
        "oncluído 2020–2022. Fundamentos de Desenvolvimento Web: Protocolos de Internet (TCP/IP, HTTP), Arquitetura de Sistemas, design front-end responsivo, lógica algorítmica e gestão de banco de dados.",
      p2EtecBodyFull:
        "Concluído 2020–2022. Fundamentos de Desenvolvimento Web: Protocolos de Internet (TCP/IP, HTTP), Arquitetura de Sistemas, design front-end responsivo, lógica algorítmica e gestão de banco de dados.",
      p2StackTitle:        "Proficiência no Stack",
      p2Verified:          "Dados verificados // Sujeito MMXXVI-B",
      p2MobileNoteLabel:   "Nota de Observação",
      p2MobileNote:
        '"Avaliação Técnica: Alta proficiência em motion fluido e arquitetura escalável. Pronto para engenharia digital complexa e otimização de UI/UX."',

      // Page 3
      p3GeoOrigin:         "Origem Geográfica",
      p3LocationData:      "Dados de Localização do Sujeito",
      p3Sector:            "Setor: 019 // SP",
      p3CityRef:           "Ref: SJRP_BRAZIL_001",
      p3SubjectBadge:      "Sujeito: Gustavo Barros // São José do Rio Pardo",
      p3Desc:
        "Origem Geográfica: São José do Rio Pardo, SP. Conectando lógica complexa com estética cinematográfica.",
      p3CurrentOp:         "Operação Atual",
      p3CurrentOpValue:    "Sistema SaaS de Analytics",
      p3SituationLabel:    "Situação",
      p3SituationValue:    "Disponível para trabalho",
      p3KernelLabel:       "[ LOG_DO_KERNEL_DO_SISTEMA ]",
      p3CpuUsage:          "USO_CPU:",
      p3CpuValue:          "OTIMIZADO",
      p3Runtime:           "RUNTIME:",
      p3RuntimeValue:      "NEXT_JS_V15",
      p3Stack:             "STACK:",
      p3StackValue:        "TS // NEXT",
      p3Status:            "STATUS:",
      p3StatusValue:       "PRONTO",
      p3LogLines: [
        "INICIANDO_CORE...",
        "CARREGANDO_UI...",
        "ANALISANDO_REPOS...",
        "0x53797374656d_OK",
      ],
      p3SecMark:           "SEC_90",
      p3NoteLabel:         "NOTA_DE_OBSERVAÇÃO:",
      p3NoteText:
        '"Um operativo versátil especializado em engenharia full-stack. O sujeito se destaca em entregar experiências de usuário fluidas mantendo estabilidade rígida no backend. Ativo estratégico para projetos de alto risco que exigem supervisão técnica de ponta a ponta e lógica visual avançada."',
      p3HashLabel:         "Hash: MMXXVI_S14",
      p3CrcLabel:          "CRC: 8E2F",
      p3MobileTerminalRows: [
        ["RUNTIME",  "NEXT_JS_V15"],
        ["STACK",    "TS // NEXT"],
        ["STATUS",   "PRONTO"],
      ],
      p3MobileNote:
        '"Um operativo versátil especializado em engenharia full-stack. Ativo estratégico para projetos de alto risco que exigem supervisão técnica de ponta a ponta."',
      p3AuthSignature:     "Assinatura Autorizada:",
      p3ArchiveDept:       "Dept. de Arquivo",
      p3EndDossier:        "--- FIM DO DOSSIÊ ---",

      // Shared page labels
      pageMeta: "Arquivo Dept.",
    },
    en: {
      p1ClassifiedBadge:   "CLASSIFIED",
      p1ConfidentialReport:"Confidential Report",
      p1DossierTitle:      "Personnel Subject Dossier",
      p1Vol:               "Vol. MMXXVI // S-14",
      p1Location:          "São José do Rio Pardo\nSP // Brazil",
      p1HeadlineLeft:      "Public\nRecord",
      p1ClearedBadge:      "Cleared for\nAnalysis",
      p1RoleLabel:         "Primary Role // Specialization",
      p1RoleTitle:         "Full Stack Developer // Specialized",
      p1RoleDesc:
        "High-performance architecture design and advanced web aesthetics. Expertise in custom API development and secure authentication protocols. Specialized in AI integration, cloud ecosystems, and full-cycle system deployment.",
      p1StatusLabel:       "Subject Status",
      p1StatusValue:       "Active // Operational",
      p1ClearanceLabel:    "Security Clearance",
      p1ClearanceValue:    "Level 4 (Admin)",
      p1TechStackLabel:    "Tech Stack",
      p1PageIndicator:     "PAGE 1/3 →",

      p2AngleMark:         "45°",
      p2TechSpecs:         "Tech Specs & Background",
      p2ArchiveRef:        "Archive Ref: MMXXVI-B",
      p2SystemsPersonnel:  "Systems Personnel Archive",
      p2EduLabel:          "Academic Background",
      p2Fatec:             "Fatec Mococa // Systems Analysis",
      p2FatecBody:
        "tarted in 2023, graduating July 2026. Advanced Software Engineering focus: Data Structures, Cloud Computing, Full-Stack lifecycle management, scalable system reliability, and modern development patterns.",
      p2FatecBodyFull:
        "Started in 2023, graduating July 2026. Advanced Software Engineering focus: Data Structures, Cloud Computing, Full-Stack lifecycle management, scalable system reliability, and modern development patterns.",
      p2Etec:              "Etec // Internet Informatics",
      p2EtecBody:
        "ompleted 2020–2022. Web Development fundamentals: Internet Protocols (TCP/IP, HTTP), System Architecture, responsive front-end design, algorithmic logic, and database management.",
      p2EtecBodyFull:
        "Completed 2020–2022. Web Development fundamentals: Internet Protocols (TCP/IP, HTTP), System Architecture, responsive front-end design, algorithmic logic, and database management.",
      p2StackTitle:        "Tech Stack Proficiency",
      p2Verified:          "Data verified // Subject MMXXVI-B",
      p2MobileNoteLabel:   "Observation Note",
      p2MobileNote:
        '"Technical Evaluation: High proficiency in fluid motion and scalable architecture. Field-ready for complex digital engineering and UI/UX optimization."',

      p3GeoOrigin:         "Geographical Origin",
      p3LocationData:      "Subject Location Data",
      p3Sector:            "Sector: 019 // SP",
      p3CityRef:           "Ref: SJRP_BRAZIL_001",
      p3SubjectBadge:      "Subject: Gustavo Barros // São José do Rio Pardo",
      p3Desc:
        "Geographical Origin: São José do Rio Pardo, SP. Bridging complex logic with cinematic aesthetics.",
      p3CurrentOp:         "Current Operation",
      p3CurrentOpValue:    "SaaS Analytics System",
      p3SituationLabel:    "Situation",
      p3SituationValue:    "Open to work",
      p3KernelLabel:       "[ SYSTEM_KERNEL_LOG ]",
      p3CpuUsage:          "CPU_USAGE:",
      p3CpuValue:          "OPTIMIZED",
      p3Runtime:           "RUNTIME:",
      p3RuntimeValue:      "NEXT_JS_V15",
      p3Stack:             "STACK:",
      p3StackValue:        "TS // NEXT",
      p3Status:            "STATUS:",
      p3StatusValue:       "READY",
      p3LogLines: [
        "BOOTING_CORE...",
        "LOADING_UI_PRESETS",
        "ANALYZING_REPOS...",
        "0x53797374656d_OK",
      ],
      p3SecMark:           "SEC_90",
      p3NoteLabel:         "OBSERVATION_NOTE:",
      p3NoteText:
        '"A versatile operative specializing in full-stack engineering. Subject excels at delivering fluid user experiences while maintaining rigid backend stability. Strategic asset for high-stakes projects requiring end-to-end technical oversight and advanced visual logic."',
      p3HashLabel:         "Hash: MMXXVI_S14",
      p3CrcLabel:          "CRC: 8E2F",
      p3MobileTerminalRows: [
        ["RUNTIME",  "NEXT_JS_V15"],
        ["STACK",    "TS // NEXT"],
        ["STATUS",   "READY"],
      ],
      p3MobileNote:
        '"A versatile operative specializing in full-stack engineering. Strategic asset for high-stakes projects requiring end-to-end technical oversight."',
      p3AuthSignature:     "Authorized Signature:",
      p3ArchiveDept:       "Archive Dept.",
      p3EndDossier:        "--- END OF DOSSIER ---",

      pageMeta: "Archive Dept.",
    },
  },

  // ── JOURNEY INTRO SECTION ──────────────────────────────────
  journeyIntro: {
    pt: {
      headline:        "7 anos atrás…",
      subtext:         "a jornada começa aqui",
      systemInit:      "◎ INICIO_SISTEMA",
      timecode:        "TC 00:00:42:09",
      reelLabel:       "ROLO_001",
      estLabel:        "EST. 2026",
      scanningHistory: "Varrendo Histórico",
      yearRange:       "2026 — 2019",
      photoFrameLabel: (i: number) => `FRAME ${String(i + 1).padStart(2, "0")}`,
    },
    en: {
      headline:        "7 years ago…",
      subtext:         "the journey begins here",
      systemInit:      "◎ SYSTEM_INIT",
      timecode:        "TC 00:00:42:09",
      reelLabel:       "REEL_001",
      estLabel:        "EST. 2026",
      scanningHistory: "Scanning History",
      yearRange:       "2026 — 2019",
      photoFrameLabel: (i: number) => `FRAME ${String(i + 1).padStart(2, "0")}`,
    },
  },

  // ── JOURNEY SECTION (side-scroll) ─────────────────────────
  journey: {
    pt: {
      frameCounter:    "JORNADA // GH-2026 // FR 00",
      frameCounterMob: "GH-2026",
      yearLabel:       "ANO",
      bearingLabel:    "RUMO",
      kmLabel:         "KM",
      scrollHint:      "ROLAR ▶▶",
      scrollHintMob:   "ROLAR ▶",
      watermark:       "TOP SECRET",

      signposts: [
        { year: "2019", text: "EM 2019 DESCOBRI MEU INTERESSE POR PROGRAMAÇÃO E ARQUITETURA DE SOFTWARE" },
        { year: "2020", text: "EM 2020 INICIEI O ENSINO TÉCNICO EM DESENVOLVIMENTO WEB NA ETEC" },
        { year: "2023", text: "EM 2023 ME MATRICULEI EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS NA FATEC" },
      ],

      // Signpost card internals
      cardDeptLabel:   "Departamento de Lógica",
      cardSerial:      "Serial: GH-2026-AR",
      cardTitle:       "Aviso Oficial",
      cardAuthorized:  "Autorizado: Supervisor Gustavo",
      cardConfidential:"Confidencial",
    },
    en: {
      frameCounter:    "JOURNEY // GH-2026 // FR 00",
      frameCounterMob: "GH-2026",
      yearLabel:       "YEAR",
      bearingLabel:    "BEARING",
      kmLabel:         "KM",
      scrollHint:      "SCROLL ▶▶",
      scrollHintMob:   "SCROLL ▶",
      watermark:       "TOP SECRET",

      signposts: [
        { year: "2019", text: "IN 2019 I DISCOVERED MY PASSION FOR PROGRAMMING AND SOFTWARE ARCHITECTURE" },
        { year: "2020", text: "IN 2020 STARTED MY TECHNICAL HIGH SCHOOL DEGREE IN WEB DEVELOPMENT AT ETEC" },
        { year: "2023", text: "IN 2023 ENROLLED IN SYSTEMS ANALYSIS AND DEVELOPMENT AT FATEC COLLEGE" },
      ],

      cardDeptLabel:   "Department of Logic",
      cardSerial:      "Serial: GH-2026-AR",
      cardTitle:       "Official Notice",
      cardAuthorized:  "Authorized: Overseer Gustavo",
      cardConfidential:"Confidential",
    },
  },
} as const;

// ── Accessor helper ────────────────────────────────────────────
// Usage: const tx = t("pt"); tx.hero.nav.about  →  "SOBRE"
export function t(locale: Locale) {
  return {
    global:         translations.global[locale],
    hero:           translations.hero[locale],
    loader:         translations.loader[locale],
    about:          translations.about[locale],
    bootIntro:      translations.bootIntro[locale],
    boot:           translations.boot[locale],
    connectionLost: translations.connectionLost[locale],
    contact:        translations.contact[locale],
    journal:        translations.journal[locale],
    journeyIntro:   translations.journeyIntro[locale],
    journey:        translations.journey[locale],
  };
}

// Re-export raw object for tree-shaking in large bundles
export { translations };