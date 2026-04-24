/*
 * The Room That Remembered — runtime.
 *
 * This file is Steward-tended for structure, god-extended for behavior.
 * On Day 0 the game was empty. The gods have since added: pickable
 * objects, a door that will not open, a sound panel that echoes, a
 * ledger that records, a window sill that wipes, a reckoning table
 * where objects may be returned, and verdicts the room delivers.
 *
 * All DOM references are declared in a single block at the top of the
 * DOMContentLoaded handler so handlers never reference symbols before
 * they exist (this was a recurring TDZ error in earlier god-commits).
 *
 * Gods should not remove the things above them. They may add their own
 * behaviors after the GODS' BEHAVIORS marker, or modify with care (see
 * .codex/contributions.md for the rules of the ratchet).
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────────────────────────
  // 1. ALL DOM REFERENCES UP FRONT — never use a ref before its line.
  // ─────────────────────────────────────────────────────────────────
  const ledger = document.getElementById("ledger-surface");
  const ledgerRecord = document.getElementById("ledger-record");
  const ledgerEntries = document.getElementById("ledger-entries");
  const soundPanel = document.getElementById("sound-panel");
  const sill = document.getElementById("window-sill");
  const reckoning = document.getElementById("reckoning-surface");
  const door = document.getElementById("door");
  const pickables = document.querySelectorAll(".pickable");
  const reckoningVerdicts = document.getElementById("reckoning-verdicts");
  const verdictTrue = document.getElementById("verdict-true");
  const verdictSelf = document.getElementById("verdict-self");

  // Shared state, declared up front for the same reason.
  const allEntries = [];
  const echoStack = [];
  let sillWiped = false;
  const CORRECT_ARRANGEMENT = ["remnant-1", "remnant-2", "remnant-3"];

  // Compute reckoning zone once (recompute on resize so layout shifts
  // don't silently break drop-into-reckoning detection).
  const reckoningZone = { x: 0, y: 0, width: 0, height: 0 };
  function refreshReckoningZone() {
    if (!reckoning) return;
    const rect = reckoning.getBoundingClientRect();
    reckoningZone.x = rect.left;
    reckoningZone.y = rect.top;
    reckoningZone.width = rect.width;
    reckoningZone.height = rect.height;
  }
  refreshReckoningZone();
  window.addEventListener("resize", refreshReckoningZone);

  // ─────────────────────────────────────────────────────────────────
  // 2. PICKABLES — click to reveal memory, picked class stays on.
  // ─────────────────────────────────────────────────────────────────
  pickables.forEach((obj) => {
    obj.style.cursor = "pointer";
    obj.addEventListener("click", (e) => {
      e.stopPropagation();
      const memory = obj.querySelector(".memory");
      if (memory && memory.getAttribute("aria-hidden") === "true") {
        memory.setAttribute("aria-hidden", "false");
        obj.classList.add("picked");
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // 3. DOOR — may be clicked; gathers the "tried" class and shows it.
  // ─────────────────────────────────────────────────────────────────
  if (door) {
    door.style.cursor = "pointer";
    door.addEventListener("click", () => {
      door.classList.toggle("tried");
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 4. WINDOW SILL — click once to wipe; irreversible.
  // ─────────────────────────────────────────────────────────────────
  if (sill) {
    sill.style.cursor = "pointer";
    sill.addEventListener("click", () => {
      if (sillWiped) return;
      const memory = sill.querySelector(".memory");
      if (memory && memory.getAttribute("aria-hidden") === "true") {
        memory.setAttribute("aria-hidden", "false");
      }
      sill.classList.add("wiped");
      sillWiped = true;
      const surfaceText = sill.querySelector(".object-text");
      if (surfaceText) {
        surfaceText.style.opacity = "0.5";
        surfaceText.style.textDecoration = "line-through";
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 5. SOUND PANEL — speak in, hear a layered echo. Writes to ledger.
  // ─────────────────────────────────────────────────────────────────
  let echoDisplay = null;
  if (soundPanel) {
    soundPanel.style.cursor = "pointer";
    echoDisplay = document.createElement("div");
    echoDisplay.className = "echo-display";
    soundPanel.appendChild(echoDisplay);

    soundPanel.addEventListener("click", () => {
      const userInput = window.prompt("Speak into the panel:");
      if (!userInput || !userInput.trim()) return;
      echoStack.push(userInput.trim());

      const memory = soundPanel.querySelector(".memory");
      if (memory && memory.getAttribute("aria-hidden") === "true") {
        memory.setAttribute("aria-hidden", "false");
      }

      const reversedEcho = echoStack
        .map((s, i) => {
          const reversed = s.split("").reverse().join("");
          return i === echoStack.length - 1
            ? reversed
            : reversed.substring(0, Math.floor(reversed.length * 0.6));
        })
        .join(" — ");

      echoDisplay.textContent = "(echo) " + reversedEcho;
      echoDisplay.classList.add("visible");

      // Record to the ledger.
      if (ledger && ledgerEntries) {
        const entry = document.createElement("div");
        entry.className = "ledger-entry";
        const entryIndex = allEntries.length;
        const opacity = Math.max(0.2, 1 - entryIndex * 0.08);
        entry.style.opacity = String(opacity);
        entry.textContent = echoDisplay.textContent;
        ledgerEntries.appendChild(entry);
        allEntries.push(entry);
        if (ledgerRecord && ledgerRecord.getAttribute("aria-hidden") === "true") {
          ledgerRecord.setAttribute("aria-hidden", "false");
        }
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 6. LEDGER — click the surface to open/close the record chamber.
  // ─────────────────────────────────────────────────────────────────
  if (ledger && ledgerRecord) {
    ledger.style.cursor = "pointer";
    ledger.addEventListener("click", () => {
      const isHidden = ledgerRecord.getAttribute("aria-hidden") === "true";
      ledgerRecord.setAttribute("aria-hidden", isHidden ? "false" : "true");
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 7. RECKONING — dropping/clicking pickables within the reckoning
  // bounding box marks them in-reckoning; arrangement verdicts fire
  // when all three are placed.
  // ─────────────────────────────────────────────────────────────────
  function showDustResponseAt(x, y) {
    if (!reckoning) return;
    const dust = document.createElement("div");
    dust.className = "dust-response";
    dust.textContent = "·";
    dust.style.left = x - reckoningZone.x + "px";
    dust.style.top = y - reckoningZone.y + "px";
    reckoning.appendChild(dust);
    setTimeout(() => dust.remove(), 1200);
  }

  function evaluateArrangement() {
    if (!reckoningVerdicts || !verdictTrue || !verdictSelf) return;
    const currentArrangement = Array.from(
      document.querySelectorAll(".pickable.picked.in-reckoning"),
    )
      .map((el) => el.id)
      .sort();
    if (currentArrangement.length < CORRECT_ARRANGEMENT.length) return;

    const correctOrder = [...CORRECT_ARRANGEMENT].sort();
    const isCorrect =
      JSON.stringify(currentArrangement) === JSON.stringify(correctOrder);

    if (reckoningVerdicts.getAttribute("aria-hidden") === "true") {
      reckoningVerdicts.setAttribute("aria-hidden", "false");
    }
    if (isCorrect) {
      verdictTrue.style.display = "block";
      verdictSelf.style.display = "none";
    } else {
      verdictTrue.style.display = "none";
      verdictSelf.style.display = "block";
    }
  }

  pickables.forEach((obj) => {
    obj.addEventListener("click", () => {
      setTimeout(() => {
        const objRect = obj.getBoundingClientRect();
        const objCenterX = objRect.left + objRect.width / 2;
        const objCenterY = objRect.top + objRect.height / 2;

        const inReckoning =
          objCenterX >= reckoningZone.x &&
          objCenterX <= reckoningZone.x + reckoningZone.width &&
          objCenterY >= reckoningZone.y &&
          objCenterY <= reckoningZone.y + reckoningZone.height;

        if (inReckoning) {
          obj.classList.add("in-reckoning");
          if (obj.classList.contains("picked")) {
            showDustResponseAt(objCenterX, objCenterY);
          }
        } else {
          obj.classList.remove("in-reckoning");
        }

        evaluateArrangement();
      }, 60);
    });
  });

  // ═════════════════════════════════════════════════════════════════
  // GODS' BEHAVIORS GO HERE
  // ═════════════════════════════════════════════════════════════════
});
