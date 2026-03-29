<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template Principle 1 -> I. Security By Default
- Template Principle 2 -> II. Performance Is A Feature
- Template Principle 3 -> III. UI Excellence Is Non-Negotiable
- Template Principle 4 -> IV. Evidence Over Assumption
- Template Principle 5 -> V. Keep The System Simple To Operate
Added sections:
- Delivery Standards
- Review & Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->
# humanvsrobot Constitution

## Core Principles

### I. Security By Default
All product and engineering decisions MUST start from least privilege, validated
input, safe defaults, and explicit trust boundaries. Features MUST avoid
exposing secrets, personal data, internal identifiers, or privileged actions
without authentication and authorization controls appropriate to their risk.
Security-sensitive changes MUST document the threat being addressed and the
mitigation applied. Rationale: retrofitted security is expensive and unreliable;
this project treats user trust as a release blocker.

### II. Performance Is A Feature
Interactive flows MUST define measurable performance targets before
implementation and MUST be verified against those targets before release. New
work MUST avoid unnecessary network round trips, excessive bundle or asset
growth, and avoidable main-thread blocking. Regressions against agreed budgets
require either remediation or an explicit written exception in the implementation
plan. Rationale: performance determines usability and operating cost at the same
time.

### III. UI Excellence Is Non-Negotiable
User-facing work MUST be clear, accessible, consistent, and polished on
supported screen sizes. Acceptance criteria for UI work MUST cover states,
feedback, empty and error handling, keyboard and focus behavior where
applicable, and accessibility expectations such as contrast, semantics, and
assistive technology support. Visual quality is not complete when only the happy
path works; the full interaction surface MUST be intentional. Rationale: users
judge product quality through the interface they experience, not the internal
architecture.

### IV. Evidence Over Assumption
Specifications, plans, and pull requests MUST include objective evidence for the
security, performance, and UI impact of a change. That evidence MAY include
tests, benchmarks, audits, screenshots, recordings, or structured manual
verification, but it MUST be reproducible by a reviewer. Missing evidence blocks
completion for medium- and high-risk changes. Rationale: discipline only scales
when reviewers can verify claims without relying on memory or intuition.

### V. Keep The System Simple To Operate
Solutions MUST prefer the smallest design that satisfies current requirements
while preserving security, performance, and UI quality. New dependencies,
abstractions, and background processes require a concrete justification in the
plan when simpler alternatives exist. Complexity introduced for speculative
scale or hypothetical reuse is not allowed. Rationale: unnecessary complexity
degrades velocity, reliability, and review quality.

## Delivery Standards

Every feature specification MUST describe security considerations, performance
expectations, and UI acceptance criteria when user-facing behavior is affected.
Implementation plans MUST define trust boundaries, sensitive data handling,
authorization expectations, performance budgets or latency and rendering targets,
supported devices or viewports, accessibility expectations, and the states to
validate. Tasks MUST include the work needed to verify these standards, not only
the implementation work. Releases MUST not ship known high-severity security
issues, unexplained performance regressions, or unresolved UI breakage on
supported platforms.

## Review & Quality Gates

Before Phase 0 research, the Constitution Check MUST confirm that the feature
has a documented security posture or an explicit statement that no new attack
surface is introduced, measurable performance goals and a verification approach,
UI acceptance coverage for primary, empty, loading, and error states when
user-facing behavior changes, and a validation plan naming the evidence
reviewers will inspect. Before merge, reviewers MUST confirm that the evidence
exists and that any exceptions are recorded with an owner, reason, and closure
plan. High-risk changes SHOULD receive focused review from the most relevant
discipline, such as security, frontend, or performance, before release approval.

## Governance

This constitution overrides conflicting local habits, checklists, and
undocumented team preferences. Amendments require a pull request that includes
the proposed text change, the reason for the change, and any template or
workflow updates needed to preserve consistency.

Versioning policy:
- MAJOR: removes a principle, materially weakens a mandatory rule, or redefines
	governance in a backward-incompatible way.
- MINOR: adds a principle or materially expands required practices or review
	gates.
- PATCH: clarifies wording, improves examples, or makes non-semantic editorial
	fixes.

Compliance review is required for every implementation plan and every merge
request that changes behavior, architecture, or operational posture. If a
change cannot comply immediately, the exception MUST be documented in the plan
or pull request with scope, mitigation, owner, and closure date before
approval.

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
