# Design principles

Read this file in full when you choose data shapes, types, modules or boundaries, integrate a new requirement into an existing design, or face a design with no precedent in the codebase. Apply every principle whose situation matches, and name it in your reply with the choice it changed.

## Foundational Thinking

Get the data shape right before writing logic. Define the core types early, trace every way the data is read and written, and choose structures that fit the most common paths. Then the code that follows becomes obvious.

- **Scaffold first.** If something helps every later step, do it first: CI, linting, test setup, shared types. Ask "does every later phase benefit from this existing?"
- **Structure over lines.** Remove duplication in the data model and types. Three similar statements still beat a premature abstraction.
- **Concurrency.** Before sharing state between actors, ask what happens if another actor changes it at the same time. If the answer is not "nothing", isolate it.
- Each increment lands a coherent abstraction or deepens one that exists, instead of spreading a new capability across callers as special cases.

Structural decisions protect future options. Code-level decisions protect simplicity.

## Model the Domain

Encode the real domain in a structure instead of scattering it across conditionals. A structure that matches the domain makes invalid states impossible to represent and deletes branches. It is cheap to choose while writing and expensive to recover later.

Reach for:

- a state machine instead of scattered booleans, phases or lifecycle checks;
- a typed model or value object instead of loose parameters or a repeated shape assumption;
- a lookup table, registry or tagged union instead of branching spread across files;
- a module organised around one body of domain knowledge, instead of a sequence of steps such as load, validate, transform, save;
- a queue, index, tree or normalised collection where the access pattern calls for it.

Keep boring code when the current shape is clear, local and unlikely to grow. An abstraction earns its place only by removing branches, duplicated rules, invalid states or lifecycle risk.

You skipped this when a feature grows an existing if/else chain by one more branch, or adds a second boolean that must stay in sync with the first.

## Boundary Discipline

Validate, narrow types and handle errors at the system's boundaries: user input, CLI arguments, config, network, external APIs, the database. Inside the system, trust the types and let errors propagate. Keep business logic in pure functions that the framework code calls.

- Parse raw data into domain types at the boundary.
- Expose domain concepts across a boundary, not the transport, storage or framework types behind it.
- Ask of every check: "is this data crossing a boundary right now?" If not, the check is redundant.
- Ask of every piece of logic: "can this be a pure function the shell just calls?" If yes, extract it.

## Type System Discipline

Let the language reject impossible states, mixed-up values and unhandled variants. In a statically typed language, use the compiler. In a dynamic one, use value objects, enums and validation at the boundary for the same effect.

- **Distinct types for distinct meanings.** A customer ID and an order ID are both numbers or strings underneath, but they should not be interchangeable.
- **External data is untyped until parsed.** JSON, request params, environment variables, database rows and CLI arguments all go through one parse step into the typed model.
- **Derive types from the source of truth.** When a schema, migration, API spec or token file owns a shape, derive from it instead of writing a parallel definition by hand.
- Handle every variant explicitly, so a new one fails loudly where it is unhandled.

## Redesign From First Principles

When a new requirement arrives, redesign as if it had been a founding assumption, instead of bolting it onto the current design.

- Read every affected file and understand the current design.
- Ask: "if we wrote this from scratch with this requirement, what would we build?"
- Carry the change through every reference: types, names, docs, examples, tests.
- Design the whole change, then deliver it in increments.

## Exhaust the Design Space

For a new interaction, a new architectural decision, or a product decision that depends on feel, build two or three competing versions and compare them side by side before committing. Prototypes are cheaper than a wrong production build. Use the Prototype playbook, with the variants behind one switcher.

## Minimize Reader Load

Maintainability is the work a reader does to understand the code. Track two things: the **layers** between a question and its answer, and the **state** the reader has to hold in their head. Line counts and complexity scores are only proxies.

- Inline layers that cost more than they save: wrappers with one caller, adapters with one implementation, indirection nobody needed.
- Each layer must change the abstraction. A layer that repeats the methods and arguments below it adds load without hiding anything.
- Shrink the scope of state: return values over mutation, locals over fields, fields over module state, module state over globals. Derive values instead of syncing copies.
- State an invariant once at the boundary, not in every consumer.

The test: can a new reader answer "where does X come from?" and "what can change X?" in under 30 seconds? If not, cut layers or cut state.
