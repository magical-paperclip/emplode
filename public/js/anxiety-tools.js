/**
 * Anxiety Management Tools
 * Calming activities and journaling features
 */

class AnxietyTools {
  static show() {
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
    
    // Go directly to journal
    this.showJournal();
  }

  static createToolMenu() {
    const menu = document.createElement('div');
    menu.id = 'circleMenu';
    menu.innerHTML = `
      <div class="circle-tool" data-tool="journal" style="background: #fbbc04" title="Journal">📝</div>
      <div class="circle-tool" data-tool="whiteboard" style="background: #f9a825" title="Whiteboard">🎨</div>
      <div class="circle-tool" data-tool="breathe" style="background: #4285f4" title="Breathing Circle">🫁</div>
      <div class="circle-tool" data-tool="waves" style="background: #1976d2" title="Wave Animation">🌊</div>
      <div class="circle-tool" data-tool="floating" style="background: #0d47a1" title="Floating Dots">✨</div>
    `;

    menu.querySelectorAll('.circle-tool').forEach(tool => {
      tool.addEventListener('click', () => {
        this.selectTool(tool.dataset.tool);
        menu.remove();
      });
    });

    return menu;
  }

  static selectTool(toolType) {
    switch (toolType) {
      case 'journal':
        this.showJournal();
        break;
      case 'whiteboard':
        this.showWhiteboard();
        break;
      case 'breathe':
        this.showBreathingCircle();
        break;
      case 'waves':
        this.showWaveAnimation();
        break;
      case 'floating':
        this.showFloatingDots();
        break;
    }
  }

  static showJournal() {
    const playground = document.getElementById('playground');
    const container = document.createElement('div');
    container.className = 'journal-container journal-full';

    const colorPalette = ['#ea4335', '#fbbc04', '#fdd835', '#34a853', '#4285f4', '#a142f4'];
    let activeColor = colorPalette[0];

    // Create journal elements
    const textArea = this.createTextArea(activeColor);
    const colorSelector = this.createColorSelector(colorPalette, activeColor, textArea);
    const buttonRow = this.createButtonRow();
    const toggleButton = this.createToggleButton();
    const entryList = this.createEntryList();

    container.appendChild(textArea);
    container.appendChild(colorSelector);
    container.appendChild(buttonRow);
    container.appendChild(toggleButton);
    container.appendChild(entryList);

    playground.appendChild(container);
    textArea.focus();
    this.showResetButton();
  }

  static createTextArea(initialColor) {
    const textArea = document.createElement('textarea');
    textArea.placeholder = 'write your thoughts...';
    textArea.className = 'journal-input';
    textArea.style.cssText = `
      flex: 1;
      min-height: 0;
      color: ${initialColor};
    `;

    // Auto-resize functionality
    textArea.addEventListener('input', () => {
      textArea.style.height = 'auto';
      textArea.style.height = Math.min(
        textArea.scrollHeight + 2,
        window.innerHeight * 0.4
      ) + 'px';
    });

    return textArea;
  }

  static createColorSelector(palette, activeColor, textArea) {
    const colorSelector = document.createElement('div');
    colorSelector.className = 'journal-color-row';

    palette.forEach(color => {
      const dot = document.createElement('div');
      dot.className = 'color-dot';
      dot.style.background = color;
      
      if (color === activeColor) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => {
        activeColor = color;
        textArea.style.color = color;
        
        // Update active state
        colorSelector.querySelectorAll('.color-dot').forEach(d => {
          d.classList.toggle('active', d === dot);
        });
      });

      colorSelector.appendChild(dot);
    });

    return colorSelector;
  }

  static createButtonRow() {
    const buttonRow = document.createElement('div');
    buttonRow.className = 'journal-btn-row';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'save';
    saveButton.className = 'tool';
    saveButton.style.cssText = 'background: #fbbc04; color: #202124;';

    const doneButton = document.createElement('button');
    doneButton.textContent = 'done';
    doneButton.className = 'tool';
    doneButton.style.cssText = 'background: #fbbc04; color: #202124;';
    doneButton.addEventListener('click', () => location.reload());

    buttonRow.appendChild(saveButton);
    buttonRow.appendChild(doneButton);

    return buttonRow;
  }

  static createToggleButton() {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'past journals';
    toggleButton.className = 'tool';
    toggleButton.style.cssText = 'background: #5f6368; margin-top: 0.6rem;';

    return toggleButton;
  }

  static createEntryList() {
    const entryList = document.createElement('div');
    entryList.className = 'journal-list';
    entryList.style.cssText = 'display: none; flex: 1;';

    return entryList;
  }

  static showWhiteboard() {
    const playground = document.getElementById('playground');
    const canvas = document.createElement('canvas');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      cursor: crosshair;
      z-index: 999;
      background: rgba(0, 0, 0, 0.05);
    `;

    const ctx = canvas.getContext('2d');
    const colorPalette = ['#ea4335', '#fbbc04', '#fdd835', '#34a853', '#4285f4', '#a142f4'];
    let brushColor = '#fbbc04';
    
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    this.setupDrawing(canvas, ctx);
    this.createWhiteboardToolbar(canvas, ctx, colorPalette, brushColor);

    playground.appendChild(canvas);
    this.showResetButton();
  }

  static setupDrawing(canvas, ctx) {
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (event) => {
      isDrawing = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const draw = (event) => {
      if (!isDrawing) return;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(event.clientX, event.clientY);
      ctx.stroke();
      
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);
  }

  static createWhiteboardToolbar(canvas, ctx, palette, currentColor) {
    const playground = document.getElementById('playground');
    const toolbar = document.createElement('div');
    
    toolbar.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 18px;
      align-items: center;
      z-index: 1001;
    `;

    // Color palette
    const colorRow = document.createElement('div');
    colorRow.className = 'journal-color-row';
    
    palette.forEach(color => {
      const dot = document.createElement('div');
      dot.className = 'color-dot';
      dot.style.background = color;
      
      if (color === currentColor) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => {
        currentColor = color;
        ctx.strokeStyle = color;
        
        colorRow.querySelectorAll('.color-dot').forEach(d => {
          d.classList.toggle('active', d === dot);
        });
      });

      colorRow.appendChild(dot);
    });

    // Control buttons
    const clearButton = this.createToolButton('Clear', '#fbbc04', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const doneButton = this.createToolButton('Done', '#fbbc04', () => {
      location.reload();
    });

    toolbar.appendChild(colorRow);
    toolbar.appendChild(clearButton);
    toolbar.appendChild(doneButton);
    playground.appendChild(toolbar);
  }

  static createToolButton(text, backgroundColor, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'tool';
    button.style.cssText = `background: ${backgroundColor}; color: #202124;`;
    button.addEventListener('click', onClick);
    return button;
  }

  static showBreathingCircle() {
    // Implementation for breathing circle
    console.log('Breathing circle - implementation needed');
  }

  static showWaveAnimation() {
    // Implementation for wave animation
    console.log('Wave animation - implementation needed');
  }

  static showFloatingDots() {
    // Implementation for floating dots
    console.log('Floating dots - implementation needed');
  }

  static showResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

// Make available globally
window.AnxietyTools = AnxietyTools;

function selectAnxietyTool(tool, menu){
  menu.remove()
  if(tool==='journal') showJournal()
  if(tool==='whiteboard') showWhiteboard()
  if(tool==='breathe') showBreathingCircle()
  if(tool==='waves') showWaveAnimation()
  if(tool==='floating') showFloatingDots()
}

function showJournal(){
  const container = document.createElement('div')
  container.className = 'journal-container journal-full'

  const textArea = document.createElement('textarea')
  textArea.placeholder = 'Write it out…' // tried "What's on your mind?" first but too generic
  textArea.className = 'journal-input'
  textArea.style.flex='1'
  textArea.style.minHeight='0'
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4'] // tried more colors but 6 feels right
  let activeColor = palette[0] // was palette[2] (yellow) but red feels more honest for anxiety
  textArea.style.color = activeColor
  container.appendChild(textArea)

  const colorSelector = document.createElement('div')
  colorSelector.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===activeColor) dot.classList.add('active')
    dot.onclick = ()=>{
      activeColor = color
      textArea.style.color = color
      ;[...colorSelector.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colorSelector.appendChild(dot)
  })
  container.appendChild(colorSelector)

  const buttonRow = document.createElement('div')
  buttonRow.className = 'journal-btn-row'

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'save'
  saveBtn.className = 'tool'
  saveBtn.style.cssText = 'background:#fbbc04;color:#202124'

  const doneBtn = document.createElement('button')
  doneBtn.textContent = 'done'
  doneBtn.className = 'tool'
  doneBtn.style.cssText = 'background:#fbbc04;color:#202124'
  doneBtn.onclick = () => { location.reload() }

  buttonRow.appendChild(saveBtn)
  buttonRow.appendChild(doneBtn)
  container.appendChild(buttonRow)

  const toggleBtn = document.createElement('button')
  toggleBtn.textContent = 'past journals' // tried "history" first but felt too clinical
  toggleBtn.className = 'tool'
  toggleBtn.style.cssText = 'background:#5f6368;margin-top:0.6rem'
  container.appendChild(toggleBtn)

  const entryList = document.createElement('div')
  entryList.className = 'journal-list'
  entryList.style.display = 'none' // tried starting visible but felt overwhelming
  entryList.style.flex = '1'
  container.appendChild(entryList)
  toggleBtn.onclick = () => {
    entryList.style.display = entryList.style.display==='none' ? 'block' : 'none'
  }

  textArea.addEventListener('input', ()=>{
    textArea.style.height = 'auto'
    textArea.style.height = Math.min(textArea.scrollHeight+2, window.innerHeight*0.4) + 'px' // tried 0.5 but took up too much space
  })

  const loadEntries = () => {
    entryList.innerHTML = ''
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.slice().reverse().forEach(entry=>{
      let text, color
      if(typeof entry === 'string'){ text = entry; color = '#e8eaed' } else { text = entry.t; color = entry.c || '#e8eaed' }
      const entryEl = document.createElement('div')
      entryEl.className = 'entry-text'
      entryEl.textContent = text
      entryEl.style.color = color
      entryList.appendChild(entryEl)
    })
  }

  loadEntries()

  saveBtn.onclick = () => {
    const text = textArea.value.trim()
    if(!text) return
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.push({t:text,c:activeColor})
    localStorage.setItem('journalEntries', JSON.stringify(entries))
    textArea.value = ''
    loadEntries()
  }

  playground.appendChild(container)
  textArea.focus()
  resetBtn.classList.remove('hidden')
}

function showWhiteboard(){
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style = 'position:fixed;top:0;left:0;cursor:crosshair;z-index:999;background:rgba(0,0,0,0.05);' // tried pure white first but too stark
  playground.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let brushColor = '#fbbc04' // started with red but yellow feels calmer
  ctx.strokeStyle = brushColor
  ctx.lineWidth = 3 // tried 2 but too thin, 5 felt chunky
  ctx.lineCap = 'round' // tried 'square' first but looked harsh

  let isDrawing = false
  let lastX = 0, lastY = 0

  const startDrawing = e => {
    isDrawing = true
    ;({clientX:lastX, clientY:lastY} = e)
  }
  const draw = e => {
    if(!isDrawing) return
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.clientX, e.clientY)
    ctx.stroke()
    lastX = e.clientX
    lastY = e.clientY
  }
  const stopDrawing = () => isDrawing = false

  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  window.addEventListener('mouseup', stopDrawing)

  const toolbar = document.createElement('div')
  toolbar.style = 'position:fixed;top:20px;left:50%;translate:-50% 0;display:flex;gap:18px;align-items:center;z-index:1001'

  const colorRow = document.createElement('div')
  colorRow.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===brushColor) dot.classList.add('active')
    dot.onclick = () => {
      brushColor = color
      ctx.strokeStyle = color
      ;[...colorRow.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colorRow.appendChild(dot)
  })

  toolbar.appendChild(colorRow)

  const clearBtn = document.createElement('button')
  clearBtn.textContent = 'clear' // tried "erase" first but felt too permanent
  clearBtn.className = 'tool'
  clearBtn.style.background = '#fbbc04'
  clearBtn.style.color = '#202124'
  clearBtn.onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height) }

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'done' // was "close" but "done" feels more positive
  closeBtn.className = 'tool'
  closeBtn.style.background = '#fbbc04'
  closeBtn.style.color = '#202124'
  closeBtn.onclick = () => { location.reload() } // tried just hiding canvas but caused issues

  toolbar.appendChild(clearBtn)
  toolbar.appendChild(closeBtn)
  playground.appendChild(toolbar)

  resetBtn.classList.remove('hidden')
}

function showBreathingCircle(){
  playground.innerHTML = ''
  
  const circle = document.createElement('div')
  circle.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, #4285f4, #1976d2);
    transform: translate(-50%, -50%);
    transition: all 4s ease-in-out;
    box-shadow: 0 0 30px rgba(66, 133, 244, 0.5);
  `
  
  const instructions = document.createElement('div')
  instructions.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 18px;
    text-align: center;
    font-family: Poppins;
  `
  instructions.textContent = 'breathe with the circle'
  
  playground.appendChild(circle)
  playground.appendChild(instructions)
  
  let expanding = true
  
  function breatheAnimation() {
    if (expanding) {
      circle.style.width = '300px' // tried 250px first but felt rushed, 350px too big
      circle.style.height = '300px'
      instructions.textContent = 'breathe in... (4 seconds)' // was 3 seconds but felt too fast
      expanding = false
      setTimeout(breatheAnimation, 4000) // tried 3000ms but breathing felt rushed
    } else {
      circle.style.width = '100px' // started at 80px but too small to focus on
      circle.style.height = '100px' 
      instructions.textContent = 'breathe out... (4 seconds)'
      expanding = true
      setTimeout(breatheAnimation, 4000)
    }
  }
  
  setTimeout(breatheAnimation, 1000) // start after 1 second
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

function showWaveAnimation(){
  playground.innerHTML = ''
  
  // wave animation using canvas - still learning canvas api
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth  
  canvas.height = window.innerHeight
  canvas.style.cssText = 'position:fixed;top:0;left:0;'
  playground.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  // coordinate confusion: kept thinking canvas.height/2 was center but forgot about margins
  let time = 0
  
  function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, 'rgba(33, 150, 243, 0.1)')
    gradient.addColorStop(1, 'rgba(13, 71, 161, 0.3)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // multiple wave layers - found this creates depth effect
    for (let layer = 0; layer < 3; layer++) { // tried 5 layers first but too busy, 2 felt flat
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      
      // math confusion: spent hours figuring out why sin waves looked wrong (amplitude vs frequency)
      for (let x = 0; x <= canvas.width; x += 10) { // was x += 5 but too smooth, 15 looked choppy
        const y = canvas.height / 2 + 
          Math.sin((x * 0.01) + (time * 0.02) + (layer * 0.5)) * (50 + layer * 20) + // tried 0.03 speed but too fast
          Math.sin((x * 0.005) + (time * 0.015) + (layer * 0.3)) * (30 + layer * 10)
        
        ctx.lineTo(x, y)
      }
      
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      
      const alpha = 0.3 - (layer * 0.08) // started at 0.5 but waves too opaque
      ctx.fillStyle = `rgba(66, 133, 244, ${alpha})`
      ctx.fill()
    }
    
    time += 1
    requestAnimationFrame(drawWaves)
  }
  
  drawWaves()
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

function showFloatingDots(){
  playground.innerHTML = ''
  
  // floating particles for calming effect
  const particles = []
  const numParticles = 50 // was 80 but too cluttered
  
  for (let i = 0; i < numParticles; i++) {
    const dot = document.createElement('div')
    const size = Math.random() * 8 + 4
    
    dot.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(66, 133, 244, ${Math.random() * 0.6 + 0.2});
      pointer-events: none;
      transition: all 0.3s ease;
    `
    
    const particle = {
      element: dot,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5, // slower movement
      vy: (Math.random() - 0.5) * 0.5,
      size: size
    }
    
    particles.push(particle)
    playground.appendChild(dot)
  }
  
  function animateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      
      // bounce off edges
      if (particle.x <= 0 || particle.x >= window.innerWidth) {
        particle.vx *= -1
      }
      if (particle.y <= 0 || particle.y >= window.innerHeight) {
        particle.vy *= -1
      }
      
      // keep in bounds
      particle.x = Math.max(0, Math.min(window.innerWidth, particle.x))
      particle.y = Math.max(0, Math.min(window.innerHeight, particle.y))
      
      particle.element.style.left = particle.x + 'px'
      particle.element.style.top = particle.y + 'px'
    })
    
    requestAnimationFrame(animateParticles)
  }
  
  animateParticles()
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
} 