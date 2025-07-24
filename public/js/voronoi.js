// Voronoi diagram note crumpling effect
// Learning paper.js and computational geometry
// took me forever to get the coordinate systems right

function showNoteCrumpling(){
  pg.innerHTML = ''
  
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.cssText = 'position:fixed;top:0;left:0;cursor:grab;z-index:999;'
  pg.appendChild(canvas)
  
  paper.setup(canvas)

  if(typeof Voronoi === 'undefined') {
    console.error('Voronoi library not loaded')
    pg.innerHTML = '<div style="color:white;text-align:center;padding:50px;">Voronoi library failed to load</div>'
    return
  }
  
  const voronoi = new Voronoi()
  let sites = []
  let bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height} // paper.js uses different coords than regular canvas
  let diagram
  const spotColor = new paper.Color('#f5f5dc') // tried white first but too harsh
  let mousePos = paper.view.center
  let selected = false
  let crumpling = false
  
  // Stack Overflow saved me: generateBeeHivePoints algorithm from user @geometryMath
  sites = generateBeeHivePoints(80, true) // was 120 but too many cells, 60 too few

  const noteText = inp.value || 'anger'
  const text = new paper.PointText(paper.view.center)
  text.content = noteText
  text.fillColor = '#333' // dark gray works better than black
  text.fontSize = 32 // tried 24 but too small, 48 too big
  text.fontFamily = 'Poppins'
  text.justification = 'center'
  
  renderDiagram()
  
  function onMouseDown(event) {
    if(!crumpling){
      sites.push(event.point) // adds new voronoi site at click position
      renderDiagram()
    }
  }
  
  function onMouseMove(event) {
    mousePos = event.point
    // fix: only modify sites when not crumpling and limit additions
    if(!crumpling && event.count == 0 && sites.length < 200) // prevent too many sites causing lag
      sites.push(event.point)
    if(!crumpling && sites.length > 0 && event.count > 0)
      sites[sites.length - 1] = event.point // move last site with mouse only when dragging
    renderDiagram()
  }
  
  function onDoubleClick(event) {
    crumpling = true
    canvas.style.cursor = 'default'
    
    // move all sites toward center with some randomness - creates crumpling effect
    sites.forEach(site => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50 // was 100 but too spread out
      site.targetX = paper.view.center.x + Math.cos(angle) * distance
      site.targetY = paper.view.center.y + Math.sin(angle) * distance
    })
    
    text.opacity = 0.3 // fade text during crumpling
    
    animateCrumple()
  }
  
  function animateCrumple(){
    if(!crumpling) return
    
    sites.forEach(site => {
      if(site.targetX && site.targetY){
        site.x += (site.targetX - site.x) * 0.05 // slow easing, was 0.1 but too fast
        site.y += (site.targetY - site.y) * 0.05
      }
    })
    
    renderDiagram()
    requestAnimationFrame(animateCrumple) // smooth 60fps animation
  }

  function renderDiagram() {
    paper.project.activeLayer.children = [] // clear canvas - took me a while to figure this out
    
    paper.project.activeLayer.addChild(text) // make sure text stays on top
    
    // found this voronoi.compute pattern on Stack Overflow after hours of reading docs
    const diagram = voronoi.compute(sites, bbox)
    if (diagram) {
      // fix: need to properly map sites to cells using diagram.cells array
      diagram.cells.forEach((cell, index) => {
        if (cell) {
          const halfedges = cell.halfedges // voronoi cells are made of halfedges
          const length = halfedges.length
          if (length > 2) { // need at least 3 edges to make a polygon
            const points = []
            for (let j = 0; j < length; j++) {
              const v = halfedges[j].getEndpoint()
              if(v) points.push(new paper.Point(v)) // null check prevents crashes
            }
            if(points.length > 2) createPath(points, cell.site) // use cell.site instead of sites[i]
          }
        }
      })
    }
  }
  
  function createPath(points, center) {
    const path = new paper.Path()
    if (!selected) { 
      path.fillColor = spotColor
      path.strokeColor = '#ddd' // light gray borders
      path.strokeWidth = 1 // tried 2 but too thick
    } else {
      path.fullySelected = selected
    }
    path.closed = true // close the polygon
    
    for(let i = 0; i < points.length; i++) {
      path.add(points[i])
    }
    
    if(!crumpling){
      path.smooth() // makes curves look more natural, breaks during crumpling though
    }
  }
  
     function generateBeeHivePoints(size, loose) {
     const points = []
     const cols = Math.floor(paper.view.size.width / size)
     const rows = Math.floor(paper.view.size.height / size)
     
     for(let i = 0; i < cols; i++) {
       for(let j = 0; j < rows; j++) {
         let x = i * size + size/2
         let y = j * size + size/2
         
         if(j % 2) x += size/2 // offset every other row for hexagon pattern
         
         if(loose) {
           x += (Math.random() - 0.5) * size * 0.3 // was 0.5 but too chaotic
           y += (Math.random() - 0.5) * size * 0.3
         }
         
         points.push(new paper.Point(x, y))
       }
     }
     return points
   }
  
     function onResize() {
     bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height} // update bounding box on resize
     renderDiagram() // redraw everything
   }
  
  // attach event handlers to paper.js view
  paper.view.onMouseDown = onMouseDown
  paper.view.onMouseMove = onMouseMove  
  paper.view.onDoubleClick = onDoubleClick // double click to crumple
  paper.view.onResize = onResize
  
  renderDiagram() // initial render

  rst.classList.remove('hidden') // show reset button
  rst.onclick = () => location.reload() // lazy way to reset everything
}
