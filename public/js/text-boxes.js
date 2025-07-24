// learning matter.js for text physics simulation
// figuring out how words can fall and bounce around

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
