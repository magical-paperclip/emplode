/**
 * anger management tools
 * physics-based destruction and release activities
 */

class AngerTools {
  static show() {
    console.log('anger tools: initializing wrecking ball');
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
    
    // direct route to wrecking ball physics simulation
    this.showWreckingBall();
  }

  static showWreckingBall() {
    const playground = document.getElementById('playground');
    
    // verify matter.js library availability
    if (!window.Matter) {
      console.error('matter.js library not loaded');
      playground.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    color: #e8eaed; font-family: 'Poppins', monospace; text-align: center;">
          <h3>physics engine unavailable</h3>
          <p>matter.js library failed to initialize</p>
          <p style="font-size: 0.8rem; opacity: 0.7;">check network connection and reload</p>
        </div>
      `;
      this.showResetButton();
      return;
    }

    console.log('matter.js detected, initializing physics world');

    try {
      // destructure matter.js components
      const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;
      
      // validate required components
      if (!Engine || !Render || !World || !Bodies) {
        throw new Error('missing critical matter.js components');
      }
      
      // create physics engine instance
      const engine = Engine.create();
      const world = engine.world;
      const width = window.innerWidth;
      const height = window.innerHeight;

      console.log(`physics world dimensions: ${width}x${height}`);

      // configure matter.js renderer
      const render = Render.create({
        element: playground,
        engine: engine,
        options: {
          width: width,
          height: height,
          wireframes: false,
          background: 'transparent',
          showVelocity: false,
          showAngleIndicator: false,
          pixelRatio: 'auto'
        }
      });

      // ensure canvas has proper mouse event handling
      render.canvas.style.cursor = 'grab';
      render.canvas.addEventListener('mousedown', () => {
        render.canvas.style.cursor = 'grabbing';
      });
      render.canvas.addEventListener('mouseup', () => {
        render.canvas.style.cursor = 'grab';
      });

      // create static ground boundary
      const ground = Bodies.rectangle(width / 2, height - 15, width, 30, { 
        isStatic: true,
        render: { fillStyle: '#3c4043' }
      });
      
      World.add(world, [ground]);

      // generate destructible objects array
      const colors = ['#ea4335', '#fbbc04', '#34a853', '#4285f4', '#a142f4'];
      const boxes = [];
      
      for (let i = 0; i < 12; i++) {
        const box = Bodies.rectangle(
          200 + (i * 60), 
          height - 80, 
          45, 
          45, 
          {
            restitution: 0.7,
            friction: 0.1,
            render: { fillStyle: colors[i % colors.length] }
          }
        );
        boxes.push(box);
      }
      
      World.add(world, boxes);

      // create wrecking ball object
      const wreckingBall = Bodies.circle(150, 100, 25, {
        density: 0.004,
        restitution: 0.9,
        frictionAir: 0.01,
        render: { fillStyle: '#ea4335' }
      });
      World.add(world, wreckingBall);

      // start physics simulation
      Engine.run(engine);
      Render.run(render);

      // implement mouse interaction system after render is created
      if (Mouse && MouseConstraint) {
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false }
          }
        });
        World.add(world, mouseConstraint);
        
        // keep the mouse in sync with rendering offset
        render.mouse = mouse;
        
        // add debug logging for mouse events
        render.canvas.addEventListener('mousedown', (e) => {
          console.log('dragging wrecking ball');
        });
        
        console.log('mouse interaction enabled for canvas');
      } else {
        console.error('Mouse or MouseConstraint not available from Matter.js');
      }

      console.log('physics simulation active');

      // display usage instructions
      this.addInstructions();
      this.showResetButton();

    } catch (error) {
      console.error('physics engine initialization failed:', error);
      playground.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    color: #e8eaed; font-family: 'Poppins', monospace; text-align: center;">
          <h3>simulation error</h3>
          <p>failed to initialize physics engine</p>
          <p style="font-size: 0.8rem; opacity: 0.7;">error: ${error.message}</p>
        </div>
      `;
      this.showResetButton();
    }
  }

  static addInstructions() {
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      color: #e8eaed;
      font-size: 14px;
      font-family: 'Poppins', monospace;
      background: rgba(32, 33, 36, 0.9);
      padding: 16px 20px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      max-width: 280px;
    `;
    instructions.innerHTML = `
      <div style="color: #ea4335; font-weight: bold; margin-bottom: 8px;">wrecking ball physics</div>
      <div style="font-size: 12px; line-height: 1.4;">
        • drag red sphere to build momentum<br>
        • release to impact destructible objects<br>
        • physics simulation responds to collisions
      </div>
    `;
    
    document.getElementById('playground').appendChild(instructions);
  }

  static showResetButton() {
    const resetBtn = document.getElementById('rst');
    resetBtn.classList.remove('hidden');
    resetBtn.onclick = () => location.reload();
  }
}

// expose class globally
window.AngerTools = AngerTools;
