# mood playground

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