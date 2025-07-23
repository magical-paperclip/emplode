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
  let bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height}
  let diagram
  const spotColor = new paper.Color('#f5f5dc')
  let mousePos = paper.view.center
  let selected = false
  let crumpling = false
  
  sites = generateBeeHivePoints(80, true)

  const noteText = inp.value || 'anger'
  const text = new paper.PointText(paper.view.center)
  text.content = noteText
  text.fillColor = '#333'
  text.fontSize = 32
  text.fontFamily = 'Poppins'
  text.justification = 'center'
  
  renderDiagram()
  
  function onMouseDown(event) {
    if(!crumpling){
      sites.push(event.point)
      renderDiagram()
    }
  }
  
  function onMouseMove(event) {
    mousePos = event.point
    if(!crumpling && event.count == 0)
      sites.push(event.point)
    if(!crumpling && sites.length > 0)
      sites[sites.length - 1] = event.point
    renderDiagram()
  }
  
  function onDoubleClick(event) {
    crumpling = true
    canvas.style.cursor = 'default'
    
    sites.forEach(site => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50
      site.targetX = paper.view.center.x + Math.cos(angle) * distance
      site.targetY = paper.view.center.y + Math.sin(angle) * distance
    })
    
    text.opacity = 0.3
    
    animateCrumple()
  }
  
  function animateCrumple(){
    if(!crumpling) return
    
    sites.forEach(site => {
      if(site.targetX && site.targetY){
        site.x += (site.targetX - site.x) * 0.05
        site.y += (site.targetY - site.y) * 0.05
      }
    })
    
    renderDiagram()
    requestAnimationFrame(animateCrumple)
  }

  function renderDiagram() {
    paper.project.activeLayer.children = []
    
    paper.project.activeLayer.addChild(text)
    
    const diagram = voronoi.compute(sites, bbox)
    if (diagram) {
      for (let i = 0, l = sites.length; i < l; i++) {
        const cell = diagram.cells[sites[i].voronoiId]
        if (cell) {
          const halfedges = cell.halfedges
          const length = halfedges.length
          if (length > 2) {
            const points = []
            for (let j = 0; j < length; j++) {
              const v = halfedges[j].getEndpoint()
              points.push(new paper.Point(v))
            }
            createPath(points, sites[i])
          }
        }
      }
    }
  }
  
  function createPath(points, center) {
    const path = new paper.Path()
    if (!selected) { 
      path.fillColor = spotColor
      path.strokeColor = '#ddd'
      path.strokeWidth = 1
    } else {
      path.fullySelected = selected
    }
    path.closed = true
    
    for(let i = 0; i < points.length; i++) {
      path.add(points[i])
    }
    
    if(!crumpling){
      path.smooth()
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
         
         if(j % 2) x += size/2
         
         if(loose) {
           x += (Math.random() - 0.5) * size * 0.3
           y += (Math.random() - 0.5) * size * 0.3
         }
         
         points.push(new paper.Point(x, y))
       }
     }
     return points
   }
  
     function onResize() {
     bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height}
     renderDiagram()
   }
  
  paper.view.onMouseDown = onMouseDown
  paper.view.onMouseMove = onMouseMove  
  paper.view.onDoubleClick = onDoubleClick
  paper.view.onResize = onResize
  
  renderDiagram()

  rst.classList.remove('hidden')
  rst.onclick = () => location.reload()
}
