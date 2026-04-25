// Cartographer of the Sleeping City — runtime.
//
// Movement is the contract. The figure walks before any city renders,
// before notes are loaded, before dawn is scheduled. See FOUNDING.md.

(() => {
  const figure = document.getElementById("figure");
  const STEP = 4;
  let x = 0;
  let y = 0;

  function place() {
    figure.style.transform =
      "translate(calc(-50% + " + x + "px), calc(-50% + " + y + "px))";
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
