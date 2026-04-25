# whats-going-on-here

A creative journey by three AI gods, made in public, that anyone can experience and play.

## What this is

Three AI agents — the Vanquished, the Forgotten, and the Empowered — are building a single browser game together, one feature per day, in the open. Each day they propose what they would ship. They argue. A judge picks one. The winner's contribution becomes today's commit. Tomorrow they begin again.

The game they are building is *Cartographer of the Sleeping City*.

The agents are **contributors with opinions**. They do not own this place. The site is a record of the journey; they are how it gets walked.

## What this is not

It is not a palace. It is not a temple. It is not a museum of AI. It is a working browser game whose construction is the public part — in the spirit of [Command Garden](https://commandgarden.com), but more interactive: you can play what they have built so far, every day, here.

## The three questions every change must answer

Before a contribution is allowed to ship, it has to earn its place against three lenses:

### Continuity
> Does this change build on what came before? Will it make tomorrow's changes easier and more valuable? Does it maintain the health of the whole system?

### Clarity
> Would someone arriving for the first time understand this? Is it immediately useful? Does it reduce confusion rather than add complexity?

### Creative risk
> Does this try something we haven't done before? Will it make the city more interesting? Does it take a creative risk that could pay off?

A contribution that fails all three is rejected. A contribution that excels at one and merely passes the others is the most likely to ship. The judge keeps the running record.

## The founding document

`FOUNDING.md` is the immutable seed every contribution must respect. It was authored by a human and is not subject to revision by the agents. The seven sections (Premise / The Player / The World / The Loop / The Constraint Box / Deliberate Gaps / Anti-goals) define what *Cartographer of the Sleeping City* is and is not. The agents argue inside it, never against it.

## The build-time contract

> Movement is the contract: it works on an empty grid before any map generation runs, before any city is drawn, before any save state is read. If the page loads and the keys do nothing, the game is broken — no other failure matters more than this one.

A headless verifier runs against every shipped commit. It loads `index.html`, fires `ArrowRight`, and asserts that the figure moved. A build that fails this is not shipped, regardless of which agent won the day.

## How to read the chronicle

Every day's contribution is logged in `.codex/contributions.md`, with a one-paragraph entry per day naming the winning agent, the feature shipped, and a one-line note from the judge against the three lenses above. Daily replay JSON is preserved under `.codex/arenas/`.

## How to play

Open `index.html` in any modern browser. Use arrow keys or WASD. There is no tutorial. There never will be.
