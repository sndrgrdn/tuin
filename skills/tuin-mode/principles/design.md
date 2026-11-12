# Design principles

Read this file in full when you choose where a responsibility lives, shape a module, service or interface, name things, change a public surface, integrate a new requirement, or face a design with no precedent in the codebase. Apply the sections whose situation matches.

## Foundational Thinking

Get the data shape right before writing logic. Trace the caller-visible operation through its inputs, decisions, effects, expected failures, transitions and outputs, and choose the data and state representations before writing their logic. Define core types early, trace every way the data is read and written, and choose structures that fit the most common paths.

- **Scaffold first.** If something helps every later step (CI, linting, test setup, shared types), do it first.
- **Structure over lines.** Remove duplication in the data model and types. Three similar statements still beat a premature abstraction.
- **Concurrency.** Before sharing state between actors, ask what happens if another actor changes it at the same time. Unless the answer is "nothing", isolate it.
- Each increment lands a coherent abstraction or deepens one that exists, instead of spreading a capability across callers as special cases.

Structural decisions protect future options. Code-level decisions protect simplicity.

## Model the Domain

For each changed responsibility, decide what kind it is, and give it the owner that kind calls for:

- **domain behaviour** lives with the domain knowledge and invariants it governs;
- **application policy** (use-case decisions and the order of effects) lives with the application operation;
- **technology mechanics** (provider, storage, transport) live with the dependency that owns them;
- **composition** (construction, wiring, lifetimes) lives with the composition root.

Inspect the existing owner and its callers before choosing a file. Execution order alone does not define ownership, and file proximity or similar syntax are clues, not evidence.

Encode the domain in a structure instead of scattering it across conditionals. Reach for a state machine instead of scattered booleans or phase checks; a typed model or value object instead of loose parameters or a repeated shape assumption; a lookup table, registry or tagged union instead of branching spread across files; a module organised around one body of domain knowledge instead of a sequence such as load, validate, transform, save; and the queue, index, tree or normalised collection the access pattern calls for.

Keep boring code when the current shape is clear, local and unlikely to grow. You skipped this principle when a feature grows an if/else chain by one more branch, or adds a second boolean that must stay in sync with the first.

## Deep modules and service boundaries

A module is anything with an interface and an implementation: a function, class, interactor, package or subsystem. Its interface is everything a caller must know to use it correctly: inputs, outputs, invariants, ordering, failures, configuration and relevant performance.

- **Information hiding.** Keep each design decision behind the interface of its owner. The same design knowledge appearing in several modules is leakage; put it behind one owner unless the meanings differ.
- **Prefer deep modules:** substantial behaviour behind a small interface. Push complexity down into the module that owns it when that simplifies callers without hiding caller-relevant behaviour. When shaping an interface, ask whether it can expose fewer operations, take simpler inputs, or hide more policy.
- **Service boundaries** are explicit caller-facing interfaces, or an intentional public protocol in languages without interfaces. Keep framework, provider and storage details private unless callers need them. A boundary earns its place through a meaningful capability or a cohesive operation.
- **Substitutability.** When an interface has several implementations, each accepts every valid call and keeps every guarantee, failure, effect and invariant. Matching names and types is not enough.
- **Functional core, imperative shell.** The core owns deterministic decisions and transformations. The shell gets runtime information, coordinates effects, and keeps their order visible. Prefer composition.

## Boundary Discipline

Validate, narrow types and handle errors at system boundaries: user input, CLI arguments, config, network, external APIs, the database. Inside, trust the types and let errors propagate. Keep business logic in pure functions that the shell calls. Expose domain concepts across a boundary, not the transport, storage or framework types behind it.

Ask of every check: "is this data crossing a boundary right now?" If not, it is redundant. Ask of every piece of logic: "can this be a pure function the shell calls?" If yes, extract it. The rules for parsing and representing that data are in `data.md`.

## Ownership and dependencies

Give each domain rule, application policy, technology mechanism and composition concern one clear owner.

Make every dependency that affects behaviour explicit: persistence, external services, configuration, time, randomness, identity generation, authorisation evidence, telemetry. Provide each one at the boundary that matches its lifetime and meaning, and keep request-specific state out of long-lived services.

The owner of an application operation keeps its decisions, effect order and expected early exits visible. Give cross-cutting behaviour (logging, tracing, retries, timeouts, cleanup, metrics, error translation) a clear owner, in whatever shape fits.

## Redesign From First Principles

When a new requirement arrives, ask what shape would make it natural if it had been there from the start. Compare that shape with a local extension, and prefer the redesign when the extension adds contradictory state, repeated rules, or knowledge leaking into callers. Read every affected file first. Carry the change through every reference: types, names, docs, examples, tests. Design the whole change, then deliver it in increments.

Choose the smallest coherent solution that keeps required behaviour and compatibility.

## Exhaust the Design Space

When a new interaction, or an unresolved choice of ownership, state or interface, could materially change the implementation, compare at least two structurally different shapes before committing. Start from the caller's usage, a state model or a small sketch. Use a throwaway prototype when runtime behaviour or feel decides (the Prototype playbook), and a tracer bullet when the question is whether a real integration path works. For a change that crosses a function boundary, run `architect`.

Compare contract fit, interface depth, locality, reader load, compatibility, and runtime and operational cost. A familiar local change needs no bakeoff, new abstraction or parallel agents. Discarded experiments must not become production architecture by accident.

## Abstractions earn their place

- **YAGNI.** Build the smallest coherent solution for current requirements. Add flexibility, abstractions, dependencies and operational mechanisms only when a current need earns them.
- **Conceptual integrity.** Extend the repository's established vocabulary, contracts, failure model and patterns unless concrete requirements break them. Before adding a mechanism, look for an established one that provides the same capability in the same context, and extend it when it fits. A parallel mechanism is a deliberate architectural choice with ongoing lifecycle, failure, deployment and observability costs.
- **The deletion test.** An abstraction earns its place when removing it would spread meaningful complexity, coupling, policy or provider mechanics into callers. An abstraction with one caller can pass; a wrapper that only renames and forwards cannot.
- Keep a concrete dependency private until a separate abstraction hides meaningful mechanics, serves several owners, or supports real variation.

## Minimize Reader Load

Judge complexity by what a reader must do to understand the behaviour: the **layers** they trace between a question and its answer, and the **state** they hold in their head. Evaluate the whole operation, including its callers. Line counts, function sizes and complexity scores are proxies and investigation signals, not targets.

- Inline layers that cost more than they save: wrappers with one caller, adapters with one implementation, layers that forward the same concepts.
- Each layer must change the abstraction; keep a boundary when it hides meaningful policy, mechanics or invariants.
- Shrink the scope of state: return values over mutation, locals over fields, fields over module state, module state over globals. Derive values instead of syncing copies.
- State an invariant once at the boundary, not in every consumer.
- When branches, modes or layers pile up, look for a better representation or interface that removes the complexity instead of moving it. Keep necessary complexity when the simpler alternative cannot account for it.

The test: can a new reader answer "where does X come from?" and "what can change X?" in under 30 seconds?

## Names and public surfaces

- **Intention-revealing names.** Public type and operation names state their domain purpose and effect, so callers need not read the implementation.
- **One language.** Use the same domain terms in code, interfaces, tests and docs (the project's glossary, if it has one), and rename them together when the model changes.
- Name operations by what they do: parsing turns a less-trusted representation into a meaningful value; construction builds a value from meaningful parts and establishes its invariants; a predicate answers a question; an assertion stops execution when a required condition is false.
- Use booleans for predicates and genuinely independent choices. Give behaviour-selecting inputs named policies or domain values. Keep the primary input distinct, and add an option only when a real caller needs it.
- Name capabilities by what they provide, not by today's consumer. Put use-case specifics in operation names.
- Reference abstractions through their owning module or an intentional package entrypoint. Expose only what intended callers should use, and review every consumer, including those outside the repo when the code is published, before changing a public contract.
- Organise files around cohesive, searchable subjects, not size limits. Keep private helpers beside their owner; move a helper when its meaning becomes generic and stable.
- **Durable words.** Use durable domain words; keep tickets, plan phases and storage terms out of public language.
- **Dependency APIs** come from the project's pinned version and version-matched source or docs, never from memory or current upstream alone.
- **Tool claims.** Claim that tooling enforces something only when the active configuration proves it: the config, the commands, the checked paths. A passing check proves only what it inspects. Keep rule catalogues and thresholds in configuration, not in prose.
