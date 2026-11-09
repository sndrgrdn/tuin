# Design red flags

Screen every candidate before choosing. A red flag is a reason to revise or reject the shape.

## Shallow module

A large interface that hides little complexity. Judge depth by the capability and policy behind the public surface relative to its size. Prefer a simple interface backed by substantial behaviour.

A deep module is not a deep call chain. A deep call chain spreads understanding across layers; a deep module concentrates capability behind one interface.

Signs:

- callers combine several methods to complete one operation;
- public options expose internal stages or implementation choices;
- learning the interface does not save the caller from learning the implementation.

## Information leakage

Several modules depend on the same internal decision, so changing a representation, policy or protocol detail needs coordinated edits. Re-exporting transport or wire types publicly is leakage. Parse external data into domain types behind the interface, and keep storage schemas, framework objects and protocol details private.

## Temporal decomposition

Modules organised by execution order (load, validate, transform, save) instead of by the knowledge they own. Each stage tends to repeat one representation and its invariants. Group code by domain knowledge and ownership; methods that run at different times can belong to one module when they protect the same decisions.

## Pass-through method

A method that forwards the same arguments to another method of the same shape. It adds a layer and hides nothing. Remove it, or move the responsibility to the module that can complete the operation. Keep a forwarding boundary only when it adds policy, adaptation or a distinct abstraction.

## Split ownership

More than one module writes the same state or keeps its own copy. An agent editing one writer cannot see the others, so their rules drift apart. Give each piece of state one owner; other modules read it or ask the owner to change it.

## Two ways to do one task

The design offers more than one way to do the same thing. An agent copies whichever it finds first, so every way keeps gaining callers. Keep one way; move the callers and delete the others in the same change.

## Importable internals

Callers can import a module's internals. An agent takes the shortest path that compiles, so the internals become part of the interface. Make internals unreachable from outside, so such an import fails the build.

## Hand-synced list

The same items are listed in two or more places, and adding one means editing every list. An agent that sees one list updates only that one. Keep one list and derive the others; when a list cannot be derived, make the build fail when they disagree.
