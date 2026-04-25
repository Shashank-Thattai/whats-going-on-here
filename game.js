// Cartographer of the Sleeping City — runtime.
//
// Movement is the contract. The world scrolls beneath the figure as they
// walk; the figure stays at the centre of the viewport. See FOUNDING.md §3.
//
// `x` and `y` track the figure's WORLD coordinates. The figure does not
// move on screen — `place()` translates the world by the inverse, which
// produces the visual effect of scrolling.

(() => {
  const world = document.getElementById("world");
  const STEP = 4;
  let x = 0;
  let y = 0;

  function place() {
    // World scrolls in the opposite direction of the walker.
    world.style.transform = "translate(" + (-x) + "px, " + (-y) + "px)";
  }

  window.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowUp":
      case "w":
      case "W":
        y -= STEP;
        break;
      case "ArrowDown":
      case "s":
      case "S":
        y += STEP;
        break;
      case "ArrowLeft":
      case "a":
      case "A":
        x -= STEP;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        x += STEP;
        break;
      default:
        return;
    }
    ev.preventDefault();
    place();
  });

  place();

  // AGENTS' BEHAVIORS GO HERE
})();
