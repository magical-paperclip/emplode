const modal = document.getElementById('mdl')
const moodBtns = [...document.querySelectorAll('.mBtn')]
let selectedMood = null
const cf = document.getElementById('cf')

function getColors(){
  if(selectedMood === 'angry')
    return ['#b71c1c','#c62828','#d32f2f','#e53935','#f44336','#ff5252']
  return ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
}

const inp = document.getElementById('cInp')
const go = document.getElementById('goBtn')
var pg = document.getElementById('playground')
let rst = document.getElementById('rst')
const help = document.getElementById('tutorial')
let isDrawing = false

help.onclick = showTutorial

function showTutorial(){
  if(document.querySelector('#tutorialPopup')) return
  let colors=[
    ['#ea4335','anger'],
    ['#fbbc04','anxiety'],
    ['#fdd835','happiness'],
    ['#34a853','calm'],
    ['#4285f4','thoughtful'],
    ['#a142f4','creative']
  ]
  const popup=document.createElement('div');
  popup.id='tutorialPopup';
  popup.className='tutorial-modal';
  popup.innerHTML=`
    <div class="tutorial-box">
      <h2 style="margin:0;text-align:center">mood colours</h2>
      ${colors.map(([hex,name])=>`<div class="tutorial-row"><div class="tutorial-circle" style="background:${hex}"></div><span>${name}</span></div>`).join('')}
      <button class="tutorial-close">close</button>
    </div>
  `;
  popup.querySelector('.tutorial-close').onclick=()=>popup.remove();
  document.body.appendChild(popup);
}

moodBtns.forEach(btn=>btn.onclick = () => {
  selectedMood = btn.dataset.mood;
  modal.classList.add('hidden');
  cf.classList.remove('hidden');
  inp.focus();
  document.body.className = `mood-${selectedMood}`;
});

go.onclick = () => {
  if(!inp.value.trim()) return;
  cf.classList.add('hidden');
  
  if(selectedMood === 'angry'){
    showAngerTools();
  }else if(selectedMood === 'anxiety'){
    showAnxietyTools();
  }else if(selectedMood === 'happy'){
    showHappyTool();
  }else{
    showBreathTool();
  }

  function showAnxietyTools(){
    let menu = document.createElement('div');
    menu.id = 'circleMenu';
    menu.innerHTML = `
      <div class="circle-tool" data-t="journal" style="background:#fbbc04" title="Journal"></div>
      <div class="circle-tool" data-t="whiteboard" style="background:#f9a825" title="Whiteboard"></div>
    `;
    pg.appendChild(menu);
    menu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectAnxietyTool(b.dataset.t, menu));
  }

  function selectAnxietyTool(tool, menu){
    menu.remove();
    if(tool==='journal') showJournal();
    if(tool==='whiteboard') showWhiteboard();
  }

  function showJournal(){
    var box = document.createElement('div');
    box.className = 'journal-container journal-full';

    const txt = document.createElement('textarea');
    txt.placeholder = 'Write it out…';
    txt.className = 'journal-input';
    txt.style.flex='1';
    txt.style.minHeight='0';
    let palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4'];
    var col = palette[0];
    txt.style.color = col;
    box.appendChild(txt);

    const colors = document.createElement('div');
    colors.className = 'journal-color-row';
    palette.forEach(color=>{
      const dot = document.createElement('div');
      dot.className = 'color-dot';
      dot.style.background = color;
      if(color===col) dot.classList.add('active');
      dot.onclick = ()=>{
        col = color;
        txt.style.color = color;
        ;[...colors.children].forEach(d=>d.classList.toggle('active', d===dot));
      };
      colors.appendChild(dot);
    });
    box.appendChild(colors);

    let btns = document.createElement('div');
    btns.className = 'journal-btn-row';

    const save = document.createElement('button');
    save.textContent = 'save';
    save.className = 'tool';
    save.style.cssText = 'background:#fbbc04;color:#202124';

    var done = document.createElement('button');
    done.textContent = 'done';
    done.className = 'tool';
    done.style.cssText = 'background:#fbbc04;color:#202124';
    done.onclick = () => { location.reload(); };

    btns.appendChild(save);
    btns.appendChild(done);
    box.appendChild(btns);

    const toggle = document.createElement('button');
    toggle.textContent = 'past journals';
    toggle.className = 'tool';
    toggle.style.cssText = 'background:#5f6368;margin-top:0.6rem';
    box.appendChild(toggle);

    let list = document.createElement('div');
    list.className = 'journal-list';
    list.style.display = 'none';
    list.style.flex = '1';
    box.appendChild(list);
    toggle.onclick = () => {
      list.style.display = list.style.display==='none' ? 'block' : 'none';
    };

    txt.addEventListener('input', ()=>{
      txt.style.height = 'auto';
      txt.style.height = Math.min(txt.scrollHeight+2, window.innerHeight*0.4) + 'px';
    });

    function load() {
      list.innerHTML = '';
      const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]');
      entries.slice().reverse().forEach(entry=>{
        let text, color;
        if(typeof entry === 'string'){ 
          text = entry; 
          color = '#e8eaed'; 
        } else { 
          text = entry.t; 
          color = entry.c || '#e8eaed'; 
        }
        var el = document.createElement('div');
        el.className = 'entry-text';
        el.textContent = text;
        el.style.color = color;
        list.appendChild(el);
      });
    }

    load();

    save.onclick = () => {
      const text = txt.value.trim();
      if(!text) return;
      let entries = JSON.parse(localStorage.getItem('journalEntries')||'[]');
      entries.push({t:text,c:col});
      localStorage.setItem('journalEntries', JSON.stringify(entries));
      txt.value = '';
      load();
    };

    pg.appendChild(box);
    txt.focus();
    rst.classList.remove('hidden');
  }

  function showWhiteboard(){
    let canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style = 'position:fixed;top:0;left:0;cursor:crosshair;z-index:999;background:rgba(0,0,0,0.05)';
    pg.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4'];
    let brush = '#fbbc04';
    ctx.strokeStyle = brush;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    var drawing = false;
    let lastX = 0, lastY = 0;

    const start = e => {
      drawing = true;
      ;({clientX:lastX, clientY:lastY} = e);
    };
    const draw = e => {
      if(!drawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const stop = () => drawing = false;

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stop);

    let toolbar = document.createElement('div');
    toolbar.style = 'position:fixed;top:20px;left:50%;translate:-50% 0;display:flex;gap:18px;align-items:center;z-index:1001';

    var colorRow = document.createElement('div');
    colorRow.className = 'journal-color-row';
    palette.forEach(color=>{
      const dot = document.createElement('div');
      dot.className = 'color-dot';
      dot.style.background = color;
      if(color===brush) dot.classList.add('active');
      dot.onclick = () => {
        brush = color;
        ctx.strokeStyle = color;
        ;[...colorRow.children].forEach(d=>d.classList.toggle('active', d===dot));
      };
      colorRow.appendChild(dot);
    });

    toolbar.appendChild(colorRow);

    const clear = document.createElement('button');
    clear.textContent = 'clear';
    clear.className = 'tool';
    clear.style.background = '#fbbc04';
    clear.style.color = '#202124';
    clear.onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height); };

    const close = document.createElement('button');
    close.textContent = 'done';
    close.className = 'tool';
    close.style.background = '#fbbc04';
    close.style.color = '#202124';
    close.onclick = () => { location.reload(); };

    toolbar.appendChild(clear);
    toolbar.appendChild(close);
    pg.appendChild(toolbar);

    rst.classList.remove('hidden');
  }

  function showHappyTool(){
    pg.innerHTML='';
    runHappyTool('confetti');
    rst.classList.remove('hidden');
  }
  
  function runHappyTool(type) {
    if (type === 'emojis') {
      function drop(count=20){
        for(let i=0;i<count;i++){
          var emoji = document.createElement('div');
          emoji.textContent=':)';
          emoji.style.position='fixed';
          emoji.style.left = Math.random()*window.innerWidth+'px';
          emoji.style.top = '-40px';
          emoji.style.fontSize = 24 + Math.random()*24 +'px';
          emoji.style.color = ['#fff176','#ffe57f','#fff59d'][Math.floor(Math.random()*3)];
          emoji.style.pointerEvents='none';
          pg.appendChild(emoji);
        const dur = 4000 + Math.random()*3000;
          emoji.animate([
          { transform:'translateY(0)', opacity:1 },
          { transform:`translateY(${window.innerHeight+60}px)`, opacity:0.3 }
          ], { duration:dur, easing:'linear' }).onfinish = () => emoji.remove();
      }
    }
      drop(30);
      setInterval(() => drop(5), 2000);
    } else if (type === 'bubbles') {
      const makeBubbles = (count=15) => {
        for(let i=0;i<count;i++){
          var bubble = document.createElement('div');
          const size = 20 + Math.random()*40;
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
          `;
          pg.appendChild(bubble);
          let dur = 6000 + Math.random()*4000;
          bubble.animate([
            { transform:'translateY(0) scale(0)', opacity:0.8 },
            { transform:`translateY(-${window.innerHeight + 100}px) scale(1)`, opacity:0 }
          ], { duration:dur, easing:'ease-out' }).onfinish = () => bubble.remove();
        }
      };
      makeBubbles(20);
      setInterval(() => makeBubbles(3), 1500);
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

}

function showTools(){
  const toolsMenu = document.createElement('div')
  toolsMenu.id = 'circleMenu'
  toolsMenu.innerHTML = `
    <div class="circle-tool" data-t="note" style="background:#34a853" title="Crumple Note"></div>
    <div class="circle-tool" data-t="breath" style="background:#4285f4" title="Deep Breath"></div>
  `
  playground.appendChild(toolsMenu)
  toolsMenu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectTool(b.dataset.t,toolsMenu))
}

function selectTool(tool,menu){
  menu.remove()
  if(tool==='note') showStickyNote()
  if(tool==='breath') showBreathTool()
}

function showStickyNote(){
  const note = document.createElement('div')
  note.className = 'sticky'
  note.textContent = causeInput.value
  note.style.left = '50%'
  note.style.top  = '50%'
  playground.appendChild(note)

  let isDragging = false, offsetX=0, offsetY=0
  note.onmousedown = e => { isDragging = true; offsetX=e.offsetX; offsetY=e.offsetY }
  document.onmousemove = e => {
    if(!isDragging) return
    note.style.left = e.clientX - offsetX +'px'
    note.style.top  = e.clientY - offsetY +'px'
  }
  document.onmouseup = () => isDragging = false

  note.ondblclick = () => {
    if(note.classList.contains('crumple')) return;
    note.classList.add('crumple');
    note.addEventListener('animationend', () => note.remove(), { once: true });
  }
  resetBtn.classList.remove('hidden')
}

function showBreathTool(){
  const breathText = document.createElement('div')
  breathText.textContent = 'Inhale…'
  breathText.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;font-size:2rem;'
  playground.appendChild(breathText)
  let isInhaling = false
  const breathTimer = setInterval(()=>{ breathText.textContent = isInhaling?'Inhale…':'Exhale…'; isInhaling=!isInhaling }, 3000)
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => { clearInterval(breathTimer); location.reload() }
}

function showAngerTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
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
  if(tool==='rage')    showRageTool()
  if(tool==='textBox') showTextBoxes()
  if(tool==='wreck')    showWreckingBall()
  if(tool==='voronoi') showNoteCrumpling()
}

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


function showNoteCrumpling(){
  playground.innerHTML = ''
  
  // create paper.js canvas
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.cssText = 'position:fixed;top:0;left:0;cursor:grab;z-index:999;'
  playground.appendChild(canvas)
  
  // setup paper.js
  paper.setup(canvas)

  // check if libraries are loaded
  if(typeof Voronoi === 'undefined') {
    console.error('Voronoi library not loaded')
    playground.innerHTML = '<div style="color:white;text-align:center;padding:50px;">Voronoi library failed to load</div>'
    return
  }
  
  // voronoi setup
  const voronoi = new Voronoi()
  let sites = []
  let bbox = {xl: 0, xr: paper.view.size.width, yt: 0, yb: paper.view.size.height}
  let diagram
  const spotColor = new paper.Color('#f5f5dc')
  let mousePos = paper.view.center
  let selected = false
  let crumpling = false
  
  // generate initial sites
  sites = generateBeeHivePoints(80, true)

  // add text overlay
  const noteText = causeInput.value || 'anger'
  const text = new paper.PointText(paper.view.center)
  text.content = noteText
  text.fillColor = '#333'
  text.fontSize = 32
  text.fontFamily = 'Poppins'
  text.justification = 'center'
  
  // initial render
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
    
    // animate all sites toward center
    sites.forEach(site => {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50
      site.targetX = paper.view.center.x + Math.cos(angle) * distance
      site.targetY = paper.view.center.y + Math.sin(angle) * distance
    })
    
    // fade text
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
    
    // re-add text
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
    
    // add slight randomization for paper texture
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
  
  // bind events
  paper.view.onMouseDown = onMouseDown
  paper.view.onMouseMove = onMouseMove  
  paper.view.onDoubleClick = onDoubleClick
  paper.view.onResize = onResize
  
  renderDiagram()

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
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

  const boxSize = 36
  const spacing = 4
  const columns = Math.floor(width / (boxSize+spacing)) - 2
  const rows = Math.floor(height / ((boxSize+spacing) * 1.2))
  const palette = getColors()
  for(let i=0;i<columns;i++){
    for(let j=0;j<rows;j++){
      const color = palette[Math.floor(Math.random()*palette.length)]
      const x = boxSize + i*(boxSize+spacing)
      const y = height - 60 - j*(boxSize+spacing)
      const box = Bodies.rectangle(x, y, boxSize, boxSize, {
        restitution:0.4,
        render:{ fillStyle: color }
      })
      World.add(engine.world, box)
    }
  }

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, { mouse, constraint:{ stiffness:0.2, render:{ visible:false } } })
  World.add(engine.world, mouseConstraint)
  render.mouse = mouse

  render.canvas.addEventListener('click', (e)=>{
    const rect = render.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const blastPower = 0.08
    const blastRadius = 150
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
    ], { duration:600, easing:'ease-out' }).onfinish = () => blastEffect.remove()
  })

  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

function showWreckingBall(){
  playground.innerHTML = ''
  
  const { Engine, Render, World, Bodies, Events, Body, Vector, Constraint } = Matter

  const engine = Engine.create()
  const width = window.innerWidth
  const height = window.innerHeight

  const render = Render.create({
    element: playground,
    engine,
    options:{ width, height, wireframes:false, background:'transparent' }
  })

  // Create walls (floor only for blocks to sit on)
  const floor = Bodies.rectangle(width/2, height-25, width, 50, { 
    isStatic:true,
    render: { fillStyle: '#444' },
    collisionFilter: {
      category: 0x0004,
      mask: 0x0001 | 0x0002 // collides with blocks and stick
    }
  })

  // Add floor to world first
  World.add(engine.world, floor)

  // Create organized block tower (no overlapping)
  const blocks = []
  const blockSize = 40 // Slightly smaller blocks for more in the tower
  const blocksPerRow = 8 // More blocks per row
  const rows = 8 // Much taller tower
  
  // Build massive tower from bottom up
  for(let row = 0; row < rows; row++){
    // Alternate row sizes for pyramid effect
    const currentRowBlocks = Math.max(3, blocksPerRow - Math.floor(row / 2))
    
    for(let col = 0; col < currentRowBlocks; col++){
      const x = width/2 - (currentRowBlocks * blockSize)/2 + col * blockSize + blockSize/2
      const y = height - 75 - (row * (blockSize + 2)) // Small gap between rows
      
      blocks.push(Bodies.rectangle(x, y, blockSize-1, blockSize-1, {
        render: { 
          fillStyle: `hsl(${(row * 30 + col * 15) % 360}, 70%, ${50 + row * 5}%)`, // Rainbow gradient by height
          strokeStyle: '#222',
          lineWidth: 1
        },
        friction: 0.8,
        frictionAir: 0.01,
        density: 0.0003, // Even lighter for more dramatic collapses
        restitution: 0.3,
        collisionFilter: {
          category: 0x0001,
          mask: 0x0002 | 0x0001 | 0x0004 // collides with stick, other blocks, and floor
        }
      }))
    }
  }

  // Add blocks to world
  World.add(engine.world, blocks)

  // Create physics stick that follows mouse
  let mousePos = { x: width/2, y: height/2 }
  let lastMousePos = { x: width/2, y: height/2 }
  let mouseVelocity = { x: 0, y: 0 }
  const stickLength = 120 // Even longer for better leverage
  const stickWidth = 12 // Thicker for more impact
  
  // Create stick as a physics body
  const stick = Bodies.rectangle(mousePos.x, mousePos.y, stickLength, stickWidth, {
    render: {
      fillStyle: '#8B4513',
      strokeStyle: '#654321',
      lineWidth: 2
    },
    friction: 0.9,
    frictionAir: 0.008, // Less air resistance for smoother movement
    density: 0.012, // More mass for better momentum
    restitution: 0.7, // Higher bounce for more dynamic interactions
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001 | 0x0004 // collides with blocks and floor only
    }
  })

  // Set collision filter for blocks so they interact properly with stick
  blocks.forEach(block => {
    block.collisionFilter = {
      category: 0x0001,
      mask: 0x0002 | 0x0001 | 0x0004 // collides with stick, other blocks, and floor
    }
  })

  // Create invisible anchor point for stick constraint
  const anchor = Bodies.circle(mousePos.x, mousePos.y, 1, {
    isStatic: true,
    render: { visible: false },
    collisionFilter: {
      category: 0x0008,
      mask: 0x0000 // doesn't collide with anything
    }
  })

  // Connect stick to anchor with more responsive constraint for tricks
  const stickConstraint = Constraint.create({
    bodyA: anchor,
    bodyB: stick,
    length: 60, // longer leash for more freedom
    stiffness: 0.4, // softer for fluid movement
    damping: 0.15 // less damping for sustained motion
  })

  World.add(engine.world, [stick, anchor, stickConstraint])

  // Add collision event to prevent stick from going through blocks
  Events.on(engine, 'beforeUpdate', () => {
    // Apply slight separation force if stick is too close to block centers
    blocks.forEach(block => {
      const distance = Vector.magnitude(Vector.sub(stick.position, block.position))
      const minDistance = (stickLength + blockSize) / 2
      
      if (distance < minDistance && distance > 0) {
        const separation = Vector.mult(
          Vector.normalise(Vector.sub(stick.position, block.position)), 
          (minDistance - distance) * 0.1
        )
        Body.translate(stick, separation)
      }
    })
  })

  // Mouse tracking with velocity calculation for trick detection
  render.canvas.addEventListener('mousemove', (e) => {
    lastMousePos = { ...mousePos }
    mousePos.x = e.clientX
    mousePos.y = e.clientY
    
    // Calculate mouse velocity for dynamic stick response
    mouseVelocity.x = (mousePos.x - lastMousePos.x) * 0.5
    mouseVelocity.y = (mousePos.y - lastMousePos.y) * 0.5
    
    // Move the anchor point to follow mouse
    Body.setPosition(anchor, { x: mousePos.x, y: mousePos.y })
    
    // Apply velocity-based force to stick for more responsive movement
    const velocityMagnitude = Math.sqrt(mouseVelocity.x * mouseVelocity.x + mouseVelocity.y * mouseVelocity.y)
    if (velocityMagnitude > 5) { // Only apply force for significant movement
      const normalizedVelocity = {
        x: mouseVelocity.x / velocityMagnitude,
        y: mouseVelocity.y / velocityMagnitude
      }
      const responsiveForce = Vector.mult(normalizedVelocity, Math.min(velocityMagnitude * 0.001, 0.05))
      Body.applyForce(stick, stick.position, responsiveForce)
    }
  })
  
  // Click for power swing with enhanced tricks
  render.canvas.addEventListener('mousedown', (e) => {
    // Apply impulse to stick in direction away from anchor
    const forceDirection = Vector.normalise(Vector.sub(stick.position, anchor.position))
    const swingForce = Vector.mult(forceDirection, 0.15) // Even more power!
    
    Body.applyForce(stick, stick.position, swingForce)
    
    // Add angular velocity based on mouse movement for spin tricks
    const spinDirection = mouseVelocity.x > 0 ? 1 : -1
    Body.setAngularVelocity(stick, spinDirection * 1.2) // Directional spin based on mouse movement
  })

  // Right click for reverse spin trick
  render.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault() // Prevent context menu
    
    // Apply reverse force and spin
    const forceDirection = Vector.normalise(Vector.sub(anchor.position, stick.position))
    const pullForce = Vector.mult(forceDirection, 0.08)
    
    Body.applyForce(stick, stick.position, pullForce)
    Body.setAngularVelocity(stick, -1.5) // Reverse spin
  })

  // Hide default cursor
  render.canvas.style.cursor = 'none'
  
  Engine.run(engine)
  Render.run(render)

  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}

resetBtn.onclick = () => location.reload()