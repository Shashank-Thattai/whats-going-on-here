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
  const FOOTPRINT_TRAILS_KEY = 'cartographer_footprint_trails';
  const footprintTrails = JSON.parse(localStorage.getItem(FOOTPRINT_TRAILS_KEY) || '{}');
  let lastRecordedPos = { x: x, y: y };
  const TRAIL_RECORD_INTERVAL = 8; // record every 8 pixels walked
  let distanceSinceLastRecord = 0;

  function getTrailKey(fromX, toX, fromY, toY) {
    const roundX1 = Math.round(fromX / 4) * 4;
    const roundY1 = Math.round(fromY / 4) * 4;
    const roundX2 = Math.round(toX / 4) * 4;
    const roundY2 = Math.round(toY / 4) * 4;
    return roundX1 + '_' + roundY1 + '_' + roundX2 + '_' + roundY2;
  }

  function recordFootprint(fromX, fromY, toX, toY) {
    const key = getTrailKey(fromX, toY, toX, toY);
    if (!footprintTrails[key]) {
      footprintTrails[key] = {
        fromX: fromX,
        fromY: fromY,
        toX: toX,
        toY: toY,
        count: 0
      };
    }
    footprintTrails[key].count += 1;
    localStorage.setItem(FOOTPRINT_TRAILS_KEY, JSON.stringify(footprintTrails));
  }

  function renderFootprintTrails() {
    document.querySelectorAll('.footprint-trail').forEach(el => el.remove());
    Object.keys(footprintTrails).forEach(key => {
      const trail = footprintTrails[key];
      const count = trail.count;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '-50 -50 100 100');
      svg.setAttribute('width', '100');
      svg.setAttribute('height', '100');
      svg.classList.add('footprint-trail');
      
      let intensity = 'faint';
      if (count >= 5) intensity = 'worn';
      if (count >= 10) intensity = 'deep';
      svg.classList.add(intensity);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const dx = trail.toX - trail.fromX;
      const dy = trail.toY - trail.fromY;
      line.setAttribute('x1', String(dx * -0.5));
      line.setAttribute('y1', String(dy * -0.5));
      line.setAttribute('x2', String(dx * 0.5));
      line.setAttribute('y2', String(dy * 0.5));
      line.setAttribute('stroke', 'currentColor');
      svg.appendChild(line);
      
      svg.style.left = (trail.fromX + trail.toX) / 2 + 'px';
      svg.style.top = (trail.fromY + trail.toY) / 2 + 'px';
      world.appendChild(svg);
    });
  }

  function loadFootprintTrails() {
    renderFootprintTrails();
  }

  loadFootprintTrails();

  const originalPlaceFootprints = place;
  place = function() {
    originalPlaceFootprints();
    
    const dx = x - lastRecordedPos.x;
    const dy = y - lastRecordedPos.y;
    distanceSinceLastRecord += Math.sqrt(dx * dx + dy * dy);
    
    if (distanceSinceLastRecord >= TRAIL_RECORD_INTERVAL) {
      recordFootprint(lastRecordedPos.x, lastRecordedPos.y, x, y);
      renderFootprintTrails();
      distanceSinceLastRecord = 0;
    }
    
    lastRecordedPos = { x: x, y: y };
  };

  const STREET_MARKS_KEY = 'cartographer_street_marks';
  const streetMarks = JSON.parse(localStorage.getItem(STREET_MARKS_KEY) || '{}');
  let markMode = false;
  let lastMarkedCorner = null;

  function createStreetMark(worldX, worldY, isContradiction = false) {
    const markId = Math.floor(worldX) + '_' + Math.floor(worldY);
    const markEl = document.createElement('div');
    markEl.className = 'street-marker' + (isContradiction ? ' contradiction' : '');
    markEl.style.left = worldX + 'px';
    markEl.style.top = worldY + 'px';
    markEl.setAttribute('data-mark-id', markId);
    world.appendChild(markEl);
    return markId;
  }

  function recordStreetMark(worldX, worldY) {
    const markId = Math.floor(worldX) + '_' + Math.floor(worldY);
    const existingMark = streetMarks[markId];
    
    if (existingMark) {
      existingMark.revisited = new Date().toISOString();
      existingMark.contradiction = true;
      const markEl = world.querySelector(`[data-mark-id="${markId}"]`);
      if (markEl) {
        markEl.classList.add('contradiction');
      }
    } else {
      streetMarks[markId] = {
        id: markId,
        x: worldX,
        y: worldY,
        marked: new Date().toISOString(),
        contradiction: false
      };
      createStreetMark(worldX, worldY, false);
    }
    
    localStorage.setItem(STREET_MARKS_KEY, JSON.stringify(streetMarks));
    lastMarkedCorner = markId;
  }

  function loadStreetMarks() {
    Object.keys(streetMarks).forEach(markId => {
      const mark = streetMarks[markId];
      createStreetMark(mark.x, mark.y, mark.contradiction);
    });
  }

  loadStreetMarks();

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'm' || ev.key === 'M') && nightActive && !endScreen.classList.contains('active')) {
      recordStreetMark(x, y);
      ev.preventDefault();
    }
  });

  const OBSERVATION_KEY = 'cartographer_observations';
  const endScreen = document.getElementById('end-screen');
  const observationInput = document.getElementById('observation-input');
  const observationSubmit = document.getElementById('observation-submit');
  let nightActive = true;

  function endNight() {
    nightActive = false;
    endScreen.classList.add('active');
    observationInput.focus();
  }

  function saveObservation(text) {
    if (text.trim().length === 0) {
      return;
    }
    const observations = JSON.parse(localStorage.getItem(OBSERVATION_KEY) || '[]');
    observations.push({
      text: text.trim(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    localStorage.setItem(OBSERVATION_KEY, JSON.stringify(observations));
  }

  observationSubmit.addEventListener('click', () => {
    saveObservation(observationInput.value);
    observationInput.value = '';
    endScreen.classList.remove('active');
  });

  observationInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.ctrlKey) {
      saveObservation(observationInput.value);
      observationInput.value = '';
      endScreen.classList.remove('active');
    }
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && endScreen.classList.contains('active')) {
      observationInput.value = '';
      endScreen.classList.remove('active');
    }
  });

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
