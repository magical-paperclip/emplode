// using variables from client.js to avoid duplicate declarations

function getColors(){
  if(selectedMood === 'angry')
    return ['#b71c1c','#c62828','#d32f2f','#e53935','#f44336','#ff5252']
  return ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
}

// using variables from client.js to avoid duplicates
// Variables already declared in client.js: pg, playground, rst, help, etc.

// help.onclick is set in client.js

function showTutorial(){
  if(document.querySelector('#tutorialPopup')) return
  const colors=[
    ['#ea4335','anger'],
    ['#fbbc04','anxiety'],
    ['#fdd835','happiness'],
    ['#34a853','calm'],
    ['#4285f4','sad'],
    ['#a142f4','creative']
  ]
  const popup=document.createElement('div')
  popup.id='tutorialPopup'
  popup.className='tutorial-modal'
  popup.innerHTML=`
    <div class="tutorial-box">
      <h2 style="margin:0;text-align:center">mood colours</h2>
      ${colors.map(([hex,name])=>`<div class="tutorial-row"><div class="tutorial-circle" style="background:${hex}"></div><span>${name}</span></div>`).join('')}
      <button class="tutorial-close">close</button>
    </div>
  `
  popup.querySelector('.tutorial-close').onclick=()=>popup.remove()
  document.body.appendChild(popup)
}

// mood button handlers are in client.js to avoid conflicts
// submit button handler is in mood-handler.js to include sad mood

function showAngerTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-tool="rage" style="background:#ea4335" title="Anger Blast"></div>
    <div class="circle-tool" data-tool="wreck" style="background:#c62828" title="Wrecking Ball"></div>
    <div class="circle-tool" data-tool="voronoi" style="background:#b71c1c" title="Voronoi Crumple"></div>
  `
  pg.appendChild(menu)
  ;[...menu.querySelectorAll('.circle-tool')].forEach(c=>c.onclick = () => selectCircleTool(c.dataset.tool, menu))
}

function selectCircleTool(tool,menu){
  menu.remove()
  if(tool==='rage') showRageTool()
  if(tool==='wreck') showWreckingBall()
  if(tool==='voronoi') showNoteCrumpling()
}

function showTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-t="note" style="background:#34a853" title="Crumple Note"></div>
    <div class="circle-tool" data-t="breath" style="background:#4285f4" title="Deep Breath"></div>
  `
  pg.appendChild(menu)
  menu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectTool(b.dataset.t,menu))
}

function selectTool(tool,menu){
  menu.remove()
  if(tool==='note') showStickyNote()
  if(tool==='breath') showBreathTool()
}

function showStickyNote(){
  const note = document.createElement('div')
  note.className = 'sticky'
  note.textContent = inp.value
  note.style.left = '50%'
  note.style.top = '50%'
  pg.appendChild(note)

  let drag = false, offsetX=0, offsetY=0
  note.onmousedown = e => { drag = true; offsetX=e.offsetX; offsetY=e.offsetY }
  document.onmousemove = e => {
    if(!drag) return
    note.style.left = e.clientX - offsetX +'px'
    note.style.top = e.clientY - offsetY +'px'
  }
  document.onmouseup = () => drag = false

  note.ondblclick = () => {
    if(note.classList.contains('crumple')) return;
    note.classList.add('crumple');
    note.addEventListener('animationend', () => note.remove(), { once: true });
  }
  rst.classList.remove('hidden')
}

function showBreathTool(){
  const txt = document.createElement('div')
  txt.textContent = 'inhale…'
  txt.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;font-size:2rem;'
  pg.appendChild(txt)
  let inhaling = false
  const timer = setInterval(()=>{ txt.textContent = inhaling?'inhale…':'exhale…'; inhaling=!inhaling }, 3000)
  rst.classList.remove('hidden')
  rst.onclick = () => { clearInterval(timer); location.reload() }
}

rst.onclick = () => location.reload()
