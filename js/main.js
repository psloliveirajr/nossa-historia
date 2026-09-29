/**
 * ====================================================================
 * CONTROLADOR PRINCIPAL DA APLICAÇÃO (MAIN.JS)
 * ====================================================================
 * Inicializa a experiência de Diário de Memórias (Scrollytelling)
 * e mantém o contador de tempo ao vivo atualizado a cada segundo.
 */

class AppController {
  constructor() {
    this.init();
  }

  init() {
    // Inicializa a experiência principal
    window.scrollytelling = new window.ScrollytellingApp();
    
    // Inicia o contador de tempo em tempo real
    this.startLiveTimer();
  }

  startLiveTimer() {
    const update = () => {
      if (!window.STORY_DATA) return;
      const startDate = new Date(window.STORY_DATA.couple.startDate);
      const now = new Date();
      const diffMs = now - startDate;

      if (diffMs < 0) return;

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Atualizar todos os contadores da página
      document.querySelectorAll('.live-days').forEach(el => el.textContent = days);
      document.querySelectorAll('.live-hours').forEach(el => el.textContent = String(hours).padStart(2, '0'));
      document.querySelectorAll('.live-minutes').forEach(el => el.textContent = String(minutes).padStart(2, '0'));
      document.querySelectorAll('.live-seconds').forEach(el => el.textContent = String(seconds).padStart(2, '0'));
    };

    update();
    setInterval(update, 1000);
  }
}

// Inicializar quando o documento carregar
window.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});
