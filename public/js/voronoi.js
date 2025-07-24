// Simple note crumpling - no libraries, just works
// tired of all the voronoi bs, keeping it basic

function showNoteCrumpling(){
  playground.innerHTML = ''
  
  // dead simple - just scattered squares that crumple
  const noteText = document.getElementById('cInp')?.value || 'anger'
  
  // create background
  const bg = document.createElement('div')
  bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#222;z-index:999;'
  playground.appendChild(bg)
  
  // show the text in center
  const text = document.createElement('div')
  text.textContent = noteText
  text.style.cssText = `
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    color:#fff;font-size:48px;font-family:Poppins;font-weight:bold;
    text-shadow:2px 2px 4px rgba(0,0,0,0.8);z-index:1001;
    transition:all 1s ease;
  `
  bg.appendChild(text)
  
  // create simple squares scattered around
  const squares = []
  for(let i = 0; i < 100; i++) {
    const square = document.createElement('div')
    const size = 20 + Math.random() * 30
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    
    square.style.cssText = `
      position:absolute;
      left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      background:#f5f5dc;
      border:1px solid #ccc;
      transition:all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `
    
    squares.push({element: square, x, y, size})
    bg.appendChild(square)
  }
  
  // click anywhere to crumple
  bg.addEventListener('click', () => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    // shrink and fade text
    text.style.transform = 'translate(-50%,-50%) scale(0.3)'
    text.style.opacity = '0.3'
    
    // crumple all squares to center
    squares.forEach((sq, i) => {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 100
        const targetX = centerX + Math.cos(angle) * distance
        const targetY = centerY + Math.sin(angle) * distance
        
        sq.element.style.left = targetX + 'px'
        sq.element.style.top = targetY + 'px'
        sq.element.style.transform = `rotate(${Math.random() * 720}deg) scale(0.3)`
        sq.element.style.opacity = '0.7'
      }, i * 10)
    })
  })
  
  // add simple instruction
  const instruction = document.createElement('div')
  instruction.textContent = 'Click anywhere to crumple'
  instruction.style.cssText = `
    position:absolute;bottom:30px;left:50%;transform:translateX(-50%);
    color:#999;font-size:16px;font-family:Poppins;
  `
  bg.appendChild(instruction)
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}
