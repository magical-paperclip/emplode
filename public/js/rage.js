function showRageTool(){
  pg.innerHTML = ''
  const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, Vector } = Matter

  const engine = Engine.create()
  const w = window.innerWidth
  const h = window.innerHeight

  const render = Render.create({
    element: pg,
    engine,
    options:{ width:w, height:h, wireframes:false, background:'transparent' }
  })

  const walls = [
    Bodies.rectangle(w/2, h+25, w, 50, { isStatic:true }),
    Bodies.rectangle(w/2, -25, w, 50, { isStatic:true }),
    Bodies.rectangle(-25, h/2, 50, h, { isStatic:true }),
    Bodies.rectangle(w+25, h/2, 50, h, { isStatic:true })
  ]
  World.add(engine.world, walls)

  const boxSize = 36
  const spacing = 4
  const cols = Math.floor(w / (boxSize+spacing)) - 2
  const rows = Math.floor(h / ((boxSize+spacing) * 1.2))
  const palette = getColors()
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      const color = palette[Math.floor(Math.random()*palette.length)]
      const x = boxSize + i*(boxSize+spacing)
      const y = h - 60 - j*(boxSize+spacing)
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
    const blast = document.createElement('div')
    blast.style = `position:absolute;left:${x}px;top:${y}px;width:20px;height:20px;border-radius:50%;background:#ea4335;transform:translate(-50%,-50%);opacity:0.6;pointer-events:none;`
    pg.appendChild(blast)
    blast.animate([
      { transform:'translate(-50%,-50%) scale(0)', opacity:0.6 },
      { transform:`translate(-50%,-50%) scale(${blastRadius/10})`, opacity:0 }
    ], { duration:600, easing:'ease-out' }).onfinish = () => blast.remove()
  })

  Engine.run(engine)
  Render.run(render)

  rst.classList.remove('hidden')
  rst.onclick = () => location.reload()
}

function showTextBoxes(){
  pg.innerHTML = ''
  const { Engine, Render, World, Bodies, Events } = Matter
  const engine = Engine.create()
  const w = window.innerWidth
  const h = window.innerHeight

  const render = Render.create({
    element: pg,
    engine,
    options:{ width:w, height:h, wireframes:false, background:'transparent' }
  })

  const walls = [
    Bodies.rectangle(w/2, h+25, w, 50, { isStatic:true }),
    Bodies.rectangle(w/2, -25, w, 50, { isStatic:true }),
    Bodies.rectangle(-25, h/2, 50, h, { isStatic:true }),
    Bodies.rectangle(w+25, h/2, 50, h, { isStatic:true })
  ]
  World.add(engine.world, walls)

  const txt = (inp.value || 'hello world').trim()
  txt.split(/\s+/).forEach(word=>{
    if(!word) return
    const boxWidth = Math.max(80, word.length*14)
    const box = Bodies.rectangle(Math.random()*(w-200)+100, -50, boxWidth, 40, {
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

  rst.classList.remove('hidden')
  rst.onclick = () => location.reload()
}
