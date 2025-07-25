function showAnxietyTools(){
  const menu = document.createElement('div')
  menu.id = 'circleMenu'
  menu.innerHTML = `
    <div class="circle-tool" data-t="journal" style="background:#fbbc04" title="Journal"></div>
    <div class="circle-tool" data-t="whiteboard" style="background:#f9a825" title="Whiteboard"></div>
  `
  pg.appendChild(menu)
  menu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => pickTool(b.dataset.t, menu))
}

function pickTool(tool, menu){
  menu.remove()
  if(tool==='journal') showJournal()
  if(tool==='whiteboard') showWhiteboard()
}

function showJournal(){
  const box = document.createElement('div')
  box.className = 'journal-container journal-full'

  const txt = document.createElement('textarea')
  txt.placeholder = 'write it out…'
  txt.className = 'journal-input'
  txt.style.flex='1'
  txt.style.minHeight='0'
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let col = palette[0]
  txt.style.color = col
  box.appendChild(txt)

  const colors = document.createElement('div')
  colors.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===col) dot.classList.add('active')
    dot.onclick = ()=>{
      col = color
      txt.style.color = color
      ;[...colors.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colors.appendChild(dot)
  })
  box.appendChild(colors)

  const btns = document.createElement('div')
  btns.className = 'journal-btn-row'

  const save = document.createElement('button')
  save.textContent = 'save'
  save.className = 'tool'
  save.style.cssText = 'background:#fbbc04;color:#202124'

  const done = document.createElement('button')
  done.textContent = 'done'
  done.className = 'tool'
  done.style.cssText = 'background:#fbbc04;color:#202124'
  done.onclick = () => { location.reload() }

  btns.appendChild(save)
  btns.appendChild(done)
  box.appendChild(btns)

  const toggle = document.createElement('button')
  toggle.textContent = 'past journals'
  toggle.className = 'tool'
  toggle.style.cssText = 'background:#5f6368;margin-top:0.6rem'
  box.appendChild(toggle)

  const list = document.createElement('div')
  list.className = 'journal-list'
  list.style.display = 'none'
  list.style.flex = '1'
  box.appendChild(list)
  toggle.onclick = () => {
    list.style.display = list.style.display==='none' ? 'block' : 'none'
  }

  txt.addEventListener('input', ()=>{
    txt.style.height = 'auto'
    txt.style.height = Math.min(txt.scrollHeight+2, window.innerHeight*0.4) + 'px'
  })

  const load = () => {
    list.innerHTML = ''
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.slice().reverse().forEach(entry=>{
      let text, color
      if(typeof entry === 'string'){ text = entry; color = '#e8eaed' } else { text = entry.t; color = entry.c || '#e8eaed' }
      const el = document.createElement('div')
      el.className = 'entry-text'
      el.textContent = text
      el.style.color = color
      list.appendChild(el)
    })
  }

  load()

  save.onclick = () => {
    const text = txt.value.trim()
    if(!text) return
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.push({t:text,c:col})
    localStorage.setItem('journalEntries', JSON.stringify(entries))
    txt.value = ''
    load()
  }

  pg.appendChild(box)
  txt.focus()
  rst.classList.remove('hidden')
}

function showWhiteboard(){
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style = 'position:fixed;top:0;left:0;cursor:crosshair;z-index:999;background:rgba(0,0,0,0.05)';
  pg.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let brush = '#fbbc04'
  ctx.strokeStyle = brush
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

  let drawing = false
  let lastX = 0, lastY = 0

  const start = e => {
    drawing = true
    ;({clientX:lastX, clientY:lastY} = e)
  }
  const draw = e => {
    if(!drawing) return
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.clientX, e.clientY)
    ctx.stroke()
    lastX = e.clientX
    lastY = e.clientY
  }
  const stop = () => drawing = false

  canvas.addEventListener('mousedown', start)
  canvas.addEventListener('mousemove', draw)
  window.addEventListener('mouseup', stop)

  const toolbar = document.createElement('div')
  toolbar.style = 'position:fixed;top:20px;left:50%;translate:-50% 0;display:flex;gap:18px;align-items:center;z-index:1001'

  const colorRow = document.createElement('div')
  colorRow.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===brush) dot.classList.add('active')
    dot.onclick = () => {
      brush = color
      ctx.strokeStyle = color
      ;[...colorRow.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colorRow.appendChild(dot)
  })

  toolbar.appendChild(colorRow)

  const clear = document.createElement('button')
  clear.textContent = 'clear'
  clear.className = 'tool'
  clear.style.background = '#fbbc04'
  clear.style.color = '#202124'
  clear.onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height) }

  const close = document.createElement('button')
  close.textContent = 'done'
  close.className = 'tool'
  close.style.background = '#fbbc04'
  close.style.color = '#202124'
  close.onclick = () => { location.reload() }

  toolbar.appendChild(clear)
  toolbar.appendChild(close)
  pg.appendChild(toolbar)

  rst.classList.remove('hidden')
}
