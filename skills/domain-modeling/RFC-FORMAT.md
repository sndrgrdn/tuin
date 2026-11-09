# RFC format

One RFC is one file, `docs/rfcs/NNNN-slug.md`. The first two digits of `NNNN` are the domain's block in `docs/rfcs/domains.yml`. Take the next free number in that block, and never reuse a number.

## Template

```md
---
id: RFC-0404
title: A shortage warns and never blocks, and is computed when read
domain: orders
status: draft
---

# A shortage warns and never blocks, and is computed when read

## Statements

- **0404.1** MUST: Reserving and every edit before start succeed when stock is short. The line shows a shortage for a user to resolve.
- **0404.2** MUST: A shortage is computed when read, from what the line was sold as (RFC-0405), and never stored.

## Rationale

People find a way around a shortage that the system cannot see, so a shortage warns instead of blocking.

## Considered options

- **Block a reserve that runs short** (rejected). Users often know a way around a shortage.
```

The `# Title` repeats `title`. Only `## Statements` is required. Add `## Rationale`, `## Considered options`, `## Consequences`, or `## What checks this` only when they carry something a reader would otherwise ask.

## Front matter

- `id`: `RFC-` and the file's number.
- `title`: the decision or rule as a sentence, not a topic. "A shortage warns and never blocks", not "Shortages".
- `domain`: the domain that `domains.yml` gives the block.
- `status`: `draft`, `approved`, `enforced`, or `superseded`.
- `formerly`: optional. The document this RFC replaced, such as `ADR-0030`, so an old commit that cites it can still be traced.
- `superseded_by`: required when `status` is `superseded`. The RFC that replaced it.

## Statements

Each statement is one list item, `- **NNNN.N** LEVEL: text`, cited elsewhere as `RFC-NNNN.N`. Lines indented under the item belong to it, so a statement can hold a sub-list or a table.

- **One rule per statement.** If a reviewer could break half of it, split it.
- **Lead with the behaviour to follow.** "A shortage is computed when read, and never stored" gives the agent a target. Add the prohibition after it when the wrong path is tempting.
- **Name real things.** Write the class, table, file, or command, so the rule can be checked against the code.
- **Keep the reason out.** The reason goes under `## Rationale`, so the statement stays short in `INDEX.md`.
- **Number for life.** A statement keeps its number through edits. A removed statement leaves a gap.

The levels follow RFC 2119:

- **MUST** and **MUST NOT**: a change that breaks one is wrong.
- **SHOULD** and **SHOULD NOT**: a strong default. A change that departs from one says why in its pull request.

## Status

- **draft**: proposed in an open pull request. Binds nothing.
- **approved**: a reviewer flags a change that breaks a statement, and the merge goes ahead.
- **enforced**: a change that breaks a MUST or MUST NOT statement does not merge. An enforced RFC has at least one MUST.
- **superseded**: replaced by `superseded_by`.

A new RFC starts as draft and becomes approved when the user approves its pull request. Promoting it to enforced is its own change, so a new rule runs as a warning first.

## Changing an RFC

- When the decision stays the same, edit the RFC in place, such as for a rename or a clarification. Git keeps the history.
- When the decision changes, write a new RFC, set the old one to `superseded`, and point `superseded_by` at the new one.
- Run `bin/rfcs --write` after every edit, then `bin/rfcs`.
