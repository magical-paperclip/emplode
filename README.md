# 💥emplode 💥

an interactive emotions app

uses javascript and matter.js for physics 

## features

**angry mode:**
- click anywhere and objects fly away with physics
- wrecking ball on a chain that u can swing around 

**anxiety mode:**  
- journal that saves automatically 
- drawing pad with different colors
- paper crumpling animation using voronoi diagrams (found this in a tutorial)
- breathing thing with smooth timing

**happy mode:**
- confetti particles that fall with gravity
- fireworks when you click
- mouse trails
- lots of colors and animations

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
- [sics-ground](https://github.com/magical-paperclip/sics-ground) - my previous exprience with matter
- nature of code book - helped with animation math
