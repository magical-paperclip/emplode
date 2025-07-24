# emplode

an interactive emotion processing app that goes way beyond basic mood tracking. instead of just clicking buttons, you can actually *do* something with your emotions - blast things when angry, crumple notes when anxious, watch fireworks when happy.

inspired by [how we feel](https://howwefeel.org/) but with a focus on interactive coping tools rather than data collection.

## ✨ features

**anger tools:**
- **blast system** - click to send physics objects flying with realistic force falloff
- **wrecking ball** - swing a physics-based chain to destroy blocks

**anxiety tools:**  
- **journal** - persistent textarea with color theming (localStorage)
- **whiteboard** - free-draw canvas with color palette
- **breathing exercise** - guided inhale/exhale animation
- **note crumpling** - drag and crumple sticky notes with voronoi tessellation

**happiness tools:**
- **fireworks** - click-triggered particle explosions with HSL color cycling
- **confetti** - gravity-based particle system with realistic physics
- **sparkle trails** - mouse-following particle effects

## 🚀 quick start

```bash
npm install
npm start
```

visit **http://localhost:3000** and start processing emotions interactively.

## 🎯 why this exists

most mood tracking apps are just glorified surveys. but emotions aren't data points - they're physical, messy, and need expression. this app lets you:

- **physically interact** with your emotions instead of just logging them
- **actually release tension** through satisfying physics interactions  
- **create something** (drawings, journal entries) during emotional processing
- **experience immediate feedback** rather than long-term analytics

## 🛠 technical stack

- **matter.js** - 2d physics engine for realistic object interactions
- **paper.js** - vector graphics for smooth visual effects
- **canvas api** - hardware-accelerated particle systems and animations
- **vanilla javascript** - no framework overhead, just core browser APIs
- **node.js + socket.io** - optional real-time features (runs offline-first)

built with performance in mind: 60fps animations, object pooling for particles, efficient collision detection.

## 📝 development blog

want to see how this was built? check out [journal.md](./journal.md) for a detailed account of the development process, including:

- learning physics programming from scratch
- implementing complex canvas animations  
- solving performance problems with particle systems
- dealing with coordinate system hell across multiple libraries
- the emotional design decisions behind each interaction

it's written as a personal journey through web development, physics simulation, and the realization that interactive experiences can be way more engaging than traditional form-based interfaces.

## 🎮 how it works

no build step required - just edit files in `public/` and refresh. the app is intentionally simple to modify and experiment with.

**mood selection** → **interactive tools** → **emotional processing**

each emotion category unlocks different types of interactions designed to match how those emotions actually feel in your body.

## 🤝 inspiration & references

- [how we feel](https://howwefeel.org/) - original inspiration for clean mood tracking  
- [sics-ground](https://github.com/magical-paperclip/sics-ground) - foundation for matter.js physics knowledge
- nature of code - principles for natural-feeling animations and particle systems

---

*sometimes the best way to process emotions is to literally throw things around on a screen.*ood playground

a tiny browser toy: pick a colour circle that matches your vibe, fill in what’s bugging you, then mess with a couple of quick coping tools.

* **crumple note** – drag the sticky around, double-click to crunch it out of sight.
* **deep breath** – inhale / exhale loop that chills in the middle until you reset.

runs locally in the browser – the node socket backend is still there but optional.

## run

```bash
npm install
npm start
```
then hit **http://localhost:3000**.

## tweak stuff

no build step. just poke files in `public/` and refresh. 

## how each mood thing kinda works (ya, real quick)

anger – gets a lil circle menu, pick blast (click drags stuff) or wrecking ball (swing chain) – physics by matter.js.

anxiety – shows two buttons:
* journal – textarea that saves to localstorage, palette for text colours.
* whiteboard – free-draw canvas w/ colour dots, clear+done buttons.

happy – straight into confetti: click anywhere → we spawn 60-ish random bits (tiny divs) w/ gravity + drag. also ambient fall from top so it feels alive. no other toys now.

calm / thoughtful etc – just the breathe loop (inhale / exhale text in centre).

sticky note tool – writes your cause on a yellow note, you can drag or double-click to crumple.

reset button top right just reloads page. nothing fancy.

server side is plain socket.io (see backend/server.js) but most toys run fully in the browser; no db, no build, messy on purpose. 