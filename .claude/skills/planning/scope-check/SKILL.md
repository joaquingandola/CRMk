---
name: scope-check
description: Quick decision check for whether a CRMk task needs a plan or can be done directly. Use at the start of any non-trivial request to decide between just implementing it and entering Plan mode first.
---

# Scope check

Before starting implementation, decide which bucket the task is in:

## Just do it directly

- Single-file bug fix with an obvious cause.
- Change confined to one layer (e.g. a controller wiring fix, a mapper field, a frontend copy/styling change).
- The fix is smaller than the plan would be.

## Use Plan mode first (see `planning/feature-plan`)

- Touches both `crm/` and `frontend/`.
- Adds a new entity, relation, or state.
- The right approach is ambiguous, or there's more than one reasonable design.
- The user's request implies "a feature," not "a fix."

## Ask the user instead of guessing

- The request is genuinely ambiguous about scope ("clean this up" with no target) — ask what "done" looks like rather than picking a scope and hoping it matches.
- The task would touch security config (`SecurityConfig`, admin-only routes) in a way that changes who can access what — confirm intent before changing authorization boundaries.
