---
title: "Setting up Hugo, and a very long title for a post that could span multiple lines too"
description: "Saying 'Hello' from Hugo"
slug: "setting-up-hugo"
date: "2020-04-13"
categories:
  - "example"
  - "hello"
tags:
  - "example"
  - "hugo"
  - "blog"
---

**NOTE:** This markdown cheatsheet is a typography demo for this theme. Check out this post to learn more about this markdown usage when you want to get started with this theme. Enjoy!

## Typography Elements in One

Let's start with a informative paragraph. **This text is bolded.** But not this one! _How about italic text?_ Cool right? Ok, let's **_combine_** them together. Yeah, that's right! I have code to highlight, so `ThisIsMyCode()`. What a nice! Good people will hyperlink away, so [here we go](#) or [http://www.example.com](http://www.example.com).

<div class="divider"></div>

## Headings H1 to H6

# H1 Heading

## H2 Heading

### H3 Heading

#### H4 Heading

##### H5 Heading

###### H6 Heading

<div class="divider"></div>

## Footnote

Let's say you have text that you want to refer with a footnote, you can do that too! This is an example for the footnote number one [^1]. You can even add more footnotes, with link! [^2]

<div class="divider"></div>

## Blockquote

> Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible. --Francis of Assisi

**NOTE:** This theme does NOT support nested blockquotes.

<div class="divider"></div>

## List Items

1. First order list item
2. Second item

* Unordered list can use asterisks
- Or minuses
+ Or pluses

<div class="divider"></div>

## Code Blocks

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```typescript
enum GameState {
    SplashScreen,
    Playing,
    PlayerDying,
    ScoreScreen,
}

const sounds = {
    jump: new Howl({ src: ['assets/sounds/sfx_wing.ogg'], volume: 0.3 }),
    score: new Howl({ src: ['assets/sounds/sfx_point.ogg'], volume: 0.3 }),
    hit: new Howl({ src: ['assets/sounds/sfx_hit.ogg'], volume: 0.3 }),
    die: new Howl({ src: ['assets/sounds/sfx_die.ogg'], volume: 0.3 }),
    swoosh: new Howl({ src: ['assets/sounds/sfx_swooshing.ogg'], volume: 0.3 }),
};

const wait = async (time: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}

const log = (...args: any[]) => {
    console.log(`[${Date.now()}]`, ...args);
}

const toRad = (degrees: number) => {
    return degrees * Math.PI / 180;
}

const isBoxIntersecting = (a: BoundingBox, b: BoundingBox) => {
    return (
        a.x <= (b.x + b.width) &&
        b.x <= (a.x + a.width) &&
        a.y <= (b.y + b.height) &&
        b.y <= (a.y + a.height)
    );
}

const debugBoxes = new Map<HTMLElement, HTMLDivElement>();
const debuggerEnabled = true;

const drawDebugBox = (key: HTMLElement, box: BoundingBox) => {
    if (!debuggerEnabled) {
        return;
    }

    if (!debugBoxes.has(key)) {
        const newDebugBox = document.createElement('div');
        newDebugBox.className = 'boundingbox';
        const debugContainer = document.getElementById('debug');
        debugContainer!.appendChild(newDebugBox);
        debugBoxes.set(key, newDebugBox);
    }

    const boudingBox = debugBoxes.get(key);

    if (boudingBox == null) {
        log(`couldn't create a debug box for ${key}`);
        return;
    }

    boudingBox.style.top = `${box.y}px`;
    boudingBox.style.left = `${box.x}px`;
    boudingBox.style.width = `${box.width}px`;
    boudingBox.style.height = `${box.height}px`;
}

interface FlyingProperties {
    gravity: number;
    jumpVelocity: number;
    flightAreaBox: BoundingBox;
}

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface GameHtmlElements {
    bird: HTMLElement;
    land: HTMLElement;
    flightArea: HTMLElement;
}

class Game {
    protected domElements: GameHtmlElements;
    protected bird: Bird;
    protected land: Land;
    protected pipes: PipeManager;
    protected state: GameState;
    protected gameLoop: ReturnType<typeof setInterval> | undefined;

    constructor(domElements: GameHtmlElements) {
        this.domElements = domElements;
        this.bird = new Bird(domElements.bird, {
            gravity: 0.25,
            jumpVelocity: -4.6,
            flightAreaBox: domElements.flightArea.getBoundingClientRect(),
        });
        this.pipes = new PipeManager(domElements.flightArea);
        this.land = new Land(domElements.land);
        this.state = GameState.SplashScreen;
    }

    public onKeyboardEvent(ev: KeyboardEvent) {
        if (ev.keyCode !== 32) {
            return;
        }

        if (this.state === GameState.Playing) {
            this.bird.jump();
        } else if (this.state === GameState.SplashScreen) {
            this.start();
        } else if (this.state === GameState.ScoreScreen) {
            // this.replay;
        }
    }

    public onScreenTouch() {
        if (this.state === GameState.SplashScreen) {
            this.start();
        } else if (this.state === GameState.Playing) {
            this.bird.jump();
        }
    }

    public start() {
        this.state = GameState.Playing;
        this.gameLoop = setInterval(this.tick.bind(this), 1000 / 60);
        requestAnimationFrame(this.draw.bind(this));
    }

    public async die() {
        this.state = GameState.PlayerDying;
        clearInterval(this.gameLoop);

        // Find everything that's animated and stop it.
        Array.from(document.getElementsByClassName('animated')).forEach(e => {
            (e as HTMLElement).style.animationPlayState = 'paused';
            (e as HTMLElement).style.webkitAnimationPlayState = 'paused';
        });

        await this.bird.die();

        this.state = GameState.ScoreScreen;

        await wait(500);

        sounds.swoosh.play();
    }

    protected tick() {
        const now = Date.now();

        this.bird.tick();
        this.pipes.tick(now);

        if (this.pipes.intersectsWith(this.bird.box) || this.land.intersectsWith(this.bird.box)) {
            this.die();
        }
    }

    protected draw() {
        requestAnimationFrame(this.draw.bind(this));

        this.bird.draw();
    }
}

class Bird {
    protected domElement: HTMLElement;
    protected flyingProperties: FlyingProperties;
    protected width = 34;
    protected height = 24;
    protected velocity = 0;
    protected position = 180;
    protected rotation = 0;
    public box: BoundingBox = { x: 60, y: 180, width: 34, height: 24 };

    constructor(domElement: HTMLElement, flyingProperties: FlyingProperties) {
        this.domElement = domElement;
        this.flyingProperties = flyingProperties;
    }

    public tick() {
        this.velocity += this.flyingProperties.gravity;
        this.rotation = Math.min((this.velocity / 10) * 90, 90);
        this.position += this.velocity;

        // Clip us back in
        if (this.position < 0) {
            this.position = 0;
        }

        if (this.position > this.flyingProperties.flightAreaBox.height) {
            this.position = this.flyingProperties.flightAreaBox.height;
        }

        // We draw our bounding box around the bird through a couple steps. Our
        // rotation of the bird is done through the center. So if we've rotated
        // the bird 90 degrees (facing down), our bird becomes 5 px closer to
        // the top and 5 px further from the left -- because it's 10 px wider
        // than it is tall. To make this easier, we first calculate the height
        // and width of our bird and then calculate its x,y based on that.
        const rotationInRadians = Math.abs(toRad(this.rotation));
        const widthMultiplier = this.height - this.width; // 24 - 34 = -10
        const heightMultiplier = this.width - this.height; // 34 - 24 = 10

        this.box.width = this.width + (widthMultiplier * Math.sin(rotationInRadians));
        this.box.height = this.height + (heightMultiplier * Math.sin(rotationInRadians));

        const xShift = (this.width - this.box.width) / 2;
        const yShift = (this.height - this.box.height) / 2;

        // We're 60 away from the left (magic number), + x shift
        this.box.x = 60 + xShift;
        // And we're our current bird position from the top + y shift + the
        // distance to the top of the window, because of the sky
        this.box.y = this.position + yShift + this.flyingProperties.flightAreaBox.y;
    }

    public jump() {
        this.velocity = this.flyingProperties.jumpVelocity;
        sounds.jump.play();
    }

    public async die() {
        this.domElement.style.transition = `
            transform 1s cubic-bezier(0.65, 0, 0.35, 1)
        `;
        this.position = this.flyingProperties.flightAreaBox.height - this.height;
        this.rotation = 90;

        sounds.hit.play();
        await wait(500);
        sounds.die.play();
        await wait(500);
        this.domElement.style.transition = '';
    }

    public draw() {
        drawDebugBox(this.domElement, this.box);

        this.domElement.style.transform = `
            translate3d(0px, ${this.position}px, 0px)
            rotate3d(0, 0, 1, ${this.rotation}deg)
        `;
    }
}

class Land {
    public domElement: HTMLElement;
    public box: BoundingBox;

    constructor(domElement: HTMLElement) {
        this.domElement = domElement;
        this.box = domElement.getBoundingClientRect();

        drawDebugBox(this.domElement, this.box);
    }

    public intersectsWith(box: BoundingBox) {
        return isBoxIntersecting(this.box, box);
    }
}

class Pipe {
    public domElement: HTMLDivElement;
    protected upperPipeDomElement: HTMLDivElement;
    protected lowerPipeDomElement: HTMLDivElement;
    protected upperBox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };
    protected lowerBox: BoundingBox = { x: 0, y: 0, width: 0, height: 0 };

    constructor() {
        this.domElement = document.createElement('div');
        this.domElement.className = 'pipe animated';

        this.upperPipeDomElement = document.createElement('div');
        this.upperPipeDomElement.className = 'pipe_upper';
        this.upperPipeDomElement.style.height = '165px';

        this.lowerPipeDomElement = document.createElement('div');
        this.lowerPipeDomElement.className = 'pipe_lower';
        this.lowerPipeDomElement.style.height = '165px';

        this.domElement.appendChild(this.upperPipeDomElement);
        this.domElement.appendChild(this.lowerPipeDomElement);
    }

    public isOffScreen() {
        return this.upperBox.x <= -100;
    }

    public tick() {
        this.upperBox = this.upperPipeDomElement.getBoundingClientRect();
        this.lowerBox = this.lowerPipeDomElement.getBoundingClientRect();

        // TODO: This should be in draw not tick. Find a way to move it after.
        drawDebugBox(this.upperPipeDomElement, this.upperBox);
        drawDebugBox(this.lowerPipeDomElement, this.lowerBox);
    }

    public intersectsWith(box: BoundingBox) {
        return isBoxIntersecting(this.upperBox, box) || isBoxIntersecting(this.lowerBox, box);
    }
}

class PipeManager {
    protected pipeAreaDomElement: HTMLElement;
    protected pipeDelay = 1400;
    protected lastPipeInsertedTimestamp = 0;
    protected pipes: Pipe[] = [];

    constructor(pipeAreaDomElement: HTMLElement) {
        this.pipeAreaDomElement = pipeAreaDomElement;
    }

    public tick(now: number) {
        this.pipes.forEach(pipe => pipe.tick());

        if (now - this.lastPipeInsertedTimestamp < this.pipeDelay) {
            // Wait a little longer... we don't need to do this too often.
            return;
        }

        // Insert a new pipe and then prune all the pipes that have gone
        // entirely off the screen
        log('inserting pipe after', now - this.lastPipeInsertedTimestamp, 'ms');
        this.lastPipeInsertedTimestamp = now;
        const pipe = new Pipe();
        this.pipes.push(pipe);
        this.pipeAreaDomElement.appendChild(pipe.domElement);

        this.pipes = this.pipes.filter(pipe => {
            if (pipe.isOffScreen()) {
                log('pruning a pipe');
                pipe.domElement.remove();
                return false;
            }

            return true;
        });
    }

    public intersectsWith(box: BoundingBox) {
        return this.pipes.find(pipe => pipe.intersectsWith(box)) != null;
    }
}

(function() {
    const bird = document.getElementById('player');
    const land = document.getElementById('land');
    const flightArea = document.getElementById('flyarea');

    if (bird == null || flightArea == null || land == null) {
        throw new Error('Missing an element');
    }

    const game = new Game({ bird, land, flightArea });
    document.onkeydown = game.onKeyboardEvent.bind(game);
    if ('ontouchstart' in document) {
        document.ontouchstart = game.onScreenTouch.bind(game);
    } else {
        document.onmousedown = game.onScreenTouch.bind(game);
    }
    game.start();
})();
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

<div class="divider"></div>

## Mathematics

The theme comes ready with [mathjax](https://www.mathjax.org/) support built in, allowing for both simple inline equations like $$ax^2 + bx + c = 0$$ and much more complex mathematical expressions such as equation $$\eqref{eq:sample}$$ below.

$$
\begin{align}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t}  &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \tag{2} \label{eq:sample}\\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t}  &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}}  &= 0\\
\end{align}
$$

<div class="divider"></div>


## Table

### Table 1: With Alignment

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

### Table 2: With Typography Elements

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3

<div class="divider"></div>

## Horizontal Line

The HTML `<hr>` element is for creating a "thematic break" between paragraph-level elements. In markdown, you can create a `<hr>` with any of the following:

* `___`: three consecutive underscores
* `---`: three consecutive dashes
* `***`: three consecutive asterisks

renders to:

___

---

***

<div class="divider"></div>

## Media

### YouTube Embedded Iframe

<iframe width="560" height="315" src="https://www.youtube.com/embed/n1a7o44WxNo" frameborder="0" allowfullscreen></iframe>

### Image

![Minion](http://octodex.github.com/images/minion.png)

[^1]: Footnote number one yeah baby! Long sentence test of footnote to see how the words are wrapping between each other. Might overflowww!
[^2]: A footnote you can link to - [click here!](#)
