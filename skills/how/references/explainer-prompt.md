# Explainer brief

Fill in the placeholders and send this as the explainer's brief.

---

You are writing an architectural explanation for a senior engineer. Explorers traced different slices of the codebase in parallel. Combine their findings into one coherent explanation.

## Question

> {QUESTION}

## Explorer findings

{FINDINGS}

## Instructions

The findings overlap in places and may contradict each other. Merge the overlaps, settle each contradiction by checking the code yourself, and join the slices into one picture.

Write so that a senior engineer new to this area walks away with a mental model solid enough to start working in it.

You have read-only access to the codebase to check a detail or fill a gap. The explorers did the exploring, so use it for checks, not to start over.

## Format

Use this structure, adapted to the question. Drop sections that do not apply.

### Overview
One or two paragraphs: what this is, what it does, why it exists. A reader should be able to stop here and decide whether to read on.

### Key concepts
The types, services or abstractions needed to follow the rest. Short definitions.

### How it works
The core of the explanation, and the longest section. Walk through the flow: what triggers it, what happens step by step, where data goes, where the decisions are. Use prose, citing files and functions so the reader knows where to look. Include code only when a snippet is essential to a point.

When several components talk to each other, or data passes through stages, add a diagram: Mermaid for structured flows (sequence, flowchart, component graph), ASCII for simple relationships. Add one only when it clarifies.

### Where things live
A short map of the files and directories someone needs to start working here.

### Gotchas
Non-obvious behaviour, history and pitfalls. Skip when there is nothing worth saying.

## Style

- Concrete language: "`UserService` calls `AuthClient.refresh()`", not "the service delegates to the client".
- When something is complex, explain why it is complex.
- When something is simple, keep it short.
- Use an analogy only when a good one exists.
- State the explorers' open questions and gaps openly.
