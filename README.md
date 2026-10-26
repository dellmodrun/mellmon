# Mellmon

Mellmon is a protocol concept for outcome-native agent companies on Solana.

A founder defines one measurable outcome, an isolated treasury, a deadline and an acceptance policy. Mellmon forms a temporary company around that result, gives each agent or human contributor only the capability and budget required for its task, records delivery through receipts, settles approved work and expires the company's authority when the outcome is complete.

## Product model

| Object | Purpose |
| --- | --- |
| Outcome | Definition of done, acceptance conditions and deadline |
| Company | Temporary coordination state formed for one Outcome |
| Machine | Owner-controlled runtime that plans and authorizes execution |
| Chip | Versioned capability installed for a specific task |
| Receipt | Record of operator, cost, policy and reported delivery |
| Treasury | Isolated capital with spending limits and settlement routes |

The intended lifecycle is:

1. Lock an Outcome and its acceptance policy.
2. Form a Company with a bounded Treasury.
3. Decompose the Outcome into an execution graph.
4. Install the required Chips on a Machine.
5. Route subjective or high-impact decisions to human reviewers.
6. Record verified contributions as Receipts.
7. Settle approved work, return unused capital and expire temporary authority.

## Current implementation

The repository contains:

- A production-style static formation interface in index.html, styles.css and app.js.
- An interactive local formation planner. It moves no funds and makes no wallet request.
- An Anchor program baseline in programs/mellmon/src/lib.rs for versioned Chips, bounded installations, operator-reported Receipts and SPL Token settlement.

The current Anchor program implements the lower-level Machine, Chip, installation and Receipt primitives. Outcome, Company, dependency graph, acceptance and dissolution accounts described by the product interface are the next protocol layer; they are not yet deployed.

There is no public mainnet deployment, verified program address or token contract address. The program has not been audited. Do not use it to protect production assets without independent review, SBF testing and end-to-end integration tests.

## Existing onchain baseline

The current program supports:

- Publisher-owned Chip identities and immutable revisions.
- Owner-controlled Machines and operators.
- Installations with expiry, per-invocation ceilings and rolling budgets.
- Artifact and manifest digest commitments.
- Unique Receipts for operator-reported offchain work.
- One-time SPL Token settlement across a committed three-recipient route.

The program does not yet verify the correctness of offchain computation. An authorized operator remains a trust assumption.

## Development

Run the website checks:

    npm test

Serve the static interface locally:

    python -m http.server 4173

Run the Rust checks with a compatible Rust, Solana and Anchor toolchain:

    cargo check --workspace --all-targets
    cargo test --workspace --lib
    anchor build

The site has no frontend framework or runtime dependency.
