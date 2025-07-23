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
  if(tool==='rage') showRageTool()
  if(tool==='textBox') showTextBoxes()
  if(tool==='wreck') showNoteCrumpling()
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