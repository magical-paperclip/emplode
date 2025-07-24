// learning how to make calming animations - anxiety tools
// trying different approaches to make soothing effects

function showAnxietyTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="journal" style="background:#fbbc04" title="Journal"></div>
    <div class="circle-tool" data-tool="whiteboard" style="background:#f9a825" title="Whiteboard"></div>
    <div class="circle-tool" data-tool="breathe" style="background:#4285f4" title="Breathing Circle"></div>
    <div class="circle-tool" data-tool="waves" style="background:#1976d2" title="Wave Animation"></div>
    <div class="circle-tool" data-tool="floating" style="background:#0d47a1" title="Floating Dots"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectAnxietyTool(c.dataset.tool, menu))
}

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
  textArea.placeholder = 'Write it out…'
  textArea.className = 'journal-input'
  textArea.style.flex='1'
  textArea.style.minHeight='0'
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let activeColor = palette[0]
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
  toggleBtn.textContent = 'past journals'
  toggleBtn.className = 'tool'
  toggleBtn.style.cssText = 'background:#5f6368;margin-top:0.6rem'
  container.appendChild(toggleBtn)

  const entryList = document.createElement('div')
  entryList.className = 'journal-list'
  entryList.style.display = 'none'
  entryList.style.flex = '1'
  container.appendChild(entryList)
  toggleBtn.onclick = () => {
    entryList.style.display = entryList.style.display==='none' ? 'block' : 'none'
  }

  textArea.addEventListener('input', ()=>{
    textArea.style.height = 'auto'
    textArea.style.height = Math.min(textArea.scrollHeight+2, window.innerHeight*0.4) + 'px'
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
  canvas.style = 'position:fixed;top:0;left:0;cursor:crosshair;z-index:999;background:rgba(0,0,0,0.05)';
  playground.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let brushColor = '#fbbc04'
  ctx.strokeStyle = brushColor
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

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
  clearBtn.textContent = 'clear'
  clearBtn.className = 'tool'
  clearBtn.style.background = '#fbbc04'
  clearBtn.style.color = '#202124'
  clearBtn.onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height) }

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'done'
  closeBtn.className = 'tool'
  closeBtn.style.background = '#fbbc04'
  closeBtn.style.color = '#202124'
  closeBtn.onclick = () => { location.reload() }

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
  instructions.textContent = 'Breathe with the circle'
  
  playground.appendChild(circle)
  playground.appendChild(instructions)
  
  let expanding = true
  
  function breatheAnimation() {
    if (expanding) {
      circle.style.width = '300px'
      circle.style.height = '300px'
      instructions.textContent = 'Breathe in... (4 seconds)'
      expanding = false
      setTimeout(breatheAnimation, 4000)
    } else {
      circle.style.width = '100px'
      circle.style.height = '100px' 
      instructions.textContent = 'Breathe out... (4 seconds)'
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
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      
      for (let x = 0; x <= canvas.width; x += 10) {
        const y = canvas.height / 2 + 
          Math.sin((x * 0.01) + (time * 0.02) + (layer * 0.5)) * (50 + layer * 20) +
          Math.sin((x * 0.005) + (time * 0.015) + (layer * 0.3)) * (30 + layer * 10)
        
        ctx.lineTo(x, y)
      }
      
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      
      const alpha = 0.3 - (layer * 0.08)
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