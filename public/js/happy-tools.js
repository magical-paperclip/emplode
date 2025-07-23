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