# 💥emplode 💥

an interactive emotions app

uses javascript and matter.js for physics 

## features

**creative mode**
the best way to think is to stare at a blank screen - undercity 2025 

**angry mode:**
- destroy the blocks with your cursor
<<<<<<< HEAD
- wrecking stick on a chain that u can swing around 
=======
- wrecking ball that you can drag around to smash stuff 

**anxiety mode:**  
- journal that saves automatically  
- just type and let it out, no pressure  
- focus on future thoughts, past journals aren't shown (so you don't get stuck in old worries, despite the button being grayed out)
- stuff gets "saved" so you don't lose your thoughts

**happy mode:**  
- confetti particles that fall with gravity  
- fireworks when you click  
- mouse trails  
- tons of colors and animations everywhere

**sad mode:**  
- rain particles( the words you type) streaming down the screen  
- wordsthat slowly fall apart
- soft, muted colors and slow motion  
- past submissions aren't shown so you can look forward

the textbox in the end is supposed to be clipped ( it sort of throws away / burns the thing that ur angry about)

**anxiety mode:**  
- journal that saves automatically

**happy mode:**
- confetti particles that fall with gravity
- fireworks when you click
- mouse trails
- lots of colors and animations

**thoughtful**
- just a place to dump your thoughts out :D nothing too fancy with a circle that expands and shrinks!
## setup

```bash
git clone https://github.com/magical-paperclip/emplode.git
cd emplode
npm install
npm start
```

go to localhost:3000

## tech stack

- vanilla javascript (no frameworks)
- matter.js for physics engine
- html5 canvas for graphics
- node.js backend but everything works in browser

had to learn about:
- keeping 60fps without lag
- object pooling so garbage collection doesnt freeze everything  
- making collision detection fast enough
- using gpu acceleration when possible
- debugging physics interactions (harder than expected)

## development log

check [journal.md](./journal.md) for my notes while building:

- learning vector math for physics (still dont fully get it)
- getting smooth 60fps animations 
- dealing with different coordinate systems between libraries
- preventing memory leaks with too many particles
- using browser devtools to find performance issues


## development

no build process, just edit and refresh browser:

```bash
# edit files in public/js/
# refresh page to see changes
```

flow: pick emotion -> load module -> interactive tools -> save data

tried to match physics to emotions like destructive stuff for anger

## resources

- [how we feel](https://howwefeel.org/) - original mood app that gave me the idea
<<<<<<< HEAD
- [sics-ground](https://github.com/magical-paperclip/sics-ground) - my previous exprience with matter
<<<<<<< HEAD
- nature of code book - helped with animation math
=======
- nature of code book - helped with animation math
>>>>>>> 6dd569d (fixed readme wording for wrecking ball)
=======
- [sics-ground](https://github.com/magical-paperclip/sics-ground) - learned matter.js here first
- nature of code book - helped with animation math
>>>>>>> 279b277 (typo fix)
