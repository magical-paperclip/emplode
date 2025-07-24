// happiness effects - learning particle systems and confetti
// trying to make celebration animations

function showHappyTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="confetti" style="background:#34a853" title="Confetti Burst"></div>
    <div class="circle-tool" data-tool="fireworks" style="background:#0f9d58" title="Fireworks"></div>
    <div class="circle-tool" data-tool="sparkles" style="background:#137333" title="Sparkle Effect"></div>
  `
  playground.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectHappyTool(c.dataset.tool, menu))
}

function selectHappyTool(tool, menu){
  menu.remove()
  if(tool==='confetti') showHappyTool()
  if(tool==='fireworks') showFireworks()  
  if(tool==='sparkles') showSparkles()
}

function showHappyTool(){
  playground.innerHTML='';
  runHappyTool('confetti');
  resetBtn.classList.remove('hidden');
}

function runHappyTool(type) {
  if (type === 'confetti') {
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
  }
}

function showFireworks(){
  playground.innerHTML = ''
  
  // fireworks with canvas - learned from animation tutorials
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.cssText = 'position:fixed;top:0;left:0;background:#000;'
  playground.appendChild(canvas)
  
  const ctx = canvas.getContext('2d')
  const fireworks = []
  const particles = []
  
  class Firework {
    constructor(x, y, targetX, targetY) {
      this.x = x
      this.y = y
      this.targetX = targetX
      this.targetY = targetY
      this.distanceToTarget = Math.sqrt(Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2))
      this.distanceTraveled = 0
      this.coordinates = []
      this.coordinateCount = 3
      
      // populate coordinates with current position
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y])
      }
      
      this.angle = Math.atan2(targetY - y, targetX - x)
      this.speed = 2
      this.acceleration = 1.05
      this.brightness = Math.random() * 50 + 50
      this.targetRadius = 1
    }
    
    update(index) {
      this.coordinates.pop()
      this.coordinates.unshift([this.x, this.y])
      
      if (this.targetRadius < 8) {
        this.targetRadius += 0.3
      } else {
        this.targetRadius = 1
      }
      
      this.speed *= this.acceleration
      
      const vx = Math.cos(this.angle) * this.speed
      const vy = Math.sin(this.angle) * this.speed
      this.distanceTraveled = Math.sqrt(Math.pow(this.x + vx - this.x, 2) + Math.pow(this.y + vy - this.y, 2))
      
      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.targetX, this.targetY)
        fireworks.splice(index, 1)
      } else {
        this.x += vx
        this.y += vy
      }
    }
    
    draw() {
      ctx.beginPath()
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1])
      ctx.lineTo(this.x, this.y)
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(this.targetX, this.targetY, this.targetRadius, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
  
  class Particle {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.coordinates = []
      this.coordinateCount = 5
      
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y])
      }
      
      this.angle = Math.random() * Math.PI * 2
      this.speed = Math.random() * 10 + 1
      this.friction = 0.95
      this.gravity = 1
      this.hue = Math.random() * 360
      this.brightness = Math.random() * 80 + 50
      this.alpha = 1
      this.decay = Math.random() * 0.03 + 0.015
    }
    
    update(index) {
      this.coordinates.pop()
      this.coordinates.unshift([this.x, this.y])
      
      this.speed *= this.friction
      this.x += Math.cos(this.angle) * this.speed
      this.y += Math.sin(this.angle) * this.speed + this.gravity
      this.alpha -= this.decay
      
      if (this.alpha <= this.decay) {
        particles.splice(index, 1)
      }
    }
    
    draw() {
      ctx.beginPath()
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1])
      ctx.lineTo(this.x, this.y)
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`
      ctx.stroke()
    }
  }
  
  function createParticles(x, y) {
    let particleCount = 30
    while (particleCount--) {
      particles.push(new Particle(x, y))
    }
  }
  
  function loop() {
    requestAnimationFrame(loop)
    
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'lighter'
    
    let i = fireworks.length
    while (i--) {
      fireworks[i].draw()
      fireworks[i].update(i)
    }
    
    let j = particles.length
    while (j--) {
      particles[j].draw()
      particles[j].update(j)
    }
    
    // auto launch fireworks
    if (Math.random() < 0.05) {
      fireworks.push(new Firework(
        canvas.width / 2,
        canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height / 2
      ))
    }
  }
  
  canvas.addEventListener('click', (e) => {
    fireworks.push(new Firework(
      canvas.width / 2,
      canvas.height,
      e.clientX,
      e.clientY
    ))
  })
  
  loop()
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

function showSparkles(){
  playground.innerHTML = ''
  
  // sparkle trail effect following mouse
  const sparkles = []
  
  function createSparkle(x, y) {
    const sparkle = document.createElement('div')
    const size = Math.random() * 6 + 2
    
    sparkle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.8);
      z-index: 1000;
    `
    
    playground.appendChild(sparkle)
    sparkles.push(sparkle)
    
    // animate sparkle
    sparkle.animate([
      { opacity: 1, transform: 'scale(0)' },
      { opacity: 0.8, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0)' }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).onfinish = () => {
      sparkle.remove()
      const index = sparkles.indexOf(sparkle)
      if (index > -1) sparkles.splice(index, 1)
    }
  }
  
  let mouseTrail = []
  
  playground.addEventListener('mousemove', (e) => {
    mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() })
    
    // limit trail length
    if (mouseTrail.length > 10) {
      mouseTrail.shift()
    }
    
    // create sparkles along trail
    if (Math.random() < 0.3) {
      const trailPoint = mouseTrail[Math.floor(Math.random() * mouseTrail.length)]
      createSparkle(
        trailPoint.x + (Math.random() - 0.5) * 20,
        trailPoint.y + (Math.random() - 0.5) * 20
      )
    }
  })
  
  playground.addEventListener('click', (e) => {
    // burst of sparkles on click
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        createSparkle(
          e.clientX + (Math.random() - 0.5) * 60,
          e.clientY + (Math.random() - 0.5) * 60
        )
      }, i * 50)
    }
  })
  
  const instructions = document.createElement('div')
  instructions.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 20px;
    text-align: center;
    font-family: Poppins;
  `
  instructions.textContent = 'Move your mouse to create sparkles! ✨'
  playground.appendChild(instructions)
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
} 