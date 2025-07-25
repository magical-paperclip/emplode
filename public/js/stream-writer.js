// Stream of consciousness writer - just let thoughts flow
// sometimes the best thinking happens when you don't overthink

function showStreamWriter(){
  playground.innerHTML = ''
  
  const bg = document.createElement('div')
  bg.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#2d1b69;z-index:999;'
  playground.appendChild(bg)
  
  // minimal writing interface
  const writer = document.createElement('textarea')
  writer.placeholder = 'just start typing... let your thoughts flow without judgment...'
  writer.style.cssText = `
    position:absolute;top:10%;left:10%;width:80%;height:70%;
    background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
    color:#e0e0e0;font-family:Poppins;font-size:18px;padding:30px;
    border-radius:15px;resize:none;outline:none;
    box-shadow:inset 0 0 50px rgba(0,0,0,0.3);
    line-height:1.6;
  `
  bg.appendChild(writer)
  
  // stats display
  const stats = document.createElement('div')
  stats.style.cssText = `
    position:absolute;top:85%;left:50%;transform:translateX(-50%);
    color:#888;font-family:Poppins;font-size:16px;text-align:center;
  `
  bg.appendChild(stats)
  
  let startTime = Date.now()
  let lastTyped = Date.now()
  let isFlowing = false
  
  // typing flow detection
  writer.oninput = () => {
    const words = writer.value.trim().split(/\\s+/).length
    const chars = writer.value.length
    const minutes = (Date.now() - startTime) / 60000
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0
    
    // detect flow state (consistent typing for 30+ seconds)
    const now = Date.now()
    if(now - lastTyped < 2000) { // typing consistently
      if(!isFlowing && chars > 100) {
        isFlowing = true
        showFlowState()
      }
    } else {
      isFlowing = false
      hideFlowState()
    }
    lastTyped = now
    
    stats.innerHTML = `
      <div>Words: ${words} | Characters: ${chars} | WPM: ${wpm}</div>
      <div style="color:#666;font-size:14px;margin-top:5px;">
        ${isFlowing ? '🌊 FLOW STATE ACTIVE' : 'Keep writing to enter flow state...'}
      </div>
    `
  }
  
  function showFlowState() {
    bg.style.background = 'linear-gradient(45deg, #2d1b69, #1b5e20)'
    writer.style.background = 'rgba(255,255,255,0.08)'
    
    // subtle breathing animation
    writer.style.animation = 'breathe 4s ease-in-out infinite'
    
    if(!document.querySelector('#breathe-style')) {
      const style = document.createElement('style')
      style.id = 'breathe-style'
      style.textContent = `
        @keyframes breathe {
          0%, 100% { box-shadow: inset 0 0 50px rgba(0,0,0,0.3), 0 0 0 rgba(255,255,255,0.1); }
          50% { box-shadow: inset 0 0 50px rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.1); }
        }
      `
      document.head.appendChild(style)
    }
  }
  
  function hideFlowState() {
    bg.style.background = '#2d1b69'
    writer.style.background = 'rgba(255,255,255,0.05)'
    writer.style.animation = 'none'
  }
  
  // prompts to keep thoughts flowing
  const prompts = [
    'what am I really feeling right now?',
    'what would I do if I had no fear?',
    'what patterns do I notice in my thinking?',
    'what assumptions am I making?',
    'what would someone else think about this?',
    'what if the opposite were true?',
    'what questions should I be asking?',
    'what am I avoiding thinking about?'
  ]
  
  let promptInterval = setInterval(() => {
    if(writer.value.length > 50 && Date.now() - lastTyped > 10000) {
      const prompt = prompts[Math.floor(Math.random() * prompts.length)]
      const promptDiv = document.createElement('div')
      promptDiv.textContent = prompt
      promptDiv.style.cssText = `
        position:fixed;top:20px;right:20px;
        background:rgba(255,255,255,0.1);color:#ccc;
        padding:15px 20px;border-radius:10px;font-family:Poppins;
        font-size:14px;max-width:250px;
        animation:fadeInOut 5s ease forwards;
      `
      bg.appendChild(promptDiv)
      
      if(!document.querySelector('#fadeInOut-style')) {
        const style = document.createElement('style')
        style.id = 'fadeInOut-style'
        style.textContent = `
          @keyframes fadeInOut {
            0% { opacity:0; transform:translateY(-10px); }
            20%, 80% { opacity:1; transform:translateY(0); }
            100% { opacity:0; transform:translateY(-10px); }
          }
        `
        document.head.appendChild(style)
      }
      
      setTimeout(() => promptDiv.remove(), 5000)
    }
  }, 15000)
  
  // save/export functionality
  const saveBtn = document.createElement('button')
  saveBtn.textContent = 'save stream'
  saveBtn.style.cssText = `
    position:absolute;bottom:20px;left:20px;
    background:#7b1fa2;color:white;border:none;padding:10px 20px;
    border-radius:8px;font-family:Poppins;cursor:pointer;
  `
  saveBtn.onclick = () => {
    const content = writer.value
    const timestamp = new Date().toLocaleString()
    const fullContent = `Stream of Consciousness - ${timestamp}\\n\\n${content}`
    
    navigator.clipboard.writeText(fullContent).then(() => {
      saveBtn.textContent = 'saved!'
      setTimeout(() => saveBtn.textContent = 'save stream', 1500)
    })
  }
  bg.appendChild(saveBtn)
  
  // focus the writer immediately
  writer.focus()
  
  resetBtn.classList.remove('hidden')
  resetBtn.onclick = () => {
    clearInterval(promptInterval)
    location.reload()
  }
}
