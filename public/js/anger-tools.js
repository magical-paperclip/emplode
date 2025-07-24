// Learning matter.js physics for interactive destruction - anger tools
// figuring out how to make satisfying destruction effects

function showAngerTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="rage" style="background:#ea4335" title="Anger Blast"></div>
    <div class="circle-tool" data-tool="wreck" style="background:#c62828" title="Wrecking Ball"></div>
    <div class="circle-tool" data-tool="voronoi" style="background:#b71c1c" title="Voronoi Crumple"></div>
    <div class="circle-tool" data-tool="textBox" style="background:#d32f2f" title="Text Physics"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectCircleTool(c.dataset.tool, menu))
}

function selectCircleTool(tool,menu){
  menu.remove()
  if(tool==='rage')    showRageTool()
  if(tool==='textBox') showTextBoxes()
  if(tool==='wreck')    showWreckingBall()
  if(tool==='voronoi') showNoteCrumpling()
}
  menu.innerHTML = `
    <div class="circle-tool" data-tool="rage" style="background:#ea4335" title="Anger Blast"></div>
    <div class="circle-tool" data-tool="wreck" style="background:#c62828" title="Wrecking Ball"></div>
    <div class="circle-tool" data-tool="voronoi" style="background:#b71c1c" title="Voronoi Crumple"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectCircleTool(c.dataset.tool, menu))
}

function selectCircleTool(tool,menu){
  menu.remove()
  if(tool==='rage') showRageTool()
  if(tool==='textBox') showTextBoxes()
  if(tool==='wreck') showWreckingBall()
  if(tool==='voronoi') showNoteCrumpling()
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

  const boxSize = 36 // tried 32 but too small, 40 felt chunky
  const spacing = 4 // was 2 originally but boxes stuck together
  const columns = Math.floor(width / (boxSize+spacing)) - 2
  const rows = Math.floor(height / ((boxSize+spacing) * 1.2))
  const palette = getColors()
  // grid layout algorithm from Stack Overflow - way cleaner than my random approach
  for(let i=0;i<columns;i++){
    for(let j=0;j<rows;j++){
      const color = palette[Math.floor(Math.random()*palette.length)]
      const x = boxSize + i*(boxSize+spacing)
      const y = height - 60 - j*(boxSize+spacing)
      const box = Bodies.rectangle(x, y, boxSize, boxSize, {
        restitution:0.4, // was 0.6 but boxes bounced forever
        render:{ fillStyle: color }
      })
      World.add(engine.world, box)
    }
  }

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } }) // was 0.8 but dragging felt weird
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  render.canvas.addEventListener('click', (e)=>{
    const rect = render.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const blastPower = 0.08 // started at 0.1 but too violent, 0.05 too weak
    const blastRadius = 150 // tried 100 first but felt limited, 200 too huge
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
    ], { duration:600, easing:'ease-out' }).onfinish = () => blastEffect.remove() // 400ms felt rushed, 800ms dragged
  })

  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
} 

function showWreckingBall(){
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

  // Create walls
  const walls = [
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic:true }),
    Bodies.rectangle(width/2, -25, width, 50, { isStatic:true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic:true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic:true })
  ]

  // Create destructible blocks representing frustrations
  const blocks = []
  for(let i=0; i<15; i++){ // tried 20 but too crowded, 10 felt empty
    blocks.push(Bodies.rectangle(
      Math.random() * width, 
      Math.random() * height/2, 
      40, 40, // was 30x30 but hard to hit, 50x50 too big
      { render: { fillStyle: '#ff5252' } }
    ))
  }

  // Create wrecking ball
  const ball = Bodies.circle(width/2, 50, 30, { // radius 25 felt small, 35 too heavy
    render: { fillStyle: '#b71c1c' },
    density: 0.01 // was 0.02 but ball moved too slow, 0.005 too light
  })

  World.add(engine.world, [...walls, ...blocks, ball])

  // Mouse control for throwing the ball
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } } // tried 0.8 first but felt rigid
  })
  World.add(engine.world, mouseConstraint)

  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
} 