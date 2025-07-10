// scrappy mood → tool playground  (no sockets, no frameworks)

// refs
const modal = document.getElementById('mdl')
const moodBtns = [...document.querySelectorAll('.mBtn')]
const causeBox = document.getElementById('cf')
const causeInp = document.getElementById('cInp')
const goBtn   = document.getElementById('goBtn')
const stage   = document.getElementById('playground')
const reset   = document.getElementById('rst')

// (maybe username?)-> mood pick -> cause -> tools -> make it more interactive -> reset
moodBtns.forEach(btn=>btn.onclick = () => {
  modal.classList.add('hidden')
  causeBox.classList.remove('hidden')
  causeInp.focus()
})

goBtn.onclick = () => {
  if(!causeInp.value.trim()) return
  causeBox.classList.add('hidden')
  showCircleMenu()
}

function showTools(){
  const wrap = document.createElement('div')
  wrap.id = 'tools'
  wrap.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;display:flex;gap:18px'
  wrap.innerHTML = `
    <button class="tool" data-t="note">Crumple Note</button>
    <button class="tool" data-t="breath">Deep Breath</button>
  `
  stage.appendChild(wrap)
  wrap.querySelectorAll('.tool').forEach(b=>b.onclick = () => pickTool(b.dataset.t,wrap))
}

function pickTool(t,wrap){
  wrap.remove()
  if(t==='note') noteTool()
  if(t==='breath') breathTool()
}

// --- note tool kinda ----------------------------------------------------
function noteTool(){
  const note = document.createElement('div')
  note.className = 'sticky'
  note.textContent = causeInp.value
  note.style.left = '50%'
  note.style.top  = '50%'
  stage.appendChild(note)

  let drag = false, offX=0, offY=0
  note.onmousedown = e => { drag = true; offX=e.offsetX; offY=e.offsetY }
  document.onmousemove = e => {
    if(!drag) return
    note.style.left = e.clientX - offX +'px'
    note.style.top  = e.clientY - offY +'px'
  }
  document.onmouseup = () => drag = false

  note.ondblclick = () => {
    if(note.classList.contains('crumple')) return;
    note.classList.add('crumple');
    note.addEventListener('animationend', () => note.remove(), { once: true });
  }
  reset.classList.remove('hidden')
}

// --- breath tool(ish) --------------------------------------------------
function breathTool(){
  const msg = document.createElement('div')
  msg.textContent = 'Inhale…'
  msg.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;font-size:2rem;'
  stage.appendChild(msg)
  let flip = false
  const id = setInterval(()=>{ msg.textContent = flip?'Inhale…':'Exhale…'; flip=!flip }, 3000)
  reset.classList.remove('hidden')
  reset.onclick = () => { clearInterval(id); location.reload() }
}

// ---------------- circle menu -----------------------------
function showCircleMenu(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="rage" style="background:#ea4335" title="Anger Blast"></div>
    <div class="circle-tool" data-tool="wreck" style="background:#fbbc04" title="Wrecking Ball"></div>
  `
  stage.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => pickCircleTool(c.dataset.tool, menu))
}

function pickCircleTool(tool,menu){
  menu.remove()
  if(tool==='rage')    angerReleaseTool()
  if(tool==='textBox') textBoxesTool()
  if(tool==='wreck')    wreckingBallTool()
}

// --------------- Matter.js text boxes tool ----------------
function textBoxesTool(){
  stage.innerHTML = ''
  const { Engine, Render, World, Bodies, Events } = Matter
  const engine = Engine.create()
  const width  = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: stage,
    engine,
    options:{ width, height, wireframes:false, background:'transparent' }
  })

  // walls
  const walls = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true })
  ]
  World.add(engine.world, walls)

  // use the original cause text to generate words
  const txt = (causeInp.value || 'hello world').trim()
  txt.split(/\s+/).forEach(word=>{
    if(!word) return
    const bw = Math.max(80, word.length*14)
    const box = Bodies.rectangle(Math.random()*(width-200)+100, -50, bw, 40, {
      restitution:0.7,
      render:{ fillStyle:'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0') }
    })
    box.label = word
    World.add(engine.world, box)
  })

  Engine.run(engine)
  Render.run(render)

  // draw text labels
  Events.on(render, 'afterRender', () => {
    const ctx = render.context
    ctx.font = '16px Poppins'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    engine.world.bodies.forEach(b=>{
      if(!b.label || b.isStatic) return
      ctx.save()
      ctx.translate(b.position.x, b.position.y)
      ctx.rotate(b.angle)
      ctx.fillText(b.label, 0, 0)
      ctx.restore()
    })
  })

  reset.classList.remove('hidden')
  reset.onclick = () => location.reload()
}

// --------------- Matter.js wrecking ball tool -------------
function wreckingBallTool(){
  stage.innerHTML = ''
  const { Engine, Render, World, Bodies, Constraint, Composites, Mouse, MouseConstraint } = Matter

  const engine = Engine.create()
  const width  = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: stage,
    engine,
    options: { width, height, wireframes:false, background:'transparent' }
  })

  // ground
  World.add(engine.world, [Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true })])

  // dense grid of blocks filling the lower half of the scene
  const blockSize = 24
  const cols = Math.floor(width / blockSize) - 2
  const rows = Math.floor(height / (blockSize * 2))
  const createStar = (cx, cy, rOuter) => {
    const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
    const spikes = 5
    const rInner = rOuter * 0.5
    const verts = []
    for(let i=0;i<spikes*2;i++){
      const r = i%2===0 ? rOuter : rInner
      const ang = (Math.PI / spikes) * i
      verts.push({ x: Math.cos(ang)*r, y: Math.sin(ang)*r })
    }
    const color = palette[Math.floor(Math.random()*palette.length)]
    return Bodies.fromVertices(cx, cy, [verts], {
      restitution:0.6,
      render:{ fillStyle: color }
    }, true)
  }

  const blockField = Composites.stack(blockSize, height - rows * blockSize - 50, cols, rows, 0, 0, (x, y) =>
    createStar(x, y, blockSize*0.6)
  )
  World.add(engine.world, blockField)

  // ball & rope
  const ball = Bodies.circle(200, 300, 80, { density:0.006, render:{ fillStyle:'#ea4335' } })
  const rope = Constraint.create({ pointA:{ x:200, y:50 }, bodyB:ball, stiffness:1, length:800 })
  World.add(engine.world, [ball, rope])

  // mouse control
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } })
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  Engine.run(engine)
  Render.run(render)

  reset.classList.remove('hidden')
  reset.onclick = () => location.reload()
}

// --------------- Anger blast tool ------------------------
function angerReleaseTool(){
  stage.innerHTML = ''
  const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, Vector } = Matter

  const engine = Engine.create()
  const width  = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: stage,
    engine,
    options:{ width, height, wireframes:false, background:'transparent' }
  })

  // walls
  const walls = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true })
  ]
  World.add(engine.world, walls)

  // fill with many boxes
  const size = 36
  const cols = Math.floor(width / size) - 2
  const rows = Math.floor(height / (size * 1.2))
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      const box = Bodies.rectangle(size + i*size, height - 60 - j*size, size, size, {
        restitution:0.4,
        render:{ fillStyle:'#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0') }
      })
      World.add(engine.world, box)
    }
  }

  // mouse for dragging bodies
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } })
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  // click explosions
  render.canvas.addEventListener('click', (e)=>{
    const rect = render.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const blastPower = 0.08
    const radius = 150
    engine.world.bodies.forEach(b=>{
      if(b.isStatic) return
      const dist = Vector.magnitude({ x: b.position.x - x, y: b.position.y - y })
      if(dist < radius){
        const force = Vector.mult(Vector.normalise({ x: b.position.x - x, y: b.position.y - y }), blastPower)
        Body.applyForce(b, b.position, force)
      }
    })
    // visual circle blast
    const blast = document.createElement('div')
    blast.style = `position:absolute;left:${x}px;top:${y}px;width:20px;height:20px;border-radius:50%;background:#ea4335;transform:translate(-50%,-50%);opacity:0.6;pointer-events:none;`
    stage.appendChild(blast)
    blast.animate([
      { transform:'translate(-50%,-50%) scale(0)', opacity:0.6 },
      { transform:`translate(-50%,-50%) scale(${radius/10})`, opacity:0 }
    ], { duration:600, easing:'ease-out' }).onfinish = () => blast.remove()
  })

  Engine.run(engine)
  Render.run(render)

  reset.classList.remove('hidden')
  reset.onclick = () => location.reload()
}

// reset straight reload
reset.onclick = () => location.reload()