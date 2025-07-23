const modal = document.getElementById('mdl')
const moodBtns = [...document.querySelectorAll('.mBtn')]
const causeForm = document.getElementById('cf')
const causeInput = document.getElementById('cInp')
const submitBtn = document.getElementById('goBtn')
const playground = document.getElementById('playground')
const resetBtn = document.getElementById('rst')
let selectedMood = null

function getColors(){
  if(selectedMood === 'angry')
    return ['#b71c1c','#c62828','#d32f2f','#e53935','#f44336','#ff5252']
  return ['#ea4335','#fbbc04','#fdd835','#34a853','#4285f4','#a142f4']
}

moodBtns.forEach(btn=>btn.onclick = () => {
  selectedMood = btn.dataset.mood
  modal.classList.add('hidden')
  causeForm.classList.remove('hidden')
  causeInput.focus()
  
  document.body.className = `mood-${selectedMood}`
})

submitBtn.onclick = () => {
  if(!causeInput.value.trim()) return
  causeForm.classList.add('hidden')
  
  if(selectedMood === 'angry'){
    showAngerTools()
  }else if(selectedMood === 'anxiety'){
    showAnxietyTools()
  }else if(selectedMood === 'happy'){
    showHappyTool()
  }else{
    showBreathTool()
  }
}

resetBtn.onclick = () => location.reload() 