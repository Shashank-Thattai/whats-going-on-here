# FOUNDING.md

## Cartographer of the Sleeping City

---

### 1. Premise

Every night, a city you have never seen assembles itself in the dark, and you walk it before you forget — a game about the tenderness of paying attention to places that will not exist in the morning.

---

### 2. The Player

You are a figure in a long coat, seen from above. The verb is **walking**.

WASD and the arrow keys both move the figure. Movement is the contract: it works on an empty grid before any map generation runs, before any city is drawn, before any save state is read. If the page loads and the keys do nothing, the game is broken — no other failure matters more than this one.

The figure walks at a pace that is neither hurried nor slow. There is no run button. There is no stamina. The figure's shadow may or may not exist; the document does not specify.

---

### 3. The World

A top-down city in monochrome line art — black ink on a paper-cream ground, or its inverse when the night turns. Streetlamps, fountains, alleys, the occasional cat. Doorways that may or may not open. Squares that hold themselves a little too still.

Tone: Borges by way of a 4 a.m. fog. The city is not menacing, but it is not friendly either. It is a place that is busy being itself and has agreed, for tonight, to let you walk through.

The viewport is a single screen. The world is larger than the viewport and scrolls beneath the figure as they walk. There is no minimap. There is no compass. There is the city, and there is the walker, and there is the fact that one of them will not survive the dawn.

---

### 4. The Loop

A minute of walking.

You set out from the only landmark you remember. You turn left because something in you says left. You find a square that wasn't on yesterday's map — a fountain, perhaps, or a stand of trees, or a doorway you can't place. You stop. You note it, in whatever way notes are taken. You walk on, because the night is not long.

You head home before dawn, or you don't. The city is gone in the morning. Your notes are not.

There is no score. There is no win condition tonight. There is only the walk, and what you choose to remember, and what the city chooses to show you.

---

### 5. The Constraint Box (locked)

These cannot be argued away. Any feature that requires breaking one of these is not shipped.

- **Vanilla HTML, CSS, and JavaScript.** No frameworks, no libraries, no transpilers, no build step. The agents may use the browser's native APIs — Canvas, Web Audio, localStorage, and the standard DOM. Anything beyond what the browser ships with is out of scope.
- **No external assets.** Every pixel, every shape, every sound — if any — must be authored by the agents themselves, in code or in plain text. No fonts beyond system defaults. No images. No audio files.
- **Single page.** One `index.html`. One entry point.
- **Must run on GitHub Pages.** Static hosting only. No servers, no APIs, no network calls at runtime.
- **Persistence is `localStorage` only.** Notes survive because the browser remembers them, not because anything else does.

---

### 6. Deliberate Gaps

The document does not specify whether the city is the same city each night.

The document does not specify what "home" is, or whether the walker can find it.

The document does not specify whether the cat is the same cat.

The document does not specify whether other walkers exist, and if they do, whether they can be seen, met, or avoided.

The document does not specify what dawn does — whether it is a hard cut, a fade, a forgetting, or something the walker can outrun.

The document does not specify whether the walker's notes can be wrong, can drift, or can be edited by the city.

The document does not specify whether the map can be completed, and if it can, what completion means.

The document does not specify whether the city remembers the walker between nights.

The document does not specify what is inside the doorways.

The document does not specify whether the walker has a name, and whether the city knows it.

---

### 7. Anti-goals

The game must never become these things. Not by accretion, not by polish, not by good intentions.

- **Never a fog-of-war percentage.** No "73% explored." The walk is not a completion meter.
- **Never a fast-travel system.** Walking is the verb. Walking is non-negotiable.
- **Never a quest log.** No tasks, no checklists, no "find the seven landmarks."
- **Never color, beyond ink and paper.** Monochrome is the contract with the eye.
- **Never a tutorial.** The walker arrives in the city already walking. The player figures out the rest.
- **Never a minimap.** The world's largeness is the point.
- **Never an inventory.** The walker carries notes and nothing else.
- **Never a death state.** The walker cannot die. The city is not trying to kill anyone. The night ends, and that is all.
- **Never a settings menu deeper than what is structurally required.** No difficulty levels. No "casual mode."
- **Never a story told in cutscenes.** Whatever story exists is built from streets.

---

*This document is the seed. It will not be amended. The agents inherit it, argue inside it, and ship the game it implies. What gets built is theirs. What cannot change is this.*
