function showWreckingBall(){
  pg.innerHTML = ''
  
  const { Engine, Render, World, Bodies, Events, Body, Vector, Constraint } = Matter

  const engine = Engine.create()
  const w = window.innerWidth
  const h = window.innerHeight

  const render = Render.create({
    element: pg,
    engine,
    options:{ width:w, height:h, wireframes:false, background:'transparent' }
  })

  const floor = Bodies.rectangle(w/2, h-25, w, 50, { 
    isStatic:true,
    render: { fillStyle: '#444' },
    collisionFilter: {
      category: 0x0004,
      mask: 0x0001 | 0x0002
    }
  })

  World.add(engine.world, floor)

  const blocks = []
  const blockSize = 40
  const blocksPerRow = 8
  const rows = 8
  
  for(let row = 0; row < rows; row++){
    const currentRowBlocks = Math.max(3, blocksPerRow - Math.floor(row / 2))
    
    for(let col = 0; col < currentRowBlocks; col++){
      const x = w/2 - (currentRowBlocks * blockSize)/2 + col * blockSize + blockSize/2
      const y = h - 75 - (row * (blockSize + 2))
      
      blocks.push(Bodies.rectangle(x, y, blockSize-1, blockSize-1, {
        render: { 
          fillStyle: `hsl(${(row * 30 + col * 15) % 360}, 70%, ${50 + row * 5}%)`,
          strokeStyle: '#222',
          lineWidth: 1
        },
        friction: 0.8,
        frictionAir: 0.01,
        density: 0.0003,
        restitution: 0.3,
        collisionFilter: {
          category: 0x0001,
          mask: 0x0002 | 0x0001 | 0x0004
        }
      }))
    }
  }

  World.add(engine.world, blocks)

  let mousePos = { x: w/2, y: h/2 }
  let lastMousePos = { x: w/2, y: h/2 }
  let mouseVel = { x: 0, y: 0 }
  const stickLen = 120
  const stickWidth = 12
  
  const stick = Bodies.rectangle(mousePos.x, mousePos.y, stickLen, stickWidth, {
    render: {
      fillStyle: '#8B4513',
      strokeStyle: '#654321',
      lineWidth: 2
    },
    friction: 0.9,
    frictionAir: 0.008,
    density: 0.012,
    restitution: 0.7,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001 | 0x0004
    }
  })

  blocks.forEach(block => {
    block.collisionFilter = {
      category: 0x0001,
      mask: 0x0002 | 0x0001 | 0x0004
    }
  })

  const anchor = Bodies.circle(mousePos.x, mousePos.y, 1, {
    isStatic: true,
    render: { visible: false },
    collisionFilter: {
      category: 0x0008,
      mask: 0x0000
    }
  })

  const stickConstraint = Constraint.create({
    bodyA: anchor,
    bodyB: stick,
    length: 60,
    stiffness: 0.4,
    damping: 0.15
  })

  World.add(engine.world, [stick, anchor, stickConstraint])

  Events.on(engine, 'beforeUpdate', () => {
    blocks.forEach(block => {
      const distance = Vector.magnitude(Vector.sub(stick.position, block.position))
      const minDistance = (stickLen + blockSize) / 2
      
      if (distance < minDistance && distance > 0) {
        const separation = Vector.mult(
          Vector.normalise(Vector.sub(stick.position, block.position)), 
          (minDistance - distance) * 0.1
        )
        Body.translate(stick, separation)
      }
    })
  })

  render.canvas.addEventListener('mousemove', (e) => {
    lastMousePos = { ...mousePos }
    mousePos.x = e.clientX
    mousePos.y = e.clientY
    
    mouseVel.x = (mousePos.x - lastMousePos.x) * 0.5
    mouseVel.y = (mousePos.y - lastMousePos.y) * 0.5
    
    Body.setPosition(anchor, { x: mousePos.x, y: mousePos.y })
    
    const velMag = Math.sqrt(mouseVel.x * mouseVel.x + mouseVel.y * mouseVel.y)
    if (velMag > 5) {
      const normVel = {
        x: mouseVel.x / velMag,
        y: mouseVel.y / velMag
      }
      const force = Vector.mult(normVel, Math.min(velMag * 0.001, 0.05))
      Body.applyForce(stick, stick.position, force)
    }
  })
  
  render.canvas.addEventListener('mousedown', (e) => {
    const forceDir = Vector.normalise(Vector.sub(stick.position, anchor.position))
    const swingForce = Vector.mult(forceDir, 0.15)
    
    Body.applyForce(stick, stick.position, swingForce)
    
    const spinDir = mouseVel.x > 0 ? 1 : -1
    Body.setAngularVelocity(stick, spinDir * 1.2)
  })

  render.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    
    const forceDir = Vector.normalise(Vector.sub(anchor.position, stick.position))
    const pullForce = Vector.mult(forceDir, 0.08)
    
    Body.applyForce(stick, stick.position, pullForce)
    Body.setAngularVelocity(stick, -1.5)
  })

  render.canvas.style.cursor = 'none'
  
  Engine.run(engine)
  Render.run(render)

  rst.classList.remove('hidden')
  rst.onclick = () => location.reload()
}
