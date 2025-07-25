// main app thing
// handles mood picking and stuff

class EmplodeApp {
  constructor() {
    this.currentMood = null;
    this.stuff = this.getElements();
    this.setupEvents();
  }

  getElements() {
    return {
      modal: document.getElementById('mdl'),
      moodBtns: [...document.querySelectorAll('.mBtn')],
      causeForm: document.getElementById('cf'),
      resetBtn: document.getElementById('rst'),
      playground: document.getElementById('playground'),
      causeInput: document.getElementById('cInp'),
      goBtn: document.getElementById('goBtn'),
      tutorialBtn: document.getElementById('tutorial')
    };
  }

  setupEvents() {
    // mood button clicks
    this.stuff.moodBtns.forEach(btn => {
      btn.addEventListener('click', () => this.pickMood(btn.dataset.mood));
    });

    // tutorial
    this.stuff.tutorialBtn.addEventListener('click', () => {
      Tutorial.show();
    });

    // reset
    this.stuff.resetBtn.addEventListener('click', () => {
      this.reset();
    });

    // submit - let mood handler deal with it
    if (this.stuff.goBtn) {
      this.stuff.goBtn.addEventListener('click', () => {
        MoodHandler.handleSubmit(this.currentMood, this.stuff.causeInput.value);
      });
    }
  }

  pickMood(mood) {
    this.currentMood = mood;
    this.stuff.modal.classList.add('hidden');
    this.stuff.causeForm.classList.remove('hidden');
    this.stuff.causeInput.focus();
    document.body.className = `mood-${mood}`;
  }

  reset() {
    location.reload();
  }

  getColors() {
    if (this.currentMood === 'angry') {
      return ['#b71c1c', '#c62828', '#d32f2f', '#e53935', '#f44336', '#ff5252'];
    }
    return ['#ea4335', '#fbbc04', '#fdd835', '#34a853', '#4285f4', '#a142f4'];
  }
}

// start when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EmplodeApp();
});

// global vars for other scripts
window.playground = document.getElementById('playground');
window.resetBtn = document.getElementById('rst');
