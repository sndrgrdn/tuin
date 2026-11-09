---
name: create-verification
description: Generate a project-local verification skill that drives the app the way a user does, in any language, framework or platform, with a feature map. Use when a project has no scripted way to prove UI, CLI or service behaviour.
disable-model-invocation: true
---

# Create a verification skill

Every serious project needs a scripted way to drive the real app and prove behaviour: launch it, use a feature the way a user would, and capture evidence. This skill generates that as a project-local skill, `verify-<app>`, in the folder where the project keeps its skills (usually `.agents/skills/`).

Write the result for the next agent, not for a human. It will be read cold, in the middle of a task, by an agent that has never seen the app.

## 1. Interview the repo, not the user

Answer these from the codebase. Ask the user only what you cannot observe.

- **Surface:** what does a user actually touch? A web UI, a CLI or TUI, a desktop app, an API, a mobile app, a library? A repo can have several; pick the primary one and note the rest.
- **Run:** how does the app start locally? Prefer the repo's own documented dev command (package scripts, `bin/` scripts, Makefile, README). Note ports, environment variables, seed data and auth.
- **Drive:** how can an agent interact with it programmatically? Existing harnesses first: Playwright or Cypress specs, system tests, expect scripts, PTY helpers, endpoints you can curl, a debug port. Only then pick a generic recipe: a browser over CDP for web and Electron, a tmux or PTY harness for CLI and TUI, plain HTTP for services.
- **Observe:** what evidence can be captured? Screenshots, terminal transcripts, response bodies, logs, exit codes, database state.
- **Isolate:** can two instances run side by side (ports, data directories, profiles)? If not, say so in the generated skill: refusing to drive a shared instance twice beats corrupting the user's session.

When the checkout does not build or start as it is, fix that first, or report it precisely, before generating. A skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static folder the API never serves, a sample config), the generated skill may create it, clearly marked as verification scaffolding, and remove it during cleanup.

## 2. Generate the skill

Write `<skills>/verify-<app>/SKILL.md` with frontmatter (`name: verify-<app>`, and a `description` that names the app, the surface, and when to reach for it; without frontmatter the skill never registers). Include these sections, each grounded in what the interview found, with no placeholders left:

- **Launch:** the exact command that starts the app for verification, and how to tell it is ready (a log line, a prompt). Launch must reach a usable state from an empty data directory, including migrations and seed data. Ready means usable, not just that a process answers: a database health check can pass while its init scripts are still running. Include teardown. A short-lived CLI or TUI has no server to keep alive: launch means building the binary or installing dependencies once, then starting each drive in its own isolated PTY or tmux session.
- **Doctor:** one read-only check that answers "is this instance worth driving?": the process is up, it is the right version or build, we own the port, auth is valid. An agent runs it first whenever anything looks off.
- **Drive:** the harness recipe, with real selectors and commands from this repo, not examples. Prefer stable handles (ARIA roles and labels, data attributes, prompt strings, route paths) to coordinates and tab order.
- **Evidence:** what to capture for a proof, and where it goes. State the proof standards:
  - exercise the real user path, not internal setters or test-only endpoints;
  - capture the action and the resulting state, not only the final screen;
  - verify side effects (files written, rows inserted, messages sent) alongside what is visible;
  - mock only where a production boundary already isolates the external system;
  - when the safe path is a dry run or test mode, observe what it actually skips (files, network, git refs) instead of trusting its name; some dry runs still touch the network or open a browser.
- **Cleanup:** how to tear down the instances a run created. Kill what you started, never by process name. Cleanup removes instances and scratch state, never the evidence: proof artifacts survive teardown, in a location the skill names.
- **Helpers:** every script the skill ships is executable, and the skill body shows how to run it. A helper the reader has to reverse-engineer is not a helper.

## 3. Seed the feature map

Create `<skills>/verify-<app>/features/README.md`, plus one file per user-facing feature you can identify. Start with the top three to five, taken from routes, commands, menus or docs. Follow the shape in `references/feature-map-example/`: a README index and one file per feature.

Each feature file answers, from the user's point of view: what the feature is, how to reach it, how to drive it with the harness, and what observable end state proves it works. Its four H2 sections are `Sub-features`, `How to get to it (user POV)`, `Driving it with <harness>` and `Gotchas`.

When the seed data lacks a precondition a journey needs, the journey reports a failure and the reason goes in that feature's `Gotchas`. Never weaken the journey to make it pass.

The map is the repo's maintained source for verification. A proof that drives one convenient entry point is incomplete when the map lists others.

## 4. Prove the generated skill before handing it over

Run its own instructions end to end once: launch, doctor, drive one mapped feature (one is enough; the map lets later runs cover the rest), capture evidence, clean up. After cleanup, confirm the evidence still exists at the named location. A cleanup that deletes the proof fails this step.

Fix what fails, and run the generated cleanup after every failed attempt too, so broken attempts do not strand processes and ports. A generated skill that has never run is a draft, not a deliverable.

When you proved it in a stand-in for the real target (a container instead of a fresh VM, a local stack instead of a remote one), list every setup step the stand-in did that the target will not. Those steps stay unverified until a run on the real target covers them.

## 5. Hand over the maintenance loop

Point the user at `maintain-verification` for keeping the map honest as the app changes. Suggest a schedule only when they ask.
