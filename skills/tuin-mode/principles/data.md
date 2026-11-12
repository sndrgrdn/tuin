# Data principles

Read this file in full when values, types, schemas, state, optionality or failures change: parsing input, modelling state, adding a field, handling an error, or calling a dependency that can fail. Apply the sections whose situation matches.

## Parse at the boundary

Parse external representations into meaningful values at their owner, and establish invariants there. Keep the precision you have: never turn meaningful values back into generic strings, numbers, maps or untyped data.

Database rows, cache entries, events, job arguments and workflow state are boundary data whenever they re-enter running code. A library's type declaration describes a representation; it does not prove the data is intact.

## Type System Discipline

Let the language reject impossible states, mixed-up values and unhandled variants. In a statically typed language, use the compiler. In a dynamic one, get the same effect with value objects, enums, constructors that validate, and parsing at the boundary.

- **Make illegal states unrepresentable** where practical. Represent mutually exclusive states as explicit variants with legal transitions, not flags that can contradict each other.
- **Distinct types for distinct meanings.** Give identifiers, units and constrained values their own representation when they carry invariants or are easy to mix up. A customer ID and an order ID are not interchangeable.
- **Construct constrained values** only through parsers or constructors that establish their invariants.
- **Derive types from the source of truth.** When a schema, migration, API spec or token file owns a shape, derive from it instead of writing a parallel definition.
- **Handle every variant.** Handle closed internal variants exhaustively, so a new one fails loudly. Give unknown external variants an explicit policy: ignore, reject, preserve or dead-letter.

## Valid state

- **Derive, don't copy.** Derive values from their authoritative state instead of storing copies that must stay in sync. Keep redundant state only when a current requirement justifies it, with an explicit owner and consistency guarantee.
- **Optionality.** Resolve it before calling behaviour that needs a value. Keep it when absence is part of the domain.
- **Absence** follows the operation: plain absence when the caller interprets it, an expected failure when presence is required.
- Represent omission, null, absence and defaults by what they actually mean.

## Producer contracts

The same defensive check repeated in several consumers suggests the producer is missing a contract. One consumer keeps its requirement local; two similar consumers show duplication, not yet a shared invariant.

Move an invariant to its producer only when the producer can truthfully guarantee it for every consumer. Keep use-case-specific requirements in the application operation that owns them. Remove downstream checks only after the stronger contract is enforced.

## Separate representations

Introduce a separate protocol or persistence representation only when its fields, encoding, naming, optionality, authority or meaning genuinely differ from the application's. Translate at the owning boundary. Reuse a definition only when meaning and invariants are the same; when the similarity is only structural, translate explicitly. Derive dependent contracts from their owning definition.

## Unchecked operations

Unchecked casts, untyped values, unchecked deserialisation, raw interpolation, skipped validations, and reflection or metaprogramming that bypasses visibility each need:

- a concrete runtime invariant that makes the operation safe;
- containment in the smallest responsible owner;
- an explanation of what the language or framework cannot express.

## Failures

**Expected failures are values; defects may throw.** An expected failure is part of normal operation: rejected input, denied authorisation, missing required data, a declined payment, a classified dependency failure. Make it part of the operation's public contract, so callers handle or propagate it on purpose. A defect means correct execution is impossible because an internal invariant broke. Never dress a defect up as a plausible business failure.

- **Keep the meaning until it can be rendered.** Preserve an expected failure until the boundary that can turn it into a valid protocol or interface outcome. Domain code does not pick HTTP status codes, and transport code does not erase domain meaning before rendering it.
- **Distinct identities** for failures that callers handle differently, or that need different recovery, security or diagnostics. Combine them when the distinction has no value to callers and useful context survives.
- **What a failure carries:** a stable identity, safe structured context, an actionable message when recovery is possible, and the original cause when useful and safe. Classify by identity and fields, never by matching message text.
- **Translate at the dependency's boundary.** Transport, provider, storage and framework failures are translated by the code that owns that dependency. Already-correct application failures pass through, with useful causes kept safely.
- **Check status before decoding.** Classify an HTTP response by status before decoding it as success, or a valid error response gets misreported as a malformed success.
- **A timeout is not a failure.** A timeout, interruption or missing response from a remote mutation means the outcome is uncertain. Reconcile or retry only from evidence about what actually happened and whether repeating is safe (see `runtime.md`).
