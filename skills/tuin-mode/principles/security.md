# Security and observability principles

Read this file in full when a change touches personal data, secrets or credentials, authentication or authorisation, or logging, tracing, metrics and error reporting. Apply the sections whose situation matches.

## Sensitive data

Treat personal data as private by default. Put only approved, minimal representations into logs, traces, metrics, error reports and snapshots. Prefer opaque identifiers, operation names, dependency names, state tags, failure identities, retry counts and short sanitised summaries.

Keep secrets out of diagnostics, jobs, URLs, headers and automatic instrumentation, and limit raw access to the operations that need it. Use the platform's established storage and filtering mechanisms, and a redacted runtime representation where it adds protection.

Check framework and client instrumentation as well as your own logging. Filtering an application field does not make outer HTTP spans, exception causes, request bodies or redirect locations safe.

## Observability

Use the repository's established logging, tracing, metrics and error-reporting paths. Keep safe operation, dependency, state, failure, retry and correlation context across requests, jobs, workflows and external calls.

Place instrumentation at the boundary that understands the operation. Verify what is actually emitted, instead of assuming a logging call or an inner filter controls every reporter.

## Authentication and authorisation

Keep four responsibilities separate:

- boundary code verifies credentials and establishes a parsed actor, principal or session;
- domain policy makes permission decisions over meaningful values;
- application code gathers the context, enforces the decision and performs the operation;
- the outer boundary translates missing credentials and denied operations into protocol outcomes.

Parameter filtering is not authorisation.
