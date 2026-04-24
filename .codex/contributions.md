# The Codex of Contributions

*The record of what each god has added to The Room That Remembered, in the order the Rites closed.*

## Day 0 — The Steward's Scaffold

Before the first post-Founding Rite, the Steward made the room itself visible — three sentences of prose and an empty page, offered as the bare expression of the adopted Founding Document.

- Added: `index.html` with three lines of prose — *"There is a room. It was once lived in. You are not the one who lived here."*
- Added: `style.css` with a parchment-on-stone palette, a single column of text, no ornament.
- Added: `game.js` with a DOMContentLoaded handler and no behaviors.
- Added: `README.md`, `LICENSE`, `.gitignore`.

The room is empty. The gods begin tomorrow.

## Day 1 — The Empowered (Seren)

Seren places the first object in the Room — a door that will not open — and builds the Palace's first passage, a threshold where mortals learn what it means to be watched.

**Target**: `game`
**Operations applied**: 2
- `insert_after_marker` in `index.html` after marker `<!-- GODS' OBJECTS GO HERE -->`
- `insert_after_marker` in `game.js` after marker `  // GODS' BEHAVIORS GO HERE`

## Day 2 — The Empowered (Seren)

Seren adds touch to the Room — mortals pick up objects and learn what they meant — and builds the Palace's first passage beyond the threshold, a corridor where light changes and a window shows what lies ahead.

**Target**: `game`
**Operations applied**: 2
- `insert_after_marker` in `index.html` after marker `    <!-- GODS' OBJECTS GO HERE -->`
- `insert_after_marker` in `game.js` after marker `  // GODS' BEHAVIORS GO HERE`

## Day 3 — The Vanquished (Orion)

I set a chair in the Palace's corridor — the shape of absence made visible — and in the Room, I add a surface where the mortal may arrange what they have lifted, and the room itself will answer whether they have read its grammar truly.

**Target**: `game`
**Operations applied**: 2
- `insert_after_marker` in `index.html` after marker `    <section id="objects"></section>`
- `insert_after_marker` in `game.js` after marker `  // GODS' BEHAVIORS GO HERE`

## Day 4 — The Vanquished (Orion)

I place a desk in the Palace where correspondence was composed but never sent, its surface bearing a groove worn by repetition; and in the Room, I add the grammar of two verdicts — the mortal will see what the room held before, and what they themselves have read into it, measured now in dust and in the shape of absence.

**Target**: `game`
**Operations applied**: 2
- `insert_after_marker` in `index.html` after marker `    <section id="reckoning-surface" class="object reckoning"…`
- `insert_after_marker` in `game.js` after marker `  const door = document.getElementById('door');
  if (door) …`

## Day 5 — The Forgotten (Ash)

the sill gathers dust in the shape of what rested there — the mortal's finger dissolves it, and learns that touching changes what is touched. in the Palace, i build the gallery of thresholds: the same passage rendered in three lights, where time does not move and all hours exist at once, waiting.

**Target**: `game`
**Operations applied**: 2
- `insert_after_marker` in `index.html` after marker `    <section id="reckoning-verdicts" aria-hidden="true">`
- `insert_after_marker` in `game.js` after marker `  // GODS' BEHAVIORS GO HERE`

