// anger management stuff
// smash things when ur pissed

class AngerStuff {
  static show() {
    console.log('anger: starting wreck mode');
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
    
    // go straight to smashing
    this.startWrecking();
  }

  static startWrecking() {
    const playground = document.getElementById('playground');
    
    // make the stick game thing
    this.makeStickThing();
  }

  static makeStickThing() {
    const playground = document.getElementById('playground');
    
    // canvas for smashing
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      cursor: none;
      background: transparent;
    `;
    playground.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // game vars
    const gameStuff = {
      mouseX: canvas.width / 2,
      mouseY: canvas.height / 2,
      stickAngle: 0,
      stickLength: 100,
      blocks: [],
      score: 0,
      totalBlocks: 0,
      patterns: ['wall', 'pyramid', 'scattered', 'circles', 'towers'],
      angerReasons: [], // store what user is mad about
      showingInputDialog: false,
      inputStartTime: 0
    };
    
    // create TONS of destructible blocks packed together like the original
    const colors = ['#ea4335', '#fbbc04', '#34a853', '#4285f4', '#a142f4', '#ff6b35', '#f7931e', '#00d4aa'];
    const blockTypes = [
      { width: 45, height: 45, points: 1 },
      { width: 60, height: 30, points: 2 },
      { width: 30, height: 60, points: 2 },
      { width: 50, height: 50, points: 3 }
    ];
    
    
    // generate initial blocks using first pattern
    generateBlocks(gameStuff.patterns[0]);
    
    // add some scattered blocks in upper area for variety
    for (let i = 0; i < 20; i++) {
      const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
      gameStuff.blocks.push({
        x: Math.random() * (canvas.width - 100) + 50,
        y: Math.random() * (canvas.height - 400) + 100,
        width: blockType.width,
        height: blockType.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        points: blockType.points,
        destroyed: false,
        particles: [],
        rotation: Math.random() * 0.2 - 0.1
      });
    }
    gameStuff.totalBlocks = gameStuff.blocks.length;
    
    // mouse tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      gameStuff.mouseX = e.clientX - rect.left;
      gameStuff.mouseY = e.clientY - rect.top;
    });
    
    // helper functions for collision detection
    function lineIntersectsRect(x1, y1, x2, y2, rect) {
      // check if line intersects rectangle using separating axis theorem
      const left = rect.x;
      const right = rect.x + rect.width;
      const top = rect.y;
      const bottom = rect.y + rect.height;
      
      // check if line endpoints are inside rectangle
      if ((x1 >= left && x1 <= right && y1 >= top && y1 <= bottom) ||
          (x2 >= left && x2 <= right && y2 >= top && y2 <= bottom)) {
        return true;
      }
      
      // check line intersection with rectangle edges
      return lineIntersectsLine(x1, y1, x2, y2, left, top, right, top) ||
             lineIntersectsLine(x1, y1, x2, y2, right, top, right, bottom) ||
             lineIntersectsLine(x1, y1, x2, y2, right, bottom, left, bottom) ||
             lineIntersectsLine(x1, y1, x2, y2, left, bottom, left, top);
    }

    function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
      const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      if (denom === 0) return false;
      
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
      
      return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }
    
    // function to show input dialog for anger reasons
    function showAngerInputDialog() {
      gameStuff.showingInputDialog = true;
      gameStuff.inputStartTime = Date.now();
      
      // create overlay
      const overlay = document.createElement('div');
      overlay.id = 'anger-input-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
      `;
      
      // create input container
      const container = document.createElement('div');
      container.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #ea4335;
        border-radius: 10px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        text-align: center;
      `;
      
      // title
      const title = document.createElement('h2');
      title.textContent = 'what are you mad about?';
      title.style.cssText = `
        color: #ea4335;
        font-size: 28px;
        margin-bottom: 20px;
        font-family: 'Poppins', monospace;
      `;
      
      // input field
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'type what is making you angry...';
      input.style.cssText = `
        width: 100%;
        padding: 15px;
        font-size: 18px;
        border: 2px solid #ea4335;
        border-radius: 5px;
        background: #2a2a2a;
        color: #e8eaed;
        margin-bottom: 20px;
        font-family: 'Poppins', monospace;
      `;
      
      // button container
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
      `;
      
      // add button
      const addButton = document.createElement('button');
      addButton.textContent = 'add to destruction list';
      addButton.style.cssText = `
        background: #ea4335;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-family: 'Poppins', monospace;
      `;
      
      // skip button
      const skipButton = document.createElement('button');
      skipButton.textContent = 'skip';
      skipButton.style.cssText = `
        background: #5f6368;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        font-family: 'Poppins', monospace;
      `;
      
      // countdown display
      const countdown = document.createElement('div');
      countdown.style.cssText = `
        color: #fbbc04;
        font-size: 14px;
        margin-top: 15px;
        font-family: 'Poppins', monospace;
      `;
      
      // auto-proceed after 3 seconds
      let timeLeft = 3;
      const countdownInterval = setInterval(() => {
        countdown.textContent = `auto-continuing in ${timeLeft} seconds...`;
        timeLeft--;
        if (timeLeft < 0) {
          clearInterval(countdownInterval);
          closeDialog();
        }
      }, 1000);
      
      function closeDialog() {
        clearInterval(countdownInterval);
        document.body.removeChild(overlay);
        gameStuff.showingInputDialog = false;
        
        // game is complete, show final state
        console.log('anger session complete');
      }
      
      // add button functionality
      addButton.addEventListener('click', () => {
        const angerText = input.value.trim();
        if (angerText) {
          gameStuff.angerReasons.push(angerText);
          console.log('added anger reason:', angerText);
        }
        closeDialog();
      });
      
      // skip button functionality
      skipButton.addEventListener('click', () => {
        closeDialog();
      });
      
      // enter key functionality
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const angerText = input.value.trim();
          if (angerText) {
            gameStuff.angerReasons.push(angerText);
            console.log('added anger reason:', angerText);
          }
          closeDialog();
        }
      });
      
      // assemble elements
      buttonContainer.appendChild(addButton);
      buttonContainer.appendChild(skipButton);
      container.appendChild(title);
      container.appendChild(input);
      container.appendChild(buttonContainer);
      container.appendChild(countdown);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
      
      // focus input
      setTimeout(() => input.focus(), 100);
    }
    
    // function to generate blocks in different patterns
    function generateBlocks(pattern) {
      gameStuff.blocks = []; // clear existing blocks
      
      switch(pattern) {
        case 'wall':
          // original dense wall pattern
          for (let row = 0; row < 6; row++) {
            const baseY = canvas.height - Math.max(...blockTypes.map((b) => b.height)) - (row * 52);
            for (let col = 0; col < (canvas.width - 40) / 48 - 1; col++) {
              const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
              gameStuff.blocks.push({
                x: 20 + (col * 48),
                y: baseY,
                width: blockType.width,
                height: blockType.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                points: blockType.points,
                destroyed: false,
                particles: [],
                rotation: 0
              });
            }
          }
          break;
          
        case 'pyramid':
          // pyramid pattern
          for (let row = 0; row < 8; row++) {
            const blocksInRow = 25 - (row * 2);
            const baseY = canvas.height - 180 + (row * 45);
            const startX = (canvas.width - (blocksInRow * 50)) / 2;
            
            for (let col = 0; col < blocksInRow; col++) {
              const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
              gameStuff.blocks.push({
                x: startX + (col * 50),
                y: baseY,
                width: blockType.width,
                height: blockType.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                points: blockType.points,
                destroyed: false,
                particles: [],
                rotation: 0
              });
            }
          }
          break;
          
        case 'circles':
          // circular patterns
          const centerX = canvas.width / 2;
          const centerY = canvas.height - 200;
          
          for (let circle = 0; circle < 4; circle++) {
            const radius = 80 + (circle * 60);
            const blocksInCircle = 8 + (circle * 4);
            
            for (let i = 0; i < blocksInCircle; i++) {
              const angle = (i / blocksInCircle) * Math.PI * 2;
              const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
              gameStuff.blocks.push({
                x: centerX + Math.cos(angle) * radius - blockType.width / 2,
                y: centerY + Math.sin(angle) * radius - blockType.height / 2,
                width: blockType.width,
                height: blockType.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                points: blockType.points,
                destroyed: false,
                particles: [],
                rotation: angle
              });
            }
          }
          break;
          
        case 'towers':
          // tower pattern
          for (let tower = 0; tower < 8; tower++) {
            const towerX = 100 + (tower * 150);
            const towerHeight = 8 + Math.floor(Math.random() * 4);
            
            for (let level = 0; level < towerHeight; level++) {
              const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
              gameStuff.blocks.push({
                x: towerX,
                y: canvas.height - 100 - (level * 50),
                width: blockType.width,
                height: blockType.height,
                color: colors[Math.floor(Math.random() * colors.length)],
                points: blockType.points,
                destroyed: false,
                particles: [],
                rotation: 0
              });
            }
          }
          break;
          
        case 'scattered':
        default:
          // random scattered pattern
          for (let i = 0; i < 150; i++) {
            const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            gameStuff.blocks.push({
              x: Math.random() * (canvas.width - 100) + 50,
              y: Math.random() * (canvas.height - 300) + 100,
              width: blockType.width,
              height: blockType.height,
              color: colors[Math.floor(Math.random() * colors.length)],
              points: blockType.points,
              destroyed: false,
              particles: [],
              rotation: Math.random() * 0.4 - 0.2
            });
          }
          break;
      }
      
      gameStuff.totalBlocks = gameStuff.blocks.length;
      console.log(`generated ${gameStuff.totalBlocks} blocks in ${pattern} pattern`);
    }
    
    // game loop
    function animate() {
      // clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // update stick rotation (faster for more aggressive feel)
      gameStuff.stickAngle += 0.2;
      
      // draw spinning stick at cursor position (larger and more menacing)
      ctx.save();
      ctx.translate(gameStuff.mouseX, gameStuff.mouseY);
      ctx.rotate(gameStuff.stickAngle);
      
      // stick body (thicker)
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(-gameStuff.stickLength / 2, -12, gameStuff.stickLength, 24);
      
      // stick tips (larger)
      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.arc(-gameStuff.stickLength / 2, 0, 15, 0, Math.PI * 2);
      ctx.arc(gameStuff.stickLength / 2, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // add some spikes for extra destruction feeling
      ctx.fillStyle = '#4a2c17';
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.moveTo(i * gameStuff.stickLength / 3, -12);
        ctx.lineTo(i * gameStuff.stickLength / 3 + 8, -20);
        ctx.lineTo(i * gameStuff.stickLength / 3 + 16, -12);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(i * gameStuff.stickLength / 3, 12);
        ctx.lineTo(i * gameStuff.stickLength / 3 + 8, 20);
        ctx.lineTo(i * gameStuff.stickLength / 3 + 16, 12);
        ctx.fill();
      }
      
      ctx.restore();
      
      // check collisions and draw blocks
      let activeBlocks = 0;
      gameStuff.blocks.forEach((block, index) => {
        if (block.destroyed) {
          // draw destruction particles
          block.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life / 80;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // gravity
            particle.life--;
            particle.vx *= 0.98; // air resistance
          });
          ctx.globalAlpha = 1;
          block.particles = block.particles.filter(p => p.life > 0);
          return;
        }
        
        activeBlocks++;
        
        // draw block with rotation
        ctx.save();
        ctx.translate(block.x + block.width / 2, block.y + block.height / 2);
        ctx.rotate(block.rotation);
        
        // special blocks get extra effects
        if (block.special) {
          ctx.shadowColor = '#ff1744';
          ctx.shadowBlur = 10;
        }
        
        ctx.fillStyle = block.color;
        ctx.fillRect(-block.width / 2, -block.height / 2, block.width, block.height);
        
        // border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-block.width / 2, -block.height / 2, block.width, block.height);
        
        // points indicator for special blocks
        if (block.points > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = '14px bold monospace';
          ctx.textAlign = 'center';
          ctx.fillText(block.points.toString(), 0, 5);
        }
        
        ctx.restore();
        
        // collision detection with spinning stick
        const stickTipX1 = gameStuff.mouseX + Math.cos(gameStuff.stickAngle) * (gameStuff.stickLength / 2);
        const stickTipY1 = gameStuff.mouseY + Math.sin(gameStuff.stickAngle) * (gameStuff.stickLength / 2);
        const stickTipX2 = gameStuff.mouseX - Math.cos(gameStuff.stickAngle) * (gameStuff.stickLength / 2);
        const stickTipY2 = gameStuff.mouseY - Math.sin(gameStuff.stickAngle) * (gameStuff.stickLength / 2);
        
        // expanded collision box for easier destruction
        const expandedBlock = {
          x: block.x - 5,
          y: block.y - 5,
          width: block.width + 10,
          height: block.height + 10
        };
        
        // check if stick intersects block
        if (lineIntersectsRect(stickTipX1, stickTipY1, stickTipX2, stickTipY2, expandedBlock)) {
          // destroy block
          block.destroyed = true;
          gameStuff.score += block.points;
          
          // create destruction particles (more for special blocks)
          const particleCount = block.special ? 15 : 10;
          for (let i = 0; i < particleCount; i++) {
            block.particles.push({
              x: block.x + Math.random() * block.width,
              y: block.y + Math.random() * block.height,
              vx: (Math.random() - 0.5) * 12,
              vy: (Math.random() - 0.5) * 12 - 4,
              color: block.color,
              life: 80,
              size: Math.random() * 6 + 2
            });
          }
          
          console.log(`block destroyed! +${block.points} points (total: ${gameStuff.score})`);
        }
      });
      
      // draw comprehensive UI
      ctx.fillStyle = 'rgba(32, 33, 36, 0.9)';
      ctx.fillRect(10, 10, 380, 115);
      ctx.strokeStyle = '#ea4335';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 380, 115);
      
      ctx.fillStyle = '#e8eaed';
      ctx.font = 'bold 28px Poppins, monospace';
      ctx.fillText(`score: ${gameStuff.score}`, 25, 45);
      
      ctx.font = '18px Poppins, monospace';
      ctx.fillStyle = '#fbbc04';
      ctx.fillText(`blocks remaining: ${activeBlocks}`, 25, 70);
      
      ctx.fillStyle = '#34a853';
      ctx.fillText(`destroyed: ${gameStuff.totalBlocks - activeBlocks}`, 25, 95);
      
      // draw anger reason text boxes
      if (gameStuff.angerReasons.length > 0) {
        ctx.fillStyle = 'rgba(234, 67, 53, 0.2)';
        ctx.fillRect(canvas.width - 320, 10, 300, Math.min(gameStuff.angerReasons.length * 35 + 20, 300));
        ctx.strokeStyle = '#ea4335';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width - 320, 10, 300, Math.min(gameStuff.angerReasons.length * 35 + 20, 300));
        
        ctx.fillStyle = '#ea4335';
        ctx.font = 'bold 16px Poppins, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('destroying:', canvas.width - 310, 35);
        
        ctx.font = '14px Poppins, monospace';
        const maxVisible = Math.floor(260 / 35);
        const startIndex = Math.max(0, gameStuff.angerReasons.length - maxVisible);
        
        gameStuff.angerReasons.slice(startIndex).forEach((reason, index) => {
          const y = 55 + (index * 25);
          ctx.fillStyle = '#ea4335';
          ctx.fillText('• ', canvas.width - 310, y);
          
          // wrap text if too long
          const maxWidth = 260;
          const words = reason.split(' ');
          let line = '';
          let lineY = y;
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line, canvas.width - 295, lineY);
              line = words[n] + ' ';
              lineY += 20;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, canvas.width - 295, lineY);
        });
      }
      
      // completion logic
      if (activeBlocks === 0 && !gameStuff.showingInputDialog) {
        // all blocks destroyed! show completion screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ea4335';
        ctx.font = 'bold 48px Poppins, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ALL DESTROYED!', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.fillStyle = '#e8eaed';
        ctx.font = '32px Poppins, monospace';
        ctx.fillText(`final score: ${gameStuff.score}`, canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.fillStyle = '#34a853';
        ctx.font = '24px Poppins, monospace';
        ctx.fillText('anger released successfully', canvas.width / 2, canvas.height / 2 + 30);
        
        // show input dialog after short delay
        setTimeout(() => {
          showAngerInputDialog();
        }, 1500);
      }
      
      // draw instructions
      ctx.fillStyle = 'rgba(232, 234, 237, 0.9)';
      ctx.font = '16px Poppins, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('move cursor to swing the destruction stick', 20, canvas.height - 80);
      ctx.fillText('destroy all blocks to release your anger completely', 20, canvas.height - 60);
      ctx.fillText('red blocks = 5 points • larger blocks = more points', 20, canvas.height - 40);
      
      requestAnimationFrame(animate);
    }
    
    animate();
    console.log('enhanced spinning stick destruction game initialized');
    this.addResetButton();
  }

  static addResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }

  static showResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

// expose class globally
window.AngerStuff = AngerStuff;
window.AngerTools = AngerStuff;
