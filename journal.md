# building my own emotion tracker - a developer's journey

*emplode - explode ur emotions*

## hwf but interactive

saw [how we feel](https://howwefeel.org/) around, thought it was neat but basic. wanted something where u actually *do* stuff with emotions instead of just clicking buttons. already had matter.js experience from [sics-ground](https://github.com/magical-paperclip/sics-ground) so figured i could make anger feel satisfying with physics.

basic plan: html structure, css custom properties, event delegation. spent too much time staring at hwf's design trying to make mine different but not worse.

## physics and math (lowk half copied from sics-ground+ the matter documentation)

brought back matter.js but went deeper. needed blast system (click sends everything flying) and wrecking ball (swing chain to destroy stuff).

blast = vector math. `Vector.magnitude()` for distance, `Vector.normalise()` for direction, multiply for realistic explosions:

```javascript
const distance = Vector.magnitude({ x: body.position.x - x, y: body.position.y - y })
if(distance < blastRadius){
  const force = Vector.mult(Vector.normalise({ 
    x: body.position.x - x, 
    y: body.position.y - y 
  }), blastPower)
  Body.applyForce(body, body.position, force)
}
```

wrecking ball = constraint physics. stiffness: 0.4, damping: 0.15. spent forever debugging why it kept spinning (damping isn't optional).

bitwise collision filtering still feels like magic - powers of 2 for categories, & operations to check what hits what.

## graphics rabbit hole

hwf looks clean, mine looked like 2008 physics sandbox. discovered paper.js for vector graphics, then got carried away with voronoi diagrams for note crumpling.

paper.js coordinates vs canvas coordinates = debugging hell. spent 3 days fixing why voronoi cells appeared wrong (coordinate transformations suck).

breakthrough: smooth animated voronoi responding to mouse made anxiety tools feel organic.

## animation performance

everything felt static so dove into requestAnimationFrame. animation concept is simple but performance is brutal - too many particles kills browser.

solution: object pooling (recycle particles), gravity/friction for natural movement, cubic-bezier easing. got particle trails working with alpha blending.

main lesson: 60fps is hard. one bad loop kills everything.

## fireworks and colors

happiness tools were boring so implemented confetti fireworks. learned hsl > rgb for dynamic effects - random hue (0-360) gives good color variations.

canvas composite operations = photoshop blend modes. `globalCompositeOperation = 'destination-out'` for trail fades.

alpha blending tricky - `fillStyle = 'rgba()'` vs `globalAlpha` affect different pipeline parts.

## week 7 - code organization

main file hit 800 lines of chaos. split into modules:
- `anger-tools.js` - physics 
- `anxiety-tools.js` - drawing/calming
- `happy-tools.js` - particles/fireworks

added "learning curve" comments like `// was 0.8 but too bouncy` to show experimentation.

## what i learned

**technical:**
- physics = math but applied math is hard
- coordinate systems are evil (paper.js vs canvas vs dom)  
- 60fps makes or breaks experience
- hsl > rgb for dynamic colors
- code organization mandatory at scale

**frustrations:**
- 3 days on voronoi coordinate bugs
- matter.js docs accurate but not beginner friendly
- object pooling essential but poorly explained

**hwf comparison:**
- hwf: minimal, server-side, mobile-first
- mine: client-heavy, physics sim, desktop-focused
- different solutions, both valid

## the stack

- matter.js (expanded from sics-ground)
- paper.js (new)
- canvas api with performance optimization  
- vanilla js, no frameworks

way more complex than hwf but way more fun when ur actually feeling emotions.

---

*check out the [code](https://github.com/magical-paperclip/emplode) or my previous [sics-ground](https://github.com/magical-paperclip/sics-ground)*
