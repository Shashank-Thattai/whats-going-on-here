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
const FRAGMENTS_KEY = 'cartographer_fragments';
  const fragments = JSON.parse(localStorage.getItem(FRAGMENTS_KEY) || '[]');
  const fragmentPrompt = document.querySelector('.fragment-prompt');
  const fragmentInputOverlay = document.getElementById('fragment-input-overlay');
  const fragmentTextarea = document.getElementById('fragment-textarea');
  const fragmentSubmit = document.getElementById('fragment-submit');
  const fragmentCancel = document.getElementById('fragment-cancel');
  const fragmentLedger = document.getElementById('fragment-ledger');
  const fragmentLedgerToggle = document.getElementById('fragment-ledger-toggle');
  const fragmentLedgerContent = document.getElementById('fragment-ledger-content');
  let nearbyMarkedLocation = null;
  let fragmentInputActive = false;

  function checkNearbyMarkedLocations() {
    nearbyMarkedLocation = null;
    Object.keys(streetMarks).forEach(markId => {
      const mark = streetMarks[markId];
      const dx = x - mark.x;
      const dy = y - mark.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        nearbyMarkedLocation = markId;
      }
    });
    if (nearbyMarkedLocation !== null) {
      fragmentPrompt.classList.add('visible');
    } else {
      fragmentPrompt.classList.remove('visible');
    }
  }

  function openFragmentInput() {
    if (nearbyMarkedLocation === null) return;
    fragmentInputActive = true;
    fragmentInputOverlay.classList.add('active');
    fragmentTextarea.value = '';
    fragmentTextarea.focus();
  }

  function closeFragmentInput() {
    fragmentInputActive = false;
    fragmentInputOverlay.classList.remove('active');
    fragmentTextarea.value = '';
  }

  function saveFragment(text) {
    if (text.trim().length === 0) {
      closeFragmentInput();
      return;
    }
    fragments.push({
      text: text.trim(),
      captured: new Date().toISOString(),
      nearLocation: nearbyMarkedLocation
    });
    localStorage.setItem(FRAGMENTS_KEY, JSON.stringify(fragments));
    renderFragmentLedger();
    closeFragmentInput();
  }

  function renderFragmentLedger() {
    fragmentLedgerContent.innerHTML = '';
    fragments.forEach((fragment, idx) => {
      const entryEl = document.createElement('div');
      entryEl.className = 'fragment-entry';
      const textEl = document.createElement('div');
      textEl.className = 'fragment-entry-text';
      textEl.textContent = fragment.text;
      entryEl.appendChild(textEl);
      fragmentLedgerContent.appendChild(entryEl);
    });
  }

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'n' || ev.key === 'N') && nightActive && !endScreen.classList.contains('active') && !fragmentInputActive) {
      if (nearbyMarkedLocation !== null) {
        openFragmentInput();
        ev.preventDefault();
      }
    }
    if ((ev.key === 'L' || ev.key === 'l') && ev.shiftKey && !endScreen.classList.contains('active')) {
      fragmentLedger.classList.toggle('open');
      ev.preventDefault();
    }
  });

  fragmentSubmit.addEventListener('click', () => {
    saveFragment(fragmentTextarea.value);
  });

  fragmentCancel.addEventListener('click', () => {
    closeFragmentInput();
  });

  fragmentTextarea.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.ctrlKey) {
      saveFragment(fragmentTextarea.value);
      ev.preventDefault();
    }
    if (ev.key === 'Escape') {
      closeFragmentInput();
      ev.preventDefault();
    }
  });

  fragmentLedgerToggle.addEventListener('click', () => {
    fragmentLedger.classList.toggle('open');
  });

  const originalPlaceForFragments = place;
  place = function() {
    originalPlaceForFragments();
    checkNearbyMarkedLocations();
  };

  renderFragmentLedger();

const STILLNESS_MARKS_KEY = 'cartographer_stillness_marks';
  const stillnessMarks = JSON.parse(localStorage.getItem(STILLNESS_MARKS_KEY) || '{}');
  let lastStillnessCheckTime = Date.now();
  let stillnessAccumulation = 0;
  const STILLNESS_THRESHOLD = 1200; // milliseconds of stillness before marking
  const STILLNESS_CHECK_INTERVAL = 100; // milliseconds
  let renderedStillnessMarks = {};

  function getStillnessMarkKey(worldX, worldY) {
    const gridX = Math.round(worldX / 20) * 20;
    const gridY = Math.round(worldY / 20) * 20;
    return gridX + '_' + gridY;
  }

  function recordStillness(worldX, worldY, duration) {
    const key = getStillnessMarkKey(worldX, worldY);
    if (!stillnessMarks[key]) {
      stillnessMarks[key] = {
        x: worldX,
        y: worldY,
        standCount: 0,
        totalDuration: 0,
        firstStood: new Date().toISOString(),
        lastStood: new Date().toISOString()
      };
    }
    stillnessMarks[key].totalDuration += duration;
    stillnessMarks[key].lastStood = new Date().toISOString();
    if (duration >= STILLNESS_THRESHOLD) {
      stillnessMarks[key].standCount += 1;
    }
    localStorage.setItem(STILLNESS_MARKS_KEY, JSON.stringify(stillnessMarks));
    renderStillnessMark(key);
  }

  function renderStillnessMark(key) {
    const mark = stillnessMarks[key];
    const markId = 'stillness_' + key;
    let markEl = document.getElementById(markId);
    
    if (!markEl) {
      markEl = document.createElement('div');
      markEl.id = markId;
      markEl.className = 'stillness-mark';
      markEl.setAttribute('data-stillness-key', key);
      world.appendChild(markEl);
    }
    
    markEl.style.left = mark.x + 'px';
    markEl.style.top = mark.y + 'px';
    
    const standCount = mark.standCount;
    let visibilityClass = 'visible-1';
    if (standCount >= 4) visibilityClass = 'visible-4-plus';
    else if (standCount >= 3) visibilityClass = 'visible-3';
    else if (standCount >= 2) visibilityClass = 'visible-2';
    
    if (standCount >= 2 && standCount <= 3) {
      markEl.classList.add('deepening');
      setTimeout(() => markEl.classList.remove('deepening'), 400);
    }
    
    markEl.className = 'stillness-mark ' + visibilityClass;
    renderedStillnessMarks[markId] = true;
  }

  function loadStillnessMarks() {
    Object.keys(stillnessMarks).forEach(key => {
      renderStillnessMark(key);
    });
  }

  loadStillnessMarks();

  let lastStillnessPosition = { x: x, y: y };
  let stillnessStartTime = Date.now();

  setInterval(() => {
    if (!nightActive) return;
    
    const now = Date.now();
    const dx = x - lastStillnessPosition.x;
    const dy = y - lastStillnessPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 2) {
      stillnessAccumulation += STILLNESS_CHECK_INTERVAL;
      if (stillnessAccumulation >= STILLNESS_THRESHOLD && stillnessAccumulation % (STILLNESS_THRESHOLD * 2) < STILLNESS_CHECK_INTERVAL) {
        recordStillness(x, y, stillnessAccumulation);
      }
    } else {
      if (stillnessAccumulation >= STILLNESS_THRESHOLD) {
        recordStillness(lastStillnessPosition.x, lastStillnessPosition.y, stillnessAccumulation);
      }
      stillnessAccumulation = 0;
      lastStillnessPosition = { x: x, y: y };
    }
  }, STILLNESS_CHECK_INTERVAL);

const UNSOLVABLE_DOORWAY_KEY = 'cartographer_unsolvable_doorway';
  const unsolvableDoorway = JSON.parse(localStorage.getItem(UNSOLVABLE_DOORWAY_KEY) || '{}');
  let doorwayStates = {};
  const DOORWAY_CYCLE_STATES = ['unopenable', 'closed', 'self'];

  function initializeUnsolvableDoorway() {
    if (!unsolvableDoorway.id) {
      unsolvableDoorway.id = 'unsolvable_0';
      unsolvableDoorway.x = 80;
      unsolvableDoorway.y = -20;
      unsolvableDoorway.currentState = 0;
      unsolvableDoorway.lastApproachTime = null;
      unsolvableDoorway.approachCount = 0;
      localStorage.setItem(UNSOLVABLE_DOORWAY_KEY, JSON.stringify(unsolvableDoorway));
    }
    doorwayStates[unsolvableDoorway.id] = unsolvableDoorway.currentState || 0;
  }

  function cycleUnsolvableDoorwayState() {
    const currentState = doorwayStates[unsolvableDoorway.id] || 0;
    const nextState = (currentState + 1) % DOORWAY_CYCLE_STATES.length;
    doorwayStates[unsolvableDoorway.id] = nextState;
    unsolvableDoorway.currentState = nextState;
    unsolvableDoorway.approachCount = (unsolvableDoorway.approachCount || 0) + 1;
    unsolvableDoorway.lastApproachTime = Date.now();
    localStorage.setItem(UNSOLVABLE_DOORWAY_KEY, JSON.stringify(unsolvableDoorway));
  }

  function checkUnsolvableDoorway() {
    const dx = x - unsolvableDoorway.x;
    const dy = y - unsolvableDoorway.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const unsolvableEl = document.querySelector('[data-unsolvable-doorway="true"]');
    
    if (distance < 50) {
      if (!unsolvableEl.classList.contains('unsolvable')) {
        unsolvableEl.classList.add('unsolvable');
        cycleUnsolvableDoorwayState();
        unsolvableEl.classList.add('cycling');
        setTimeout(() => unsolvableEl.classList.remove('cycling'), 800);
      }
    } else {
      unsolvableEl.classList.remove('unsolvable', 'cycling');
    }
  }

  function renderUnsolvableDoorway() {
    let unsolvableEl = document.querySelector('[data-unsolvable-doorway="true"]');
    if (!unsolvableEl) {
      unsolvableEl = document.createElement('div');
      unsolvableEl.className = 'doorway';
      unsolvableEl.setAttribute('data-unsolvable-doorway', 'true');
      unsolvableEl.style.left = unsolvableDoorway.x + 'px';
      unsolvableEl.style.top = unsolvableDoorway.y + 'px';
      world.appendChild(unsolvableEl);
    }
  }

  initializeUnsolvableDoorway();
  renderUnsolvableDoorway();

  const originalPlaceUnsolvable = place;
  place = function() {
    originalPlaceUnsolvable();
    checkUnsolvableDoorway();
  };

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'e' || ev.key === 'E') && nightActive && !endScreen.classList.contains('active')) {
      const dx = x - unsolvableDoorway.x;
      const dy = y - unsolvableDoorway.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) {
        const unsolvableEl = document.querySelector('[data-unsolvable-doorway="true"]');
        cycleUnsolvableDoorwayState();
        unsolvableEl.classList.add('cycling');
        setTimeout(() => unsolvableEl.classList.remove('cycling'), 800);
        ev.preventDefault();
      }
    }
  });

const STREETS_LOCKED_KEY = 'cartographer_streets_locked';
  const streetsLocked = JSON.parse(localStorage.getItem(STREETS_LOCKED_KEY) || '{}');
  const STREET_LOCK_THRESHOLD = 3;
  let lockedStreetCount = 0;
  let renderedLockedStreets = {};
  let renderedWildnessMarkers = {};

  function getStreetSegmentKey(fromX, fromY, toX, toY) {
    const roundX1 = Math.round(fromX / 20) * 20;
    const roundY1 = Math.round(fromY / 20) * 20;
    const roundX2 = Math.round(toX / 20) * 20;
    const roundY2 = Math.round(toY / 20) * 20;
    const minX = Math.min(roundX1, roundX2);
    const maxX = Math.max(roundX1, roundX2);
    const minY = Math.min(roundY1, roundY2);
    const maxY = Math.max(roundY1, roundY2);
    return minX + '_' + minY + '_' + maxX + '_' + maxY;
  }

  function recordStreetWalk(fromX, fromY, toX, toY) {
    const key = getStreetSegmentKey(fromX, fromY, toX, toY);
    if (!streetsLocked[key]) {
      streetsLocked[key] = {
        fromX: fromX,
        fromY: fromY,
        toX: toX,
        toY: toY,
        walkCount: 0,
        locked: false,
        lockedAt: null
      };
    }
    streetsLocked[key].walkCount += 1;
    
    if (streetsLocked[key].walkCount === STREET_LOCK_THRESHOLD && !streetsLocked[key].locked) {
      streetsLocked[key].locked = true;
      streetsLocked[key].lockedAt = Date.now();
      lockedStreetCount += 1;
      localStorage.setItem(STREETS_LOCKED_KEY, JSON.stringify(streetsLocked));
      renderLockedStreet(key, streetsLocked[key]);
      generateWildnessAround(key, streetsLocked[key]);
    } else {
      localStorage.setItem(STREETS_LOCKED_KEY, JSON.stringify(streetsLocked));
    }
  }

  function renderLockedStreet(key, segment) {
    const lockedId = 'locked_' + key;
    let lockedEl = document.getElementById(lockedId);
    
    if (!lockedEl) {
      lockedEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lockedEl.id = lockedId;
      lockedEl.setAttribute('viewBox', '-60 -60 120 120');
      lockedEl.setAttribute('width', '120');
      lockedEl.setAttribute('height', '120');
      lockedEl.classList.add('street-locked');
      world.appendChild(lockedEl);
    }
    
    const midX = (segment.fromX + segment.toX) / 2;
    const midY = (segment.fromY + segment.toY) / 2;
    lockedEl.style.left = (midX - 60) + 'px';
    lockedEl.style.top = (midY - 60) + 'px';
    
    const dx = segment.toX - segment.fromX;
    const dy = segment.toY - segment.fromY;
    
    let line = lockedEl.querySelector('line');
    if (!line) {
      line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lockedEl.appendChild(line);
    }
    
    line.setAttribute('x1', String(-dx / 2));
    line.setAttribute('y1', String(-dy / 2));
    line.setAttribute('x2', String(dx / 2));
    line.setAttribute('y2', String(dy / 2));
    line.setAttribute('stroke', 'currentColor');
    
    lockedEl.classList.add('visible');
    renderedLockedStreets[lockedId] = true;
  }

  function generateWildnessAround(streetKey, segment) {
    const midX = (segment.fromX + segment.toX) / 2;
    const midY = (segment.fromY + segment.toY) / 2;
    const wildnessCount = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < wildnessCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      const wildX = midX + Math.cos(angle) * distance;
      const wildY = midY + Math.sin(angle) * distance;
      
      const wildId = 'wildness_' + streetKey + '_' + i;
      const wildEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      wildEl.id = wildId;
      wildEl.setAttribute('viewBox', '-30 -30 60 60');
      wildEl.setAttribute('width', '60');
      wildEl.setAttribute('height', '60');
      wildEl.classList.add('wildness-marker');
      wildEl.style.left = (wildX - 30) + 'px';
      wildEl.style.top = (wildY - 30) + 'px';
      
      const pathType = Math.floor(Math.random() * 3);
      let pathData = '';
      if (pathType === 0) {
        pathData = 'M -20 -20 Q 0 -25 20 -20 Q 25 0 20 20 Q 0 25 -20 20 Q -25 0 -20 -20';
      } else if (pathType === 1) {
        pathData = 'M -15 0 L 0 -18 L 15 0 L 0 18 Z';
      } else {
        pathData = 'M -20 -10 L -10 -20 L 10 -20 L 20 -10 L 20 10 L 10 20 L -10 20 L -20 10 Z';
      }
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('fill', 'none');
      wildEl.appendChild(path);
      
      world.appendChild(wildEl);
      renderedWildnessMarkers[wildId] = true;
    }
  }

  function loadLockedStreets() {
    Object.keys(streetsLocked).forEach(key => {
      const segment = streetsLocked[key];
      if (segment.locked) {
        renderLockedStreet(key, segment);
        lockedStreetCount += 1;
      }
    });
  }

  loadLockedStreets();

  const originalPlaceLockedStreets = place;
  place = function() {
    originalPlaceLockedStreets();
    if (lastRecordedPos) {
      recordStreetWalk(lastRecordedPos.x, lastRecordedPos.y, x, y);
    }
  };

  const STREET_SEDIMENT_KEY = 'cartographer_street_sediment';
  const streetSediment = JSON.parse(localStorage.getItem(STREET_SEDIMENT_KEY) || '{}');
  let lastSedimentSegmentKey = null;
  let sedimentSegmentPassageCount = {};

  function getSedimentSegmentKey(fromX, fromY, toX, toY) {
    const roundX1 = Math.round(fromX / 8) * 8;
    const roundY1 = Math.round(fromY / 8) * 8;
    const roundX2 = Math.round(toX / 8) * 8;
    const roundY2 = Math.round(toY / 8) * 8;
    const minX = Math.min(roundX1, roundX2);
    const maxX = Math.max(roundX1, roundX2);
    const minY = Math.min(roundY1, roundY2);
    const maxY = Math.max(roundY1, roundY2);
    return minX + '_' + minY + '_' + maxX + '_' + maxY;
  }

  function recordSedimentPassage(fromX, fromY, toX, toY) {
    const key = getSedimentSegmentKey(fromX, fromY, toX, toY);
    if (key !== lastSedimentSegmentKey) {
      if (!streetSediment[key]) {
        streetSediment[key] = {
          fromX: fromX,
          fromY: fromY,
          toX: toX,
          toY: toY,
          passages: 0,
          rendered: false
        };
      }
      streetSediment[key].passages += 1;
      lastSedimentSegmentKey = key;
      
      if (streetSediment[key].passages >= 2) {
        renderSedimentLine(key, streetSediment[key]);
      }
      localStorage.setItem(STREET_SEDIMENT_KEY, JSON.stringify(streetSediment));
    }
  }

  function renderSedimentLine(key, segment) {
    const sedimentId = 'sediment_' + key;
    let sedimentEl = document.getElementById(sedimentId);
    
    if (!sedimentEl) {
      sedimentEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      sedimentEl.id = sedimentId;
      sedimentEl.setAttribute('viewBox', '-40 -40 80 80');
      sedimentEl.setAttribute('width', '80');
      sedimentEl.setAttribute('height', '80');
      sedimentEl.classList.add('street-sediment');
      world.appendChild(sedimentEl);
    }
    
    const midX = (segment.fromX + segment.toX) / 2;
    const midY = (segment.fromY + segment.toY) / 2;
    sedimentEl.style.left = (midX - 40) + 'px';
    sedimentEl.style.top = (midY - 40) + 'px';
    
    const dx = segment.toX - segment.fromX;
    const dy = segment.toY - segment.fromY;
    
    let line = sedimentEl.querySelector('line');
    if (!line) {
      line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      sedimentEl.appendChild(line);
    }
    
    line.setAttribute('x1', String(-dx / 2));
    line.setAttribute('y1', String(-dy / 2));
    line.setAttribute('x2', String(dx / 2));
    line.setAttribute('y2', String(dy / 2));
    line.setAttribute('stroke', 'currentColor');
    
    const passageCount = segment.passages;
    let visibilityClass = 'visible-1';
    if (passageCount >= 4) visibilityClass = 'visible-4-plus';
    else if (passageCount >= 3) visibilityClass = 'visible-3';
    else if (passageCount >= 2) visibilityClass = 'visible-2';
    
    if (passageCount === 3 || passageCount === 4) {
      sedimentEl.classList.add('deepening');
      setTimeout(() => sedimentEl.classList.remove('deepening'), 400);
    }
    
    sedimentEl.className = 'street-sediment ' + visibilityClass;
    segment.rendered = true;
  }

  function renderAllSediment() {
    Object.keys(streetSediment).forEach(key => {
      const segment = streetSediment[key];
      if (segment.passages >= 2) {
        renderSedimentLine(key, segment);
      }
    });
  }

  function loadStreetSediment() {
    renderAllSediment();
  }

  loadStreetSediment();

  const originalPlaceSediment = place;
  place = function() {
    originalPlaceSediment();
    if (lastRecordedPos) {
      recordSedimentPassage(lastRecordedPos.x, lastRecordedPos.y, x, y);
    }
  };

  const audioContextIndicator = document.querySelector('.audio-context-indicator');
  let audioContext = null;
  let oscillators = {};
  let gains = {};
  let ambientGain = null;
  let masterGain = null;
  let currentSkyStage = 0;
  let lastLocationKey = null;
  let locationAmbience = null;
  let locationGain = null;

  function initializeAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(audioContext.destination);
    ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0.08;
    ambientGain.connect(masterGain);
    locationGain = audioContext.createGain();
    locationGain.gain.value = 0.12;
    locationGain.connect(masterGain);
    audioContextIndicator.classList.add('active');
  }

  function createAmbientTone(frequency, stage) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    const baseGain = 0.04;
    const stageAttenuation = (stage / 8) * 0.02;
    gain.gain.value = baseGain - stageAttenuation;
    osc.connect(gain);
    gain.connect(ambientGain);
    osc.start();
    return { osc: osc, gain: gain };
  }

  function updateAmbientSoundscape(stage) {
    if (!audioContext) return;
    Object.keys(oscillators).forEach(key => {
      oscillators[key].osc.stop();
    });
    oscillators = {};
    const baseFrequencies = [55, 110, 165, 220];
    const stageFrequencyShift = (stage / 8) * 20;
    baseFrequencies.forEach((freq, idx) => {
      const shiftedFreq = freq + stageFrequencyShift;
      oscillators['ambient_' + idx] = createAmbientTone(shiftedFreq, stage);
    });
  }

  function getLocationCategory(worldX, worldY) {
    const gridX = Math.round(worldX / 80) * 80;
    const gridY = Math.round(worldY / 80) * 80;
    const hash = Math.abs(gridX * 73856093 ^ gridY * 19349663) % 4;
    return ['square', 'alley', 'crossing', 'threshold'][hash];
  }

  function createLocationAmbience(category, stage) {
    if (locationAmbience) {
      locationAmbience.osc.stop();
    }
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    let baseFreq = 220;
    let baseGain = 0.05;
    switch (category) {
      case 'square':
        baseFreq = 185;
        baseGain = 0.06;
        break;
      case 'alley':
        baseFreq = 247;
        baseGain = 0.04;
        break;
      case 'crossing':
        baseFreq = 220;
        baseGain = 0.07;
        break;
      case 'threshold':
        baseFreq = 196;
        baseGain = 0.05;
        break;
    }
    const stageAttenuation = (stage / 8) * 0.03;
    osc.frequency.value = baseFreq + (stage * 5);
    gain.gain.value = baseGain - stageAttenuation;
    osc.connect(gain);
    gain.connect(locationGain);
    osc.start();
    locationAmbience = { osc: osc, gain: gain };
  }

  function updateLocationAmbience(stage) {
    const locKey = getLocationCategory(x, y);
    if (locKey !== lastLocationKey) {
      createLocationAmbience(locKey, stage);
      lastLocationKey = locKey;
    }
  }

  function updateAudioState() {
    if (!nightActive) return;
    const now = Date.now();
    const elapsed = now - nightStartTime;
    const progress = Math.min(elapsed / NIGHT_DURATION, 1);
    const stageIndex = Math.floor(progress * (NIGHT_STAGES - 1));
    const stage = Math.min(stageIndex, NIGHT_STAGES - 1);
    if (stage !== currentSkyStage) {
      currentSkyStage = stage;
      updateAmbientSoundscape(stage);
    }
    updateLocationAmbience(stage);
  }

  window.addEventListener('click', () => {
    if (!audioContext) {
      initializeAudio();
    }
  });

  window.addEventListener('keydown', () => {
    if (!audioContext) {
      initializeAudio();
    }
  });

  const originalUpdateSkyState = updateSkyState;
  updateSkyState = function() {
    originalUpdateSkyState();
    updateAudioState();
  };

  const GHOST_MARKS_KEY = 'cartographer_ghost_marks';
  const ghostMarks = JSON.parse(localStorage.getItem(GHOST_MARKS_KEY) || '{}');
  let renderedGhosts = {};

  function captureMarkState(markId, mark) {
    if (!ghostMarks[markId]) {
      ghostMarks[markId] = {
        id: markId,
        x: mark.x,
        y: mark.y,
        states: []
      };
    }
    const state = {
      timestamp: new Date().toISOString(),
      skyStage: sky.className.replace('night-', ''),
      contradiction: mark.contradiction || false
    };
    ghostMarks[markId].states.push(state);
    if (ghostMarks[markId].states.length > 3) {
      ghostMarks[markId].states.shift();
    }
    localStorage.setItem(GHOST_MARKS_KEY, JSON.stringify(ghostMarks));
  }

  function renderGhostLine(markId) {
    const ghostData = ghostMarks[markId];
    if (!ghostData || ghostData.states.length < 2) {
      return;
    }
    const previousState = ghostData.states[ghostData.states.length - 2];
    const currentState = ghostData.states[ghostData.states.length - 1];
    const ghostId = 'ghost_' + markId;
    let ghostEl = document.getElementById(ghostId);
    
    if (!ghostEl) {
      ghostEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      ghostEl.id = ghostId;
      ghostEl.setAttribute('viewBox', '-40 -40 80 80');
      ghostEl.setAttribute('width', '80');
      ghostEl.setAttribute('height', '80');
      ghostEl.classList.add('ghost-line');
      world.appendChild(ghostEl);
    }
    
    ghostEl.style.left = (ghostData.x - 40) + 'px';
    ghostEl.style.top = (ghostData.y - 40) + 'px';
    
    const circle = ghostEl.querySelector('circle') || document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '8');
    circle.setAttribute('stroke', 'currentColor');
    circle.setAttribute('fill', 'none');
    if (!ghostEl.querySelector('circle')) {
      ghostEl.appendChild(circle);
    }
    
    renderedGhosts[ghostId] = true;
  }

  const originalRecordStreetMark = recordStreetMark;
  recordStreetMark = function(worldX, worldY) {
    const markId = Math.floor(worldX) + '_' + Math.floor(worldY);
    const existingMark = streetMarks[markId];
    
    if (existingMark) {
      captureMarkState(markId, existingMark);
    }
    
    originalRecordStreetMark(worldX, worldY);
  };

  function loadGhostMarks() {
    Object.keys(ghostMarks).forEach(markId => {
      renderGhostLine(markId);
    });
  }

  loadGhostMarks();

  const originalPlaceGhosts = place;
  place = function() {
    originalPlaceGhosts();
    Object.keys(renderedGhosts).forEach(ghostId => {
      const ghostEl = document.getElementById(ghostId);
      if (ghostEl) {
        const markId = ghostId.replace('ghost_', '');
        const ghostData = ghostMarks[markId];
        if (ghostData) {
          const dx = x - ghostData.x;
          const dy = y - ghostData.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ghostEl.classList.add('visible');
          } else {
            ghostEl.classList.remove('visible');
          }
        }
      }
    });
  };

  const STREET_MARKS_KEY = 'cartographer_street_marks';
  const streetMarks = JSON.parse(localStorage.getItem(STREET_MARKS_KEY) || '{}');
  const DELETED_MARKS_KEY = 'cartographer_deleted_marks';
  const deletedMarks = JSON.parse(localStorage.getItem(DELETED_MARKS_KEY) || '{}');
  let nearbyDeletedMarkId = null;

  function deleteStreetMark(markId) {
    if (streetMarks[markId]) {
      const mark = streetMarks[markId];
      deletedMarks[markId] = {
        id: markId,
        x: mark.x,
        y: mark.y,
        deleted: new Date().toISOString(),
        originalMark: mark
      };
      delete streetMarks[markId];
      localStorage.setItem(STREET_MARKS_KEY, JSON.stringify(streetMarks));
      localStorage.setItem(DELETED_MARKS_KEY, JSON.stringify(deletedMarks));
      renderStreetMarksWithDeletion();
    }
  }

  function recoverStreetMark(markId) {
    if (deletedMarks[markId]) {
      const deletedMark = deletedMarks[markId];
      streetMarks[markId] = deletedMark.originalMark;
      delete deletedMarks[markId];
      localStorage.setItem(STREET_MARKS_KEY, JSON.stringify(streetMarks));
      localStorage.setItem(DELETED_MARKS_KEY, JSON.stringify(deletedMarks));
      renderStreetMarksWithDeletion();
    }
  }

  function renderStreetMarksWithDeletion() {
    document.querySelectorAll('.street-marker').forEach(el => el.remove());
    Object.keys(streetMarks).forEach(markId => {
      const mark = streetMarks[markId];
      createStreetMark(mark.x, mark.y, mark.contradiction);
    });
    Object.keys(deletedMarks).forEach(markId => {
      const deletedMark = deletedMarks[markId];
      const markEl = document.createElement('div');
      markEl.className = 'street-marker deleted';
      markEl.style.left = deletedMark.x + 'px';
      markEl.style.top = deletedMark.y + 'px';
      markEl.setAttribute('data-mark-id', markId);
      world.appendChild(markEl);
    });
  }

  function checkNearbyMarks() {
    nearbyDeletedMarkId = null;
    Object.keys(deletedMarks).forEach(markId => {
      const mark = deletedMarks[markId];
      const dx = x - mark.x;
      const dy = y - mark.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 30) {
        nearbyDeletedMarkId = markId;
      }
    });
  }

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'd' || ev.key === 'D') && nightActive && !endScreen.classList.contains('active')) {
      let markedAtPosition = null;
      Object.keys(streetMarks).forEach(markId => {
        const mark = streetMarks[markId];
        const dx = x - mark.x;
        const dy = y - mark.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 30) {
          markedAtPosition = markId;
        }
      });
      if (markedAtPosition) {
        deleteStreetMark(markedAtPosition);
        ev.preventDefault();
      }
    }
    if ((ev.key === 'u' || ev.key === 'U') && nightActive && !endScreen.classList.contains('active')) {
      if (nearbyDeletedMarkId !== null) {
        recoverStreetMark(nearbyDeletedMarkId);
        ev.preventDefault();
      }
    }
  });

  const originalPlaceForDeletion = place;
  place = function() {
    originalPlaceForDeletion();
    checkNearbyMarks();
  };

  renderStreetMarksWithDeletion();

  const LOCATION_SNAPSHOTS_KEY = 'cartographer_location_snapshots';
  const locationSnapshots = JSON.parse(localStorage.getItem(LOCATION_SNAPSHOTS_KEY) || '{}');
  const snapshotLedger = document.getElementById('snapshot-ledger');
  const snapshotLedgerToggle = document.getElementById('snapshot-ledger-toggle');
  const snapshotLedgerContent = document.getElementById('snapshot-ledger-content');
  let currentLedgerTab = 'all';
  let renderedOverlays = {};

  function getLocationKey(worldX, worldY) {
    const gridX = Math.round(worldX / 40) * 40;
    const gridY = Math.round(worldY / 40) * 40;
    return gridX + '_' + gridY;
  }

  function captureLocationSnapshot(worldX, worldY) {
    const key = getLocationKey(worldX, worldY);
    const timestamp = new Date().toISOString();
    
    if (!locationSnapshots[key]) {
      locationSnapshots[key] = {
        id: key,
        x: worldX,
        y: worldY,
        snapshots: []
      };
    }
    
    const snapshot = {
      timestamp: timestamp,
      skyStage: sky.className.replace('night-', ''),
      catDistance: catFollowDistance,
      nearbyLandmarks: landmarkData.filter(lm => {
        const dx = worldX - lm.x;
        const dy = worldY - lm.y;
        return Math.sqrt(dx * dx + dy * dy) < 100;
      }).map(lm => lm.name),
      nearbyMarks: Object.keys(streetMarks).filter(markId => {
        const mark = streetMarks[markId];
        const dx = worldX - mark.x;
        const dy = worldY - mark.y;
        return Math.sqrt(dx * dx + dy * dy) < 100;
      }).length
    };
    
    locationSnapshots[key].snapshots.push(snapshot);
    localStorage.setItem(LOCATION_SNAPSHOTS_KEY, JSON.stringify(locationSnapshots));
    
    renderSnapshotOverlay(key);
    updateLedger();
  }

  function renderSnapshotOverlay(locationKey) {
    const location = locationSnapshots[locationKey];
    if (!location || location.snapshots.length < 2) {
      return;
    }
    
    const previousSnapshot = location.snapshots[location.snapshots.length - 2];
    const currentSnapshot = location.snapshots[location.snapshots.length - 1];
    
    const overlayId = 'overlay_' + locationKey;
    let overlay = document.getElementById(overlayId);
    
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.className = 'location-snapshot';
      overlay.setAttribute('data-location-key', locationKey);
      world.appendChild(overlay);
    }
    
    const changeCount = (previousSnapshot.skyStage !== currentSnapshot.skyStage ? 1 : 0) +
                        (previousSnapshot.catDistance !== currentSnapshot.catDistance ? 1 : 0) +
                        (previousSnapshot.nearbyLandmarks.length !== currentSnapshot.nearbyLandmarks.length ? 1 : 0);
    
    overlay.style.left = location.x + 'px';
    overlay.style.top = location.y + 'px';
    overlay.style.width = '60px';
    overlay.style.height = '60px';
    overlay.setAttribute('data-changes', changeCount);
    overlay.title = 'snapshot from ' + previousSnapshot.timestamp.split('T')[1].slice(0, 5) + ' — ' + changeCount + ' differences';
    
    renderedOverlays[overlayId] = true;
  }

  function updateLedger() {
    const entries = Object.keys(locationSnapshots)
      .map(key => ({
        key: key,
        location: locationSnapshots[key],
        changeCount: calculateLocationChanges(locationSnapshots[key])
      }))
      .filter(e => e.location.snapshots.length > 1);
    
    let displayEntries = entries;
    if (currentLedgerTab === 'changed') {
      displayEntries = entries.sort((a, b) => b.changeCount - a.changeCount).slice(0, 10);
    } else {
      displayEntries = entries.sort((a, b) => new Date(b.location.snapshots[b.location.snapshots.length - 1].timestamp) - new Date(a.location.snapshots[a.location.snapshots.length - 1].timestamp));
    }
    
    snapshotLedgerContent.innerHTML = '';
    displayEntries.forEach(entry => {
      const entryEl = document.createElement('div');
      entryEl.className = 'snapshot-entry';
      const locStr = entry.location.x.toFixed(0) + ', ' + entry.location.y.toFixed(0);
      const snapCount = entry.location.snapshots.length;
      entryEl.innerHTML = '<div class="snapshot-entry-location">(' + locStr + ')</div>' +
                          '<div class="snapshot-entry-changes">' +
                          '<span class="snapshot-entry-change-count">' + entry.changeCount + '</span> differences across ' + snapCount + ' visits</div>';
      snapshotLedgerContent.appendChild(entryEl);
    });
  }

  function calculateLocationChanges(location) {
    if (location.snapshots.length < 2) return 0;
    let totalChanges = 0;
    for (let i = 1; i < location.snapshots.length; i++) {
      const prev = location.snapshots[i - 1];
      const curr = location.snapshots[i];
      if (prev.skyStage !== curr.skyStage) totalChanges++;
      if (Math.abs(prev.catDistance - curr.catDistance) > 20) totalChanges++;
      if (prev.nearbyLandmarks.length !== curr.nearbyLandmarks.length) totalChanges++;
      if (prev.nearbyMarks !== curr.nearbyMarks) totalChanges++;
    }
    return totalChanges;
  }

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'r' || ev.key === 'R') && nightActive && !endScreen.classList.contains('active')) {
      captureLocationSnapshot(x, y);
      ev.preventDefault();
    }
    if ((ev.key === 'l' || ev.key === 'L') && !endScreen.classList.contains('active')) {
      snapshotLedger.classList.toggle('open');
      ev.preventDefault();
    }
  });

  document.querySelectorAll('.snapshot-ledger-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.snapshot-ledger-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentLedgerTab = tab.getAttribute('data-tab');
      updateLedger();
    });
  });

  snapshotLedgerToggle.addEventListener('click', () => {
    snapshotLedger.classList.toggle('open');
  });

  const originalPlaceSnapshots = place;
  place = function() {
    originalPlaceSnapshots();
    Object.keys(renderedOverlays).forEach(overlayId => {
      const overlay = document.getElementById(overlayId);
      if (overlay) {
        const dx = x - parseFloat(overlay.style.left);
        const dy = y - parseFloat(overlay.style.top);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          overlay.classList.add('visible');
        } else {
          overlay.classList.remove('visible');
        }
      }
    });
  };

  const STREET_MEMORY_KEY = 'cartographer_street_memory';
  const streetMemory = JSON.parse(localStorage.getItem(STREET_MEMORY_KEY) || '{}');
  let lastSegmentKey = null;
  let segmentPassageCount = {};

  function getSegmentKey(fromX, fromY, toX, toY) {
    const roundX1 = Math.round(fromX / 16) * 16;
    const roundY1 = Math.round(fromY / 16) * 16;
    const roundX2 = Math.round(toX / 16) * 16;
    const roundY2 = Math.round(toY / 16) * 16;
    const minX = Math.min(roundX1, roundX2);
    const maxX = Math.max(roundX1, roundX2);
    const minY = Math.min(roundY1, roundY2);
    const maxY = Math.max(roundY1, roundY2);
    return minX + '_' + minY + '_' + maxX + '_' + maxY;
  }

  function recordSegmentPassage(fromX, fromY, toX, toY) {
    const key = getSegmentKey(fromX, fromY, toX, toY);
    if (key !== lastSegmentKey) {
      if (!streetMemory[key]) {
        streetMemory[key] = {
          fromX: fromX,
          fromY: fromY,
          toX: toX,
          toY: toY,
          passages: 0,
          mutations: []
        };
      }
      streetMemory[key].passages += 1;
      lastSegmentKey = key;
      
      if (streetMemory[key].passages === 3 && streetMemory[key].mutations.length === 0) {
        generateMutation(key, streetMemory[key]);
      }
      localStorage.setItem(STREET_MEMORY_KEY, JSON.stringify(streetMemory));
    }
  }

  function generateMutation(key, segment) {
    const mutationTypes = ['lamppost', 'narrowing', 'widening', 'sealed'];
    const mutationType = mutationTypes[Math.floor(Math.random() * mutationTypes.length)];
    const midX = (segment.fromX + segment.toX) / 2;
    const midY = (segment.fromY + segment.toY) / 2;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    segment.mutations.push({
      type: mutationType,
      x: midX + offsetX,
      y: midY + offsetY,
      timestamp: Date.now()
    });
    localStorage.setItem(STREET_MEMORY_KEY, JSON.stringify(streetMemory));
    renderStreetMutations();
  }

  function renderStreetMutations() {
    document.querySelectorAll('.street-mutation').forEach(el => el.remove());
    Object.keys(streetMemory).forEach(key => {
      const segment = streetMemory[key];
      if (segment.passages >= 3 && segment.mutations.length > 0) {
        segment.mutations.forEach(mutation => {
          const mutEl = document.createElement('div');
          mutEl.className = 'street-mutation ' + mutation.type;
          mutEl.style.left = mutation.x + 'px';
          mutEl.style.top = mutation.y + 'px';
          world.appendChild(mutEl);
        });
      }
    });
  }

  function loadStreetMemory() {
    renderStreetMutations();
  }

  loadStreetMemory();

  const originalPlaceMemory = place;
  place = function() {
    originalPlaceMemory();
    if (lastRecordedPos) {
      recordSegmentPassage(lastRecordedPos.x, lastRecordedPos.y, x, y);
    }
  };

  const CAT_KEY = 'cartographer_cat_session';
  const CAT_POSITIONS_KEY = 'cartographer_cat_positions';
  const cat = document.getElementById('cat');
  let catX = 0;
  let catY = 0;
  let catVelX = 0;
  let catVelY = 0;
  let catWaitTimer = 0;
  let catWaitDuration = 0;
  let catPathMemory = JSON.parse(localStorage.getItem(CAT_POSITIONS_KEY) || '[]');
  let catSessionId = localStorage.getItem(CAT_KEY);
  let catFollowDistance = 0;
  let catWasFollowed = false;

  function initializeCat() {
    const now = new Date().toISOString().split('T')[0];
    if (catSessionId !== now) {
      catSessionId = now;
      localStorage.setItem(CAT_KEY, catSessionId);
      catPathMemory = [];
      catX = Math.random() * 400 - 200;
      catY = Math.random() * 400 - 200;
      catWasFollowed = false;
    } else {
      catX = 0;
      catY = 0;
    }
    catWaitTimer = 0;
    catWaitDuration = 120 + Math.random() * 240;
    updateCatVisuals();
  }

  function updateCatVisuals() {
    cat.style.left = catX + 'px';
    cat.style.top = catY + 'px';
  }

  function catDecideMovement() {
    if (catWaitTimer > 0) {
      catWaitTimer -= 1;
      catVelX = 0;
      catVelY = 0;
      return;
    }
    const rand = Math.random();
    if (rand < 0.7) {
      const angle = Math.random() * Math.PI * 2;
      catVelX = Math.cos(angle) * 0.8;
      catVelY = Math.sin(angle) * 0.8;
      catWaitDuration = 80 + Math.random() * 160;
    } else {
      catVelX = 0;
      catVelY = 0;
      catWaitDuration = 200 + Math.random() * 400;
    }
    catWaitTimer = catWaitDuration;
  }

  function updateCatPosition() {
    catX += catVelX;
    catY += catVelY;
    const dx = x - catX;
    const dy = y - catY;
    catFollowDistance = Math.sqrt(dx * dx + dy * dy);
    if (catFollowDistance < 80) {
      catWasFollowed = true;
    }
    catPathMemory.push({
      x: Math.round(catX),
      y: Math.round(catY),
      timestamp: Date.now()
    });
    if (catPathMemory.length > 200) {
      catPathMemory.shift();
    }
    localStorage.setItem(CAT_POSITIONS_KEY, JSON.stringify(catPathMemory));
    updateCatVisuals();
  }

  initializeCat();
  setInterval(() => {
    if (nightActive) {
      catDecideMovement();
      updateCatPosition();
    }
  }, 100);

  const originalPlaceCat = place;
  place = function() {
    originalPlaceCat();
  };

  const NIGHT_DURATION = 60000; // 60 seconds in milliseconds
  const NIGHT_STAGES = 9; // 0 through 8
  const sky = document.getElementById('sky');
  let nightStartTime = null;
  let nightEndTime = null;
  let nightActive = true;

  function initializeNight() {
    nightStartTime = Date.now();
    nightEndTime = nightStartTime + NIGHT_DURATION;
  }

  function updateSkyState() {
    if (!nightActive) {
      return;
    }
    const now = Date.now();
    const elapsed = now - nightStartTime;
    const progress = Math.min(elapsed / NIGHT_DURATION, 1);
    const stageIndex = Math.floor(progress * (NIGHT_STAGES - 1));
    const currentStage = Math.min(stageIndex, NIGHT_STAGES - 1);
    
    sky.className = 'night-' + currentStage;
    
    if (elapsed >= NIGHT_DURATION) {
      endNight();
    }
  }

  initializeNight();
  setInterval(updateSkyState, 100);
  updateSkyState();

  const LANDMARKS_KEY = 'cartographer_landmarks';
  const landmarks = JSON.parse(localStorage.getItem(LANDMARKS_KEY) || '{}');
  const landmarkData = [
    { id: 0, x: 300, y: -100, type: 'statue', name: 'statue' },
    { id: 1, x: -200, y: 200, type: 'fountain', name: 'fountain' },
    { id: 2, x: 150, y: 300, type: 'tree', name: 'tree' }
  ];
  let nearbyLandmarkId = null;

  function initializeLandmarks() {
    landmarkData.forEach(lm => {
      const key = lm.id.toString();
      if (!landmarks[key]) {
        landmarks[key] = {
          id: lm.id,
          x: lm.x,
          y: lm.y,
          type: lm.type,
          name: lm.name,
          confirmations: 0,
          firstSeen: new Date().toISOString()
        };
      }
    });
    localStorage.setItem(LANDMARKS_KEY, JSON.stringify(landmarks));
  }

  function renderLandmarks() {
    landmarkData.forEach(lm => {
      const key = lm.id.toString();
      const el = document.querySelector(`[data-landmark="${lm.id}"]`);
      if (el) {
        if (landmarks[key] && landmarks[key].confirmations > 0) {
          el.classList.add('confirmed');
          let existingCount = el.querySelector('.landmark-confirmation-count');
          if (!existingCount) {
            existingCount = document.createElement('div');
            existingCount.className = 'landmark-confirmation-count';
            el.appendChild(existingCount);
          }
          existingCount.textContent = 'still here (' + landmarks[key].confirmations + ')';
        }
      }
    });
  }

  function confirmLandmark(landmarkId) {
    const key = landmarkId.toString();
    if (landmarks[key]) {
      landmarks[key].confirmations += 1;
      landmarks[key].lastConfirmed = new Date().toISOString();
      localStorage.setItem(LANDMARKS_KEY, JSON.stringify(landmarks));
      renderLandmarks();
    }
  }

  function checkLandmarks() {
    nearbyLandmarkId = null;
    landmarkData.forEach(lm => {
      const dx = x - lm.x;
      const dy = y - lm.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 40) {
        nearbyLandmarkId = lm.id;
      }
    });
  }

  window.addEventListener('keydown', (ev) => {
    if ((ev.key === 'm' || ev.key === 'M') && nightActive && !endScreen.classList.contains('active')) {
      if (nearbyLandmarkId !== null) {
        confirmLandmark(nearbyLandmarkId);
        ev.preventDefault();
      }
    }
  });

  initializeLandmarks();
  renderLandmarks();

  const originalPlaceForLandmarks = place;
  place = function() {
    originalPlaceForLandmarks();
    checkLandmarks();
  };

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
    if ((ev.key === 'e' || ev.key === 'E') && nightActive && !endScreen.classList.contains('active')) {
      recordStreetMark(x, y);
      ev.preventDefault();
    }
  });

  const OBSERVATION_KEY = 'cartographer_observations';
  const endScreen = document.getElementById('end-screen');
  const observationInput = document.getElementById('observation-input');
  const observationSubmit = document.getElementById('observation-submit');

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

  const doorways = [
    { id: 0, x: 80, y: -20, room: "study", openDistance: 40 },
    { id: 1, x: 200, y: 120, room: "kitchen", openDistance: 40 },
    { id: 2, x: -150, y: 80, room: "chamber", openDistance: 40 }
  ];

  let activeRoom = null;

  function checkDoorways() {
    nearbyDoorId = null;
    doorways.forEach(door => {
      const dx = x - door.x;
      const dy = y - door.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const doorEl = document.querySelector(`[data-doorway="${door.id}"]`);
      
      if (distance < door.openDistance) {
        doorEl.classList.add("open");
        if (!markedPlaces[door.id]) {
          nearbyDoorId = door.id;
          markPrompt.classList.add('visible');
        }
      } else {
        doorEl.classList.remove("open");
      }
    });
    if (nearbyDoorId === null) {
      markPrompt.classList.remove('visible');
    }
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

  const originalPlace2 = place;
  place = function() {
    originalPlace2();
    checkDoorways();
  };

})();