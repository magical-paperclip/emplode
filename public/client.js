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
    // coordinate system confusion: clientX/Y vs canvas coordinates had me debugging for hours
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
        const dur = 4000 + Math.random()*3000;  // adjusted timing
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

function showTools(mood){
  playground.innerHTML = ''
  if(mood==='anger') showAngerTools()
  if(mood==='anxiety') showAnxietyTools()
  if(mood==='happy') showHappyTools()
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

resetBtn.onclick = () => location.reload()