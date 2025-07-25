/**
 * tutorial system
 * displays mood guide and application instructions
 */

class Tutorial {
  static show() {
    if (document.querySelector('#tutorialPopup')) return;
    
    const modal = this.createModal();
    document.body.appendChild(modal);
  }

  static createModal() {
    const moodColors = [
      ['#ea4335', 'anger'],
      ['#fbbc04', 'anxiety'],
      ['#fdd835', 'happiness'],
      ['#34a853', 'calm'],
      ['#4285f4', 'sad'],
      ['#a142f4', 'creative']
    ];

    const modal = document.createElement('div');
    modal.id = 'tutorialPopup';
    modal.className = 'tutorial-modal';
    
    modal.innerHTML = `
      <div class="tutorial-box">
        <h2 style="margin: 0 0 1rem 0; text-align: center; color: #fff; font-size: 1.8rem;">
          mood guide
        </h2>
        <p style="color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 1.5rem; font-size: 1rem;">
          click a color to explore your feelings
        </p>
        <div class="mood-guide-grid">
          ${moodColors.map(([color, mood]) => `
            <div class="mood-guide-item">
              <div class="mood-guide-dot" style="background: ${color}"></div>
              <span class="mood-guide-text">${mood}</span>
            </div>
          `).join('')}
        </div>
        <button class="tutorial-close">got it!</button>
      </div>
    `;

    // Close handlers
    const closeButton = modal.querySelector('.tutorial-close');
    closeButton.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.remove();
    });

    return modal;
  }
}

// Make available globally
window.Tutorial = Tutorial;
