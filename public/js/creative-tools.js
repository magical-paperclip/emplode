// drawing thing for when ur feeling creative idk
// copied some of this from stack overflow lol

class CreativeStuff {
  static show() {
    this.setupDrawingStuff();
  }

  static setupDrawingStuff() {
    const place = document.getElementById('playground');
    place.innerHTML = ''; // clear it out first
    
    // some colorful bg or whatever
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(135deg, #a142f4 0%, #e91e63 50%, #ff5722 100%);
      overflow: hidden; z-index: 999; font-family: 'Comic Sans MS', cursive;
    `;
    
    // some floating stuff in bg
    this.makeFloatingThings(container);
    
    // the main drawing area
    const canvasCard = document.createElement('div');
    canvasCard.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 900px; height: 80%;
      background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
      border-radius: 20px; padding: 20px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2); display: flex; flex-direction: column;
    `;
    
    // title 
    const title = document.createElement('h1');
    title.textContent = 'draw whatever idk';
    title.style.cssText = `
      font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: 1rem;
      background: linear-gradient(135deg, #a142f4, #e91e63);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; font-family: 'Comic Sans MS', cursive;
    `;
    
    // the actual canvas where u draw
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    canvas.style.cssText = `
      background: #fafafa; border-radius: 15px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1); cursor: crosshair;
      flex: 1; margin-bottom: 15px; border: 3px solid #ddd;
    `;
    
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // drawing vars
    let isDrawing = false;
    let currentColor = '#000000';
    let currentSize = 3;
    
    // mouse stuff for drawing
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineWidth = currentSize;
      ctx.strokeStyle = currentColor;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    
    // tools n stuff   
    const toolsPanel = document.createElement('div');
    toolsPanel.style.cssText = `
      display: flex; justify-content: center; align-items: center;
      gap: 15px; flex-wrap: wrap; font-family: 'Comic Sans MS', cursive;
      padding: 10px; margin: 5px 0;
    `;
    // some colors u can pick from idk
    const colorz = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
                    '#00ffff', '#ffa500', '#800080', '#ffc0cb']; // TODO: add more colors maybe?
    colorz.forEach(color => {
      const colorBtn = document.createElement('button'); 
      colorBtn.style.cssText = `
        width: 28px; height: 28px; border: 2px solid #333; border-radius: 50%;
        background: ${color}; cursor: pointer; margin: 2px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      `;
      
      colorBtn.addEventListener('click', () => {
        currentColor = color;
        // make all the other buttons look normal again (this was annoying to figure out)
        document.querySelectorAll('button').forEach(btn => {
          if (btn.style.background && btn.style.borderRadius === '50%') {
            btn.style.border = '2px solid #333';
          }
        });
        colorBtn.style.border = '3px solid #fff';  // this one selected
      });
      
      toolsPanel.appendChild(colorBtn);
    });
    
    // brush size slider
    const sizeLabel = document.createElement('span');
    sizeLabel.textContent = 'brush size:';
    sizeLabel.style.cssText = `
      font-weight: bold; margin-left: 20px; color: #333;
      font-family: 'Comic Sans MS', cursive; font-size: 14px;
    `;
    
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '30'; 
    sizeSlider.value = '3';
    sizeSlider.style.cssText = `
      width: 80px; margin: 0 10px; accent-color: #a142f4;
    `;
    sizeSlider.oninput = (e) => currentSize = e.target.value;
    
    toolsPanel.appendChild(sizeLabel);
    toolsPanel.appendChild(sizeSlider);
    // clear and save buttons  
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'delete everything'; // probably shouldve made this less scary sounding
    clearBtn.style.cssText = `
      padding: 10px 15px; border: 2px solid #ff0000; border-radius: 5px;
      background: #ffcccc; color: #cc0000; font-family: 'Comic Sans MS', cursive;
      font-weight: bold; cursor: pointer; margin-left: 15px; font-size: 12px;
    `;
    
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // bye bye drawing
    });
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'save my masterpiece';
    saveBtn.style.cssText = `
      padding: 10px 15px; border: 2px solid #00aa00; border-radius: 5px;
      background: #ccffcc; color: #006600; font-family: 'Comic Sans MS', cursive;
      font-weight: bold; cursor: pointer; margin-left: 10px; font-size: 12px;
    `;
    
    saveBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'my-drawing-' + Date.now() + '.png'; // timestamp so files dont overwrite
      link.href = canvas.toDataURL();
      link.click(); // trigger download
    });
    
    toolsPanel.appendChild(clearBtn);
    toolsPanel.appendChild(saveBtn);
    
    // back button 
    const backBtn = document.createElement('button');
    backBtn.textContent = '← go back';
    backBtn.style.cssText = `
      position: absolute; top: 20px; left: 20px; padding: 10px 20px;
      background: rgba(255, 255, 255, 0.9); border: 2px solid #a142f4;
      border-radius: 25px; color: #a142f4; font-weight: bold; cursor: pointer;
      font-family: 'Comic Sans MS', cursive; backdrop-filter: blur(10px);
    `;
    
    backBtn.addEventListener('click', () => {
      container.remove();
      document.getElementById('playground').innerHTML = '';
    });
    
    // put everything together
    canvasCard.appendChild(title);
    canvasCard.appendChild(canvas);
    canvasCard.appendChild(toolsPanel);
    container.appendChild(canvasCard);
    container.appendChild(backBtn);
    document.getElementById('playground').appendChild(container);
  }
  
  // floating background particles thing
  static makeFloatingThings(container) {
    for (let i = 0; i < 15; i++) { // 15 seems like a good number
      const particle = document.createElement('div');
      const shapes = ['🎨', '✨', '🌟', '💫', '🎭', '🖌️', '🌈', '💡'];
      particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      particle.style.cssText = `
        position: absolute;
        font-size: ${Math.random() * 20 + 15}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatAround ${Math.random() * 15 + 10}s infinite linear;
        pointer-events: none;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      container.appendChild(particle);
    }
    
    // add the css animation if its not there already
    if (!document.getElementById('float-styles')) {
      const styles = document.createElement('style');
      styles.id = 'float-styles';
      styles.textContent = `
        @keyframes floatAround {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100px) rotate(720deg);
          }
        }
      `;
      document.head.appendChild(styles);
    }
  }

  // this one is for the missing method error
  static makeCreativeParticles(container) {
    // just call the other one lol
    this.makeFloatingThings(container);
  }
}