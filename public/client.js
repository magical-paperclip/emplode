// scrappy mood → tool playground  (no sockets, no frameworks)

// refs
const modal = document.getElementById('mdl')
const moodBtns = [...document.querySelectorAll('.mBtn')]
let selectedMood = null

// palette helper
function getColors(){
  if(selectedMood === 'angry')
    return ['#b71c1c','#c62828','#d32f2f','#e53935','#f44336','#ff5252']
  return ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
}
const causeForm = document.getElementById('cf')
const causeInput = document.getElementById('cInp')
const submitBtn = document.getElementById('goBtn')
const playground = document.getElementById('playground')
const resetBtn = document.getElementById('rst')
const helpBtn = document.getElementById('tutorial')

helpBtn.onclick = showTutorial

function showTutorial(){
  if(document.querySelector('#tutorialPopup')) return
  const colors=[
    ['#ea4335','anger'],
    ['#fbbc04','anxiety'],
    ['#fdd835','happiness'],
    ['#34a853','calm'],
    ['#4285f4','thoughtful'],
    ['#a142f4','creative']
  ]
  const overlay=document.createElement('div')
  overlay.id='tutorialPopup'
  overlay.className='tutorial-modal'
  overlay.innerHTML=`
    <div class="tutorial-box">
      <h2 style="margin:0;text-align:center">mood colours</h2>
      ${colors.map(([hex,name])=>`<div class="tutorial-row"><div class="tutorial-circle" style="background:${hex}"></div><span>${name}</span></div>`).join('')}
      <button class="tutorial-close">close</button>
    </div>
  `
  overlay.querySelector('.tutorial-close').onclick=()=>overlay.remove()
  document.body.appendChild(overlay)
}

// (maybe username?)-> mood pick -> cause -> tools -> make it more interactive -> reset
moodBtns.forEach(btn=>btn.onclick = () => {
  selectedMood = btn.dataset.mood
  modal.classList.add('hidden')
  causeForm.classList.remove('hidden')
  causeInput.focus()
  
  document.body.className = `mood-${selectedMood}`
})

submitBtn.onclick = () => {
  if(!causeInput.value.trim()) return
  causeForm.classList.add('hidden')
  if(selectedMood === 'angry'){
    showAngerMenu()
  }else if(selectedMood === 'anxiety'){
    showAnxietyTools()
  }else if(selectedMood === 'happy'){
    showHappyTool()
  }else{
    showBreathTool()
  }

  // --- anxiety specific --
  function showAnxietyTools(){
    const toolsMenu = document.createElement('div')
    toolsMenu.id = 'tools'
    toolsMenu.innerHTML = `
      <button class="tool" data-t="journal" style="background:#fbbc04">Journal</button>
      <button class="tool" data-t="whiteboard" style="background:#fbbc04">Whiteboard</button>
    `
    playground.appendChild(toolsMenu)
    toolsMenu.querySelectorAll('.tool').forEach(b=>b.onclick = () => selectAnxietyTool(b.dataset.t, toolsMenu))
  }

  function selectAnxietyTool(tool, menu){
    menu.remove()
    if(tool==='journal') showJournal()
    if(tool==='whiteboard') showWhiteboard()
  }

  // journal tool: centered textarea for free writing
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

  // whiteboard tool: simple drawing canvas
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

  function showHappyTool(){
    playground.innerHTML='';
    runHappyTool('confetti');
    resetBtn.classList.remove('hidden');
  }
  
  function runHappyTool(type) {
    if (type === 'emojis') {
      const dropEmojis = (count=20)=>{
        for(let i=0;i<count;i++){
          const emoji = document.createElement('div')
          emoji.textContent=':)'
          emoji.style.position='fixed'
          emoji.style.left = Math.random()*window.innerWidth+'px'
          emoji.style.top = '-40px'
          emoji.style.fontSize = 24 + Math.random()*24 +'px'
          emoji.style.color = ['#fff176','#ffe57f','#fff59d'][Math.floor(Math.random()*3)]
          emoji.style.pointerEvents='none'
          playground.appendChild(emoji)
          const duration = 4000 + Math.random()*3000
          emoji.animate([
            { transform:'translateY(0)', opacity:1 },
            { transform:`translateY(${window.innerHeight+60}px)`, opacity:0.3 }
          ], { duration, easing:'linear' }).onfinish = () => emoji.remove()
        }
      }
      dropEmojis(30)
      setInterval(() => dropEmojis(5), 2000)
      
    } else if (type === 'bubbles') {
      const makeBubbles = (count=15) => {
        for(let i=0;i<count;i++){
          const bubble = document.createElement('div')
          const size = 20 + Math.random()*40
          bubble.style = `
            position:fixed;
            left:${Math.random()*window.innerWidth}px;
            top:${window.innerHeight + 50}px;
            width:${size}px;
            height:${size}px;
            border-radius:50%;
            background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(135,206,235,0.3));
            border:2px solid rgba(255,255,255,0.4);
            pointer-events:none;
          `
          playground.appendChild(bubble)
          const duration = 6000 + Math.random()*4000
          bubble.animate([
            { transform:'translateY(0) scale(0)', opacity:0.8 },
            { transform:`translateY(-${window.innerHeight + 100}px) scale(1)`, opacity:0 }
          ], { duration, easing:'ease-out' }).onfinish = () => bubble.remove()
        }
      }
      makeBubbles(20)
      setInterval(() => makeBubbles(3), 1500)
      
    } else if (type === 'confetti') {
       const pieces = []  // keep track of all pieces
       
       // invisible ground for confetti to land on
       const ground = document.createElement('div')
       ground.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:50px;background:transparent;z-index:997;'
       playground.appendChild(ground)
       
       const dropConfetti = (count=15) => {
         const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#e67e22','#9b59b6']
         for(let i=0;i<count;i++){
           const piece = document.createElement('div')
           const size = 4 + Math.random()*3
           const shape = Math.random() > 0.5 ? 'rect' : 'circle'
           const startX = Math.random()*window.innerWidth
           piece.style.cssText = `
             position:fixed;
             left:${startX}px;
             top:-20px;
             width:${shape === 'circle' ? size : size*2}px;
             height:${size}px;
             background:${colors[Math.floor(Math.random()*colors.length)]};
             border-radius:${shape === 'circle' ? '50%' : '0'};
             pointer-events:none;
             z-index:998;
           `
           playground.appendChild(piece)
           pieces.push(piece)
           
           const fall = 2500 + Math.random()*1500
           const drift = (Math.random() - 0.5) * 100
           const finalX = startX + drift
           const groundY = window.innerHeight - 50 - Math.random() * 30
           
           piece.animate([
             { transform:'translateY(0) translateX(0) rotate(0deg)', opacity:1 },
             { transform:`translateY(${groundY + 20}px) translateX(${drift}px) rotate(${Math.random()*180}deg)`, opacity:0.9 }
           ], { duration:fall, easing:'ease-in' }).onfinish = () => {
             // land on ground
             piece.style.top = groundY + 'px'
             piece.style.left = finalX + 'px'
             piece.style.transform = `rotate(${Math.random()*360}deg)`
             piece.style.opacity = '0.8'
             piece.style.transition = 'none'
           }
         }
       }
       dropConfetti(20)
       setInterval(() => dropConfetti(3), 2500)
       
       const clickHandler = (e) => {
         const centerX = e.clientX
         const centerY = e.clientY
         
         const burst = (count=60) => {
           const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#e67e22','#9b59b6','#34495e']
           for(let i=0;i<count;i++){
             const piece = document.createElement('div')
             const size = 3 + Math.random()*4
             const isRect = Math.random() > 0.6
             const spread = Math.random() * Math.PI * 2
             const force = 100 + Math.random() * 150
             const dx = Math.cos(spread) * force + (Math.random() - 0.5) * 30
             const dy = Math.sin(spread) * force - 80 - Math.random() * 40
             
             piece.style.cssText = `
               position:fixed;
               left:${centerX}px;
               top:${centerY}px;
               width:${isRect ? size*2 : size}px;
               height:${size}px;
               background:${colors[Math.floor(Math.random()*colors.length)]};
               border-radius:${isRect ? '0' : '50%'};
               pointer-events:none;
               z-index:998;
             `
             playground.appendChild(piece)
             pieces.push(piece)
             
             let currentX = centerX
             let currentY = centerY
             let velocityX = dx / 15
             let velocityY = dy / 15
             const gravity = 0.8
             const airResistance = 0.98
             const groundY = window.innerHeight - 50 - Math.random() * 30
             
             const animate = () => {
               velocityY += gravity  // gravity pulls down
               velocityX *= airResistance  // air resistance
               velocityY *= airResistance
               
               currentX += velocityX
               currentY += velocityY
               
               piece.style.left = currentX + 'px'
               piece.style.top = currentY + 'px'
               piece.style.transform = `rotate(${(currentX + currentY) * 0.5}deg)`
               
               if (currentY >= groundY) {
                 // hit ground, stop
                 piece.style.top = groundY + 'px'
                 piece.style.opacity = '0.7'
                 piece.style.transform = `rotate(${Math.random()*360}deg)`
                 return
               }
               
               if (currentY < window.innerHeight + 100) {
                 requestAnimationFrame(animate)
               }
             }
             
             requestAnimationFrame(animate)
           }
         }
         
         burst(50)
       }
       
       document.addEventListener('click', clickHandler)
       
     } else if (type === 'rainbow') {
       const canvas = document.createElement('canvas')
       canvas.width = window.innerWidth
       canvas.height = window.innerHeight
       canvas.style = 'position:fixed;top:0;left:0;pointer-events:none;z-index:998'
       playground.appendChild(canvas)
       
       const ctx = canvas.getContext('2d')
       let hue = 0
       
       const drawRainbow = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height)
         const centerX = canvas.width / 2
         const centerY = canvas.height / 2
         
         for(let i=0; i<7; i++){
           ctx.beginPath()
           ctx.arc(centerX, centerY + 100, 200 - i*15, 0, Math.PI)
           ctx.lineWidth = 15
           ctx.strokeStyle = `hsl(${(hue + i*30) % 360}, 70%, 60%)`
           ctx.stroke()
         }
         hue += 2
         requestAnimationFrame(drawRainbow)
       }
       drawRainbow()
     }
  }

}

function showTools(){
  const toolsMenu = document.createElement('div')
  toolsMenu.id = 'tools'
  toolsMenu.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;display:flex;gap:18px'
  toolsMenu.innerHTML = `
    <button class="tool" data-t="note">Crumple Note</button>
    <button class="tool" data-t="breath">Deep Breath</button>
  `
  playground.appendChild(toolsMenu)
  toolsMenu.querySelectorAll('.tool').forEach(b=>b.onclick = () => selectTool(b.dataset.t,toolsMenu))
}

function selectTool(tool,menu){
  menu.remove()
  if(tool==='note') showStickyNote()
  if(tool==='breath') showBreathTool()
}

function showStickyNote(){
  const note = document.createElement('div')
  note.className = 'sticky'
  note.textContent = causeInput.value
  note.style.left = '50%'
  note.style.top  = '50%'
  playground.appendChild(note)

  let isDragging = false, offsetX=0, offsetY=0
  note.onmousedown = e => { isDragging = true; offsetX=e.offsetX; offsetY=e.offsetY }
  document.onmousemove = e => {
    if(!isDragging) return
    note.style.left = e.clientX - offsetX +'px'
    note.style.top  = e.clientY - offsetY +'px'
  }
  document.onmouseup = () => isDragging = false

  note.ondblclick = () => {
    if(note.classList.contains('crumple')) return;
    note.classList.add('crumple');
    note.addEventListener('animationend', () => note.remove(), { once: true });
  }
  resetBtn.classList.remove('hidden')
}

function showBreathTool(){
  const breathText = document.createElement('div')
  breathText.textContent = 'Inhale…'
  breathText.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;font-size:2rem;'
  playground.appendChild(breathText)
  let isInhaling = false
  const breathTimer = setInterval(()=>{ breathText.textContent = isInhaling?'Inhale…':'Exhale…'; isInhaling=!isInhaling }, 3000)
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => { clearInterval(breathTimer); location.reload() }
}

function showAngerMenu(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="open" style="background:#ea4335" title="Open Tools"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectCircleTool(c.dataset.tool, menu))
}

function showAngerTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="rage" style="background:#ea4335" title="Anger Blast"></div>
    <div class="circle-tool" data-tool="wreck" style="background:#c62828" title="Wrecking Ball"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectCircleTool(c.dataset.tool, menu))
}

function selectCircleTool(tool,menu){
  if(tool==='open'){
    menu.remove()
    showAngerTools()
    return
  }
  menu.remove()
  if(tool==='rage')    showRageTool()
  if(tool==='textBox') showTextBoxes()
  if(tool==='wreck')    showWreckingBall()
}

function showTextBoxes(){
  playground.innerHTML = ''
  const { Engine, Render, World, Bodies, Events } = Matter
  const engine = Engine.create()
  const width = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: playground,
    engine,
    options:{ width, height, wireframes:false, background:'transparent' }
  })

  const walls = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true })
  ]
  World.add(engine.world, walls)

  const inputText = (causeInput.value || 'hello world').trim()
  inputText.split(/\s+/).forEach(word=>{
    if(!word) return
    const boxWidth = Math.max(80, word.length*14)
    const box = Bodies.rectangle(Math.random()*(width-200)+100, -50, boxWidth, 40, {
      restitution:0.7,
      render:{ fillStyle:'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0') }
    })
    box.label = word
    World.add(engine.world, box)
  })

  Engine.run(engine)
  Render.run(render)

  Events.on(render, 'afterRender', () => {
    const ctx = render.context
    ctx.font = '16px Poppins'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    engine.world.bodies.forEach(body=>{
      if(!body.label || body.isStatic) return
      ctx.save()
      ctx.translate(body.position.x, body.position.y)
      ctx.rotate(body.angle)
      ctx.fillText(body.label, 0, 0)
      ctx.restore()
    })
  })

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}


function showWreckingBall(){
  playground.innerHTML = ''
  const { Engine, Render, World, Bodies, Constraint, Composites, Mouse, MouseConstraint } = Matter

  const engine = Engine.create()
  const width = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: playground,
    engine,
    options: { width, height, wireframes:false, background:'transparent' }
  })

  const boundaries = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true })
  ]
  World.add(engine.world, boundaries)

  const blockSize = 24
  const spacing = 2
  const columns = Math.floor(width / (blockSize + spacing)) - 2
  const rows = Math.floor(height / ((blockSize + spacing) * 2))
  const createStar = (x, y, radius) => {
    const palette = getColors()
    const spikes = 5
    const innerRadius = radius * 0.5
    const vertices = []
    for(let i=0;i<spikes*2;i++){
      const r = i%2===0 ? radius : innerRadius
      const angle = (Math.PI / spikes) * i
      vertices.push({ x: Math.cos(angle)*r, y: Math.sin(angle)*r })
    }
    const color = palette[Math.floor(Math.random()*palette.length)]
    return Bodies.fromVertices(x, y, [vertices], {
      restitution:0.6,
      render:{ fillStyle: color }
    }, true)
  }

  const starField = Composites.stack(blockSize, height - rows * (blockSize + spacing) - 50, columns, rows, spacing, spacing, (x, y) =>
    createStar(x, y, blockSize*0.6)
  )
  World.add(engine.world, starField)

  const anchorPoint = { x: 200, y: 50 }
  const chainLength = 15
  const linkSize = 32
  const chain = Composites.stack(anchorPoint.x, anchorPoint.y + linkSize/2, 1, chainLength, 0, 0, (_x,_y,i)=>
    Bodies.rectangle(anchorPoint.x, anchorPoint.y + i*linkSize + linkSize/2, 16, linkSize, {
      density:0.004,
      friction:0.9,
      collisionFilter:{ group:-1 },
      render:{ fillStyle:'#8d6e63' }
    })
  )
  Composites.chain(chain, 0.5, 0, 0.5, 1, { stiffness:0.9, length:0, damping:0.1 })

  World.add(engine.world, Constraint.create({ pointA: anchorPoint, bodyB: chain.bodies[0], pointB:{x:0,y:-linkSize/2}, stiffness:1, damping:0.1 }))

  const ballRadius = 90
  const lastLink = chain.bodies[chain.bodies.length-1]
  const wreckingBall = Bodies.circle(lastLink.position.x, lastLink.position.y + ballRadius + linkSize/2, ballRadius, {
    density:0.03,
    restitution:0.9,
    collisionFilter:{ group:-1 },
    render:{ fillStyle:'#b71c1c' }
  })
  World.add(engine.world, [chain])
  World.add(engine.world, Constraint.create({ bodyA:lastLink, pointA:{x:0,y:linkSize/2}, bodyB:wreckingBall, stiffness:1, length:0, damping:0.05 }))
  World.add(engine.world, wreckingBall)

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } })
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

function showRageTool(){
  playground.innerHTML = ''
  const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, Vector } = Matter

  const engine = Engine.create()
  const width = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: playground,
    engine,
    options:{ width, height, wireframes:false, background:'transparent' }
  })

  const walls = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true })
  ]
  World.add(engine.world, walls)

  const boxSize = 36
  const spacing = 4
  const columns = Math.floor(width / (boxSize+spacing)) - 2
  const rows = Math.floor(height / ((boxSize+spacing) * 1.2))
  const palette = getColors()
  for(let i=0;i<columns;i++){
    for(let j=0;j<rows;j++){
      const color = palette[Math.floor(Math.random()*palette.length)]
      const x = boxSize + i*(boxSize+spacing)
      const y = height - 60 - j*(boxSize+spacing)
      const box = Bodies.rectangle(x, y, boxSize, boxSize, {
        restitution:0.4,
        render:{ fillStyle: color }
      })
      World.add(engine.world, box)
    }
  }

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } })
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  render.canvas.addEventListener('click', (e)=>{
    const rect = render.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const blastPower = 0.08
    const blastRadius = 150
    engine.world.bodies.forEach(body=>{
      if(body.isStatic) return
      const distance = Vector.magnitude({ x: body.position.x - x, y: body.position.y - y })
      if(distance < blastRadius){
        const force = Vector.mult(Vector.normalise({ x: body.position.x - x, y: body.position.y - y }), blastPower)
        Body.applyForce(body, body.position, force)
      }
    })
    const blastEffect = document.createElement('div')
    blastEffect.style = `position:absolute;left:${x}px;top:${y}px;width:20px;height:20px;border-radius:50%;background:#ea4335;transform:translate(-50%,-50%);opacity:0.6;pointer-events:none;`
    playground.appendChild(blastEffect)
    blastEffect.animate([
      { transform:'translate(-50%,-50%) scale(0)', opacity:0.6 },
      { transform:`translate(-50%,-50%) scale(${blastRadius/10})`, opacity:0 }
    ], { duration:600, easing:'ease-out' }).onfinish = () => blastEffect.remove()
  })

  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

resetBtn.onclick = () => location.reload()