// confetti stuff when ur happy lol

class HappyStuff {
  static show() {
    this.setupConfettiThing();
  }

  static setupConfettiThing() {
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
    
    // just make it black idk
    const screen = document.createElement('div');
    screen.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: #000; overflow: hidden; z-index: 999; cursor: crosshair;
    `;
    
    playground.appendChild(screen);
    
    // start the confetti dropping
    this.dropConfettiStuff();
    
    // click to make explosion
    screen.addEventListener('click', (e) => {
      this.explodeStuff(e.clientX, e.clientY);
    });
    
    this.showResetBtn();
  }

  static dropConfettiStuff() {
    const makeStuffFall = () => {
      const colorz = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6', '#34495e'];
      
      // drop 5 pieces at a time
      for (let i = 0; i < 5; i++) {
        const confettiPiece = document.createElement('div');
        const sz = 4 + Math.random() * 6;
        const isSquare = Math.random() > 0.5;
        
        confettiPiece.style.cssText = `
          position: fixed; left: ${Math.random() * window.innerWidth}px; top: -20px;
          width: ${isSquare ? sz * 2 : sz}px; height: ${sz}px;
          background: ${colorz[Math.floor(Math.random() * colorz.length)]};
          border-radius: ${isSquare ? '0' : '50%'}; pointer-events: none; z-index: 1000;
        `;
        
        document.body.appendChild(confettiPiece);
        
        const howLongToFall = 3000 + Math.random() * 2000;
        const sidewaysDrift = (Math.random() - 0.5) * 100;
        const whereItLands = window.innerHeight - 20 - Math.random() * 40; // ground level varies
        
        confettiPiece.animate([
          { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
          { transform: `translateY(${whereItLands}px) translateX(${sidewaysDrift}px) rotate(${Math.random() * 360}deg)`, opacity: 0.9 }
        ], { 
          duration: howLongToFall, 
          easing: 'linear' 
        }).addEventListener('finish', () => {
          // make it stay on the ground
          confettiPiece.style.top = whereItLands + 'px';
          confettiPiece.style.left = (parseInt(confettiPiece.style.left) + sidewaysDrift) + 'px';
          confettiPiece.style.transform = `rotate(${Math.random() * 360}deg)`;
          confettiPiece.style.opacity = '0.8';
        });
      }
    };
    
    // start dropping right away
    makeStuffFall();
    // keep dropping more every so often
    setInterval(makeStuffFall, 800);
  }

  static explodeStuff(x, y) {
    const colorz = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6', '#34495e'];
    
    // make like 40 pieces explode out
    for (let i = 0; i < 40; i++) {
      const bit = document.createElement('div');
      const sz = 3 + Math.random() * 5;
      const isSquareish = Math.random() > 0.6;
      
      bit.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        width: ${isSquareish ? sz * 2 : sz}px; height: ${sz}px;
        background: ${colorz[Math.floor(Math.random() * colorz.length)]};
        border-radius: ${isSquareish ? '0' : '50%'}; pointer-events: none; z-index: 1001;
      `;
      
      document.body.appendChild(bit);
      
      const direction = (Math.PI * 2 * i) / 40;
      const power = 80 + Math.random() * 120;
      const xMove = Math.cos(direction) * power;
      const yMove = Math.sin(direction) * power - 30;
      
      const timeToFall = 2000 + Math.random() * 1000;
      const landingSpot = window.innerHeight - 20 - Math.random() * 40; // where it lands
      
      bit.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${xMove/3}px, ${yMove/2}px) rotate(${Math.random() * 180}deg)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${xMove/3}px, ${landingSpot - y}px) rotate(${Math.random() * 360}deg)`, opacity: 0.8 }
      ], { 
        duration: timeToFall, 
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      }).addEventListener('finish', () => {
        // stick it to the ground
        bit.style.left = (x + xMove/3) + 'px';
        bit.style.top = landingSpot + 'px';
        bit.style.transform = `rotate(${Math.random() * 360}deg)`;
        bit.style.opacity = '0.7';
      });
    }
  }

  static showResetBtn() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

window.HappyStuff = HappyStuff;
window.HappyTools = HappyStuff;
