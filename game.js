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

  let departures = parseInt(localStorage.getItem('room-departures') || '0', 10);
  const objectFound = document.getElementById('object-found');
  const misrememberedSection = document.getElementById('misremembered');
  const misrememberedText = misrememberedSection.querySelector('.misremembered-text');
  const originalText = objectFound.querySelector('.object-text').textContent;
  
  function showMisremembered() {
    if (Math.random() < 0.3) {
      objectFound.querySelector('.object-text').textContent = misrememberedText.textContent;
      objectFound.classList.add('misremembered');
    }
  }
  
  function recordDeparture() {
    departures += 1;
    localStorage.setItem('room-departures', departures.toString());
    fetch('/api/departures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: departures })
    }).catch(() => {});
  }
  
  window.addEventListener('beforeunload', recordDeparture);
  showMisremembered();

});
