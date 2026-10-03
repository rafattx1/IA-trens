/**
 * TRILHOS SP — O GUIA MAIS HUMANO DO METRÔ E TREM DE SÃO PAULO
 * Integrations: Skiper 8 (Words), Skiper 11 (Pixel Grid), Skiper 18 (Image Trail),
 * Skiper 70 (Text Reveal), Skiper 35 (Hover Expand), Skiper 90 (Gradient Hover),
 * Skiper 23 (Card Expand Modal), Skiper 6 (Hover Members), Audio Chime & Route Engine.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. PRELOADER COMBINADO: Skiper 8 (Words) & Skiper 11 (Pixel Grid)
  // =========================================================================
  const preloader = document.getElementById('preloader');
  const pixelCanvas = document.getElementById('pixelCanvas');
  const words = document.querySelectorAll('.preloader-word');
  const progressBar = document.getElementById('preloaderProgressBar');
  const skipBtn = document.getElementById('skipPreloaderBtn');

  let preloaderFinished = false;
  let wordIndex = 0;
  let progress = 0;

  // --- Skiper 11: Pixel Grid Canvas Animation ---
  let ctx, canvasW, canvasH, pixelGrid = [];
  const pixelSize = 24;

  function initPixelCanvas() {
    if (!pixelCanvas) return;
    ctx = pixelCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    createPixels();
    requestAnimationFrame(animatePixels);
  }

  function resizeCanvas() {
    if (!pixelCanvas) return;
    canvasW = pixelCanvas.width = window.innerWidth;
    canvasH = pixelCanvas.height = window.innerHeight;
  }

  function createPixels() {
    pixelGrid = [];
    const cols = Math.ceil(canvasW / pixelSize);
    const rows = Math.ceil(canvasH / pixelSize);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.12) {
          pixelGrid.push({
            x: c * pixelSize,
            y: r * pixelSize,
            alpha: Math.random() * 0.4,
            speed: 0.005 + Math.random() * 0.015,
            color: Math.random() > 0.5 ? '#f5a623' : '#005ca9'
          });
        }
      }
    }
  }

  function animatePixels() {
    if (preloaderFinished || !ctx) return;
    ctx.clearRect(0, 0, canvasW, canvasH);
    for (let p of pixelGrid) {
      p.alpha += p.speed;
      if (p.alpha > 0.5 || p.alpha < 0.05) p.speed = -p.speed;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(p.x, p.y, pixelSize - 2, pixelSize - 2);
    }
    requestAnimationFrame(animatePixels);
  }

  initPixelCanvas();

  // --- Skiper 8: Animated Words Transition ---
  const wordInterval = setInterval(() => {
    if (preloaderFinished) return;
    words[wordIndex].classList.remove('active');
    wordIndex = (wordIndex + 1) % words.length;
    words[wordIndex].classList.add('active');
  }, 750);

  // Progress Bar Simulation
  const progressInterval = setInterval(() => {
    if (preloaderFinished) return;
    progress += 2.2;
    if (progressBar) progressBar.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) {
      finishPreloader();
    }
  }, 65);

  function finishPreloader() {
    if (preloaderFinished) return;
    preloaderFinished = true;
    clearInterval(wordInterval);
    clearInterval(progressInterval);
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', finishPreloader);
  }

  // Fallback safety: close preloader within 5 seconds at most
  setTimeout(finishPreloader, 4800);


  // =========================================================================
  // 2. CURSOR IMAGE TRAIL: Skiper 18
  // =========================================================================
  const trailContainer = document.getElementById('cursorTrailContainer');
  const heroSection = document.getElementById('hero');

  const trailImages = [
    'assets/images/luz_station.jpg',
    'assets/images/se_station.jpg',
    'assets/images/pinheiros_station.jpg',
    'assets/images/agente_ajuda.jpg',
    'assets/images/hero_trains.jpg',
    'assets/images/city_tram.jpg'
  ];

  let lastTrailTime = 0;
  let trailImgIndex = 0;

  if (trailContainer && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTrailTime > 90) { // Throttle to maintain 60fps
        lastTrailTime = now;
        spawnTrailItem(e.clientX, e.clientY);
      }
    });
  }

  function spawnTrailItem(x, y) {
    const item = document.createElement('div');
    item.className = 'trail-item';
    const chosenImg = trailImages[trailImgIndex % trailImages.length];
    trailImgIndex++;

    const randomRot = (Math.random() * 24 - 12).toFixed(1) + 'deg';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.setProperty('--rot', randomRot);
    item.style.backgroundImage = `url('${chosenImg}')`;

    trailContainer.appendChild(item);

    setTimeout(() => {
      if (item && item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }, 1200);
  }


  // =========================================================================
  // 3. HEADER SCROLL & MOBILE DRAWER
  // =========================================================================
  const mainHeader = document.getElementById('mainHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });


  // =========================================================================
  // 4. MODO SOS: "TÔ PERDIDO AGORA!"
  // =========================================================================
  const sosSelect = document.getElementById('sosStationSelect');
  const sosActionBtn = document.getElementById('sosActionBtn');
  const sosResultPanel = document.getElementById('sosResultPanel');

  const sosAdviceDatabase = {
    se: {
      title: "📍 Você está na Estação Sé (O coração de SP)",
      steps: [
        "<strong>Não entre em pânico com o movimento:</strong> Sé é a estação mais movimentada do Brasil, mas é super organizada.",
        "<strong>Entenda os níveis:</strong> No nível inferior passa a <strong>Linha 1-Azul</strong> (Jabaquara / Tucuruvi). No nível intermediário passa a <strong>Linha 3-Vermelha</strong> (Barra Funda / Corinthians-Itaquera).",
        "<strong>Para desembarcar:</strong> Saia sempre pela plataforma do MEIO (plataforma central). Para subir no trem, entre pelas plataformas laterais.",
        "<strong>Tem dúvida?</strong> Vá ao balcão de informações no mezanino ou fale com qualquer agente com crachá e colete do Metrô."
      ]
    },
    luz: {
      title: "📍 Você está na Estação da Luz (Trens CPTM e Metrô)",
      steps: [
        "<strong>Você está num castelo histórico:</strong> Os trens de superfície da CPTM (Linha 7-Rubi e Linha 11-Coral) ficam sob os arcos de ferro gigantes no piso térreo.",
        "<strong>Para ir para o Metrô (Linha 1-Azul ou 4-Amarela):</strong> Desça as escadas rolantes até o subterrâneo.",
        "<strong>O Túnel da Linha 4-Amarela:</strong> Parece infinito, mas tem esteira rolante no piso! É só seguir em frente sem pressa.",
        "<strong>Precisa pagar de novo?</strong> Não! A baldeação entre CPTM e Metrô é totalmente gratuita e interna."
      ]
    },
    bras: {
      title: "📍 Você está na Estação Brás (Terminal Ferroviário & Linha 3)",
      steps: [
        "<strong>Identifique seu objetivo:</strong> Se veio fazer compras de roupas na feirinha da madrugada ou lojas, siga as placas de saída para a Rua Rangel Pestana / Miller.",
        "<strong>Para pegar Metrô:</strong> Siga as placas vermelhas até a Linha 3-Vermelha.",
        "<strong>Para pegar Trem CPTM:</strong> Há várias plataformas (Linhas 7, 10, 11 e 12). Olhe nos monitores suspensos o número da plataforma do seu trem.",
        "<strong>Dica de ouro:</strong> Mantenha sua bolsa ou mochila na sua frente por precaução enquanto caminha no meio da multidão."
      ]
    },
    pinheiros: {
      title: "📍 Você está na Estação Pinheiros (Linha 4-Amarela & 9-Esmeralda)",
      steps: [
        "<strong>Estação muito profunda:</strong> As escadas rolantes são longas e íngremes. Segure sempre no corrimão à direita.",
        "<strong>Se estiver no trem da Linha 9:</strong> Para ir ao centro ou Paulista, suba todas as escadas em direção à Linha 4-Amarela.",
        "<strong>Se estiver na Linha 4:</strong> Para ir para Berrini, Morumbi ou Interlagos, desça em direção à Linha 9-Esmeralda.",
        "<strong>Acesso para ciclovia:</strong> Fica na saída da CPTM com passarela direta para o Rio Pinheiros."
      ]
    },
    barra_funda: {
      title: "📍 Você está na Estação Palmeiras-Barra Funda",
      steps: [
        "<strong>Grande terminal da Zona Oeste:</strong> Abriga a Linha 3-Vermelha do Metrô, Linha 7-Rubi, Linha 8-Diamante e rodoviária interestadual.",
        "<strong>Para ir ao Allianz Parque ou Memorial da América Latina:</strong> Siga a saída sul / passarela do Memorial.",
        "<strong>Para ir à Paulista ou Centro:</strong> Pegue o Metrô Linha 3 sentido Corinthians-Itaquera e faça baldeação na República (Linha 4) ou Sé (Linha 1)."
      ]
    },
    tiete: {
      title: "📍 Você está na Estação Portuguesa-Tietê (Rodoviária)",
      steps: [
        "<strong>Acabou de desembarcar de ônibus de viagem?</strong> Você está na Linha 1-Azul do Metrô!",
        "<strong>Para ir para a Avenida Paulista:</strong> Pegue o metrô <em>Sentido Jabaquara</em>. Desça na Estação Paraíso e troque para a Linha 2-Verde (15 minutos de viagem).",
        "<strong>Para ir para o Centro / 25 de Março:</strong> Pegue sentido Jabaquara e desça em São Bento (apenas 5 estações).",
        "<strong>Como pagar:</strong> Aproxime seu cartão de débito/crédito direto na catraca de entrada."
      ]
    },
    paulista: {
      title: "📍 Você está na Conexão Paulista / Consolação (Linhas 2 e 4)",
      steps: [
        "<strong>O famoso túnel de transferência:</strong> Conecta a Linha 2-Verde à Linha 4-Amarela.",
        "<strong>No horário de pico das 18h:</strong> O túnel fica com fila indiana guiada por cones. Vá com calma no ritmo dos passos, não tente furar o fluxo.",
        "<strong>Saídas:</strong> A saída Consolação te deixa na Av. Paulista com Rua Augusta; a saída Paulista te deixa na Rua da Consolação."
      ]
    },
    republica: {
      title: "📍 Você está na Estação República (Linhas 3 e 4)",
      steps: [
        "<strong>Conexão rápida:</strong> Integra a Linha 3-Vermelha (nível mais alto) e a Linha 4-Amarela (nível mais profundo).",
        "<strong>Saída para o Edifício Copan e Praça da República:</strong> Fica na saída norte, com feira de artesanato aos domingos.",
        "<strong>Para ir para a Paulista:</strong> Pegue a Linha 4-Amarela sentido Vila Sônia e desça na estação Paulista (2 paradas)."
      ]
    },
    paraiso: {
      title: "📍 Você está na Estação Paraíso (Linhas 1-Azul & 2-Verde)",
      steps: [
        "<strong>A baldeação mais rápida de SP:</strong> Para trocar da Linha 1 para a Linha 2, você só precisa subir ou descer uma pequena rampa central.",
        "<strong>Sentidos paralelos:</strong> Olhe bem as placas no teto para garantir que está na plataforma sentido Vila Madalena ou Vila Prudente.",
        "<strong>Bairro calmo:</strong> Perto do Parque do Ibirapuera e da Avenida Paulista."
      ]
    },
    outra: {
      title: "📍 Não encontrou sua estação na lista? Calma!",
      steps: [
        "<strong>1. Olhe para cima agora:</strong> Encontre a placa suspensa mais próxima. Ela tem uma cor (azul, verde, vermelha, amarela, etc.) e o nome de uma estação final.",
        "<strong>2. Essa estação final é o 'Sentido':</strong> Veja no mapa da linha se o lugar onde você quer ir está na direção dessa estação.",
        "<strong>3. Se pegou o sentido errado:</strong> Não se preocupe! Desça na próxima estação, atravesse para a plataforma oposta (sem pagar nada) e pegue o trem na volta.",
        "<strong>4. Chame a equipe:</strong> Dirija-se à bilheteria ou procure qualquer funcionário com uniforme. Eles estão ali para te orientar!"
      ]
    }
  };

  function displaySosAdvice(stationKey) {
    if (!stationKey) return;
    const data = sosAdviceDatabase[stationKey] || sosAdviceDatabase.outra;

    sosResultPanel.innerHTML = `
      <div class="sos-res-header">
        <h3 class="sos-res-title">${data.title}</h3>
        <span class="subheading-tag" style="margin:0;">Orientação Express</span>
      </div>
      <div class="sos-res-steps">
        ${data.steps.map((st, i) => `
          <div class="sos-step">
            <span class="sos-step-num">0${i+1}</span>
            <div class="sos-step-content">${st}</div>
          </div>
        `).join('')}
      </div>
      <div class="sos-hotlines">
        <a href="tel:08007707722" class="sos-hotline-btn">
          📞 0800 770 7722 (Ligar Metrô SP)
        </a>
        <a href="https://wa.me/5511997677080" target="_blank" rel="noopener" class="sos-hotline-btn">
          💬 WhatsApp Oficial CPTM
        </a>
        <a href="#dicas" class="sos-hotline-btn" style="color:var(--sp-warm);">
          💡 Ver regras de ouro da estação
        </a>
      </div>
    `;

    sosResultPanel.style.display = 'block';
    sosResultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (sosActionBtn && sosSelect) {
    sosActionBtn.addEventListener('click', () => {
      const val = sosSelect.value || 'outra';
      displaySosAdvice(val);
    });

    sosSelect.addEventListener('change', () => {
      if (sosSelect.value) {
        displaySosAdvice(sosSelect.value);
      }
    });
  }


  // =========================================================================
  // 5. SIMULADOR DE ROTAS HUMANO
  // =========================================================================
  const routeOrigin = document.getElementById('routeOrigin');
  const routeDest = document.getElementById('routeDest');
  const calculateRouteBtn = document.getElementById('calculateRouteBtn');
  const swapRouteBtn = document.getElementById('swapRouteBtn');
  const routeOutputCard = document.getElementById('routeOutputCard');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Human routes knowledge graph
  const routeGraph = {
    // Tietê -> Paulista
    'tiete->paulista': {
      time: '18 a 22 min',
      cost: 'R$ 5,00',
      transfers: '1 baldeação gratuita',
      steps: [
        {
          title: 'Embarque na Portuguesa-Tietê (Linha 1-Azul)',
          desc: 'Entre no trem <strong>Sentido Jabaquara</strong>. Passe por 7 estações sem descer (Armênia, Tiradentes, Luz, São Bento, Sé, Japão-Liberdade, São Joaquim, Vergueiro).'
        },
        {
          title: 'Baldeação na Estação Paraíso',
          desc: 'Desembarque na Estação Paraíso. Suba a rampa interna indicada por placas verdes em direção à <strong>Linha 2-Verde (Sentido Vila Madalena)</strong>. Não passe por nenhuma catraca!'
        },
        {
          title: 'Chegada na Avenida Paulista',
          desc: 'Pegue o trem verde e desça na estação <strong>Trianon-MASP</strong> ou <strong>Brigadeiro</strong> conforme o número da avenida onde você vai. O trem abre as portas do lado direito.'
        }
      ],
      insiderTip: 'Embarque nos primeiros vagões do trem na Estação Tietê. Assim, quando você descer na Paraíso, sairá exatamente em frente à rampa de baldeação para a Linha Verde!'
    },
    // GRU -> Luz
    'gru->luz': {
      time: '35 min (Expresso) / 50 min (Parador)',
      cost: 'R$ 5,00',
      transfers: 'Trem direto ou 1 baldeação',
      steps: [
        {
          title: 'No Terminal de Passageiros do Aeroporto (GRU)',
          desc: 'Pegue o ônibus circular gratuito do aeroporto que te leva até a plataforma da estação ferroviária <strong>Aeroporto-Guarulhos</strong>.'
        },
        {
          title: 'Pegue o Expresso Aeroporto (Linha 13-Jade)',
          desc: 'Compre o bilhete por R$ 5,00 ou encoste seu cartão bancário na catraca. O trem <strong>Expresso Aeroporto</strong> sai de hora em hora direto para a Estação da Luz!'
        },
        {
          title: 'Desembarque na Estação da Luz',
          desc: 'Você chega direto no centro de São Paulo. De lá, pode fazer baldeação gratuita para a Linha 1-Azul ou Linha 4-Amarela.'
        }
      ],
      insiderTip: 'O Expresso Aeroporto é muito mais barato que táxi ou aplicativo (que cobram mais de R$ 90,00). Tem bagageiro para malas e ar condicionado excelente.'
    },
    // Luz -> 25 de Março
    'luz->março': {
      time: '6 a 10 min',
      cost: 'R$ 5,00',
      transfers: 'Nenhuma (ou 1 estação de metrô)',
      steps: [
        {
          title: 'Segredo de Ouro: Desça em São Bento, NÃO na Luz!',
          desc: 'Muita gente acha que deve descer na Luz para ir à 25 de Março, mas a melhor estação é <strong>São Bento (Linha 1-Azul)</strong>.'
        },
        {
          title: 'Embarque na Luz Sentido Jabaquara',
          desc: 'É apenas <strong>1 parada</strong> de metrô (Luz ➔ São Bento). A viagem dura só 90 segundos.'
        },
        {
          title: 'Procure a Saída "Ladeira Porto Geral"',
          desc: 'Ao desembarcar em São Bento, siga as placas até a saída da Ladeira Porto Geral. Ao subir a escada rolante, você já sai de cara com as lojas da 25 de Março!'
        }
      ],
      insiderTip: 'Mantenha bolsas e mochilas viradas para a frente do corpo na 25 de Março. Evite ficar com o celular na mão distraído no meio do calçadão.'
    },
    // Barra Funda -> Allianz
    'barra_funda->allianz': {
      time: '12 min a pé ou 5 min de van/ônibus',
      cost: 'R$ 5,00 (apenas o metrô/trem)',
      transfers: 'Acesso direto a pé',
      steps: [
        {
          title: 'Desembarque em Palmeiras-Barra Funda',
          desc: 'Chegue pela Linha 3-Vermelha do Metrô ou Linhas 7/8 da CPTM.'
        },
        {
          title: 'Siga a Saída Sul (Rua Francisco Matarazzo)',
          desc: 'Saia em direção à Avenida Francisco Matarazzo. Você verá centenas de torcedores e pedestres seguindo a mesma calçada ampla.'
        },
        {
          title: 'Caminhada de 850 metros',
          desc: 'Siga reto pela calçada da Matarazzo passando pelo Shopping Bourbon. A entrada principal do Allianz Parque estará à sua esquerda.'
        }
      ],
      insiderTip: 'Em dias de show ou clássico de futebol, as catracas da Barra Funda ficam cheias na volta. Compre sua passagem de retorno com antecedência ou use aproximação!'
    },
    // Sé -> Liberdade
    'se->liberdade': {
      time: '4 a 6 min',
      cost: 'R$ 5,00',
      transfers: 'Direto na Linha 1-Azul',
      steps: [
        {
          title: 'Na Estação Sé, vá para a Linha 1-Azul',
          desc: 'Desça até a plataforma da Linha 1 e procure a placa <strong>Sentido Jabaquara</strong>.'
        },
        {
          title: 'Apenas 1 estação de viagem',
          desc: 'Embarque no trem e desça na próxima parada: <strong>Estação Japão-Liberdade</strong>.'
        },
        {
          title: 'Saída da Praça da Liberdade',
          desc: 'Suba as escadas da estação e você já estará no meio das lanternas orientais vermelhas, feirinhas gastronômicas e lojas típicas.'
        }
      ],
      insiderTip: 'Aos sábados e domingos a Praça da Liberdade tem a tradicional feirinha de rua com guioza, tempurá e doces a partir das 10h da manhã.'
    },
    // Pinheiros -> Beco do Batman
    'pinheiros->beco': {
      time: '14 min',
      cost: 'R$ 5,00',
      transfers: 'Direto na Linha 4-Amarela',
      steps: [
        {
          title: 'Na Estação Pinheiros, pegue a Linha 4-Amarela',
          desc: 'Pegue o trem <strong>Sentido Luz</strong>.'
        },
        {
          title: 'Desembarque na Estação Fradique Coutinho',
          desc: 'Apenas 1 estação de distância (Pinheiros ➔ Faria Lima ➔ Fradique Coutinho).'
        },
        {
          title: 'Caminhada artística pela Vila Madalena',
          desc: 'Saia pela Rua Fradique Coutinho e caminhe cerca de 10 minutos pelas ruas arborizadas até a Rua Gonçalo Afonso (o famoso Beco do Batman).'
        }
      ],
      insiderTip: 'A Vila Madalena tem ladeiras charmosas com cafés e ateliês. Vá de tênis confortável para caminhar tranquilamente pelas galerias a céu aberto.'
    }
  };

  function calculateAndDisplayRoute(origin, dest) {
    if (!origin || !dest) {
      alert('Por favor, escolha uma estação de origem e um destino!');
      return;
    }

    if (origin === dest) {
      alert('A origem e o destino são iguais! Escolha uma estação diferente.');
      return;
    }

    const key = `${origin}->${dest}`;
    const reverseKey = `${dest}->${origin}`;
    let routeData = routeGraph[key];

    // If reverse exists or generic calculation
    if (!routeData && routeGraph[reverseKey]) {
      const origData = routeGraph[reverseKey];
      routeData = {
        time: origData.time,
        cost: origData.cost,
        transfers: origData.transfers,
        steps: [
          {
            title: `Embarque de retorno (${dest.toUpperCase()})`,
            desc: `Inicie seu retorno pelo trajeto inverso. Olhe sempre para as placas de sinalização suspensas.`
          },
          ...origData.steps.slice(0, 2)
        ],
        insiderTip: origData.insiderTip
      };
    } else if (!routeData) {
      // Intelligent fallback route builder
      routeData = {
        time: '25 a 35 min',
        cost: 'R$ 5,00',
        transfers: '1 baldeação recomendada',
        steps: [
          {
            title: `Embarque na estação de partida`,
            desc: `Encoste seu cartão de débito/crédito na catraca e siga as placas suspensas em direção ao centro da malha (Sé, Luz ou Paraíso).`
          },
          {
            title: `Conexão inteligente no Terminal Central`,
            desc: `Se sua linha for diferente do destino, faça baldeação na estação de cruzamento (ex: Sé para Linhas 1 e 3; República ou Paulista para Linha 4). Lembre-se: não passe por catracas de saída!`
          },
          {
            title: `Desembarque no seu destino`,
            desc: `Ouça o aviso sonoro do trem ("Próxima estação...") e observe os painéis luminosos acima das portas para desembarcar no lado correto.`
          }
        ],
        insiderTip: 'Se bater qualquer dúvida no meio do caminho, nunca tenha vergonha: pergunte para qualquer passageiro ou funcionário uniformizado. O paulistano tem orgulho de ajudar quem visita a cidade!'
      };
    }

    // Render route output
    routeOutputCard.innerHTML = `
      <div class="route-header-strip">
        <div>
          <span class="subheading-tag" style="margin:0 0 0.4rem 0;">Seu Roteiro Descomplicado</span>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; color:#fff;">
            De ${getStationFriendlyName(origin)} ➔ Para ${getStationFriendlyName(dest)}
          </h3>
        </div>
        <div class="route-badges-row">
          <span class="r-badge">⏱️ Tempo: ${routeData.time}</span>
          <span class="r-badge fare">💰 Tarifa: ${routeData.cost}</span>
          <span class="r-badge">🔄 ${routeData.transfers}</span>
        </div>
      </div>

      <div class="route-timeline">
        ${routeData.steps.map(step => `
          <div class="tl-step">
            <h4 class="tl-title">${step.title}</h4>
            <p class="tl-desc">${step.desc}</p>
          </div>
        `).join('')}
      </div>

      <div class="route-insider-tip">
        <span class="tip-emoji">💡</span>
        <div class="tip-text">
          <strong>Dica de Ouro de quem pega todo dia:</strong>
          <p>${routeData.insiderTip}</p>
        </div>
      </div>
    `;

    routeOutputCard.style.display = 'block';
    routeOutputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getStationFriendlyName(val) {
    const names = {
      tiete: 'Rodoviária do Tietê (L1)',
      barra_funda: 'Palmeiras-Barra Funda (L3/CPTM)',
      jabaquara: 'Jabaquara (L1)',
      gru: 'Aeroporto Guarulhos (L13)',
      se: 'Estação Sé (L1/L3)',
      luz: 'Estação da Luz (L1/L4/CPTM)',
      bras: 'Estação Brás (L3/CPTM)',
      republica: 'República (L3/L4)',
      pinheiros: 'Pinheiros (L4/L9)',
      paulista: 'Av. Paulista / MASP',
      consolacao: 'Rua Augusta / Consolação',
      oscar_freire: 'Oscar Freire (L4)',
      março: '25 de Março / São Bento',
      liberdade: 'Bairro da Liberdade (L1)',
      beco: 'Beco do Batman / Vila Madalena',
      ibirapuera: 'Parque Ibirapuera',
      allianz: 'Allianz Parque',
      itaquera: 'Neo Química Arena / Itaquera',
      morumbi: 'Estádio do Morumbi',
      interlagos: 'Autódromo de Interlagos',
      paraiso: 'Paraíso (L1/L2)',
      ana_rosa: 'Ana Rosa (L1/L2)',
      santo_amaro: 'Santo Amaro (L5/L9)',
      vila_madalena: 'Vila Madalena (L2)',
      tatuape: 'Tatuapé (L3/CPTM)'
    };
    return names[val] || val;
  }

  if (calculateRouteBtn && routeOrigin && routeDest) {
    calculateRouteBtn.addEventListener('click', () => {
      calculateAndDisplayRoute(routeOrigin.value, routeDest.value);
    });
  }

  if (swapRouteBtn && routeOrigin && routeDest) {
    swapRouteBtn.addEventListener('click', () => {
      const temp = routeOrigin.value;
      routeOrigin.value = routeDest.value;
      routeDest.value = temp;
      if (routeOrigin.value && routeDest.value) {
        calculateAndDisplayRoute(routeOrigin.value, routeDest.value);
      }
    });
  }

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.getAttribute('data-origin');
      const dest = btn.getAttribute('data-dest');
      if (routeOrigin) routeOrigin.value = orig;
      if (routeDest) routeDest.value = dest;
      calculateAndDisplayRoute(orig, dest);
    });
  });


  // =========================================================================
  // 6. GRANDES TERMINAIS: Skiper 35 (Hover Expand)
  // =========================================================================
  const hubCards = document.querySelectorAll('.skiper35-card');

  hubCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      hubCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });

    card.addEventListener('click', () => {
      hubCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });


  // =========================================================================
  // 7. AS LINHAS: Skiper 90 (Gradient Hover Cards with Mouse Tracking)
  // =========================================================================
  const lineCards = document.querySelectorAll('.skiper90-card');
  const filterTabs = document.querySelectorAll('.filter-tab');

  lineCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-filter');

      lineCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // =========================================================================
  // 8. DICAS DE SOBREVIVÊNCIA: Skiper 23 (Minimal Card Expand Modal)
  // =========================================================================
  const modal = document.getElementById('skiper23Modal');
  const modalTarget = document.getElementById('modalContentTarget');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const guideCards = document.querySelectorAll('.skiper23-card');

  const guideDatabase = {
    pagamento: {
      title: "💳 Como Pagar Sua Passagem Sem Fila e Sem Complicação",
      content: `
        <p>A melhor notícia para quem visita São Paulo: <strong>você não precisa pegar fila de bilheteria</strong> nem comprar bilhete com moedas!</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>1. Aproximação Direta na Catraca (NFC)</h4>
            <p>Se você tem cartão de débito ou crédito (físico ou no celular via Apple Pay / Google Wallet), basta aproximar diretamente no leitor luminoso da catraca. O valor da passagem padrão (R$ 5,00) cai na fatura na hora!</p>
          </div>
          <div class="modal-step-item">
            <h4>2. Bilhete Digital QR Code (Aplicativo TOP)</h4>
            <p>Você pode baixar o app <strong>TOP</strong> ou comprar pelo WhatsApp oficial do TOP. Ele gera um QR Code na tela do seu celular que você encosta no leitor de vidro da catraca.</p>
          </div>
          <div class="modal-step-item">
            <h4>3. Bilhete Único da SPTrans</h4>
            <p>Se você vai morar em SP ou usar ônibus municipais integrados com metrô, vale a pena emitir o Bilhete Único nos postos da SPTrans para ter desconto na baldeação com ônibus.</p>
          </div>
        </div>
        <p><strong>Atenção:</strong> As bilheterias com atendentes humanos ainda existem na maioria das estações, mas muitas fecham após as 20h. Ter o cartão por aproximação no celular é sua maior segurança!</p>
      `
    },
    baldeacao: {
      title: "🔄 O Segredo da Baldeação 100% Gratuita",
      content: `
        <p>Quase todo mundo que vem de fora tem medo de ter que pagar outra passagem para trocar de trem. Aqui está a regra mais importante:</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>Toda baldeação interna é GRATUITA!</h4>
            <p>Você pode entrar na Linha 1-Azul no Tietê, trocar para a Linha 3-Vermelha na Sé, trocar para a Linha 4-Amarela na República e depois pegar a Linha 9-Esmeralda em Pinheiros. <strong>Tudo isso pagando apenas UMA passagem de R$ 5,00!</strong></p>
          </div>
          <div class="modal-step-item">
            <h4>O Único Erro Fatal: Sair pela Catraca de Saída</h4>
            <p>Nunca saia para a rua a menos que as placas digam explicitamente. A troca de trens é feita inteiramente por dentro das passarelas e escadas da estação. Se você passar pela catraca de saída para a rua, terá que pagar outra passagem para reentrar.</p>
          </div>
        </div>
      `
    },
    escada: {
      title: "🪜 A Regra Sagrada da Escada Rolante Paulistana",
      content: `
        <p>Em São Paulo, a escada rolante tem uma lei não-escrita levada muito a sério por todos os cidadãos:</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>👉 Lado Direito: Parado e descansando</h4>
            <p>Se você quiser apenas ficar parado na escada descansando ou segurando sua mala, fique RIGOROSAMENTE encostado do lado direito.</p>
          </div>
          <div class="modal-step-item">
            <h4>👈 Lado Esquerdo: A 'Pista de Corrida'</h4>
            <p>O lado esquerdo é reservado exclusivamente para quem está andando ou correndo para não perder o trem. Se você parar do lado esquerdo, alguém vai te pedir 'com licença' ou te olhar feio!</p>
          </div>
        </div>
        <p>Segure sempre no corrimão e respeite a sua segurança em primeiro lugar.</p>
      `
    },
    pico: {
      title: "⏰ Como Sobreviver com Calma ao Horário de Pico",
      content: `
        <p>São Paulo acorda cedo e dorme tarde. O horário de pico é quando o metrô atinge sua capacidade máxima:</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>Horários Críticos</h4>
            <p>Manhã: <strong>06h30 às 09h00</strong> | Fim de Tarde: <strong>17h00 às 19h30</strong>.</p>
          </div>
          <div class="modal-step-item">
            <h4>Regra de Ouro: Tire a mochila das costas</h4>
            <p>Ao entrar em um vagão cheio, tire a mochila das costas e segure-a na mão ou entre as suas pernas no chão. Isso libera muito espaço e evita que você esbarre nas pessoas.</p>
          </div>
          <div class="modal-step-item">
            <h4>Deixe quem está saindo descer primeiro</h4>
            <p>Fique ao lado das portas, nunca bloqueando o centro da saída. Quando o fluxo de descida terminar, você entra com muito mais tranquilidade.</p>
          </div>
        </div>
      `
    },
    perdidos: {
      title: "🎒 Perdeu Algo no Trem ou Estação? A Central da Sé Te Salva!",
      content: `
        <p>Esqueceu mochila, documento, casaco ou celular no trem? Não se desespere! O Metrô de São Paulo tem uma das centrais de achados e perdidos mais eficientes do mundo:</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>Onde Fica</h4>
            <p>A Central de Achados e Perdidos fica no <strong>mezanino da Estação Sé</strong> (funciona de segunda a sexta, das 7h às 20h).</p>
          </div>
          <div class="modal-step-item">
            <h4>Como Consultar</h4>
            <p>Você pode ligar gratuitamente no <strong>0800 770 7722</strong> ou consultar no site oficial do Metrô informando a linha e o dia da perda.</p>
          </div>
          <div class="modal-step-item">
            <h4>Prazos</h4>
            <p>Os itens ficam guardados por até 60 dias antes de serem doados para instituições de caridade. Documentos oficiais são enviados para os órgãos emissores.</p>
          </div>
        </div>
      `
    },
    acessibilidade: {
      title: "♿ Acessibilidade, Idosos, Gestantes e Carrinhos de Bebê",
      content: `
        <p>O Metrô e a CPTM possuem atendimento preferencial com agentes dedicados prontos para te ajudar:</p>
        <div class="modal-step-list">
          <div class="modal-step-item">
            <h4>Elevadores em Todas as Estações</h4>
            <p>Se você estiver com carrinho de bebê, mobilidade reduzida ou muitas malas, nunca enfrente as escadas rolantes íngremes. Procure as placas com ícone de elevador.</p>
          </div>
          <div class="modal-step-item">
            <h4>Embarque Acompanhado</h4>
            <p>Se você for deficiente visual, cadeirante ou idoso, avise o agente na catraca. Ele acompanhará você pelo elevador até o vagão e avisará a estação de destino para que outro agente te espere na descida!</p>
          </div>
        </div>
      `
    }
  };

  guideCards.forEach(card => {
    card.addEventListener('click', () => {
      const topic = card.getAttribute('data-topic');
      const data = guideDatabase[topic];
      if (data && modal && modalTarget) {
        modalTarget.innerHTML = `
          <div class="modal-content-inner">
            <h3>${data.title}</h3>
            ${data.content}
          </div>
        `;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  // =========================================================================
  // 9. VOZES DOS TRILHOS: Skiper 6 (Hover Members)
  // =========================================================================
  const memberItems = document.querySelectorAll('.skiper6-item');
  const memberPhoto = document.getElementById('memberPhoto');
  const memberTag = document.getElementById('memberTag');
  const memberQuote = document.getElementById('memberQuote');
  const memberTip = document.getElementById('memberTip');

  const membersData = {
    cadu: {
      photo: 'assets/images/agente_ajuda.jpg',
      tag: 'Agente de Atendimento (Sé)',
      quote: '"A gente com colete amarelo não tá aqui só para vigiar catraca. O meu maior orgulho é olhar nos olhos de alguém que tá assustado e falar: \'Calma, pega aquele trem ali que você chega certinho\'. Pode me chamar sempre!"',
      tip: '"Na Estação Sé, nunca tente entrar no vagão de frente empurrando. Dê 3 passos para o lado e espere o desembarque. Você entra com o dobro de espaço e tranquilidade."'
    },
    dora: {
      photo: 'assets/images/se_station.jpg',
      tag: 'Passageira Diária há 34 anos',
      quote: '"Cheguei de Irecê na Bahia em 1989 sem saber ler placa de metrô. Uma moça me pegou pela mão na Sé e me levou até o Brás. Hoje, se vejo alguém com cara de perdido, eu faço questão de ajudar!"',
      tip: '"Filho, na escada rolante, fica à direita. Deixa a esquerda livre que o paulistano tem pressa na alma, mas no fundo todo mundo tem um coração enorme."'
    },
    ju: {
      photo: 'assets/images/pinheiros_station.jpg',
      tag: 'Mãe com carrinho de bebê',
      quote: '"Muita gente me dizia que andar de metrô com bebê em SP era impossível. Mas todas as estações novas têm elevador limpo e os agentes sempre me dão passagem prioritária."',
      tip: '"Evite o horário das 18h se estiver com bebê. Entre 10h e 16h as estações são super tranquilas e dá até para colocar o bebê pra dormir no vagão silencioso da Linha Amarela."'
    },
    benedito: {
      photo: 'assets/images/luz_station.jpg',
      tag: 'Violinista da Estação da Luz',
      quote: '"A Estação da Luz é como uma grande catedral de gente. O som do violino ecoa nos arcos britânicos de ferro. Pare cinco minutos, tome um cafezinho com pão de queijo e respire a cidade."',
      tip: '"A saída para o Museu da Língua Portuguesa e Pinacoteca fica dentro da própria estação. Você não precisa nem sair na chuva para visitar dois dos museus mais lindos do mundo."'
    },
    camila: {
      photo: 'assets/images/city_tram.jpg',
      tag: 'Médica Residente no Hospital das Clínicas',
      quote: '"Faço plantão no HC e o metrô Linha 2-Verde é a minha salvação diária. É a linha mais pontual e segura da América Latina."',
      tip: '"Para quem vai aos hospitais e faculdade de medicina da USP, desça na Estação Clínicas. A saída te deixa direto na calçada do ambulatório."'
    }
  };

  memberItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      memberItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const key = item.getAttribute('data-member');
      const data = membersData[key];
      if (data) {
        if (memberPhoto) memberPhoto.src = data.photo;
        if (memberTag) memberTag.textContent = data.tag;
        if (memberQuote) memberQuote.textContent = data.quote;
        if (memberTip) memberTip.textContent = data.tip;
      }
    });
  });


  // =========================================================================
  // 10. ANÚNCIO SONORO INTERATIVO (Web Audio API Chime Synth)
  // =========================================================================
  const chimeSoundBtn = document.getElementById('chimeSoundBtn');
  const playChimeStationBtn = document.getElementById('playChimeStationBtn');
  const waveVisualizer = document.getElementById('waveVisualizer');

  let audioCtx = null;

  function playMetroChime() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Visual wave effect
      if (waveVisualizer) waveVisualizer.classList.add('active');

      const now = audioCtx.currentTime;

      // Authentic Metro SP two-tone pleasant chime:
      // Note 1: E5 (659 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.28, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.7);

      // Note 2: B4 (493.88 Hz) with slight delay
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(493.88, now + 0.35);
      gain2.gain.setValueAtTime(0, now + 0.35);
      gain2.gain.linearRampToValueAtTime(0.32, now + 0.4);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.35);
      osc2.stop(now + 1.3);

      // Synthesized speech announcement simulation if SpeechSynthesis is supported
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance('Atenção passageiros. Próxima estação: Luz. Transferência gratuita para as linhas 4 Amarela e CPTM. Desembarque pelo lado direito.');
          utterance.lang = 'pt-BR';
          utterance.rate = 0.95;
          utterance.pitch = 1.05;
          speechSynthesis.speak(utterance);

          utterance.onend = () => {
            if (waveVisualizer) waveVisualizer.classList.remove('active');
          };
        }, 850);
      } else {
        setTimeout(() => {
          if (waveVisualizer) waveVisualizer.classList.remove('active');
        }, 1400);
      }

    } catch (e) {
      console.warn('Audio playback not permitted or supported:', e);
      if (waveVisualizer) waveVisualizer.classList.remove('active');
    }
  }

  if (chimeSoundBtn) chimeSoundBtn.addEventListener('click', playMetroChime);
  if (playChimeStationBtn) playChimeStationBtn.addEventListener('click', playMetroChime);


  // =========================================================================
  // 11. ASSISTENTE DE IA: "MALU DOS TRILHOS" (Inteligência & Interação)
  // =========================================================================
  const aiWidgetWrapper = document.getElementById('aiWidgetWrapper');
  const aiSpeechBubble = document.getElementById('aiSpeechBubble');
  const closeBubbleBtn = document.getElementById('closeBubbleBtn');
  const aiFabBtn = document.getElementById('aiFabBtn');
  const aiChatWindow = document.getElementById('aiChatWindow');
  const minimizeChatBtn = document.getElementById('minimizeChatBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const toggleTtsBtn = document.getElementById('toggleTtsBtn');
  const ttsIcon = document.getElementById('ttsIcon');
  const aiChipsBar = document.getElementById('aiChipsBar');
  const aiMessagesFeed = document.getElementById('aiMessagesFeed');
  const aiTypingIndicator = document.getElementById('aiTypingIndicator');
  const aiInputForm = document.getElementById('aiInputForm');
  const aiUserInput = document.getElementById('aiUserInput');
  const aiMicBtn = document.getElementById('aiMicBtn');

  const navAiBtn = document.getElementById('navAiBtn');
  const heroAiBtn = document.getElementById('heroAiBtn');
  const drawerAiBtn = document.getElementById('drawerAiBtn');

  let isTtsActive = false;
  let isListening = false;
  let recognitionInstance = null;

  // Show proactive welcome bubble after 3.5s
  setTimeout(() => {
    if (aiSpeechBubble && !aiChatWindow.classList.contains('open')) {
      aiSpeechBubble.classList.remove('hidden');
    }
  }, 3500);

  if (closeBubbleBtn) {
    closeBubbleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      aiSpeechBubble.classList.add('hidden');
    });
  }

  if (aiSpeechBubble) {
    aiSpeechBubble.addEventListener('click', () => {
      openMaluChat();
    });
  }

  function openMaluChat(initialPrompt = '') {
    if (!aiChatWindow) return;
    aiChatWindow.classList.add('open');
    if (aiSpeechBubble) aiSpeechBubble.classList.add('hidden');
    if (aiUserInput) {
      setTimeout(() => aiUserInput.focus(), 300);
      if (initialPrompt) {
        aiUserInput.value = initialPrompt;
        handleUserMessage(initialPrompt);
      }
    }
  }

  function closeMaluChat() {
    if (!aiChatWindow) return;
    aiChatWindow.classList.remove('open');
  }

  if (aiFabBtn) aiFabBtn.addEventListener('click', () => {
    if (aiChatWindow.classList.contains('open')) {
      closeMaluChat();
    } else {
      openMaluChat();
    }
  });

  if (minimizeChatBtn) minimizeChatBtn.addEventListener('click', closeMaluChat);

  if (navAiBtn) navAiBtn.addEventListener('click', () => openMaluChat());
  if (heroAiBtn) heroAiBtn.addEventListener('click', () => openMaluChat());
  if (drawerAiBtn) drawerAiBtn.addEventListener('click', () => {
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    openMaluChat();
  });

  // Clear chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      if (aiMessagesFeed) {
        aiMessagesFeed.innerHTML = `
          <div class="ai-msg ai-msg-bot">
            <div class="msg-avatar-thumb">
              <img src="assets/images/agente_ajuda.jpg" alt="Malu">
            </div>
            <div class="msg-bubble">
              <p>Histórico limpo! 🧹 Em que mais posso te ajudar agora? Pode me perguntar qualquer estação ou trajeto!</p>
              <span class="msg-time">Agora</span>
            </div>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // ADVANCED AUDIO ENGINE: Web Audio API Chime + Natural TTS & STT
  // =========================================================================
  const speechStatusBar = document.getElementById('aiSpeechStatusBar');
  const speechStatusLabel = document.getElementById('speechStatusLabel');
  const stopSpeechBtn = document.getElementById('stopSpeechBtn');
  const headerCallBtn = document.getElementById('headerCallBtn');
  const chatCallBtn = document.getElementById('chatCallBtn');
  const aiCallOverlay = document.getElementById('aiCallOverlay');
  const callTimer = document.getElementById('callTimer');
  const callStatusLabel = document.getElementById('callStatusLabel');
  const callSubText = document.getElementById('callSubText');
  const callVisualizer = document.getElementById('callVisualizer');
  const callMicToggleBtn = document.getElementById('callMicToggleBtn');
  const callMicIcon = document.getElementById('callMicIcon');
  const callMicLabel = document.getElementById('callMicLabel');
  const callEndBtn = document.getElementById('callEndBtn');
  const callSwitchChatBtn = document.getElementById('callSwitchChatBtn');

  let isTtsActive = true; // Active by default for voice immersion!
  let currentUtterance = null;
  let callTimerInterval = null;
  let callSeconds = 0;
  let isCallActive = false;
  let isCallMicMuted = false;
  let availableVoices = [];

  // Load available speech voices
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    availableVoices = window.speechSynthesis.getVoices();
  }

  loadVoices();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Get best Portuguese (Brazil) voice
  function getBestPtBrVoice() {
    if (!availableVoices.length) loadVoices();
    // Prioritize natural female Brazilian voices
    const ptVoices = availableVoices.filter(v => v.lang && v.lang.toLowerCase().replace('_', '-').startsWith('pt'));
    const naturalPtBr = ptVoices.find(v => 
      v.name.toLowerCase().includes('natural') || 
      v.name.toLowerCase().includes('francisca') || 
      v.name.toLowerCase().includes('maria') || 
      v.name.toLowerCase().includes('google português do brasil') ||
      v.name.toLowerCase().includes('luciana')
    );
    if (naturalPtBr) return naturalPtBr;
    const anyPtBr = ptVoices.find(v => v.lang.toLowerCase().includes('br'));
    if (anyPtBr) return anyPtBr;
    return ptVoices[0] || null;
  }

  // Gentle 2-tone melodic harmonic metro chime before Malu speaks
  function playMaluIntroChime(callback) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      // Tone 1: G5 (784 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(783.99, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Tone 2: C5 (523.25 Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.14);
      gain2.gain.setValueAtTime(0, now + 0.14);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.6);

      setTimeout(() => {
        if (callback) callback();
      }, 350);

    } catch (e) {
      if (callback) callback();
    }
  }

  // Global Malu Speech Player
  function speakMalu(text, onStart, onEnd) {
    if (!('speechSynthesis' in window)) return;
    
    stopMaluSpeech();

    // Clean text: strip HTML tags and unwanted symbols for natural pronunciation
    const cleanText = text
      .replace(/<[^>]+>/g, ' ')
      .replace(/[•\*\#\_\~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    playMaluIntroChime(() => {
      currentUtterance = new SpeechSynthesisUtterance(cleanText);
      currentUtterance.lang = 'pt-BR';
      currentUtterance.rate = 1.02; // natural conversational tempo
      currentUtterance.pitch = 1.08; // friendly, warm feminine pitch

      const voice = getBestPtBrVoice();
      if (voice) currentUtterance.voice = voice;

      currentUtterance.onstart = () => {
        if (speechStatusBar) speechStatusBar.style.display = 'flex';
        if (speechStatusLabel) speechStatusLabel.textContent = 'Malu está falando...';
        if (callVisualizer && isCallActive) callVisualizer.classList.add('active');
        if (onStart) onStart();
      };

      currentUtterance.onend = () => {
        if (speechStatusBar) speechStatusBar.style.display = 'none';
        if (callVisualizer) callVisualizer.classList.remove('active');
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      currentUtterance.onerror = (err) => {
        if (speechStatusBar) speechStatusBar.style.display = 'none';
        if (callVisualizer) callVisualizer.classList.remove('active');
        currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(currentUtterance);
    });
  }

  function stopMaluSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (speechStatusBar) speechStatusBar.style.display = 'none';
    if (callVisualizer) callVisualizer.classList.remove('active');
    document.querySelectorAll('.btn-msg-audio-play').forEach(b => {
      b.classList.remove('playing');
      b.querySelector('span:first-child').textContent = '▶';
    });
    currentUtterance = null;
  }

  if (stopSpeechBtn) {
    stopSpeechBtn.addEventListener('click', stopMaluSpeech);
  }

  // Toggle voice (TTS)
  if (toggleTtsBtn && ttsIcon) {
    toggleTtsBtn.addEventListener('click', () => {
      isTtsActive = !isTtsActive;
      ttsIcon.textContent = isTtsActive ? '🔊' : '🔇';
      toggleTtsBtn.title = isTtsActive ? 'Voz ativada (Malu lê as respostas)' : 'Voz desativada (Mudo)';
      if (isTtsActive) {
        speakMalu('Voz ativada! Sempre que eu responder, vou falar com você.');
      } else {
        stopMaluSpeech();
      }
    });
  }

  // =========================================================================
  // VOICE CALL MODE: "LIGAR PARA A MALU" (Full Call Interface)
  // =========================================================================
  function startMaluCall() {
    isCallActive = true;
    isCallMicMuted = false;
    callSeconds = 0;
    if (aiCallOverlay) aiCallOverlay.classList.add('active');
    if (callStatusLabel) callStatusLabel.textContent = 'Conectando com a Malu...';
    if (callTimer) callTimer.textContent = '00:00';
    if (callMicIcon) callMicIcon.textContent = '🎤';
    if (callMicLabel) callMicLabel.textContent = 'Ouvindo';
    if (callMicToggleBtn) callMicToggleBtn.classList.add('active');

    // Start Timer
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
      const secs = String(callSeconds % 60).padStart(2, '0');
      if (callTimer) callTimer.textContent = `${mins}:${secs}`;
    }, 1000);

    // Initial greeting announcement
    const greeting = 'Alô? Oi! Aqui é a Malu dos Trilhos. Respira fundo, eu tô te ouvindo! Onde você tá ou pra onde você precisa ir agora?';
    if (callSubText) callSubText.textContent = `"${greeting}"`;
    if (callStatusLabel) callStatusLabel.textContent = 'Malu falando...';

    speakMalu(greeting, 
      () => {
        if (callVisualizer) callVisualizer.classList.add('active');
        if (callStatusLabel) callStatusLabel.textContent = 'Malu falando...';
      },
      () => {
        if (callVisualizer) callVisualizer.classList.remove('active');
        if (callStatusLabel) callStatusLabel.textContent = 'Sua vez! Pode falar... 🎤';
        startCallListening();
      }
    );
  }

  function endMaluCall() {
    isCallActive = false;
    stopMaluSpeech();
    if (recognitionInstance && isListening) {
      try { recognitionInstance.stop(); } catch(e){}
    }
    clearInterval(callTimerInterval);
    if (aiCallOverlay) aiCallOverlay.classList.remove('active');
  }

  function startCallListening() {
    if (!isCallActive || isCallMicMuted) return;
    if (!recognitionInstance) return;

    try {
      recognitionInstance.start();
    } catch (e) {
      // recognition might already be running
    }
  }

  if (headerCallBtn) headerCallBtn.addEventListener('click', startMaluCall);
  if (chatCallBtn) chatCallBtn.addEventListener('click', startMaluCall);
  if (callEndBtn) callEndBtn.addEventListener('click', endMaluCall);
  
  if (callSwitchChatBtn) {
    callSwitchChatBtn.addEventListener('click', () => {
      endMaluCall();
      openMaluChat();
    });
  }

  if (callMicToggleBtn) {
    callMicToggleBtn.addEventListener('click', () => {
      isCallMicMuted = !isCallMicMuted;
      if (isCallMicMuted) {
        callMicToggleBtn.classList.remove('active');
        if (callMicIcon) callMicIcon.textContent = '🔇';
        if (callMicLabel) callMicLabel.textContent = 'Mutado';
        if (callStatusLabel) callStatusLabel.textContent = 'Microfone desativado';
        if (recognitionInstance && isListening) {
          try { recognitionInstance.stop(); } catch(e){}
        }
      } else {
        callMicToggleBtn.classList.add('active');
        if (callMicIcon) callMicIcon.textContent = '🎤';
        if (callMicLabel) callMicLabel.textContent = 'Ouvindo';
        if (callStatusLabel) callStatusLabel.textContent = 'Sua vez! Pode falar... 🎤';
        startCallListening();
      }
    });
  }

  // =========================================================================
  // VOICE INPUT (STT: Speech-to-Text Recognition)
  // =========================================================================
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec && aiMicBtn) {
    recognitionInstance = new SpeechRec();
    recognitionInstance.lang = 'pt-BR';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      isListening = true;
      if (aiMicBtn) {
        aiMicBtn.classList.add('listening');
        aiMicBtn.textContent = '🔴';
      }
      if (isCallActive) {
        if (callStatusLabel) callStatusLabel.textContent = 'Ouvindo você... 🎙️';
        if (callVisualizer) callVisualizer.classList.add('active');
      }
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (isCallActive) {
        if (callSubText) callSubText.textContent = `Você disse: "${transcript}"`;
        if (callStatusLabel) callStatusLabel.textContent = 'Malu pensando na resposta...';
        
        // Generate response for call
        setTimeout(() => {
          const answerHtml = generateMaluAnswer(transcript);
          const cleanAnswer = answerHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (callSubText) callSubText.textContent = `Malu: "${cleanAnswer}"`;
          
          // Also append to background chat for history persistence
          appendMessage('user', transcript);
          appendMessage('bot', answerHtml);

          speakMalu(cleanAnswer,
            () => {
              if (callVisualizer) callVisualizer.classList.add('active');
              if (callStatusLabel) callStatusLabel.textContent = 'Malu falando...';
            },
            () => {
              if (callVisualizer) callVisualizer.classList.remove('active');
              if (callStatusLabel) callStatusLabel.textContent = 'Sua vez! Pode falar... 🎤';
              setTimeout(startCallListening, 400);
            }
          );
        }, 600);

      } else {
        if (aiUserInput) {
          aiUserInput.value = transcript;
          handleUserMessage(transcript);
        }
      }
    };

    recognitionInstance.onerror = () => {
      stopListening();
    };

    recognitionInstance.onend = () => {
      stopListening();
    };

    function stopListening() {
      isListening = false;
      if (aiMicBtn) {
        aiMicBtn.classList.remove('listening');
        aiMicBtn.textContent = '🎤';
      }
      if (isCallActive && !currentUtterance) {
        if (callVisualizer) callVisualizer.classList.remove('active');
        if (callStatusLabel) callStatusLabel.textContent = 'Sua vez! Pode falar... 🎤';
      }
    }

    aiMicBtn.addEventListener('click', () => {
      if (isListening) {
        recognitionInstance.stop();
      } else {
        try {
          recognitionInstance.start();
        } catch (e) {
          console.warn('Speech recognition error:', e);
        }
      }
    });
  } else if (aiMicBtn) {
    aiMicBtn.title = 'Reconhecimento de voz não suportado neste navegador';
  }

  // =========================================================================
  // STATION AUDIO GUIDES TRIGGER ("Ouvir áudio-guia da estação")
  // =========================================================================
  const stationAudioScripts = {
    luz: "Bem-vindo à Estação da Luz! Este castelo histórico britânico foi construído em 1901. Se você estiver no piso térreo sob os arcos de ferro, aqui partem as Linhas 7-Rubi e 11-Coral da CPTM. Para acessar o Metrô Linha 1-Azul e Linha 4-Amarela, desça as escadas rolantes até o subterrâneo. O túnel da Linha Amarela é longo, mas tem esteira rolante no chão. Toda baldeação aqui é interna e gratuita. Aproveite o passeio!",
    se: "Atenção passageiros: Estação Sé! Aqui cruzam a Linha 1-Azul e Linha 3-Vermelha. Dica de ouro para não se perder: o trem abre as portas do MEIO para desembarque e das LATERAIS para embarque. A Linha 1 fica no nível inferior e a Linha 3 no nível superior. Se você perdeu algum pertence ou documento, a Central Oficial de Achados e Perdidos do Metrô fica aqui no mezanino.",
    pinheiros: "Estação Pinheiros! Você está em uma das estações mais profundas da América Latina. Conecta a moderna Linha 4-Amarela à Linha 9-Esmeralda. As escadas rolantes são longas, portanto segure sempre no corrimão à direita. Subindo todas as escadas você vai em direção à Paulista e ao Centro; descendo, você pega os trens que margeiam o Rio Pinheiros até a Berrini e o Autódromo.",
    bras: "Estação Brás! O maior entroncamento ferroviário de São Paulo. Se você veio fazer compras nas confecções ou na feirinha da madrugada, siga as placas de saída para a Rua Rangel Pestana ou Rua Miller. Para pegar os trens da CPTM, olhe os painéis suspensos com o número da plataforma. Toda baldeação com o Metrô é gratuita."
  };

  document.querySelectorAll('.btn-hub-audio').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hubKey = btn.getAttribute('data-hub-audio');
      const script = stationAudioScripts[hubKey];
      if (script) {
        speakMalu(script, () => {
          btn.style.borderColor = 'var(--sp-amarela)';
          btn.style.background = 'rgba(245, 166, 35, 0.35)';
        }, () => {
          btn.style.borderColor = '';
          btn.style.background = '';
        });
      }
    });
  });

  // Quick Chips
  const chipButtons = document.querySelectorAll('.ai-chip-btn');
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) {
        if (aiUserInput) aiUserInput.value = q;
        handleUserMessage(q);
      }
    });
  });

  // Submit message
  if (aiInputForm && aiUserInput) {
    aiInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = aiUserInput.value.trim();
      if (!text) return;
      handleUserMessage(text);
      aiUserInput.value = '';
    });
  }

  function handleUserMessage(userText) {
    // 1. Append User Message
    appendMessage('user', userText);

    // 2. Show Typing Indicator
    if (aiTypingIndicator) aiTypingIndicator.style.display = 'flex';
    scrollFeedToBottom();

    // 3. Realistic Thinking Delay (650ms to 950ms)
    setTimeout(() => {
      if (aiTypingIndicator) aiTypingIndicator.style.display = 'none';
      const botResponseHtml = generateMaluAnswer(userText);
      appendMessage('bot', botResponseHtml);
      
      // Auto-read aloud if TTS is active
      if (isTtsActive) {
        speakMalu(botResponseHtml);
      }
      scrollFeedToBottom();
    }, 750);
  }

  function appendMessage(sender, htmlContent) {
    if (!aiMessagesFeed) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-msg ai-msg-${sender}`;

    const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (sender === 'bot') {
      // Clean plain text representation for the audio button
      const plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      
      msgDiv.innerHTML = `
        <div class="msg-avatar-thumb">
          <img src="assets/images/agente_ajuda.jpg" alt="Malu">
        </div>
        <div class="msg-bubble">
          ${htmlContent}
          <div class="msg-audio-play-row">
            <button type="button" class="btn-msg-audio-play">
              <span class="audio-play-icon">▶</span>
              <span>Ouvir com a voz da Malu</span>
            </button>
          </div>
          <span class="msg-time">${nowStr}</span>
        </div>
      `;

      // Attach audio button event
      const playBtn = msgDiv.querySelector('.btn-msg-audio-play');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          if (playBtn.classList.contains('playing')) {
            stopMaluSpeech();
          } else {
            document.querySelectorAll('.btn-msg-audio-play').forEach(b => {
              b.classList.remove('playing');
              b.querySelector('.audio-play-icon').textContent = '▶';
            });
            playBtn.classList.add('playing');
            playBtn.querySelector('.audio-play-icon').textContent = '⏹';
            speakMalu(plainText, 
              () => {}, 
              () => {
                playBtn.classList.remove('playing');
                playBtn.querySelector('.audio-play-icon').textContent = '▶';
              }
            );
          }
        });
      }

    } else {
      msgDiv.innerHTML = `
        <div class="msg-bubble">
          <p>${escapeHtml(htmlContent)}</p>
          <span class="msg-time">${nowStr}</span>
        </div>
      `;
    }

    aiMessagesFeed.appendChild(msgDiv);
    scrollFeedToBottom();
  }

  // Also bind initial welcome message audio button
  document.querySelectorAll('.btn-msg-audio-play').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToSpeak = btn.getAttribute('data-text') || 'Oi, tudo bem? Respira fundo, não precisa ter pressa! Eu sou a Malu, sua parceira nos trilhos de São Paulo.';
      if (btn.classList.contains('playing')) {
        stopMaluSpeech();
      } else {
        btn.classList.add('playing');
        btn.querySelector('.audio-play-icon').textContent = '⏹';
        speakMalu(textToSpeak, 
          () => {}, 
          () => {
            btn.classList.remove('playing');
            btn.querySelector('.audio-play-icon').textContent = '▶';
          }
        );
      }
    });
  });

  function scrollFeedToBottom() {
    if (!aiMessagesFeed) return;
    setTimeout(() => {
      aiMessagesFeed.scrollTop = aiMessagesFeed.scrollHeight;
    }, 50);
  }

  function escapeHtml(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  }


  // =========================================================================
  // MALU'S HUMAN AI CONVERSATIONAL ENGINE
  // =========================================================================
  function generateMaluAnswer(input) {
    const raw = input.toLowerCase();
    const clean = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents

    // 1. Pânico / Medo / Perdido Geral
    if (clean.includes('socorro') || clean.includes('perdi') && clean.includes('estou') || clean.includes('panico') || clean.includes('desespero') || clean.includes('medo') || clean.includes('ajuda')) {
      return `
        <p><strong>Calma, meu bem! Respira fundo comigo. 🧘‍♀️</strong></p>
        <p>Você está seguro(a). Encoste agora mesmo em uma coluna ou parede para sair do fluxo de quem está correndo.</p>
        <div class="ai-route-step">
          <span>👀</span>
          <span><strong>Olhe para cima:</strong> Ache a placa suspensa com a cor da linha (Azul, Verde, Vermelha, Amarela).</span>
        </div>
        <div class="ai-route-step">
          <span>🤝</span>
          <span><strong>Procure o colete amarelo:</strong> Tem agentes do metrô em todas as plataformas. Eles são muito gentis e te levam até o vagão certo!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Me fala qual o nome da estação que você está vendo na parede que eu te explico exatamente o que fazer!
        </div>
      `;
    }

    // 2. Estação Sé
    if (clean.includes('se') && (clean.includes('estacao') || clean.includes('perdido') || clean.includes('como') || clean.includes('baldeacao'))) {
      return `
        <p><strong>Você está na Estação Sé! O coração de São Paulo. ❤️</strong></p>
        <p>Parece assustador pela quantidade de gente, mas tem um segredo que quase ninguém percebe:</p>
        <div class="ai-route-step">
          <span>🚪</span>
          <span><strong>Onde sair do trem:</strong> Desembarque sempre pela <strong>plataforma central (do meio)</strong>! As plataformas das laterais são para quem vai entrar.</span>
        </div>
        <div class="ai-route-step">
          <span>🔄</span>
          <span><strong>Troca de Linhas:</strong> A <span class="ai-line-badge" style="background:#005ca9">Linha 1-Azul</span> fica no andar mais baixo. A <span class="ai-line-badge" style="background:#ee3124">Linha 3-Vermelha</span> fica no andar de cima.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica de ouro:</strong> Toda baldeação aqui é 100% gratuita! Não passe por catraca de saída para a rua.
        </div>
      `;
    }

    // 3. Estação da Luz
    if (clean.includes('luz')) {
      return `
        <p><strong>Estação da Luz: nosso castelo vitoriano! 🏰</strong></p>
        <div class="ai-route-step">
          <span>🚂</span>
          <span><strong>Trens da CPTM (Rubi L7 e Coral L11):</strong> Ficam no piso térreo, sob os grandes arcos de ferro britânicos.</span>
        </div>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>Metrô (Linha 1-Azul e Linha 4-Amarela):</strong> Fica no subterrâneo. O túnel que liga para a Linha Amarela é comprido, mas tem esteira rolante no chão para você descansar as pernas!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica cultural:</strong> A saída para a Pinacoteca e o Museu da Língua Portuguesa fica dentro da própria estação!
        </div>
      `;
    }

    // 4. Estação Brás
    if (clean.includes('bras')) {
      return `
        <p><strong>Estação Brás: o maior entroncamento de trens da cidade! 🛍️</strong></p>
        <div class="ai-route-step">
          <span>👕</span>
          <span><strong>Veio fazer compras?</strong> Siga as placas de saída para a <em>Rua Rangel Pestana</em> ou <em>Rua Miller</em>. Cuidado com bolsas nas costas no calçadão!</span>
        </div>
        <div class="ai-route-step">
          <span>🚆</span>
          <span><strong>Para pegar os trens:</strong> Fique de olho nos painéis eletrônicos suspensos que mostram a plataforma das Linhas 7, 10, 11 e 12.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> No horário de pico das 18h, siga o ritmo dos passos na passarela suspensa, sem tentar correr ou parar no meio.
        </div>
      `;
    }

    // 5. Estação Pinheiros
    if (clean.includes('pinheiros')) {
      return `
        <p><strong>Estação Pinheiros: as maiores escadas rolantes de SP! 🧗</strong></p>
        <p>Ela conecta a moderníssima <span class="ai-line-badge" style="background:#f5a623; color:#111">Linha 4-Amarela</span> com a <span class="ai-line-badge" style="background:#00a88f">Linha 9-Esmeralda</span> da CPTM.</p>
        <div class="ai-route-step">
          <span>⬆️</span>
          <span><strong>Para ir pro Centro / Paulista:</strong> Suba as escadas em direção à Linha 4-Amarela.</span>
        </div>
        <div class="ai-route-step">
          <span>⬇️</span>
          <span><strong>Para ir pra Berrini / Morumbi / Interlagos:</strong> Desça em direção aos trens da Linha 9.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica de saúde:</strong> Se tiver labirintite ou vertigem, segure firme no corrimão à direita nas escadas rolantes profundas.
        </div>
      `;
    }

    // 6. Aeroporto de Guarulhos
    if (clean.includes('aeroporto') || clean.includes('guarulhos') || clean.includes('gru')) {
      return `
        <p><strong>Quer economizar R$ 100 de táxi ou Uber? Vem comigo! ✈️</strong></p>
        <div class="ai-route-step">
          <span>🚄</span>
          <span><strong>Expresso Aeroporto (Linha 13-Jade):</strong> Sai de hora em hora direto da Estação Palmeiras-Barra Funda e Estação da Luz.</span>
        </div>
        <div class="ai-route-step">
          <span>💰</span>
          <span><strong>Preço da passagem:</strong> Apenas <strong>R$ 5,00</strong>! Tem bagageiro amplo para malas e ar condicionado.</span>
        </div>
        <div class="ai-route-step">
          <span>🚌</span>
          <span><strong>Ao chegar na estação:</strong> Tem ônibus gratuito do aeroporto que te leva na porta de cada terminal (1, 2 ou 3).</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Consulte o painel da Luz para ver o próximo horário do Expresso e não precisar pegar o trem parador.
        </div>
      `;
    }

    // 7. Compras 25 de Março
    if (clean.includes('25 de marco') || clean.includes('25 de marco') || clean.includes('compras') && clean.includes('roupa') || clean.includes('mercadao')) {
      return `
        <p><strong>Dica de ouro de quem é paulistano nato: 🛍️</strong></p>
        <p>NÃO desça na Estação da Luz para ir à 25 de Março!</p>
        <div class="ai-route-step">
          <span>📍</span>
          <span><strong>A estação certa é:</strong> <span class="ai-line-badge" style="background:#005ca9">São Bento (Linha 1-Azul)</span>.</span>
        </div>
        <div class="ai-route-step">
          <span>🚪</span>
          <span><strong>Qual saída pegar:</strong> Procure a placa <em>Ladeira Porto Geral</em>. Ao subir a escada rolante, você já sai de frente com a ladeira e todas as lojas!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Aviso amigo:</strong> Guarde o celular no bolso da frente e mantenha a mochila virada para frente no calçadão movimentado.
        </div>
      `;
    }

    // 8. Avenida Paulista / MASP
    if (clean.includes('paulista') || clean.includes('masp') || clean.includes('augusta') || clean.includes('trianon')) {
      return `
        <p><strong>A Avenida Paulista é a cara de São Paulo! 🎨</strong></p>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>A linha principal:</strong> É a <span class="ai-line-badge" style="background:#00823b">Linha 2-Verde</span>.</span>
        </div>
        <div class="ai-route-step">
          <span>🏛️</span>
          <span><strong>Para o MASP:</strong> Desça exatamente na estação <strong>Trianon-MASP</strong>. O museu fica na saída da estação.</span>
        </div>
        <div class="ai-route-step">
          <span>🎉</span>
          <span><strong>Para a Rua Augusta:</strong> Desça na estação <strong>Consolação</strong> (Linha 2) ou <strong>Paulista</strong> (Linha 4).</span>
        </div>
        <div class="ai-tip-box">
          <strong>Domingo na Paulista:</strong> Aos domingos a avenida fecha para carros e vira um parque gigante com música e feirinhas!
        </div>
      `;
    }

    // 9. Pagamento / Catraca / Aproximação
    if (clean.includes('pagar') || clean.includes('catraca') || clean.includes('cartao') || clean.includes('aproximacao') || clean.includes('tarifa') || clean.includes('quanto custa') || clean.includes('bilhete')) {
      return `
        <p><strong>Pagar a passagem em SP é muito fácil hoje em dia! 💳</strong></p>
        <div class="ai-route-step">
          <span>📱</span>
          <span><strong>Aproximação Direta:</strong> Não precisa pegar fila! Aproxime seu cartão de débito/crédito físico ou seu celular (Apple Pay / Google Wallet) direto no visor da catraca.</span>
        </div>
        <div class="ai-route-step">
          <span>💵</span>
          <span><strong>Valor da Tarifa:</strong> R$ 5,00 por viagem.</span>
        </div>
        <div class="ai-route-step">
          <span>🎟️</span>
          <span><strong>Bilhete QR Code TOP:</strong> Se preferir, pode comprar bilhete digital no aplicativo TOP ou nas máquinas de autoatendimento das estações.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Sempre tenha um cartão com aproximação cadastrado no celular para não depender do horário da bilheteria.
        </div>
      `;
    }

    // 10. Baldeação é de graça?
    if (clean.includes('baldeacao') || clean.includes('trocar de trem') || clean.includes('pagar de novo') || clean.includes('troca de linha') || clean.includes('gratuita')) {
      return `
        <p><strong>Pode respirar aliviado(a): a baldeação é 100% GRATUITA! 🔄✨</strong></p>
        <p>Você pode trocar de metrô para trem da CPTM e mudar de linha quantas vezes quiser dentro das estações sem pagar mais nenhum centavo!</p>
        <div class="ai-route-step">
          <span>⚠️</span>
          <span><strong>O único cuidado:</strong> NUNCA passe pela catraca de saída para a rua! As transferências entre linhas são feitas por escadas e passarelas internas.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Exemplo:</strong> Você entra na Linha 1 no Tietê, troca pra Linha 3 na Sé, troca pra Linha 4 na República e desce em Pinheiros pagando apenas uma única passagem de R$ 5,00.
        </div>
      `;
    }

    // 11. Escada rolante
    if (clean.includes('escada') || clean.includes('direita') || clean.includes('esquerda') || clean.includes('rolante')) {
      return `
        <p><strong>A regra sagrada da escada rolante em São Paulo! 🪜</strong></p>
        <div class="ai-route-step">
          <span>👉</span>
          <span><strong>Lado Direito:</strong> Fique aqui se você quiser descansar parado(a) com sua mala ou bolsa.</span>
        </div>
        <div class="ai-route-step">
          <span>🏃</span>
          <span><strong>Lado Esquerdo:</strong> É a 'faixa de ultrapassagem' para quem está correndo para pegar o trem. Nunca fique parado do lado esquerdo!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Se alguém te pedir "com licença", é só dar um passinho para a direita com um sorriso!
        </div>
      `;
    }

    // 12. Achados e Perdidos / Esqueci objeto
    if (clean.includes('perdi') || clean.includes('esqueci') || clean.includes('achados') || clean.includes('bolsa') || clean.includes('mochila') || clean.includes('documento')) {
      return `
        <p><strong>Esqueceu algo no trem ou na estação? Não se desespere! 🎒</strong></p>
        <p>A Central de Achados e Perdidos do Metrô de São Paulo é famosa no mundo inteiro: <strong>mais de 70% dos pertences voltam para os donos</strong>!</p>
        <div class="ai-route-step">
          <span>📍</span>
          <span><strong>Onde fica:</strong> No mezanino da <strong>Estação Sé</strong> (segunda a sexta, das 7h às 20h).</span>
        </div>
        <div class="ai-route-step">
          <span>📞</span>
          <span><strong>Telefone Gratuito:</strong> Ligue para <strong>0800 770 7722</strong> informando a linha e o que você esqueceu.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Prazos:</strong> Objetos ficam guardados por até 60 dias. Se perdeu hoje, o item costuma chegar na Central da Sé no dia útil seguinte!
        </div>
      `;
    }

    // 13. Horário do Metrô / Último trem
    if (clean.includes('horario') || clean.includes('ultimo trem') || clean.includes('fecha') || clean.includes('madrugada') || clean.includes('abre')) {
      return `
        <p><strong>Horários de Funcionamento do Metrô e Trens em SP: ⏰</strong></p>
        <div class="ai-route-step">
          <span>🌅</span>
          <span><strong>Abertura:</strong> Todos os dias às <strong>04h40 da manhã</strong>.</span>
        </div>
        <div class="ai-route-step">
          <span>🌙</span>
          <span><strong>Fechamento:</strong> Domingo a sexta às <strong>00h00 (meia-noite)</strong>.</span>
        </div>
        <div class="ai-route-step">
          <span>🎉</span>
          <span><strong>Aos Sábados:</strong> O Metrô estende a operação até <strong>01h00 da madrugada</strong>!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Chegue à estação pelo menos 10 minutos antes da meia-noite para garantir a entrada antes do bloqueio das catracas.
        </div>
      `;
    }

    // 14. Allianz Parque / Futebol
    if (clean.includes('allianz') || clean.includes('palmeiras') || clean.includes('show')) {
      return `
        <p><strong>Vai ao Allianz Parque curtir jogo ou show? ⚽🎸</strong></p>
        <div class="ai-route-step">
          <span>🚉</span>
          <span><strong>Estação certa:</strong> <span class="ai-line-badge" style="background:#ee3124">Palmeiras-Barra Funda</span> (Linha 3-Vermelha ou Trens 7 e 8).</span>
        </div>
        <div class="ai-route-step">
          <span>🚶</span>
          <span><strong>Caminhada:</strong> Saia pela Saída Sul (Avenida Francisco Matarazzo) e caminhe cerca de 10 minutos até o estádio.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica esperta:</strong> Na volta de shows, as bilheterias da Barra Funda lotam. Já garanta sua passagem de volta ou use cartão por aproximação!
        </div>
      `;
    }

    // 15. Beco do Batman / Vila Madalena
    if (clean.includes('beco') || clean.includes('batman') || clean.includes('vila madalena')) {
      return `
        <p><strong>Visitar o Beco do Batman e os murais de grafite! 🎨</strong></p>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>Melhor estação:</strong> <span class="ai-line-badge" style="background:#f5a623; color:#111">Fradique Coutinho (Linha 4-Amarela)</span> ou <span class="ai-line-badge" style="background:#00823b">Vila Madalena (Linha 2-Verde)</span>.</span>
        </div>
        <div class="ai-route-step">
          <span>🚶</span>
          <span><strong>Caminhada:</strong> Da Fradique Coutinho são 12 minutos a pé por ruazinhas cheias de cafés e ateliês charmosos.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Vá com tênis confortável, pois a Vila Madalena tem ladeirinhas gostosas para caminhar.
        </div>
      `;
    }

    // 16. Liberdade (Bairro Japonês)
    if (clean.includes('liberdade') || clean.includes('japao') || clean.includes('comida japonesa')) {
      return `
        <p><strong>Passear e comer pastel e guioza na Liberdade! 🏮🍣</strong></p>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>Estação:</strong> <span class="ai-line-badge" style="background:#005ca9">Japão-Liberdade (Linha 1-Azul)</span>.</span>
        </div>
        <div class="ai-route-step">
          <span>🏮</span>
          <span><strong>Chegada:</strong> As escadas da estação saem diretamente na Praça da Liberdade, debaixo dos postes torii vermelhos!</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica de fim de semana:</strong> Aos sábados e domingos tem feirinha gastronômica na praça das 9h às 18h. Chegue antes das 12h para evitar filas!
        </div>
      `;
    }

    // 17. Rodoviária do Tietê
    if (clean.includes('tiete') || clean.includes('rodoviaria')) {
      return `
        <p><strong>Terminal Rodoviário do Tietê: a porta de entrada de SP! 🚌</strong></p>
        <div class="ai-route-step">
          <span>📍</span>
          <span><strong>Linha:</strong> Fica na <span class="ai-line-badge" style="background:#005ca9">Linha 1-Azul (Estação Portuguesa-Tietê)</span>.</span>
        </div>
        <div class="ai-route-step">
          <span>🧭</span>
          <span><strong>Para ir ao Centro / Paulista:</strong> Embarque no <strong>Sentido Jabaquara</strong>. Para ir à Paulista, troque na Estação Paraíso para a Linha 2-Verde.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica com malas:</strong> A estação tem passarelas cobertas com elevadores e esteiras que ligam direto ao terminal de ônibus rodoviários.
        </div>
      `;
    }

    // 18. Parque Ibirapuera
    if (clean.includes('ibirapuera') || clean.includes('parque ibirapuera')) {
      return `
        <p><strong>Passeio no Parque Ibirapuera! 🌳🚴</strong></p>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>Opção 1:</strong> Estação <strong>AACD-Servidor</strong> (<span class="ai-line-badge" style="background:#9b3894">Linha 5-Lilás</span>) fica a 12 minutos a pé do portão 5.</span>
        </div>
        <div class="ai-route-step">
          <span>🚇</span>
          <span><strong>Opção 2:</strong> Estação <strong>Brigadeiro</strong> (<span class="ai-line-badge" style="background:#00823b">Linha 2-Verde</span>) + 5 minutinhos de ônibus ou aplicativo descendo a Av. Brigadeiro Luís Antônio.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Leve protetor solar e uma garrafinha d'água. O parque é lindo e enorme!
        </div>
      `;
    }

    // 19. Consulta genérica com duas estações (Ex: de X para Y)
    const stationsList = [
      { key: 'tiete', name: 'Portuguesa-Tietê', line: 'Linha 1-Azul', color: '#005ca9' },
      { key: 'luz', name: 'Estação da Luz', line: 'Linhas 1, 4, 7, 11', color: '#f5a623' },
      { key: 'se', name: 'Estação Sé', line: 'Linhas 1 e 3', color: '#ee3124' },
      { key: 'bras', name: 'Estação Brás', line: 'Linha 3 e Trens CPTM', color: '#ee3124' },
      { key: 'pinheiros', name: 'Estação Pinheiros', line: 'Linhas 4 e 9', color: '#00a88f' },
      { key: 'paulista', name: 'Paulista / Consolação', line: 'Linhas 2 e 4', color: '#00823b' },
      { key: 'barra funda', name: 'Palmeiras-Barra Funda', line: 'Linha 3 e Trens 7/8', color: '#ee3124' },
      { key: 'paraiso', name: 'Estação Paraíso', line: 'Linhas 1 e 2', color: '#00823b' },
      { key: 'republica', name: 'Estação República', line: 'Linhas 3 e 4', color: '#f5a623' },
      { key: 'morumbi', name: 'São Paulo-Morumbi', line: 'Linha 4-Amarela', color: '#f5a623' },
      { key: 'liberdade', name: 'Japão-Liberdade', line: 'Linha 1-Azul', color: '#005ca9' },
      { key: 'tatuape', name: 'Estação Tatuapé', line: 'Linha 3 e Linha 11/12', color: '#ee3124' },
      { key: 'itaquera', name: 'Corinthians-Itaquera', line: 'Linha 3 e Linha 11', color: '#ee3124' }
    ];

    let foundStations = stationsList.filter(s => clean.includes(s.key));
    if (foundStations.length >= 2) {
      const orig = foundStations[0];
      const dest = foundStations[1];
      return `
        <p><strong>Traçado especial para você: de ${orig.name} até ${dest.name}! 🗺️</strong></p>
        <div class="ai-route-step">
          <span>1️⃣</span>
          <span><strong>Embarque:</strong> Na ${orig.name} (${orig.line}).</span>
        </div>
        <div class="ai-route-step">
          <span>2️⃣</span>
          <span><strong>Conexão:</strong> Se as linhas forem diferentes, faça baldeação na estação central de integração (como Sé, Luz ou Paraíso). Lembre-se que a baldeação é de graça!</span>
        </div>
        <div class="ai-route-step">
          <span>3️⃣</span>
          <span><strong>Chegada:</strong> Na ${dest.name}. O trajeto leva aproximadamente 20 a 30 minutos.</span>
        </div>
        <div class="ai-tip-box">
          <strong>Dica da Malu:</strong> Quer ver o passo a passo completo? Use o nosso <em>Simulador de Rota</em> aqui na página que ele te dá cada estação do percurso!
        </div>
      `;
    }

    // 20. Resposta acolhedora padrão (Fallback com inteligência e empatia)
    return `
      <p>Entendi sua dúvida! ☕❤️</p>
      <p>Para eu te dar a rota exata e não deixar você se perder, me fala duas coisinhas:</p>
      <div class="ai-route-step">
        <span>📍</span>
        <span><strong>1. Em qual estação ou bairro você está agora?</strong></span>
      </div>
      <div class="ai-route-step">
        <span>🎯</span>
        <span><strong>2. Para onde você quer ir?</strong></span>
      </div>
      <p>Você também pode me perguntar coisas como: <em>"Como pagar com cartão?"</em>, <em>"Como ir pro Aeroporto por R$ 5?"</em> ou <em>"O que fazer se eu tiver perdido na Sé?"</em>. Estou aqui com você!</p>
    `;
  }

});

