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
    toolsMenu.id = 'circleMenu'
    toolsMenu.innerHTML = `
      <div class="circle-tool" data-t="journal" style="background:#fbbc04" title="Journal"></div>
      <div class="circle-tool" data-t="whiteboard" style="background:#f9a825" title="Whiteboard"></div>
    `
    playground.appendChild(toolsMenu)
    toolsMenu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectAnxietyTool(b.dataset.t, toolsMenu))
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
       // invisible ground for confetti to land on
       const ground = document.createElement('div')
       ground.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:50px;background:transparent;z-index:997;'
       playground.appendChild(ground)
       
       const dropConfetti = (count=10) => {
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
           
           const fall = 3000 + Math.random()*2000
           const drift = (Math.random() - 0.5) * 80
           const finalX = Math.max(0, Math.min(window.innerWidth, startX + drift))
           const groundY = window.innerHeight - 50 - Math.random() * 30
           
           piece.animate([
             { transform:'translateY(0) translateX(0) rotate(0deg)', opacity:1 },
             { transform:`translateY(${groundY + 20}px) translateX(${drift}px) rotate(${Math.random()*180}deg)`, opacity:0.9 }
           ], { duration:fall, easing:'ease-in' }).onfinish = () => {
             piece.style.top = groundY + 'px'
             piece.style.left = finalX + 'px'
             piece.style.transform = `rotate(${Math.random()*360}deg)`
             piece.style.opacity = '0.8'
             piece.style.transition = 'none'
           }
         }
       }
       dropConfetti(15)
       setInterval(() => dropConfetti(3), 2500)
       
       const clickHandler = (e) => {
         const centerX = e.clientX
         const centerY = e.clientY
         
         const burst = (count=30) => {
           const colors = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#e67e22','#9b59b6','#34495e']
           for(let i=0;i<count;i++){
             const piece = document.createElement('div')
             const size = 3 + Math.random()*4
             const isRect = Math.random() > 0.6
             const spread = Math.random() * Math.PI * 2
             const force = 80 + Math.random() * 100
             const dx = Math.cos(spread) * force
             const dy = Math.sin(spread) * force - 50
             
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
             
             const duration = 2000 + Math.random() * 1000
             const finalX = Math.max(0, Math.min(window.innerWidth, centerX + dx / 3))
             const finalY = window.innerHeight - 50 - Math.random() * 30
             
             piece.animate([
               { transform:'translate(0,0) rotate(0deg)', opacity:1 },
               { transform:`translate(${dx/3}px,${dy/2}px) rotate(${Math.random()*180}deg)`, opacity:1, offset:0.3 },
               { transform:`translate(${dx/3}px,${finalY - centerY}px) rotate(${Math.random()*360}deg)`, opacity:0.8 }
             ], { duration, easing:'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => {
               piece.style.left = finalX + 'px'
               piece.style.top = finalY + 'px'
               piece.style.transform = `rotate(${Math.random()*360}deg)`
               piece.style.opacity = '0.7'
             }
           }
         }
         
         burst(35)
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
  toolsMenu.id = 'circleMenu'
  toolsMenu.innerHTML = `
    <div class="circle-tool" data-t="note" style="background:#34a853" title="Crumple Note"></div>
    <div class="circle-tool" data-t="breath" style="background:#4285f4" title="Deep Breath"></div>
  `
  playground.appendChild(toolsMenu)
  toolsMenu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectTool(b.dataset.t,toolsMenu))
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
  if(tool==='wreck')    showNoteCrumpling()
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


function showNoteCrumpling(){
  playground.innerHTML = ''
  
  // create paper.js canvas
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.cssText = 'position:fixed;top:0;left:0;cursor:grab;z-index:999;'
  playground.appendChild(canvas)
  
  // setup paper.js
  paper.setup(canvas)

  // check if libraries are loaded
  if(typeof Voronoi === 'undefined') {
    console.error('Voronoi library not loaded')
    playground.innerHTML = '<div style="color:white;text-align:center;padding:50px;">Voronoi library failed to load</div>'
    return
  }
  
  // voronoi setup
  const voronoi = new Voronoi()
  let sites = []
  let bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height}
  let diagram
  const spotColor = new paper.Color('#f5f5dc')
  let mousePos = paper.view.center
  let selected = false
  let crumpling = false
  
  // generate initial sites
  sites = generateBeeHivePoints(80, true)

  // add text overlay
  const noteText = causeInput.value || 'anger'
  const text = new paper.PointText(paper.view.center)
  text.content = noteText
  text.fillColor = '#333'
  text.fontSize = 32
  text.fontFamily = 'Poppins'
  text.justification = 'center'
  
  // initial render
  renderDiagram()
  
  function onMouseDown(event) {
    if(!crumpling){
      sites.push(event.point)
      renderDiagram()
    }
  }
  
  function onMouseMove(event) {
    mousePos = event.point
    if(!crumpling && event.count == 0)
      sites.push(event.point)
    if(!crumpling && sites.length > 0)
      sites[sites.length - 1] = event.point
    renderDiagram()
  }
  
  function onDoubleClick(event) {
    crumpling = true
    canvas.style.cursor = 'default'
    
    // animate all sites toward center
    sites.forEach(site => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50
      site.targetX = paper.view.center.x + Math.cos(angle) * distance
      site.targetY = paper.view.center.y + Math.sin(angle) * distance
    })
    
    // fade text
    text.opacity = 0.3
    
    animateCrumple()
  }
  
  function animateCrumple(){
    if(!crumpling) return
    
    sites.forEach(site => {
      if(site.targetX && site.targetY){
        site.x += (site.targetX - site.x) * 0.05
        site.y += (site.targetY - site.y) * 0.05
      }
    })
    
    renderDiagram()
    requestAnimationFrame(animateCrumple)
  }

  function renderDiagram() {
    paper.project.activeLayer.children = []
    
    // re-add text
    paper.project.activeLayer.addChild(text)
    
    const diagram = voronoi.compute(sites, bbox)
    if (diagram) {
      for (let i = 0, l = sites.length; i < l; i++) {
        const cell = diagram.cells[sites[i].voronoiId]
        if (cell) {
          const halfedges = cell.halfedges
          const length = halfedges.length
          if (length > 2) {
            const points = []
            for (let j = 0; j < length; j++) {
              const v = halfedges[j].getEndpoint()
              points.push(new paper.Point(v))
            }
            createPath(points, sites[i])
          }
        }
      }
    }
  }
  
  function createPath(points, center) {
    const path = new paper.Path()
    if (!selected) { 
      path.fillColor = spotColor
      path.strokeColor = '#ddd'
      path.strokeWidth = 1
    } else {
      path.fullySelected = selected
    }
    path.closed = true
    
    for(let i = 0; i < points.length; i++) {
      path.add(points[i])
    }
    
    // add slight randomization for paper texture
    if(!crumpling){
      path.smooth()
    }
  }
  
     function generateBeeHivePoints(size, loose) {
     const points = []
     const cols = Math.floor(paper.view.size.width / size)
     const rows = Math.floor(paper.view.size.height / size)
     
     for(let i = 0; i < cols; i++) {
       for(let j = 0; j < rows; j++) {
         let x = i * size + size/2
         let y = j * size + size/2
         
         if(j % 2) x += size/2
         
         if(loose) {
           x += (Math.random() - 0.5) * size * 0.3
           y += (Math.random() - 0.5) * size * 0.3
         }
         
         points.push(new paper.Point(x, y))
       }
     }
     return points
   }
  
     function onResize() {
     bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height}
     renderDiagram()
   }
  
  // bind events
  paper.view.onMouseDown = onMouseDown
  paper.view.onMouseMove = onMouseMove  
  paper.view.onDoubleClick = onDoubleClick
  paper.view.onResize = onResize
  
  renderDiagram()

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