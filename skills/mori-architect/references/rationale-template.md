# Rationale template

The prose that ships with the type sketch. One page, sentence-case headings. Replace each italic note with content.

## Problem

*One paragraph: what we are trying to do, and what about the existing system or constraints makes the shape non-obvious. Name the constraints Phase A surfaced (types to interoperate with, callers we cannot break, invariants crossing our boundary), so the reader sees what you saw.*

## Usage (caller's view)

*Write this first. The README or quickstart the consumer reads, plus two or three realistic call sites in their code: what they import, what they call, what comes back. The Shape section is derived from this. When they disagree, change the shape.*

## Shape

*The recommended architecture, data structures first, then how data flows through the signatures. Name the load-bearing decisions, which invariants live in types, where validation lives, and what the system deliberately does not do. Judge interface depth explicitly: what the public surface hides, what stays exposed, and why the interface is no larger than needed. Name the principle behind each decision without restating it.*

## Synthesis decision

*Which candidate became the base and why, what came from each other candidate, and what was rejected and why.*

## Tradeoffs accepted

*One bullet per tradeoff, in the form "we accept X in exchange for Y". Include anything a future reader might mistake for an oversight.*

## Alternatives considered

*Required. At least one concrete alternative shape, with one line on why it lost, judged on interface depth: what it exposes to callers and what it hides. Two or three when the design space had real contenders. When the constraints forced the answer, say "this was the only viable shape because ...". These are design alternatives, not the other runners' candidates.*

## Open questions and risks

*What the user needs to weigh in on, and risks worth flagging before implementation. Phrase them as questions, so the user's answer resolves them.*

## Next implementation step

*One sentence: the first thing to build against the sketch.*
