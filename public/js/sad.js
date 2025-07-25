// sad vibes - word rain journal

class SadStuff {
  static show() {
    const place = document.getElementById('playground');
    place.innerHTML = '';
    
    this.makeRainThing();
    this.showResetBtn();
  }

  static makeRainThing() {
    const place = document.getElementById('playground');
    
    // blue sad bg
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      overflow: hidden; z-index: 999;
    `;
    
    // rain canvas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; pointer-events: none; z-index: 2;';
    
    // journal bit
    const journalThing = document.createElement('div');
    journalThing.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 80%; max-width: 600px; z-index: 1;
    `;
    
    // title
    const title = document.createElement('h1');
    title.textContent = 'rain journal';
    title.style.cssText = `
      font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;
      background: linear-gradient(135deg, #e3f2fd, #bbdefb);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; text-align: center; font-family: Arial;
    `;
    
    // subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'type ur feelings and watch them fall like rain...';
    subtitle.style.cssText = `
      color: rgba(227, 242, 253, 0.8); font-size: 1.2rem; margin-bottom: 2rem;
      text-align: center; font-family: Arial; font-weight: 300;
    `;
    
    // input box
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'what makes u sad today?';
    textarea.style.cssText = `
      width: 100%; height: 120px; background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px); border-radius: 20px; padding: 20px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #333; font-family: Arial; font-size: 16px; resize: none;
      box-sizing: border-box; line-height: 1.5;
    `;
    
    // floating sad particles
    this.makeSadParticles(container);
    
    journalThing.appendChild(title);
    journalThing.appendChild(subtitle);
    journalThing.appendChild(textarea);
    container.appendChild(canvas);
    container.appendChild(journalThing);
    
    this.rainWords = [];
    this.ctx = canvas.getContext('2d');
    
    // when user types stuff
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const txt = textarea.value.trim();
        if (txt) {
          this.makeWordsRain(txt);
          textarea.value = '';
        }
      }
    });
    
    place.appendChild(container);
    this.startRainLoop();
  }

  static makeSadParticles(container) {
    const sadEmojis = ['😢', '💧', '☔', '🌧️', '😭', '💙', '🌀'];
    
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.textContent = sadEmojis[Math.floor(Math.random() * sadEmojis.length)];
      particle.style.cssText = `
        position: absolute; font-size: ${Math.random() * 20 + 15}px;
        left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        animation: sadFloat ${Math.random() * 15 + 10}s infinite linear;
        pointer-events: none; opacity: ${Math.random() * 0.6 + 0.3};
      `;
      container.appendChild(particle);
    }
    
    if (!document.getElementById('sad-particles-styles')) {
      const styles = document.createElement('style');
      styles.id = 'sad-particles-styles';
      styles.textContent = `
        @keyframes sadFloat {
          0% { transform: translateY(100vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(180deg) scale(1.1); opacity: 0; }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  static makeWordsRain(txt) {
    const words = txt.split(' ').filter(w => w.length > 0);
    
    words.forEach((word, i) => {
      setTimeout(() => {
        this.rainWords.push({
          txt: word,
          x: Math.random() * (window.innerWidth - 100) + 50,
          y: -30,
          speed: Math.random() * 1.5 + 0.5,
          opacity: 1,
          size: Math.random() * 6 + 14
        });
      }, i * 300);
    });
  }

  static startRainLoop() {
    const animate = () => {
      // fade bg
      this.ctx.fillStyle = 'rgba(26, 35, 126, 0.1)';
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      // draw falling words
      this.rainWords.forEach((word, i) => {
        word.y += word.speed;
        word.opacity -= 0.002;
        
        if (word.y > window.innerHeight + 50 || word.opacity <= 0) {
          this.rainWords.splice(i, 1);
        } else {
          this.ctx.fillStyle = `rgba(227, 242, 253, ${word.opacity})`;
          this.ctx.font = `${word.size}px Arial`;
          this.ctx.fillText(word.txt, word.x, word.y);
        }
      });
      
      requestAnimationFrame(animate);
    };
    animate();
  }

  static showResetBtn() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

window.SadStuff = SadStuff;
