// when ur pissed off - smash stuff
// stick swinging destruction thing

class AngerStuff {
  static show() {
    console.log('starting anger mode lol');
    const place = document.getElementById('playground');
    place.innerHTML = '';
    
    this.askWhatUrMadAbout();
  }

  static askWhatUrMadAbout() {
    const place = document.getElementById('playground');
    
    // red angry bg
    const bg = document.createElement('div');
    bg.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #8B0000, #DC143C);
      z-index: 999; display: flex; align-items: center; justify-content: center;
    `;
    
    // popup thing
    const popup = document.createElement('div');
    popup.style.cssText = `
      background: rgba(255,255,255,0.9); padding: 30px; border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center; max-width: 400px;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'what r u mad about?';
    title.style.cssText = 'color: #8B0000; margin-bottom: 20px; font-family: Arial;';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'type what pisses u off...';
    input.style.cssText = `
      width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 8px;
      font-size: 16px; margin-bottom: 20px; box-sizing: border-box;
    `;
    
    const btn = document.createElement('button');
    btn.textContent = 'start smashing';
    btn.style.cssText = `
      background: #8B0000; color: white; border: none; padding: 15px 30px;
      border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold;
    `;
    
    let countdown = 3;
    
    const startCountdown = () => {
      btn.textContent = `auto-start in ${countdown}...`;
      btn.disabled = true;
      
      const timer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          btn.textContent = `auto-start in ${countdown}...`;
        } else {
          clearInterval(timer);
          this.userAngerReason = input.value.trim() || 'everything sucks';
          this.startSmashing();
        }
      }, 1000);
    };
    
    btn.onclick = () => {
      this.userAngerReason = input.value.trim() || 'everything sucks';
      this.startSmashing();
    };
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.userAngerReason = input.value.trim() || 'everything sucks';
        this.startSmashing();
      }
    });
    
    setTimeout(startCountdown, 100);
    
    popup.appendChild(title);
    popup.appendChild(input);
    popup.appendChild(btn);
    bg.appendChild(popup);
    place.appendChild(bg);
    
    input.focus();
  }

  static startSmashing() {
    const place = document.getElementById('playground');
    place.innerHTML = '';
    
    // canvas for destruction
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 10;
      background: linear-gradient(135deg, #8B0000, #DC143C);
    `;
    place.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    
    this.mouseX = canvas.width / 2;
    this.mouseY = canvas.height / 2;
    this.stickAngle = 0;
    this.boxes = [];
    this.score = 0;
    this.isDestroying = false;
    this.angerTexts = [];
    
    // make boxes to smash
    this.makeBoxes();
    
    // mouse stuff
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('click', (e) => {
      this.smashStuff(e);
    });
    
    this.gameLoop();
  }

  static makeBoxes() {
    const colors = ['#ff4444', '#ff6666', '#ff8888', '#ffaaaa'];
    
    // create destructible boxes
    for (let i = 0; i < 50; i++) {
      this.boxes.push({
        x: Math.random() * (window.innerWidth - 50),
        y: Math.random() * (window.innerHeight - 200) + 100,
        w: 30 + Math.random() * 30,
        h: 30 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        destroyed: false,
        particles: []
      });
    }
  }

  static smashStuff(e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    this.boxes.forEach(b => {
      if (!b.destroyed &&
          x >= b.x && x <= b.x + b.w &&
          y >= b.y && y <= b.y + b.h) {

        b.destroyed = true
        this.score++

        // burst particles
        for (let i = 0; i < 8; i++) {
          b.particles.push({
            x: b.x + b.w / 2,
            y: b.y + b.h / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30
          })
        }

        // occasional text pop
        if (Math.random() < 0.3) {
          this.angerTexts.push({ text: this.userAngerReason, x, y, life: 60, vy: -2 })
        }
      }
    })

    // when every block is gone, spawn a fresh batch instead of ending the game
    if (this.boxes.every(b => b.destroyed)) {
      this.boxes = []
      this.makeBoxes()
    }
  }

    /* ───────── regenerate when all boxes in the current layer are gone ──────── */
    if (this.boxes.every(box => box.destroyed)) {
      // wipe the old ones out
      this.boxes = [];
      // make a fresh batch – you can tweak the pattern/count inside makeBoxes()
      this.makeBoxes();
    }
  }

  static gameLoop() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    // clear
    ctx.fillStyle = 'rgba(139, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // draw boxes
    this.boxes.forEach(box => {
      if (!box.destroyed) {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(box.x, box.y, box.w, box.h);
      }
      
      // draw particles
      box.particles.forEach((p, i) => {
        if (p.life > 0) {
          ctx.fillStyle = `rgba(255, 100, 100, ${p.life/30})`;
          ctx.fillRect(p.x, p.y, 3, 3);
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
        } else {
          box.particles.splice(i, 1);
        }
      });
    });
    
    // draw anger texts
    this.angerTexts.forEach((txt, i) => {
      if (txt.life > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${txt.life/60})`;
        ctx.font = '20px Arial';
        ctx.fillText(txt.text, txt.x, txt.y);
        txt.y += txt.vy;
        txt.life--;
      } else {
        this.angerTexts.splice(i, 1);
      }
    });
    
    // score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`smashed: ${this.score}`, 20, 40);
    
    requestAnimationFrame(() => this.gameLoop());
  }

  static showComplete() {
    const place = document.getElementById('playground');
    
    const doneMsg = document.createElement('div');
    doneMsg.innerHTML = `
      <h2>feeling better?</h2>
      <p>you smashed ${this.score} things</p>
      <p>about: "${this.userAngerReason}"</p>
    `;
    doneMsg.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(255,255,255,0.9); padding: 30px; border-radius: 15px;
      text-align: center; z-index: 1000; color: #333;
    `;
    
    place.appendChild(doneMsg);
    
    // show reset btn
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

// make it available
window.AngerStuff = AngerStuff;
