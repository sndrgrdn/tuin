# Testing principles

Read this file in full when you write, change, keep or delete a test, or decide how a change will be proven. Apply the sections whose situation matches. The project's testing rules win where they differ. For fixing a bug test-first, also follow `tdd`.

## Test Behavior, Not Implementation

A test is a claim about what the code does for its users: a caller, an end user or another service. Behaviour is what they can observe through the interface they use: return values, errors, state they can read back, and effects on outside systems such as a request sent, a row written or a message emitted. Implementation is what they cannot observe: private helpers, internal call order, intermediate data, which collaborator did the work.

Judge each test against two imagined edits:

- **Break the behaviour.** Make the code return a wrong value, skip an effect, or do it twice. If the test still passes, it proves nothing. Usual causes: an assertion looser than the contract, an expected value computed by the code under test, a restated constant that never runs the code that reads it, an assertion on data the test built itself.
- **Change the internals.** Keep every observable result and restructure the code underneath. If the test now fails, it is pinned to the implementation.

Keep a test that catches the first edit and survives the second; rewrite or delete the rest. Drive the code through its users' interface with a concrete input, derive the expected value from the requirement rather than a run of the code, and assert what the contract promises, no less and no more.

The contract decides, not the shape of the assertion. When "an empty cart never charges" is the promise, asserting that the payment client got no call is behaviour; pair it with a case where the charge happens, so the test shows it can see a call. The payload a mocked external service receives is behaviour, because that service observes it. A call to an internal helper is implementation. An exact error message pins wording no caller reads; the error type callers branch on is the contract. A test can also pin an invariant, such as a key that must exist in two tables.

## Test through real interfaces

Prefer tests in this order of confidence:

1. end-to-end tests through real public entrypoints;
2. integration tests through real interfaces;
3. focused and property tests for pure domain modules;
4. unit tests for meaningful behaviour, never for implementation details.

Start at the top of this order, and go down only for behaviour the level above cannot reach reliably. A unit or integration test never repeats what an end-to-end or system test already covers.

**No module-level replacement of imported dependencies.** Replace behaviour through real seams instead: dependency-injected interfaces or protocols, a local database substitute such as SQLite, faithful in-memory implementations, or fake external implementations when needed.

Assert observable outcomes: returned values and errors, persisted state, emitted events and messages, rendered responses, sent emails captured by a recording or local implementation. A spy assertion is right only when the interaction itself is the observable behaviour; otherwise prefer a recording implementation and inspect its public records.

## Test implementations

A dependency interface represents real ownership or variation, not a wish to mock.

- Keep a narrow one-off fake local to its test.
- Export a reusable static or recording implementation when its complete behaviour is useful across tests.
- Use an established conventional name when it communicates the behaviour (`TestClock`), otherwise the shortest truthful qualifier: `InMemoryCache`, `RecordingEmailSender`, `NoopEmailSender`, `FailingEmailSender`.
- Use SQLite or another real local substitute when queries, schema, serialisation, transactions or protocol behaviour matter.
- Call an implementation in-memory only when it faithfully keeps the complete observable contract under test.

Production branches, exports, flags and behaviour exist for production needs only. When no real dependency interface exists, test through an existing public interface or a faithful inert harness.
