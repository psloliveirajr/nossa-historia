/**
 * ====================================================================
 * EFEITOS DE CORAÇÕES & CONFETES (HEARTS.JS)
 * ====================================================================
 * Cria corações flutuantes no fundo da página e chuvas comemorativas
 * com canvas de alta performance.
 */

class RomanticEffects {
  constructor() {
    this.canvas = document.getElementById('effects-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'effects-canvas';
      document.body.appendChild(this.canvas);
    }
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.floatingHearts = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.startFloatingHeartsLoop();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  // Corações suaves e lentos flutuando no ambiente
  startFloatingHeartsLoop() {
    setInterval(() => {
      if (document.hidden) return;
      if (this.floatingHearts.length < 15) {
        this.floatingHearts.push({
          x: Math.random() * this.width,
          y: this.height + 20,
          size: Math.random() * 14 + 10,
          speedY: Math.random() * 0.8 + 0.4,
          speedX: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.35 + 0.15,
          color: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185', '#e11d48'][Math.floor(Math.random() * 5)],
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    }, 1200);
  }

  // Disparo explosivo de confetes e corações (Ao clicar no botão de celebração)
  burst(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 80) {
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#e11d48', '#fbbf24', '#f59e0b', '#ffffff'];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const isHeart = Math.random() > 0.4;
      
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: isHeart ? Math.random() * 14 + 12 : Math.random() * 8 + 4,
        isHeart: isHeart,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.22,
        drag: 0.96,
        life: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }
  }

  drawHeart(ctx, x, y, size, color, opacity, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Top left curve
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, topCurveHeight / 3,
      0, size
    );
    // Top right curve
    ctx.bezierCurveTo(
      size, topCurveHeight / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Atualizar corações flutuantes de fundo
    for (let i = this.floatingHearts.length - 1; i >= 0; i--) {
      const heart = this.floatingHearts[i];
      heart.y -= heart.speedY;
      heart.x += heart.speedX;
      heart.rotation += heart.rotationSpeed;

      this.drawHeart(this.ctx, heart.x, heart.y, heart.size, heart.color, heart.opacity, heart.rotation);

      if (heart.y < -30) {
        this.floatingHearts.splice(i, 1);
      }
    }

    // 2. Atualizar partículas de explosão
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.isHeart) {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.life, p.rotation);
      } else {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Instância global
window.effects = new RomanticEffects();
