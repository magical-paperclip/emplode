function showHappyTool(){
  pg.innerHTML='';
  runHappyTool('confetti');
  rst.classList.remove('hidden');
}

function runHappyTool(type) {
  if (type === 'emojis') {
    const drop = (count=20)=>{
      for(let i=0;i<count;i++){
        const emoji = document.createElement('div')
        emoji.textContent=':)'
        emoji.style.position='fixed'
        emoji.style.left = Math.random()*window.innerWidth+'px'
        emoji.style.top = '-40px'
        emoji.style.fontSize = 24 + Math.random()*24 +'px'
        emoji.style.color = ['#fff176','#ffe57f','#fff59d'][Math.floor(Math.random()*3)]
        emoji.style.pointerEvents='none'
        pg.appendChild(emoji)
      const dur = 4000 + Math.random()*3000
        emoji.animate([
        { transform:'translateY(0)', opacity:1 },
        { transform:`translateY(${window.innerHeight+60}px)`, opacity:0.3 }
        ], { duration:dur, easing:'linear' }).onfinish = () => emoji.remove()
    }
  }
    drop(30)
    setInterval(() => drop(5), 2000)
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
        pg.appendChild(bubble)
        const dur = 6000 + Math.random()*4000
        bubble.animate([
          { transform:'translateY(0) scale(0)', opacity:0.8 },
          { transform:`translateY(-${window.innerHeight + 100}px) scale(1)`, opacity:0 }
        ], { duration:dur, easing:'ease-out' }).onfinish = () => bubble.remove()
      }
    }
    makeBubbles(20)
    setInterval(() => makeBubbles(3), 1500)
  } else if (type === 'confetti') {
   const ground = document.createElement('div')
   ground.style.cssText = 'position:fixed;bottom:0;left:0;width:100%;height:50px;background:transparent;z-index:997;'
   pg.appendChild(ground)
   
   const drop = (count=10) => {
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
       pg.appendChild(piece)
       
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
   drop(15)
   setInterval(() => drop(3), 2500)
   const click = (e) => {
     const cx = e.clientX
     const cy = e.clientY
     
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
           left:${cx}px;
           top:${cy}px;
           width:${isRect ? size*2 : size}px;
           height:${size}px;
           background:${colors[Math.floor(Math.random()*colors.length)]};
           border-radius:${isRect ? '0' : '50%'};
           pointer-events:none;
           z-index:998;
         `
         pg.appendChild(piece)
         
         const dur = 2000 + Math.random() * 1000
         const finalX = Math.max(0, Math.min(window.innerWidth, cx + dx / 3))
         const finalY = window.innerHeight - 50 - Math.random() * 30
         
         piece.animate([
           { transform:'translate(0,0) rotate(0deg)', opacity:1 },
           { transform:`translate(${dx/3}px,${dy/2}px) rotate(${Math.random()*180}deg)`, opacity:1, offset:0.3 },
           { transform:`translate(${dx/3}px,${finalY - cy}px) rotate(${Math.random()*360}deg)`, opacity:0.8 }
         ], { duration:dur, easing:'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => {
           piece.style.left = finalX + 'px'
           piece.style.top = finalY + 'px'
           piece.style.transform = `rotate(${Math.random()*360}deg)`
           piece.style.opacity = '0.7'
         }
       }
     }
     burst(35)
   }
   document.addEventListener('click', click)
 } else if (type === 'rainbow') {
   const canvas = document.createElement('canvas')
   canvas.width = window.innerWidth
   canvas.height = window.innerHeight
   canvas.style = 'position:fixed;top:0;left:0;pointer-events:none;z-index:998'
   pg.appendChild(canvas)
   
   const ctx = canvas.getContext('2d')
   let hue = 0
   
   const drawRainbow = () => {
     ctx.clearRect(0, 0, canvas.width, canvas.height)
     const cx = canvas.width / 2
     const cy = canvas.height / 2
     
     for(let i=0; i<7; i++){
       ctx.beginPath()
       ctx.arc(cx, cy + 100, 200 - i*15, 0, Math.PI)
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
