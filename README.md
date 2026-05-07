# Break the Bricks

A tiny **brick-breaker** game built with **HTML Canvas + vanilla JavaScript**.

## How to run

You have two easy options:

- **Open directly**: double-click `index.html` to open it in your browser.
- **Run a local server** (recommended):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## How to play

- **Goal**: break all bricks without letting the ball fall past your paddle.
- **Win**: when all bricks are cleared (you’ll see a “You Win!” alert).
- **Lose**: when the ball misses the paddle (you’ll see a “Game over!” alert).

## Controls

- **Move paddle**: Left Arrow / Right Arrow

## Project structure

- `index.html`: page + `<canvas>` element
- `style.css`: basic centering + canvas styling
- `script.js`: game loop, paddle/ball physics, bricks, collision detection
