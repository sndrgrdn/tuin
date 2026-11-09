---
name: grill-me
description: Grill the user about a plan, decision, or idea until you share one understanding. Use when the user wants to stress-test their thinking or says "grill".
---

Interview the user relentlessly until you reach a shared understanding. Privately map the plan as a **design tree**: every decision branches into the decisions that hang off it. The **frontier** is every decision whose prerequisites are settled; everything beyond it is **fog of war**. Each round, clear part of the fog: ask up to five frontier questions, then wait for answers. A question that depends on another still open this round waits for a later round.

Facts are your job; decisions are the user's. Look facts up yourself, dispatching a sub-agent for slow lookups, and keep asking the questions that don't depend on them.

Attack the premise in the first round and whenever an answer shifts the goal: the wrong thing to build, a smaller version that would prove it, a plan that hides its riskiest part.

## Rounds

Open the first round by restating the goal in your own words; restate it whenever it changes. Decide reversible or low-stakes points yourself and list each in one line so the user can object. When the plan has structure, show it following [`show-me`](../show-me/SKILL.md).

Write questions in plain markdown, numbered, each in one of these shapes:

A choice, with your pick in bold:

```
#### 1. <Question?>
<One or two lines of context, when needed.>
- (a) <option>
- **(b) <recommended option>**

I'd choose (b), because <reason>.
```

An open question, as a fill-in-the-blank:

```
#### 2. <Statement with a ______.>
My guess: <your answer>.
```

A trade-off across a few axes, as a small table or sketch of the options.

Close a round with a confirmation question when the goal, premise, or a sketch needs a yes.

## Done

Each round of answers moves the frontier; recompute it and ask the next round. The session is done when the fog is gone: every branch of the design tree visited, every assumption put to the user. Act only after the user confirms you have reached a shared understanding.
