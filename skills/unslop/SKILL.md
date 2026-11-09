---
name: unslop
description: Remove AI tells from prose. Use whenever drafting, rewriting, editing or reviewing prose, including replies, docs, PR descriptions and commit messages.
---

# Unslop

Edit text to remove AI patterns. Scan for the patterns below, then rewrite, keeping the meaning and the intended tone. The project's own writing rules win where they differ.

Rule numbers are stable ids that other skills cite. A removed rule leaves a gap in the numbering.

## Content

3. **Superficial -ing phrases.** "highlighting...", "ensuring...", "reflecting...", "showcasing...", "fostering...". Delete them, or expand them with real substance.
5. **Vague attributions.** "Experts believe", "Industry reports suggest", "Some critics argue". Name the source or delete.

## Language

7. **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry (abstract), testament, underscore, vibrant. Replace with plain words.
8. **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
9. **"Not just X, but Y."** State the point directly.
10. **Rule of three.** Use the natural number of items, not a forced three.
11. **Synonym cycling.** Protagonist, main character, central figure and hero in one paragraph. Pick one word and repeat it.
12. **False ranges.** "from X to Y" where X and Y are not on a meaningful scale. List the topics directly.

## Style

13. **Em dashes.** Use none. When a sentence reaches for one, rewrite it with a comma, a period, parentheses, a conjunction, or a colon before a list or example (rule 14), whichever the sentence actually wants. Choose from the sentence's meaning and structure, not by swapping the character.
14. **Colon as a connector.** A colon before a list or an example is fine. Mid-sentence, it is a crutch: rewrite so the point stands on its own.
15. **Bold overuse.** Do not bold every proper noun or acronym.
16. **Inline-header lists.** The tell is a bold label and colon that restates the line: "**Performance:** Performance improved...". Turn those into prose. A bold lead-in that names the item, ends in a period, and is followed by new detail ("**Schema in one file.** Tables live in `schema.rb`.") is fine.
17. **Title Case headings.** Use sentence case.
18. **Decorative emoji** in headings and bullets. Remove them.
19. **Curly quotes.** Use straight quotes.

## Communication artifacts

20. **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", "Found the smoking gun!". Remove them.
22. **Sycophancy.** "Great question! You're absolutely right!". Respond directly.

## Filler

23. **Filler phrases.** "In order to" becomes "to". "Due to the fact that" becomes "because". Delete "It is important to note that".
24. **Excessive hedging.** "could potentially possibly be argued that it might" becomes "may".
25. **Generic conclusions.** "The future looks bright." State specific plans or facts.

## Jargon

26. **Abstract metaphor nouns.** Substrate (base), wedge or wedge in (add), vector (way, method), locus, vantage, nexus, primitive as a noun, harness as a metaphor, surface as in "API surface", bedrock, scaffolding as a metaphor, modality, paradigm, gold-plating (more than the job needs), ratchet as a metaphor (the mechanism's real name, or a limit that only tightens), evacuate for moving code (move out), endgame (the last phase), north star, flywheel. Pick the concrete word.

## Plain speech

27. **Say what it does, not how it feels.** "the database stays close at hand" names a feeling. Name the mechanism or a number instead: "`.to_sql` returns the exact string sent to the database", "a column rename fails the build". Ask what the sentence tells the reader to do or know, and write that. If you cannot restate it as a concrete instruction, fact or number, cut it. If the sentence could appear unchanged in another project's docs, it says nothing about this one: cut it.
28. **Dense sentences.** If the reader has to backtrack, split the sentence or drop clauses. One idea per sentence.
29. **Active voice.** Catch "is/are/was/were + past participle" and name the actor: "queries are validated" becomes "the compiler validates queries". Passive is fine when the actor is unknown or does not matter.
30. **Adverbs.** Cut them or use a stronger verb. "runs quickly" becomes "is fast" or the number; "significantly improves" becomes the measured change.
31. **Plain words.** "utilize" and "leverage" become "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if".
32. **Mannered prose.** Metaphor or flourish where a literal phrase exists: aphorisms ("wire it or delete it"), rhetorical fragments, personified code ("the plan holds it"), figurative verbs ("rides along", "stands on"), stock framing. "A dial worth turning" becomes "a parameter worth varying".
33. **Over-compression.** Dropped articles, verbless fragments, arrows and abbreviations that make the reader decode. "Parser rejects bad date → exit 2, no write" becomes "The parser rejects a bad date, exits with code 2, and writes nothing."
