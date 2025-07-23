function showAnxietyTools(){
  const toolsMenu = document.createElement('div')
  toolsMenu.id = 'circleMenu'
  toolsMenu.innerHTML = `
    <div class="circle-tool" data-t="journal" style="background:#fbbc04" title="Journal"></div>
    <div class="circle-tool" data-t="whiteboard" style="background:#f9a825" title="Whiteboard"></div>
  `
  playground.appendChild(toolsMenu)
  toolsMenu.querySelectorAll('.circle-tool').forEach(b=>b.onclick = () => selectAnxietyTool(b.dataset.t, toolsMenu))
}

function selectAnxietyTool(tool, menu){
  menu.remove()
  if(tool==='journal') showJournal()
  if(tool==='whiteboard') showWhiteboard()
}

function showJournal(){
  const container = document.createElement('div')
  container.className = 'journal-container journal-full'

  const textArea = document.createElement('textarea')
  textArea.placeholder = 'Write it out…'
  textArea.className = 'journal-input'
  textArea.style.flex='1'
  textArea.style.minHeight='0'
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let activeColor = palette[0]
  textArea.style.color = activeColor
  container.appendChild(textArea)

  const colorSelector = document.createElement('div')
  colorSelector.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===activeColor) dot.classList.add('active')
    dot.onclick = ()=>{
      activeColor = color
      textArea.style.color = color
      ;[...colorSelector.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colorSelector.appendChild(dot)
  })
  container.appendChild(colorSelector)

  const buttonRow = document.createElement('div')
  buttonRow.className = 'journal-btn-row'

  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'save'
  saveBtn.className = 'tool'
  saveBtn.style.cssText = 'background:#fbbc04;color:#202124'

  const doneBtn = document.createElement('button')
  doneBtn.textContent = 'done'
  doneBtn.className = 'tool'
  doneBtn.style.cssText = 'background:#fbbc04;color:#202124'
  doneBtn.onclick = () => { location.reload() }

  buttonRow.appendChild(saveBtn)
  buttonRow.appendChild(doneBtn)
  container.appendChild(buttonRow)

  const toggleBtn = document.createElement('button')
  toggleBtn.textContent = 'past journals'
  toggleBtn.className = 'tool'
  toggleBtn.style.cssText = 'background:#5f6368;margin-top:0.6rem'
  container.appendChild(toggleBtn)

  const entryList = document.createElement('div')
  entryList.className = 'journal-list'
  entryList.style.display = 'none'
  entryList.style.flex = '1'
  container.appendChild(entryList)
  toggleBtn.onclick = () => {
    entryList.style.display = entryList.style.display==='none' ? 'block' : 'none'
  }

  textArea.addEventListener('input', ()=>{
    textArea.style.height = 'auto'
    textArea.style.height = Math.min(textArea.scrollHeight+2, window.innerHeight*0.4) + 'px'
  })

  const loadEntries = () => {
    entryList.innerHTML = ''
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.slice().reverse().forEach(entry=>{
      let text, color
      if(typeof entry === 'string'){ text = entry; color = '#e8eaed' } else { text = entry.t; color = entry.c || '#e8eaed' }
      const entryEl = document.createElement('div')
      entryEl.className = 'entry-text'
      entryEl.textContent = text
      entryEl.style.color = color
      entryList.appendChild(entryEl)
    })
  }

  loadEntries()

  saveBtn.onclick = () => {
    const text = textArea.value.trim()
    if(!text) return
    const entries = JSON.parse(localStorage.getItem('journalEntries')||'[]')
    entries.push({t:text,c:activeColor})
    localStorage.setItem('journalEntries', JSON.stringify(entries))
    textArea.value = ''
    loadEntries()
  }

  playground.appendChild(container)
  textArea.focus()
  resetBtn.classList.remove('hidden')
}

function showWhiteboard(){
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style = 'position:fixed;top:0;left:0;cursor:crosshair;z-index:999;background:rgba(0,0,0,0.05)';
  playground.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  const palette = ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
  let brushColor = '#fbbc04'
  ctx.strokeStyle = brushColor
  ctx.lineWidth = 3
  ctx.lineCap = 'round'

  let isDrawing = false
  let lastX = 0, lastY = 0

  const startDrawing = e => {
    isDrawing = true
    ;({clientX:lastX, clientY:lastY} = e)
  }
  const draw = e => {
    if(!isDrawing) return
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.clientX, e.clientY)
    ctx.stroke()
    lastX = e.clientX
    lastY = e.clientY
  }
  const stopDrawing = () => isDrawing = false

  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  window.addEventListener('mouseup', stopDrawing)

  const toolbar = document.createElement('div')
  toolbar.style = 'position:fixed;top:20px;left:50%;translate:-50% 0;display:flex;gap:18px;align-items:center;z-index:1001'

  const colorRow = document.createElement('div')
  colorRow.className = 'journal-color-row'
  palette.forEach(color=>{
    const dot = document.createElement('div')
    dot.className = 'color-dot'
    dot.style.background = color
    if(color===brushColor) dot.classList.add('active')
    dot.onclick = () => {
      brushColor = color
      ctx.strokeStyle = color
      ;[...colorRow.children].forEach(d=>d.classList.toggle('active', d===dot))
    }
    colorRow.appendChild(dot)
  })

  toolbar.appendChild(colorRow)

  const clearBtn = document.createElement('button')
  clearBtn.textContent = 'clear'
  clearBtn.className = 'tool'
  clearBtn.style.background = '#fbbc04'
  clearBtn.style.color = '#202124'
  clearBtn.onclick = () => { ctx.clearRect(0,0,canvas.width,canvas.height) }

  const closeBtn = document.createElement('button')
  closeBtn.textContent = 'done'
  closeBtn.className = 'tool'
  closeBtn.style.background = '#fbbc04'
  closeBtn.style.color = '#202124'
  closeBtn.onclick = () => { location.reload() }

  toolbar.appendChild(clearBtn)
  toolbar.appendChild(closeBtn)
  playground.appendChild(toolbar)

  resetBtn.classList.remove('hidden')
} 