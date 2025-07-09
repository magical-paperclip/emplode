// scrappy mood → tool playground  (no sockets, no frameworks)

// refs
const modal = document.getElementById('mdl')
const moodBtns = [...document.querySelectorAll('.mBtn')]
const causeBox = document.getElementById('cf')
const causeInp = document.getElementById('cInp')
const goBtn   = document.getElementById('goBtn')
const stage   = document.getElementById('playground')
const reset   = document.getElementById('rst')

// (maybe username?)-> mood pick -> cause -> tools -> make it more interactive -> reset
moodBtns.forEach(btn=>btn.onclick = () => {
  modal.classList.add('hidden')
  causeBox.classList.remove('hidden')
  causeInp.focus()
})

goBtn.onclick = () => {
  if(!causeInp.value.trim()) return
  causeBox.classList.add('hidden')
  showTools()
}

function showTools(){
  const wrap = document.createElement('div')
  wrap.id = 'tools'
  wrap.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;display:flex;gap:18px'
  wrap.innerHTML = `
    <button class="tool" data-t="note">Crumple Note</button>
    <button class="tool" data-t="breath">Deep Breath</button>
  `
  stage.appendChild(wrap)
  wrap.querySelectorAll('.tool').forEach(b=>b.onclick = () => pickTool(b.dataset.t,wrap))
}

function pickTool(t,wrap){
  wrap.remove()
  if(t==='note') noteTool()
  if(t==='breath') breathTool()
}

// --- note tool kinda ----------------------------------------------------
function noteTool(){
  const note = document.createElement('div')
  note.className = 'sticky'
  note.textContent = causeInp.value
  note.style.left = '50%'
  note.style.top  = '50%'
  stage.appendChild(note)

  let drag = false, offX=0, offY=0
  note.onmousedown = e => { drag = true; offX=e.offsetX; offY=e.offsetY }
  document.onmousemove = e => {
    if(!drag) return
    note.style.left = e.clientX - offX +'px'
    note.style.top  = e.clientY - offY +'px'
  }
  document.onmouseup = () => drag = false

  note.ondblclick = () => {
    note.style.transition = 'transform .3s,opacity .3s'
    note.style.transform  = 'scale(0) rotate(540deg)'
    note.style.opacity    = '0'
    setTimeout(()=>note.remove(),300)
  }
  reset.classList.remove('hidden')
}

// --- breath tool(ish) --------------------------------------------------
function breathTool(){
  const msg = document.createElement('div')
  msg.textContent = 'Inhale…'
  msg.style = 'position:absolute;top:50%;left:50%;translate:-50% -50%;font-size:2rem;'
  stage.appendChild(msg)
  let flip = false
  const id = setInterval(()=>{ msg.textContent = flip?'Inhale…':'Exhale…'; flip=!flip }, 3000)
  reset.classList.remove('hidden')
  reset.onclick = () => { clearInterval(id); location.reload() }
}

// reset straight reload
reset.onclick = () => location.reload()