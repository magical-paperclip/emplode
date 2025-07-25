// mind map thingy - jot down thoughts n stuff
// click to add, double click to yeet

function showMindMapper(){
  playground.innerHTML = ''
  
  const bg = document.createElement('div')
  bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#f8f4e6;z-index:999;overflow:hidden;'
  playground.appendChild(bg)
  
  // grab user input or default to "thinking" 
  const userInput = document.getElementById('cInp')
  const mainTopic = userInput?.value || 'thinking'
  
  // center sticky note thing
  const centerThing = document.createElement('div')
  centerThing.textContent = mainTopic
  centerThing.className = 'center-node'
  centerThing.style.cssText = `
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-2deg);
    background:#ffeb3b;color:#333;padding:25px 30px;border-radius:3px;
    font-family:'Comic Sans MS',cursive;font-weight:normal;font-size:18px;
    box-shadow:2px 4px 8px rgba(0,0,0,0.15);cursor:pointer;
    border:1px solid #f9c74f;z-index:10;
    text-align:center;
  `
  bg.appendChild(centerThing)
  
  let count=0
  let lines = []
  let colors = ['#ffcccb', '#87ceeb', '#98fb98', '#dda0dd', '#f0e68c', '#ffc0cb', '#add8e6']
  
  // click to add new note
  bg.onclick = (e) => {
    if(e.target === bg) {
      const xPos = e.clientX
      const yPos = e.clientY
      
      const note = document.createElement('div')
      note.contentEditable = true
      note.textContent = 'brain fart...'
      
      // make it look messy like real notes
      const tilt = (Math.random() - 0.5) * 10 
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      
      note.style.cssText = `
        position:absolute;left:${xPos-50}px;top:${yPos-20}px;
        background:${randomColor};color:#333;padding:15px 20px;border-radius:2px;
        font-family:'Comic Sans MS',cursive;font-size:14px;min-width:120px;
        box-shadow:2px 3px 6px rgba(0,0,0,0.2);
        border:1px solid rgba(0,0,0,0.1);
        cursor:text;outline:none;
        transform:rotate(${tilt}deg);
        text-align:left;
        line-height:1.4;
      `
      
      bg.appendChild(note)
      note.focus()
      note.select()
      
      // connect to center with wobbly line
      const connection = drawLine(
        window.innerWidth/2, window.innerHeight/2,
        xPos, yPos
      )
      lines.push({line: connection, from: centerThing, to: note})
      
      count++
      
      // fix empty notes
      note.onblur = () => {
        if(note.textContent.trim() === '' || note.textContent.trim() === 'brain fart...') {
          note.textContent = 'idk...'
        }
      }
      
      // double click to delete
      note.ondblclick = () => {
        note.style.transform += ' scale(0.1)'
        note.style.opacity = '0'
        setTimeout(() => {
          note.remove()
          lines = lines.filter(conn => {
            if(conn.from === note || conn.to === note) {
              conn.line.remove()
              return false
            }
            return true
          })
        }, 200)
      }
    }
  }
  
  function drawLine(x1, y1, x2, y2) {
    // svg for squiggly lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:1;
    `
    
    const squiggle = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    
    // wobble it up
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 20
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 20
    
    const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
    
    squiggle.setAttribute('d', d)
    squiggle.setAttribute('stroke', '#666')
    squiggle.setAttribute('stroke-width', '2')
    squiggle.setAttribute('fill', 'none')
    squiggle.setAttribute('opacity', '0.6')
    
    svg.appendChild(squiggle)
    bg.appendChild(svg)
    return svg
  }
  
  // instructions sticky note
  const howTo = document.createElement('div')
  howTo.innerHTML = `
    <div style="font-family:'Comic Sans MS',cursive;font-size:16px;color:#333;margin-bottom:8px;">how 2 use:</div>
    • click anywhere to add thought<br>
    • click notes to edit<br>  
    • double-click to delete<br>
    • lines auto connect
  `
  howTo.style.cssText = `
    position:absolute;top:20px;left:20px;
    background:#fff9c4;color:#333;font-size:14px;font-family:'Comic Sans MS',cursive;
    padding:15px 20px;border-radius:3px;border:1px solid #f4d03f;
    box-shadow:2px 3px 6px rgba(0,0,0,0.15);
    transform:rotate(-1deg);line-height:1.5;
  `
  bg.appendChild(howTo)
  
  // save button
  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'save thoughts'
  saveBtn.style.cssText = `
    position:absolute;bottom:20px;right:20px;
    background:#90ee90;color:#333;border:2px solid #7cb342;padding:12px 24px;
    border-radius:8px;font-family:'Comic Sans MS',cursive;cursor:pointer;
    box-shadow:2px 3px 6px rgba(0,0,0,0.2);font-size:14px;
    transform:rotate(1deg);
  `
  saveBtn.onmouseover = () => {
    saveBtn.style.background = '#7cb342'
    saveBtn.style.color = 'white'
  }
  saveBtn.onmouseout = () => {
    saveBtn.style.background = '#90ee90'
    saveBtn.style.color = '#333'
  }
  saveBtn.onclick = () => {
    const thoughts = [mainTopic]
    bg.querySelectorAll('div[contenteditable]').forEach(note => {
      if(note.textContent.trim() && 
         note.textContent !== 'brain fart...' && 
         note.textContent !== 'idk...') {
        thoughts.push('- ' + note.textContent.trim())
      }
    })
    
    const txt = thoughts.join('\n')
    navigator.clipboard.writeText(txt).then(() => {
      saveBtn.textContent = 'copied!'
      setTimeout(() => saveBtn.textContent = 'save thoughts', 2000)
    })
  }
  bg.appendChild(saveBtn)
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => location.reload()
}
