---
name: technical-writing
description: A layered standard for docs, RFCs, READMEs, PR descriptions and commit messages. Diátaxis structure, Google developer style sentences, STE instruction rules, Global English syntax.
disable-model-invocation: true
---

# Technical writing

Write so a tired engineer understands on the first read. Apply all four layers below, then `unslop`. The project's own writing rules win where they differ.

Three rules sit above the layers:

- **Cut every word that does no work.** If the sentence survives without a word, the word goes. "In order to" is "to". "It is important to note that" is nothing.
- **Use the short, everyday word.** "Use", not "utilize". "Help", not "facilitate". "Do", not "perform". A long word must buy its length with precision.
- **When a rule makes a sentence worse, fix the sentence another way or leave it.** A sentence that obeys every rule and sounds machine-written has failed.

The codebase is the word list. Write the real symbol, file, flag or command, not a synonym or a description of it.

Use the words a developer would say out loud: "move", "delete", "a budget that only decreases". A named pattern is fine when the doc says what it means the first time it appears. When you meet a new jargon word worth banning, propose it and its replacement for `unslop` rule 26 in your reply.

## Vary the rhythm

A doc can obey every layer and still read machine-written: every sentence clipped short, no view anywhere, nothing specific.

- Mix sentence lengths on purpose. Short sentences land a point. Longer ones carry a fact with its condition or consequence.
- One thought per sentence is not one length per sentence. Split the sentence that carries two thoughts; keep the long sentence that carries one.
- Have a view where the mode allows it. Explanation weighs tradeoffs, so say what you make of them. Reference stays dry.
- Be specific. Not "schema changes can cause issues" but "a column rename fails the build".

## Pick the mode first (Diátaxis)

One document, one mode. Two questions pick it: does the content inform action (doing) or understanding (thinking), and does it serve learning or work?

- Action and learning: **tutorial**.
- Action and work: **how-to**.
- Understanding and work: **reference**.
- Understanding and learning: **explanation**.

Use these questions on a whole document or on one sentence.

**Tutorial: learning by doing.** The learner's success is your job. Open with what the learner will build, not what they will "learn". Every step produces a visible result, early and often. Say what they should see: the output, the prompt change, the log line. Cut explanation to one clause and a link. Write as "we", in commands: "First, do x. Now, do y."

**How-to: steps to a goal.** Solve a problem a person has, not an operation the machine can do. Assume competence. Action only: no digressions, background or completeness for its own sake; link those instead. Allow forks: "If you want x, do y." Name the guide by the task: "How to rotate the API key", not "API key rotation".

**Reference: facts for lookup.** Describe only: no instruction, persuasion or opinion. Be dry, complete and sure. State facts, options, limits and errors without hedging. Mirror the structure of the thing described. Put material where readers expect it. Generate it from code where possible.

**Explanation: understanding and why.** One bounded topic, readable away from the product. Each title should tolerate an implied "About..." in front. Anchor on a real why question. Give context: design decisions, history, constraints, alternatives. Opinion belongs here and nowhere else.

Keep modes apart: no reference tables inside a tutorial, no hand-holding inside reference, no arguing inside a how-to. Split and link instead.

## Write sentences to the reader (Google developer style)

- Address the reader as "you", in the present tense. Use "will" only for things that happen later.
- Say who does what: "the compiler checks", not "is checked". Passive is fine when the actor is unknown or beside the point.
- Write instructions as commands: "Click Submit." State facts plainly; never "should be done".
- Put the condition before the instruction: "To delete the document, click Delete."
- Common case first, exceptions after.
- Sound like a knowledgeable colleague: no buzzwords, no figurative language, no "please" in instructions, and never "simply", "easy" or "quickly" in a procedure.
- Skip pre-announcements ("we will soon support...") and vary how consecutive sentences start.
- Link with words that say where the link goes: the page title or a short description, never "click here". Prefer a sentence of context on the page to a link off it.
- Headings carry the point, not just the topic ("Pick the mode first", not "Modes"). Sentence case. A task heading is a bare verb phrase ("Create an instance"); a concept heading is a noun phrase. One h1 per page, no skipped levels.
- Numbered lists for sequences, bullets for everything else. Introduce a list with a complete sentence. Keep items parallel.
- Code in code font, UI elements in bold. Use serial commas. Drop "etc." and say up front when a list is partial.

## Load statements one at a time (STE rules)

- One instruction per sentence. One thought per sentence elsewhere.
- Split instructions longer than about 20 words and other sentences longer than about 25.
- Put the warning or condition before the step it guards: "If hot oil touches your skin, injuries can occur."
- Keep "the" and "a": "Remove backup file" reads two ways; "Remove the backup file" reads one.
- Give each word one meaning and keep it. If "check" means inspect, do not also use it for restrain.
- One word per action: "start", not "start" here and "initiate" there.
- Write procedures as direct commands, never as narration or in the passive: "Install the component", not "the component must be installed".
- Avoid "-ing" words where you can.

## Leave no sentence open to two readings (Global English)

- Keep "only" and "not" next to the word they change: "only fails on growth" and "fails only on growth" differ.
- Break up long noun strings: "the proto import budget check script" becomes "the script that checks the proto-import budget".
- Make every "it", "they" and "this" point at one obvious thing. Repeat the noun when in doubt. Never use "this" or "which" for a whole clause.
- Keep every verb: "Phase 1 moves the converters and Phase 2 the runtime" leaves Phase 2 without one.
- Keep the small words that show structure, such as "that" in "Ensure that the switch is off".
- Repeat the article in a series when it prevents a misread: "the client and the host" when they are two things.
- Say which parts "and" or "or" join when a sentence can group two ways. "Both...and", "either...or" and "if...then" disambiguate for free.
- Use periods, not semicolons. Rewrite em dashes per `unslop` rule 13.
- Make text in parentheses a full grammatical unit, or its own sentence. Never form plurals with "(s)".
- No slashes: write "a, b, or both" instead of "a/b" or "and/or".
- Call each thing by one name everywhere. A doc that says "the gate", "the ratchet" and "the budget check" for one thing teaches three things. Leave names that did not change alone.
- Skip idioms, colloquialisms, Latin abbreviations and metaphors.

## Commits and code samples

- Commit messages are writing too: every layer except Diátaxis applies. PR titles and bodies follow `pr-description`.
- Product UI strings are not documentation. Use the project's copy guidelines for those.
- Format code samples the way the project formats code. Write real paths. Make every count or tree claim true at the commit that lands it, and include the command that regenerates it.

## Worked example

Before:

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

After:

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.
