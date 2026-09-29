/**
 * ====================================================================
 * GERENCIADOR DO DIÁRIO SCROLLYTELLING (SCROLLYTELLING.JS)
 * ====================================================================
 * Renderiza a narrativa vertical contínua com layout editorial,
 * linha do tempo, galeria polaroid com zoom e carta de declaração
 * com envelope e lacre de cera interativo.
 */

class ScrollytellingApp {
  constructor() {
    this.data = window.STORY_DATA;
    this.container = document.getElementById('scrolly-app');

    if (this.container && this.data) {
      this.render();
      this.initScrollProgress();
    }
  }

  initScrollProgress() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      const progressBar = document.getElementById('reading-progress');
      if (progressBar) progressBar.style.width = scrolled + '%';
    });
  }

  renderIcon(icon, extraClass = '') {
    if (!icon) return `<span class="icon-emoji ${extraClass}">✨</span>`;
    
    // Se já for um emoji (ex: 💬, ❤️, 🎙️, 😂, ✈️, 🎬, ☀️, etc.)
    const isEmoji = /\p{Extended_Pictographic}/u.test(icon);
    if (isEmoji) {
      return `<span class="icon-emoji ${extraClass}">${icon}</span>`;
    }

    const key = String(icon).trim().toLowerCase();
    
    // Dicionário de SVGs vetoriais de alta precisão (Lucide 24x24, stroke 2)
    const svgIcons = {
      'plane': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
      'airplane': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
      'film': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>`,
      'movie': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>`,
      'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
      'book-heart': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/><path d="M16 8c-1.5-1.5-3.5 0-3.5 1.5 0 1.5 2 3.5 3.5 4.5 1.5-1 3.5-3 3.5-4.5 0-1.5-2-3-3.5-1.5Z"/></svg>`,
      'book': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/></svg>`,
      'instagram': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
      'message': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
      'message-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
      'chat': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
      'sparkles': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
      'sparkle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
      'heart': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      'camera': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
      'music': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
      'coffee': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`,
      'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
      'gift': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
      'home': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
      'calendar': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
      'star': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      'compass': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon ${extraClass}"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    };

    if (svgIcons[key]) {
      return svgIcons[key];
    }

    // Fallback: tag Lucide caso carregado externamente ou ícone romântico padrão
    return `<i data-lucide="${key}" class="lucide-icon ${extraClass}"><span class="icon-emoji">✨</span></i>`;
  }

  render() {
    const d = this.data;
    this.container.innerHTML = `
      <div class="scrolly-container">
        
        <!-- ================= HERO SECTION ================= -->
        <header class="scrolly-hero">
          <span class="scrolly-badge">${d.cover.badge}</span>
          <h1 class="scrolly-title">${d.couple.title}</h1>
          <div class="scrolly-subtitle">${d.couple.partner1} & ${d.couple.partner2}</div>

          <!-- Espaço de Foto de Destaque da Capa -->
          ${d.cover.image ? `
            <div class="hero-photo-container">
              <div class="hero-photo-card" onclick="window.scrollytelling.openModal('${d.cover.image}', '${(d.cover.imageCaption || (d.couple.partner1 + ' & ' + d.couple.partner2)).replace(/'/g, "\\'")}')" title="Clique para ampliar a foto">
                <div class="hero-photo-tape"></div>
                <div class="hero-photo-inner">
                  <img src="${d.cover.image}" alt="${d.cover.imageCaption || 'Foto da capa'}" class="hero-photo-img" />
                  <div class="hero-photo-overlay">
                    <span class="hero-photo-zoom-tag">🔍 Clique para ampliar</span>
                  </div>
                </div>
                <div class="hero-photo-caption">
                  <span class="hero-photo-heart">❤️</span>
                  <span>${(d.cover.imageCaption || (d.couple.partner1 + ' & ' + d.couple.partner2)).replace(/^[\s❤️💖💕]+|[\s❤️💖💕]+$/g, '').trim()}</span>
                  <span class="hero-photo-heart">❤️</span>
                </div>
              </div>
            </div>
          ` : ''}

          <p class="scrolly-quote"><span class="quote-music-note">♪</span> “${d.cover.quote}” <span class="quote-music-note">♪</span></p>
          
          <div class="scroll-indicator">
            <span>${d.cover.scrollHint || 'Role para viver nossa história'}</span>
            <span>↓</span>
          </div>
        </header>

        <!-- ================= CONTADOR EM TEMPO REAL ================= -->
        <section class="scrolly-chapter text-center">
          <div class="chapter-heading">
            <span class="chapter-number-pill">Tempo Juntos</span>
            <h2 class="chapter-main-title">Cada Segundo Conta</h2>
            <p class="chapter-sub-title">Desde o dia em que dissemos 'sim' para a nossa história:</p>
          </div>

          <div class="time-counter-grid max-w-xl mx-auto" id="scrolly-live-timer" style="max-width: 580px; margin: 0 auto;">
            <div class="counter-box">
              <div class="counter-num live-days">0</div>
              <div class="counter-unit">Dias</div>
            </div>
            <div class="counter-box">
              <div class="counter-num live-hours">00</div>
              <div class="counter-unit">Horas</div>
            </div>
            <div class="counter-box">
              <div class="counter-num live-minutes">00</div>
              <div class="counter-unit">Minutos</div>
            </div>
            <div class="counter-box">
              <div class="counter-num live-seconds">00</div>
              <div class="counter-unit">Segundos</div>
            </div>
          </div>

          <!-- Estatísticas Reais do Casal -->
          ${d.stats ? `
            <div class="mt-8">
              <div class="text-xs uppercase tracking-widest text-rose-600 font-bold mb-3">Nossos Primeiros 2 Meses em Números</div>
              <div class="couple-stats-grid">
                ${d.stats.map(s => `
                  <div class="stat-item-card">
                    <div class="stat-icon">${s.icon}</div>
                    <div class="stat-number">${s.value}</div>
                    <div class="stat-label">${s.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        <!-- ================= CAPÍTULO 1: O PRÓLOGO ================= -->
        <section class="scrolly-chapter">
          <div class="chapter-heading">
            <span class="chapter-number-pill">${d.prologue.chapterNumber}</span>
            <h2 class="chapter-main-title">${d.prologue.title}</h2>
            <p class="chapter-sub-title">${d.prologue.subtitle}</p>
          </div>

          <div class="prologue-editorial-card">
            <div class="prologue-text-side">
              <p>${d.prologue.text1}</p>
              <p>${d.prologue.text2}</p>
              ${d.prologue.text3 ? `<p>${d.prologue.text3}</p>` : ''}
              <div class="prologue-callout">${d.prologue.highlight}</div>
            </div>
            <div class="prologue-image-side">
              <div class="polaroid-frame mb-4" style="transform: rotate(-2deg);" onclick="window.scrollytelling.openModal('${d.prologue.image}', '${(d.prologue.imageCaption || '').replace(/'/g, "\\'")}')" title="Clique para ampliar">
                <div class="washi-tape"></div>
                <div class="polaroid-img-wrapper" style="height: 220px;">
                  <img src="${d.prologue.image}" alt="${d.prologue.imageCaption}" />
                </div>
                <div class="polaroid-caption">${d.prologue.imageCaption}</div>
              </div>
            </div>
          </div>

          <!-- Recriação das Primeiras Mensagens Reais do WhatsApp -->
          ${d.prologue.firstMessages ? `
            <div class="mt-8">
              <div class="text-center mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-3 py-1 rounded-full">
                  📱 O Primeiro 'Oi' no WhatsApp (08/05/2026)
                </span>
              </div>
              <div class="chat-conversation-wrapper">
                ${d.prologue.firstMessages.map(msg => `
                  <div class="chat-bubble ${msg.sender === 'clara' ? 'from-clara' : 'from-paulo'}">
                    <div class="chat-sender-name">${msg.sender === 'clara' ? '🥰 Clara 🥰' : 'Paulo Sergio'}</div>
                    <div class="chat-text">${msg.text}</div>
                    <div class="chat-meta">
                      <span>${msg.time}</span>
                      <span class="chat-ticks">✓✓</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </section>

        <!-- ================= CAPÍTULO 2: LINHA DO TEMPO ================= -->
        <section class="scrolly-chapter">
          <div class="chapter-heading">
            <span class="chapter-number-pill">${d.timeline.chapterNumber}</span>
            <h2 class="chapter-main-title">${d.timeline.title}</h2>
            <p class="chapter-sub-title">${d.timeline.subtitle}</p>
          </div>

          <div class="vertical-timeline">
            ${d.timeline.milestones.map((m, i) => `
              <div class="timeline-row">
                <div class="timeline-dot" title="${m.title}">
                  ${m.icon ? `<span class="timeline-dot-icon">${this.renderIcon(m.icon)}</span>` : ''}
                </div>
                <div class="timeline-content-box">
                  <div class="timeline-tag">
                    ${m.icon ? `<span class="timeline-tag-icon">${this.renderIcon(m.icon)}</span>` : ''}
                    <span>${m.date}</span>
                  </div>
                  <h3 class="timeline-title">${m.title}</h3>
                  <p class="timeline-desc">${m.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- ================= CAPÍTULO 3: MEMÓRIAS POLAROID ================= -->
        <section class="scrolly-chapter">
          <div class="chapter-heading">
            <span class="chapter-number-pill">${d.memories.chapterNumber}</span>
            <h2 class="chapter-main-title">${d.memories.title}</h2>
            <p class="chapter-sub-title">${d.memories.subtitle}</p>
          </div>

          <div class="polaroids-grid">
            ${d.memories.photos.map((p) => `
              <div class="polaroid-frame" style="transform: rotate(${p.rotation});" onclick="window.scrollytelling.openModal('${p.url}', '${(p.caption || '').replace(/'/g, "\\'")}')" title="Clique para ver a foto">
                <div class="washi-tape"></div>
                <div class="polaroid-img-wrapper">
                  <img src="${p.url}" alt="${p.caption}" />
                </div>
                <div class="polaroid-caption">${p.caption}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- ================= CAPÍTULO 4: O FUTURO / PÁGINAS EM BRANCO ================= -->
        <section class="scrolly-chapter">
          <div class="chapter-heading">
            <span class="chapter-number-pill">${d.future.chapterNumber}</span>
            <h2 class="chapter-main-title">${d.future.title}</h2>
            <p class="chapter-sub-title">${d.future.subtitle}</p>
          </div>

          <p class="text-center max-w-xl mx-auto text-stone-600 mb-8" style="max-width: 600px; margin: 0 auto 30px auto;">
            ${d.future.intro}
          </p>

          <div class="future-dreams-grid">
            ${d.future.dreams.map(dream => `
              <div class="dream-card">
                <div class="dream-icon-bubble">
                  ${this.renderIcon(dream.icon || 'sparkles')}
                </div>
                <h4 class="dream-title">${dream.title}</h4>
                <p class="dream-desc">${dream.desc}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- ================= O GRAN FINALE: CARTÃO DE AMOR INTERATIVO ================= -->
        <section class="scrolly-chapter card-finale-section">
          <div class="chapter-heading">
            <span class="chapter-number-pill">${d.finale.chapterNumber}</span>
            <h2 class="chapter-main-title">${d.finale.title}</h2>
            <p class="chapter-sub-title">${d.finale.subtitle || 'Um cartão especial aberto do fundo do meu coração'}</p>
          </div>

          <!-- Cena 3D do Cartão -->
          <div class="card-scene-wrapper">
            <div id="greeting-card-3d" class="greeting-card-3d">
              
              <!-- PARTE MÓVEL: A CAPA (ABRE EM 3D) -->
              <div class="card-cover-flap" onclick="window.scrollytelling.toggleCard(event)" title="Clique para abrir ou fechar o cartão">
                
                <!-- FACE FRONTAL EXTERNA: A CAPA A6 COM A ARTE PERSONALIZADA -->
                <div class="card-cover-face card-cover-front">
                  <div class="card-a6-art-container">
                    <img src="${d.finale.cardCoverImage || 'assets/images/card_cover_a6.jpg'}" alt="Capa A6 do Cartão - Paulo & Maria Clara" class="card-cover-a6-img" />
                    
                    <!-- Selo de Abrir com Pulso -->
                    <div class="card-open-prompt">
                      <span class="open-seal-icon">💌</span>
                      <span class="open-seal-text">Toque para abrir</span>
                      <span class="open-seal-sparkle">✨</span>
                    </div>
                  </div>
                </div>

                <!-- FACE INTERNA ESQUERDA: VERSO DA CAPA (VISÍVEL QUANDO ABERTO) -->
                <div class="card-cover-face card-cover-inside">
                  <div class="inside-left-card">
                    <div class="inside-watermark-heart">❦</div>
                    
                    <div class="inside-postmark-stamp">
                      <span class="postmark-circle">
                        <span class="postmark-date">13.JUL.2026</span>
                        <span class="postmark-text">AMOR ETERNO</span>
                      </span>
                    </div>

                    <div class="inside-romantic-quote">
                      <div class="quote-symbol">“</div>
                      <p class="quote-body">
                        Você me ama muito ou pouco?
                      </p>
                      <div class="quote-author-sign">— Paulinho ❤️</div>
                    </div>

                    <div class="inside-left-bottom">
                      <button type="button" class="btn-card-close" onclick="event.stopPropagation(); window.scrollytelling.closeCard(event)">
                        <span>↺</span> Fechar cartão
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- BASE DO CARTÃO: PARTE INTERNA DIREITA (A CARTA ESCRITA) -->
              <div class="card-base-inside">
                <div class="card-letter-content">
                  
                  <!-- Destaque romântico exibido no celular -->
                  <div class="mobile-inside-decor">
                    <div class="mobile-stamp-pill">
                      <span>💌 13.JUL.2026 • AMOR ETERNO</span>
                    </div>
                    <p class="mobile-quote-text">
                      “Você me ama muito ou pouco?”
                      <span class="mobile-quote-sign">— Paulinho ❤️</span>
                    </p>
                  </div>

                  <div class="stationery-stamp-header">
                    <div class="stationery-date-tag">Para Sempre</div>
                    <div class="stationery-stamp-mini">💖</div>
                  </div>

                  <h3 class="letter-salutation">${d.finale.salutation || 'Minha querida Maria Clara,'}</h3>

                  <div class="letter-paragraphs">
                    ${d.finale.letterText.map(para => `<p>${para}</p>`).join('')}
                  </div>

                  <div class="letter-signature-box">
                    <span class="letter-closing-phrase">${d.finale.closing || 'Com todo o meu amor e carinho,'}</span>
                    <div class="letter-sign">${d.finale.signature}</div>
                  </div>

                  <div class="card-actions-wrapper">
                    <button class="btn-celebrate" onclick="event.stopPropagation(); window.scrollytelling.celebrate(this)">
                      <span>💖</span> ${d.finale.buttonText}
                    </button>
                    <button type="button" class="btn-card-close-subtle" onclick="event.stopPropagation(); window.scrollytelling.closeCard(event)">
                      <span>↺</span> Fechar cartão
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (_) {}
    }
  }

  toggleCard(event) {
    if (event) event.stopPropagation();
    const card = document.getElementById('greeting-card-3d');
    if (!card) return;

    if (card.classList.contains('is-open')) {
      this.closeCard(event);
    } else {
      this.openCard(event);
    }
  }

  openCard(event) {
    if (event) event.stopPropagation();
    const card = document.getElementById('greeting-card-3d');
    if (!card) return;

    if (window.effects) {
      const rect = card.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      window.effects.burst(originX, originY, 45);
    }

    card.classList.add('is-open');

    // Em telas menores, ajusta a visibilidade
    if (window.innerWidth < 860) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);
    }
  }

  closeCard(event) {
    if (event) event.stopPropagation();
    const card = document.getElementById('greeting-card-3d');
    if (card) {
      card.classList.remove('is-open');
    }
  }

  openLetter(envelopeCard) {
    this.openCard();
  }

  openModal(imageUrl, caption) {
    const modal = document.getElementById('photo-modal');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (modal && img && cap) {
      img.src = imageUrl;
      // Interpreta tags HTML (como <br>) e remove quebras soltas no início ou final
      const cleanCaption = (caption || '')
        .replace(/^(<br\s*\/?>|\s)+|(<br\s*\/?>|\s)+$/gi, '')
        .trim();
      cap.innerHTML = cleanCaption;
      modal.classList.remove('hidden');
    }
  }

  closeModal() {
    const modal = document.getElementById('photo-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  celebrate(btn) {
    if (window.effects) {
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      window.effects.burst(originX, originY, 120);
      setTimeout(() => window.effects.burst(originX - 180, originY - 50, 80), 250);
      setTimeout(() => window.effects.burst(originX + 180, originY - 50, 80), 500);
    }
  }
}

window.ScrollytellingApp = ScrollytellingApp;
