// mood router thing
// figures out what tool to show based on how ur feeling

class MoodHandler {
  static handleSubmit(mood, cause) {
    if (!cause.trim()) return;
    
    const form = document.getElementById('cf');
    form.classList.add('hidden');
    
    this.goToMoodThing(mood);
  }

  static goToMoodThing(mood) {
    console.log('going to mood:', mood);
    
    const place = document.getElementById('playground');
    place.innerHTML = '';

    switch (mood) {
      case 'angry':
        console.log('loading anger stuff');
        if (window.AngerStuff) {
          AngerStuff.show();
        } else {
          console.log('AngerStuff not found, trying AngerTools');
          AngerTools.show();
        }
        break;
      case 'anxiety':
        AnxietyTools.show();
        break;
      case 'happy':
        if (window.HappyTools) {
          HappyTools.show();
        }
        break;
      case 'sad':
        if (window.SadStuff) {
          SadStuff.show();
        } else {
          console.log('SadStuff not found, trying SadTools');
          SadTools.show();
        }
        break;
      case 'calm':
        ThoughtfulTools.show();
        break;
      case 'creative':
        CreativeTools.show();
        break;
      default:
        this.showBreathingThing();
    }
  }

  static showBreathingThing() {
    const place = document.getElementById('playground');
    const resetBtn = document.getElementById('rst');
    
    const breathText = document.createElement('div');
    breathText.textContent = 'inhale...';
    breathText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      color: white;
    `;
    
    playground.appendChild(breathText);
    
    let isInhaling = true;
    const breathTimer = setInterval(() => {
      breathText.textContent = isInhaling ? 'inhale...' : 'exhale...';
      isInhaling = !isInhaling;
    }, 3000);
    
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => {
      clearInterval(breathTimer);
      location.reload();
    };
  }
}

// Make available globally
window.MoodHandler = MoodHandler; 