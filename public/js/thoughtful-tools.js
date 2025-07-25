// thoughtful stuff - reflection journal thing

class ThoughtfulStuff {
  static show() {
    this.makeJournal();
  }

  static makeJournal() {
    const place = document.getElementById('playground');
    place.innerHTML = '';
    
    // nice purple bg
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden; z-index: 999; font-family: Arial;
    `;
    
    // floating stuff in bg
    this.makeFloatingThings(container);
    
    // add breathing circle
    this.addBreathingThing(container);
    
    // Create journal card
    const journalCard = document.createElement('div');
    journalCard.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 700px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Beautiful title with gradient text
    const title = document.createElement('h1');
    title.textContent = 'thoughtful reflection';
    title.style.cssText = `
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `;
    
    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'pour your thoughts into this peaceful space';
    subtitle.style.cssText = `
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      font-weight: 300;
    `;
    
    // Textarea with beautiful styling
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'what thoughts are flowing through your mind? let them drift onto the page...';
    textarea.style.cssText = `
      width: 100%;
      height: 300px;
      border: none;
      border-radius: 15px;
      padding: 25px;
      font-size: 1.1rem;
      line-height: 1.6;
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      resize: none;
      outline: none;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: #333;
      box-sizing: border-box;
    `;
    
    // Focus effects for textarea
    textarea.addEventListener('focus', () => {
      textarea.style.transform = 'scale(1.02)';
      textarea.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(102, 126, 234, 0.2)';
    });
    
    textarea.addEventListener('blur', () => {
      textarea.style.transform = 'scale(1)';
      textarea.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // Load saved content
    textarea.value = localStorage.getItem('thoughtfulJournal') || '';
    
    // Auto-save
    textarea.addEventListener('input', () => {
      localStorage.setItem('thoughtfulJournal', textarea.value);
      updateWordCount();
    });
    
    // Word count with beautiful styling
    const wordCount = document.createElement('div');
    wordCount.style.cssText = `
      text-align: center;
      margin-top: 15px;
      font-size: 0.9rem;
      color: #888;
      font-weight: 500;
    `;
    
    function updateWordCount() {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = text.length;
      wordCount.textContent = `${words} words • ${chars} characters of reflection`;
    }
    
    updateWordCount();
    
    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 25px;
    `;
    
    // Clear button with gradient
    const clearButton = document.createElement('button');
    clearButton.textContent = '🗑️ clear thoughts';
    clearButton.style.cssText = `
      padding: 12px 25px;
      border: none;
      border-radius: 25px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      font-family: 'Poppins', Arial, sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    `;
    
    clearButton.addEventListener('mouseenter', () => {
      clearButton.style.transform = 'translateY(-2px)';
      clearButton.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.6)';
    });
    
    clearButton.addEventListener('mouseleave', () => {
      clearButton.style.transform = 'translateY(0)';
      clearButton.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
    });
    
    clearButton.addEventListener('click', () => {
      if (confirm('clear all your thoughts? this cannot be undone.')) {
        textarea.value = '';
        localStorage.removeItem('thoughtfulJournal');
        updateWordCount();
        textarea.focus();
      }
    });
    
    // Done button with gradient
    const doneButton = document.createElement('button');
    doneButton.textContent = '✨ complete reflection';
    doneButton.style.cssText = `
      padding: 12px 25px;
      border: none;
      border-radius: 25px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-family: 'Poppins', Arial, sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;
    
    doneButton.addEventListener('mouseenter', () => {
      doneButton.style.transform = 'translateY(-2px)';
      doneButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    });
    
    doneButton.addEventListener('mouseleave', () => {
      doneButton.style.transform = 'translateY(0)';
      doneButton.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });
    
    doneButton.addEventListener('click', () => {
      location.reload();
    });
    
    // Assemble the journal card
    journalCard.appendChild(title);
    journalCard.appendChild(subtitle);
    journalCard.appendChild(textarea);
    journalCard.appendChild(wordCount);
    journalCard.appendChild(buttonContainer);
    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(doneButton);
    
    container.appendChild(journalCard);
    playground.appendChild(container);
    
    // Focus textarea
    setTimeout(() => textarea.focus(), 300);
    
    this.showResetButton();
  }

  static createFloatingParticles(container) {
    // Create floating particles for ambient effect
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 4}px;
        height: ${Math.random() * 6 + 4}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 10}s infinite linear;
        pointer-events: none;
      `;
      container.appendChild(particle);
    }
    
    // Add CSS animation for floating particles
    if (!document.getElementById('thoughtful-particles-styles')) {
      const styles = document.createElement('style');
      styles.id = 'thoughtful-particles-styles';
      styles.textContent = `
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  static makeFloatingThings(container) {
    // just some floating particles
    for (let i = 0; i < 12; i++) {
      const floaty = document.createElement('div');
      floaty.style.cssText = `
        position: absolute; width: ${Math.random() * 8 + 4}px; height: ${Math.random() * 8 + 4}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2}); border-radius: 50%;
        left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        animation: floatAround ${Math.random() * 20 + 15}s infinite linear;
        pointer-events: none;
      `;
      container.appendChild(floaty);
    }
  }

  static addBreathingThing(container) {
    // breathing circle in the background
    const breatheCircle = document.createElement('div');
    breatheCircle.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 200px; height: 200px; border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%; z-index: 1;
      animation: breatheAnimation 4s ease-in-out infinite;
    `;
    
    // breathing text
    const breatheText = document.createElement('div');
    breatheText.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.8); font-size: 18px; font-weight: 500;
      text-align: center; z-index: 2; pointer-events: none;
      animation: breatheTextAnimation 4s ease-in-out infinite;
    `;
    breatheText.innerHTML = 'inhale';
    
    container.appendChild(breatheCircle);
    container.appendChild(breatheText);
    
    // add breathing animation styles if not already there
    if (!document.getElementById('breathing-styles')) {
      const styles = document.createElement('style');
      styles.id = 'breathing-styles';
      styles.textContent = `
        @keyframes breatheAnimation {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        @keyframes breatheTextAnimation {
          0%, 45% { opacity: 1; }
          50%, 95% { opacity: 1; }
          47.5% { opacity: 0; }
          97.5% { opacity: 0; }
        }
        @keyframes breatheTextAnimation::before {
          0%, 50% { content: 'inhale'; }
          50%, 100% { content: 'exhale'; }
        }
      `;
      document.head.appendChild(styles);
      
      // alternate text manually since css content animation is tricky
      let isInhale = true;
      setInterval(() => {
        breatheText.textContent = isInhale ? 'exhale' : 'inhale';
        isInhale = !isInhale;
      }, 2000);
    }
  }

  static showResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

// Make available globally
window.ThoughtfulStuff = ThoughtfulStuff;
window.ThoughtfulTools = ThoughtfulStuff;


