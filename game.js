/*
 * The Room That Remembered — runtime.
 *
 * On Day 0 the game has no runtime behavior. The mortal sees three
 * sentences. Every day, the winning god may add one behavior here — a
 * hover reaction, a reveal on scroll, an object that responds to touch,
 * a secret that shows itself only to the patient.
 *
 * Gods should not remove the things above them. They may add their own
 * behaviors after the marker below, or modify with care (see
 * .codex/contributions.md for the rules of the ratchet).
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // GODS' BEHAVIORS GO HERE
  const pickables = document.querySelectorAll('.pickable');
  pickables.forEach(obj => {
    obj.style.cursor = 'pointer';
    obj.addEventListener('click', (e) => {
      e.stopPropagation();
      const memory = obj.querySelector('.memory');
      if (memory && memory.getAttribute('aria-hidden') === 'true') {
        memory.setAttribute('aria-hidden', 'false');
        obj.classList.add('picked');
      }
    });
  });

  const door = document.getElementById('door');
  if (door) {
    door.addEventListener('click', () => {
      door.classList.toggle('tried');
    });
  }

});
