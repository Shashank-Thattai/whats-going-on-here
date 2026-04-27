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
  const markedPlaces = JSON.parse(localStorage.getItem('markedPlaces') || '{}');
  const markPrompt = document.querySelector('.mark-prompt');
  let nearbyDoorId = null;

  function saveMark(doorId, doorData) {
    markedPlaces[doorId] = {
      id: doorId,
      x: doorData.x,
      y: doorData.y,
      room: doorData.room,
      marked: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('markedPlaces', JSON.stringify(markedPlaces));
  }

  function loadMarkedDoorways() {
    Object.keys(markedPlaces).forEach(doorId => {
      const doorEl = document.querySelector(`[data-doorway="${doorId}"]`);
      if (doorEl) {
        doorEl.classList.add('marked-doorway');
      }
    });
  }

  loadMarkedDoorways();

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'e' || ev.key === 'E') {
      if (nearbyDoorId !== null) {
        const door = doorways.find(d => d.id === nearbyDoorId);
        if (door) {
          saveMark(nearbyDoorId, door);
          const doorEl = document.querySelector(`[data-doorway="${nearbyDoorId}"]`);
          doorEl.classList.add('marked-doorway');
          markPrompt.classList.remove('visible');
        }
      }
    }
  });

  const originalCheckDoorways = checkDoorways;
  checkDoorways = function() {
    originalCheckDoorways();
    nearbyDoorId = null;
    doorways.forEach(door => {
      const dx = x - door.x;
      const dy = y - door.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < door.openDistance && !markedPlaces[door.id]) {
        nearbyDoorId = door.id;
        markPrompt.classList.add('visible');
      }
    });
    if (nearbyDoorId === null) {
      markPrompt.classList.remove('visible');
    }
  };

  const doorways = [
    { id: 0, x: 80, y: -20, room: "study", openDistance: 40 },
    { id: 1, x: 200, y: 120, room: "kitchen", openDistance: 40 },
    { id: 2, x: -150, y: 80, room: "chamber", openDistance: 40 }
  ];

  let activeRoom = null;

  function checkDoorways() {
    doorways.forEach(door => {
      const dx = x - door.x;
      const dy = y - door.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const doorEl = document.querySelector(`[data-doorway="${door.id}"]`);
      
      if (distance < door.openDistance) {
        doorEl.classList.add("open");
      } else {
        doorEl.classList.remove("open");
      }
    });
  }

  doorways.forEach(door => {
    const doorEl = document.querySelector(`[data-doorway="${door.id}"]`);
    doorEl.addEventListener("click", () => {
      if (doorEl.classList.contains("open")) {
        activeRoom = door.room;
        document.getElementById(`room-${door.room}`).classList.add("active");
      }
    });
  });

  document.querySelectorAll(".room-exit").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".room").forEach(r => r.classList.remove("active"));
      activeRoom = null;
    });
  });

  const originalPlace = place;
  place = function() {
    originalPlace();
    checkDoorways();
  };

})();
