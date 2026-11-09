# Runtime principles

Read this file in full when a change touches configuration, startup, resources, background jobs or other asynchronous work, time or randomness, stored data, migrations, transactions, retries, or calls that change a remote system. Apply every section whose situation matches, and name the principle in your reply with the choice it changed.

## Configuration

Read and parse configuration at startup or at the earliest composition boundary, then pass meaningful values inward. Inner code never re-reads raw environment values.

Apply defaults only to missing configuration, and reject malformed configuration. Define the precedence between configuration sources explicitly instead of relying on load order.

Construct a dependency through its owning composition interface when that interface carries configuration, lifecycle, instrumentation, memoisation or wiring. Bypassing it must not silently drop that behaviour.

## Lifecycles

- **Every acquired resource has an owner and a release strategy,** local or through an explicit framework lifecycle. Release it after success, after failure, and when the runtime interrupts its scope.
- **Handles stay in their scope.** Keep request-, transaction-, thread-, process- and component-bound handles inside the scope where they are valid. A stable identity or cache key does not extend a live handle's validity.
- **Every asynchronous task has an owner** for its completion, failure and cancellation. Child work stays within its owner's lifetime; work that must outlive its starting scope needs an explicit supervisor or durable owner. Decide whether sibling work stops or continues when one task fails.
- **Phases.** Keep planning and construction separate from runtime execution. Acquire contextual resources only in the phase that owns them, and make required resources ready before exposing the handlers that use them.

## Ambient state and effects

- Keep module loading inert. Perform startup effects only in explicit entrypoints or framework-owned hooks.
- Confine mutable global state to an explicit framework or runtime boundary with a defined lifecycle and synchronisation policy. Pass operation-specific values inward instead of using ambient state as hidden input.
- Treat time, randomness and identity generation as explicit dependencies when they affect behaviour. Pure calculations receive concrete timestamps and generated values.

## Persistence ownership

Design persistence around cohesive domain capabilities, and keep table layout, queries, schema details, raw records and ORM mechanics private to their owner.

Choose how to decode a stored record from its version, discriminator or storage authority before decoding it. Malformed current data does not become legacy data through fallback parsing; translate identified legacy shapes explicitly and re-establish the remaining invariants.

Validate migrations and imports before committing writes, and keep invalid source evidence for diagnosis. A name in code, a physical resource identity and a persisted-state contract are three separate concerns.

## Data with its own lifecycle

Stored data with its own creation cadence, mutation rules, write ownership, retention or deletion schedule has its own lifecycle. Give it a named owner rather than attaching it to a convenient host record whose lifecycle differs. A dedicated cleanup job or retention policy is a strong sign the data deserves its own concept. Keep data with its host when their lifecycles genuinely match.

## Transactions and durable coordination

Use:

- an ordinary call when no atomic state change is needed;
- a database transaction when changes in one datastore must commit or roll back together;
- a durable workflow or saga when progress must survive process loss, long delays, redelivery, compensation, approval, or several commit boundaries.

Close database transactions before network calls or long-running work. Record durable intent (an outbox, a job) when external work must reliably follow a committed change.

## Make Operations Idempotent

Every operation that changes state answers two questions: "what happens if this runs twice?" and "what happens if the previous run crashed halfway?" The answer must be "it converges to the same end state".

- Derive each step from the state that exists, not from what the previous run meant to do: read the current state, compare it with the goal, apply only the difference.
- Anything a run leaves behind (a lock, a temporary file, a half-written record, a claimed job) must be recognisable as stale by the next run, wherever the previous run stopped. Write to a temporary path and rename into place; compare by content, not by creation order.
- Define an idempotency strategy for every real duplicate-execution path, at the layer that owns the duplication: stable request keys, natural uniqueness constraints, deduplication records, guarded state transitions, transactional outboxes or inboxes.

If any answer is "it depends on what was left behind", add a reconciliation step.

## Retries and repeated work

- Put retry policy at the boundary that understands the failure and can prove that repeating is safe. Avoid nested retries owned by several layers.
- Define what each repeated operation does after success, expected failure, defect, interruption, retry exhaustion, and failure of a single item. A permanent worker still has an explicit continuation and termination policy.
- Match retry timing to the failure: bound attempts or elapsed time, add jitter when synchronised callers could amplify a failure, honour the provider's retry guidance. Keep the final classified failure unless a truthful fallback handles it.

## Uncertain remote outcomes

A timeout or missing response from a remote mutation leaves the outcome unknown. Keep the request identity, receipts, checkpoints and recovery intent needed to reconcile, retry or compensate safely, and define the operation's point of no return.

## Complete when

Every configuration value is parsed once at an owning boundary, malformed values fail, and precedence is explicit. Every acquired resource has a valid scope and release strategy, runtime work happens in its owning phase, module loading is inert, and ambient mutable state stays contained. Persistence mechanics stay private to a cohesive capability, data with its own lifecycle has its own owner, migrations commit only validated state, and transactions contain only atomic database work. Every duplicate path, retry, repeated operation and uncertain remote mutation has an explicit owner and safety policy.
