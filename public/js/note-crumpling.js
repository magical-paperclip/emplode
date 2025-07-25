// Simple note crumpling - no libraries, just works
// using the same code as voronoi.js but here for compatibility

// LEARNING NOTES: spent hours trying to get rhill-voronoi-core working
// kept getting "Voronoi library not loaded" errors, tried CDN links, local files
// paper.js coordinate system was confusing too (y-axis flipped?)
// gave up on fancy voronoi diagrams - just using DOM squares instead
// sometimes the simple solution is better than the "proper" one

function showNoteCrumpling(){
  playground.innerHTML = ''
  
  // dead simple - just scattered squares that crumple  
  // originally tried complex voronoi cells but libraries kept breaking
  const causeInput = document.getElementById('cInp')
  const noteText = causeInput?.value || 'anger'
  
  // create background
  const bg = document.createElement('div')
  bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#222;z-index:999;'
  playground.appendChild(bg)
  
  // show the text in center
  // tried using canvas first but DOM is so much easier for text rendering
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
  // BREAKTHROUGH: instead of voronoi cells, just make random squares bc its prob easier to learn this time
  // much more reliable than depending on external libraries
  const squares = []
  for(let i = 0; i < 100; i++) {
    const square = document.createElement('div')
    const size = 20 + Math.random() * 30  // varied sizes look more natural
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
    
    // store position for later animation calculations
    // learned this from debugging - need original positions for transforms
    squares.push({element: square, x, y, size})
    bg.appendChild(square)
  }
  
  // click anywhere to crumple
  // originally tried onDoubleClick but single click feels more responsive
  bg.addEventListener('click', () => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    
    // shrink and fade text
    // simple DOM transforms work better than canvas animations
    text.style.transform = 'translate(-50%,-50%) scale(0.3)'
    text.style.opacity = '0.3'
    
    // crumple all squares to center
    // KEY INSIGHT: stagger the animations with setTimeout for realistic effect
    squares.forEach((sq, i) => {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 100  // some randomness so not perfect circle
        
        // transform relative to original position - took me forever to figure this out
        // translate(centerX - sq.x + offset) moves square from original pos to center+offset
        sq.element.style.transform = `translate(${centerX - sq.x + Math.cos(angle) * distance}px, ${centerY - sq.y + Math.sin(angle) * distance}px) scale(0.1) rotate(${Math.random() * 720}deg)`
        sq.element.style.opacity = '0.4'
      }, i * 10)  // 10ms delay between each square = smooth wave effect
    })
  })
  
  // reset functionality - reload is lazy but it works
  // tried to manually reset all transforms but reload is more reliable
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
} 