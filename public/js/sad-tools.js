
class SadTools {
  static show() {
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
    
    // go directly to rain journal
    this.createRainJournal();
    this.showResetButton();
  }

  static createRainJournal() {
    const playground = document.getElementById('playground');
    
    // create main container
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      overflow: hidden;
      z-index: 999;
    `;
    
    // create canvas for rain effect
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 2;
    `;
    
    // create journal interface
    const journalInterface = document.createElement('div');
    journalInterface.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 600px;
      z-index: 1;
    `;
    
    // title
    const title = document.createElement('h2');
    title.textContent = 'rain journal';
    title.style.cssText = `
      color: #e8eaf6;
      font-size: 2rem;
      text-align: center;
      margin-bottom: 1rem;
      font-family: 'Poppins', Arial, sans-serif;
    `;
    
    // textarea
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'pour your heart out... then let it rain';
    textarea.style.cssText = `
      width: 100%;
      height: 300px;
      background: rgba(255,255,255,0.9);
      border: none;
      border-radius: 8px;
      padding: 1.5rem;
      font-size: 1.1rem;
      line-height: 1.6;
      resize: none;
      outline: none;
      font-family: Georgia, serif;
      box-sizing: border-box;
    `;
    
    // load saved content
    textarea.value = localStorage.getItem('sadJournal') || '';
    
    // auto-save
    textarea.addEventListener('input', () => {
      localStorage.setItem('sadJournal', textarea.value);
    });
    
    // rain button
    const rainButton = document.createElement('button');
    rainButton.textContent = '🌧️ make it rain';
    rainButton.style.cssText = `
      display: block;
      margin: 1rem auto;
      padding: 12px 24px;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 1.1rem;
      cursor: pointer;
      font-family: 'Poppins', Arial, sans-serif;
      transition: all 0.3s ease;
    `;
    
    rainButton.addEventListener('mouseenter', () => {
      rainButton.style.background = '#303f9f';
      rainButton.style.transform = 'scale(1.05)';
    });
    
    rainButton.addEventListener('mouseleave', () => {
      rainButton.style.background = '#3f51b5';
      rainButton.style.transform = 'scale(1)';
    });
    
    // rain effect variables
    const ctx = canvas.getContext('2d');
    const rainDrops = [];
    let isRaining = false;
    let rainAnimationId = null;
    
    // rain button click handler
    rainButton.addEventListener('click', () => {
      if (textarea.value.trim()) {
        startRain(textarea.value);
        textarea.value = '';
        localStorage.removeItem('sadJournal');
      }
    });
    
    function startRain(text) {
      if (isRaining) return;
      
      isRaining = true;
      rainButton.textContent = '🌧️ raining...';
      rainButton.disabled = true;
      
      // create word drops from the text
      const words = text.split(/\s+/).filter(word => word.trim());
      const colors = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3'];
      
      // create rain drops
      words.forEach((word, index) => {
        setTimeout(() => {
          rainDrops.push({
            word: word,
            x: Math.random() * (canvas.width - 100),
            y: -50,
            speed: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.min(word.length * 8 + 12, 32),
            alpha: 1,
            rotation: Math.random() * 0.1 - 0.05,
            onGround: false
          });
        }, index * 100);
      });
      
      // start rain animation
      animateRain();
      
      // stop rain after all words have fallen
      setTimeout(() => {
        stopRain();
      }, words.length * 100 + 8000);
    }
    
    function animateRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // update and draw rain drops
      for (let i = rainDrops.length - 1; i >= 0; i--) {
        const drop = rainDrops[i];
        
        // update position only if not on ground
        if (!drop.onGround) {
          drop.y += drop.speed;
          drop.x += Math.sin(drop.y * 0.01) * 0.5; // slight sway
          
          // check if hit ground
          const groundLevel = canvas.height - 30 - Math.random() * 20;
          if (drop.y >= groundLevel) {
            drop.y = groundLevel;
            drop.onGround = true;
            drop.alpha = 0.8; // set final opacity
            drop.rotation = (Math.random() - 0.5) * 0.3; // final rotation
          }
        }
        
        // draw word
        ctx.save();
        ctx.globalAlpha = drop.alpha;
        ctx.fillStyle = drop.color;
        ctx.font = `${drop.size}px Georgia, serif`;
        ctx.textAlign = 'center';
        ctx.translate(drop.x, drop.y);
        ctx.rotate(drop.rotation);
        ctx.fillText(drop.word, 0, 0);
        ctx.restore();
        
        // only remove if faded out completely (not just off screen)
        if (drop.alpha <= 0) {
          rainDrops.splice(i, 1);
        }
      }
      
      if (isRaining) {
        rainAnimationId = requestAnimationFrame(animateRain);
      }
    }
    
    function stopRain() {
      isRaining = false;
      if (rainAnimationId) {
        cancelAnimationFrame(rainAnimationId);
      }
      
      // clear remaining drops after a delay
      setTimeout(() => {
        rainDrops.length = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rainButton.textContent = '🌧️ make it rain';
        rainButton.disabled = false;
      }, 3000);
    }
    
    // word count
    const wordCount = document.createElement('div');
    wordCount.style.cssText = `
      color: #c5cae9;
      font-size: 0.9rem;
      text-align: center;
      margin-top: 0.5rem;
      font-family: 'Poppins', Arial, sans-serif;
    `;
    
    function updateWordCount() {
      const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
      wordCount.textContent = `${words} words ready for rain`;
    }
    
    textarea.addEventListener('input', updateWordCount);
    updateWordCount();
    
    // assemble interface
    journalInterface.appendChild(title);
    journalInterface.appendChild(textarea);
    journalInterface.appendChild(rainButton);
    journalInterface.appendChild(wordCount);
    
    container.appendChild(journalInterface);
    container.appendChild(canvas);
    playground.appendChild(container);
    
    // focus textarea
    setTimeout(() => textarea.focus(), 100);
  }

  static showResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => {
      if (window.sadToolsInterval) {
        clearInterval(window.sadToolsInterval);
        window.sadToolsInterval = null;
      }
      location.reload();
    };
  }
}


window.SadTools = SadTools;
