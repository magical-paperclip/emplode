const helpBtn = document.getElementById('tutorial')

helpBtn.onclick = showTutorial

function showTutorial(){
  if(document.querySelector('#tutorialPopup')) return
  const colors=[
    ['#ea4335','anger'],
    ['#fbbc04','anxiety'],
    ['#fdd835','happiness'],
    ['#34a853','calm'],
    ['#4285f4','thoughtful'],
    ['#a142f4','creative']
  ]
  const overlay=document.createElement('div')
  overlay.id='tutorialPopup'
  overlay.className='tutorial-modal'
  overlay.innerHTML=`
    <div class="tutorial-box">
      <h2 style="margin:0;text-align:center">mood colours</h2>
      ${colors.map(([hex,name])=>`<div class="tutorial-row"><div class="tutorial-circle" style="background:${hex}"></div><span>${name}</span></div>`).join('')}
      <button class="tutorial-close">close</button>
    </div>
  `
  overlay.querySelector('.tutorial-close').onclick=()=>overlay.remove()
  document.body.appendChild(overlay)
} 