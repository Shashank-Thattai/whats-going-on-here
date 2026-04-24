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

  const reckoning = document.getElementById('reckoning-surface');
  const reckoningZone = { x: 0, y: 0, width: 0, height: 0 };
  
  if (reckoning) {
    const rect = reckoning.getBoundingClientRect();
    reckoningZone.x = rect.left;
    reckoningZone.y = rect.top;
    reckoningZone.width = rect.width;
    reckoningZone.height = rect.height;
    
    pickables.forEach(obj => {
      obj.addEventListener('click', () => {
        setTimeout(() => {
          const objRect = obj.getBoundingClientRect();
          const objCenterX = objRect.left + objRect.width / 2;
          const objCenterY = objRect.top + objRect.height / 2;
          
          const isInReckoning = 
            objCenterX >= reckoningZone.x &&
            objCenterX <= reckoningZone.x + reckoningZone.width &&
            objCenterY >= reckoningZone.y &&
            objCenterY <= reckoningZone.y + reckoningZone.height;
          
          if (isInReckoning && obj.classList.contains('picked')) {
            const dust = document.createElement('div');
            dust.className = 'dust-response';
            dust.textContent = '·';
            dust.style.position = 'absolute';
            dust.style.left = (objCenterX - reckoningZone.x) + 'px';
            dust.style.top = (objCenterY - reckoningZone.y) + 'px';
            dust.style.opacity = '0.6';
            dust.style.color = 'var(--dust)';
            dust.style.fontSize = '2rem';
            dust.style.pointerEvents = 'none';
            reckoning.appendChild(dust);
            
            setTimeout(() => { dust.remove(); }, 1200);
          }
        }, 50);
      });
    });
  }

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
