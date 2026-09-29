/**
 * ====================================================================
 * REPRODUTOR DE MÚSICA ROMÂNTICA (AUDIO-PLAYER.JS)
 * ====================================================================
 * Toca a trilha do casal com controle total de volume, mute/desmute,
 * recolhimento automático após 3s de inatividade (exibindo apenas o Play/Pause),
 * suporte a arquivo real (assets/music/musica.mp3) e fallback sintético suave.
 */

class RomanticAudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.audioElement = null;
    this.audioCtx = null;
    this.synthInterval = null;
    this.useSynth = false;

    // Gerenciamento de recolhimento automático (3 segundos de inatividade)
    this.isCollapsed = false;
    this.inactivityTimeout = null;
    this.inactivityDelay = 3000;
    this.isVolumeInteracting = false;

    // Recupera volume salvo do localStorage ou padrão 0.5 (50%)
    const savedVol = localStorage.getItem('romantic_music_volume');
    this.volume = savedVol !== null ? parseFloat(savedVol) : 0.5;
    this.previousVolume = this.volume > 0 ? this.volume : 0.5;

    this.initElements();
    this.initVolume();
    this.initAutoCollapse();
    this.checkAudioSource();
  }

  initElements() {
    this.widget = document.getElementById('music-player-widget');
    this.btn = document.getElementById('music-toggle-btn');
    this.vinylBtn = document.getElementById('music-vinyl-btn');
    this.infoBtn = document.getElementById('music-info-btn');
    this.vinyl = document.getElementById('music-vinyl-disc');
    this.statusText = document.getElementById('music-status-text');

    const handleToggle = (e) => {
      e.stopPropagation();
      this.toggle();
    };

    if (this.btn) {
      this.btn.addEventListener('click', handleToggle);
      this.btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    }

    if (this.vinylBtn) {
      this.vinylBtn.addEventListener('click', handleToggle);
    }

    if (this.infoBtn) {
      this.infoBtn.addEventListener('click', handleToggle);
    }
  }

  initAutoCollapse() {
    if (!this.widget) return;

    // Ao passar o mouse por cima do reprodutor: expande imediatamente e cancela qualquer timer
    this.widget.addEventListener('mouseenter', () => {
      this.clearInactivityTimer();
      this.expand();
    });

    // Enquanto o cursor se move sobre o reprodutor, permanece aberto
    this.widget.addEventListener('mousemove', () => {
      this.clearInactivityTimer();
      if (this.isCollapsed) {
        this.expand();
      }
    });

    // Ao retirar o mouse de cima do reprodutor: recolhe imediatamente!
    this.widget.addEventListener('mouseleave', () => {
      if (!this.isVolumeInteracting) {
        this.clearInactivityTimer();
        this.collapse();
      }
    });

    // Suporte para telas de toque / mobile (recolhe após 3s sem toque, já que em mobile não há mouseleave)
    this.widget.addEventListener('touchstart', () => {
      if (this.isCollapsed) {
        this.expand();
      }
      this.startInactivityTimer(3000);
    }, { passive: true });

    // Evita recolher enquanto o usuário estiver ativamente arrastando o slider de volume
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('mousedown', () => {
        this.isVolumeInteracting = true;
        this.clearInactivityTimer();
      });

      window.addEventListener('mouseup', () => {
        if (this.isVolumeInteracting) {
          this.isVolumeInteracting = false;
          // Se o mouse foi solto fora do widget, recolhe imediatamente
          if (!this.widget.matches(':hover')) {
            this.collapse();
          }
        }
      });

      this.volumeSlider.addEventListener('touchstart', () => {
        this.isVolumeInteracting = true;
        this.clearInactivityTimer();
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (this.isVolumeInteracting) {
          this.isVolumeInteracting = false;
          this.startInactivityTimer(3000);
        }
      });
    }

    // Inicia a página exibindo por 3 segundos para descoberta visual e depois recolhe suavemente
    this.startInactivityTimer(3000);
  }

  expand() {
    this.isCollapsed = false;
    if (this.widget) {
      this.widget.classList.remove('collapsed');
    }
    this.updateTooltips();
  }

  collapse() {
    if (this.isVolumeInteracting) return;
    this.isCollapsed = true;
    if (this.widget) {
      this.widget.classList.add('collapsed');
    }
    this.updateTooltips();
  }

  clearInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  startInactivityTimer(delay = this.inactivityDelay) {
    this.clearInactivityTimer();
    this.inactivityTimeout = setTimeout(() => {
      this.collapse();
    }, delay);
  }

  resetInactivityTimer() {
    this.clearInactivityTimer();
    this.startInactivityTimer();
  }

  updateTooltips() {
    if (!this.btn) return;
    const action = this.isPlaying ? 'Pausar música' : 'Tocar música';
    if (this.isCollapsed) {
      this.btn.setAttribute('title', `${action} (Passe o mouse para abrir controles)`);
      this.btn.setAttribute('aria-label', action);
    } else {
      this.btn.setAttribute('title', action);
      this.btn.setAttribute('aria-label', action);
    }
  }

  initVolume() {
    this.volumeBtn = document.getElementById('music-volume-btn');
    this.volumeSlider = document.getElementById('music-volume-slider');
    this.volumeIcon = document.getElementById('volume-icon');
    this.volumeControl = document.querySelector('.music-volume-control');

    if (this.volumeControl) {
      // Impede que cliques na área de volume disparem o toggle de play/pause
      this.volumeControl.addEventListener('click', (e) => e.stopPropagation());
    }

    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
      this.updateSliderTrack(this.volume);

      this.volumeSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        const val = parseFloat(e.target.value);
        this.setVolume(val);
        if (!this.widget || !this.widget.matches(':hover')) {
          this.startInactivityTimer(3000);
        } else {
          this.clearInactivityTimer();
        }
      });
    }

    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
        if (!this.widget || !this.widget.matches(':hover')) {
          this.startInactivityTimer(3000);
        } else {
          this.clearInactivityTimer();
        }
      });
    }

    this.updateVolumeIcon(this.volume);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.volume > 0) {
      this.previousVolume = this.volume;
    }

    localStorage.setItem('romantic_music_volume', this.volume.toString());

    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }

    if (this.volumeSlider && parseFloat(this.volumeSlider.value) !== this.volume) {
      this.volumeSlider.value = this.volume;
    }

    this.updateSliderTrack(this.volume);
    this.updateVolumeIcon(this.volume);
  }

  toggleMute() {
    if (this.volume > 0) {
      this.previousVolume = this.volume;
      this.setVolume(0);
    } else {
      const restored = this.previousVolume > 0 ? this.previousVolume : 0.5;
      this.setVolume(restored);
    }
  }

  updateSliderTrack(val) {
    if (!this.volumeSlider) return;
    const pct = Math.round(val * 100);
    this.volumeSlider.style.background = `linear-gradient(to right, #f43f5e 0%, #f43f5e ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
    this.volumeSlider.setAttribute('title', `Volume: ${pct}%`);
  }

  updateVolumeIcon(val) {
    if (!this.volumeIcon) return;
    if (val === 0) {
      // Ícone Mudo (alto-falante com X)
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
      if (this.volumeBtn) this.volumeBtn.setAttribute('title', 'Desmutar som');
    } else if (val < 0.5) {
      // Volume baixo (1 onda sonora)
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
      if (this.volumeBtn) this.volumeBtn.setAttribute('title', 'Silenciar som');
    } else {
      // Volume normal/alto (2 ondas sonoras)
      this.volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      `;
      if (this.volumeBtn) this.volumeBtn.setAttribute('title', 'Silenciar som');
    }
  }

  checkAudioSource() {
    this.audioElement = new Audio('assets/music/musica.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;

    this.audioElement.addEventListener('error', () => {
      // Caso não encontre arquivo local, usaremos a melodia ambiente relaxante integrada
      this.useSynth = true;
    });

    this.audioElement.addEventListener('canplaythrough', () => {
      this.useSynth = false;
    });
  }

  toggle() {
    this.expand();
    if (!this.widget || !this.widget.matches(':hover')) {
      this.startInactivityTimer(3000);
    } else {
      this.clearInactivityTimer();
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    if (this.widget) this.widget.classList.add('playing');
    if (this.btn) {
      this.btn.classList.add('playing');
    }
    if (this.statusText) this.statusText.textContent = "Tocando • Sotam";
    this.updateTooltips();

    // Disparar pequenos corações ao ligar a música
    if (window.effects && this.btn) {
      const rect = this.btn.getBoundingClientRect();
      window.effects.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
    }

    if (!this.useSynth && this.audioElement) {
      this.audioElement.volume = this.volume;
      const promise = this.audioElement.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Se bloqueado pelo browser ou ausente, usa sintetizador ambiente
          this.useSynth = true;
          this.startRomanticSynth();
        });
      }
    } else {
      this.startRomanticSynth();
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.widget) this.widget.classList.remove('playing');
    if (this.btn) {
      this.btn.classList.remove('playing');
    }
    if (this.statusText) this.statusText.textContent = "Clique para ouvir";
    this.updateTooltips();

    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopRomanticSynth();
  }

  // Melodia sintetizada acústica suave estilo caixinha de música/piano (Web Audio API)
  startRomanticSynth() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Notas da escala pentatônica maior romântica (Dó, Ré, Mi, Sol, Lá, Si)
      const notes = [
        261.63, 329.63, 392.00, 493.88, // C, E, G, B
        523.25, 587.33, 659.25, 783.99  // C5, D5, E5, G5
      ];
      
      let step = 0;
      const playNote = () => {
        if (!this.isPlaying) return;
        const freq = notes[step % notes.length];
        step = (step + Math.floor(Math.random() * 3 + 1)) % notes.length;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const targetGain = 0.09 * this.volume;
        gain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), this.audioCtx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 2.5);
      };

      playNote();
      this.synthInterval = setInterval(playNote, 950);
    } catch (e) {
      console.warn("Áudio não disponível no momento:", e);
    }
  }

  stopRomanticSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

// Inicializar quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  window.romanticPlayer = new RomanticAudioPlayer();
});
