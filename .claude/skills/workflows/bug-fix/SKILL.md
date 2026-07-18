---
name: bug-fix
description: Approach for fixing bugs in CRMk — reproduce first, find root cause, minimal targeted fix. Use whenever the task is described as a bug, broken behavior, or something not working as expected.
---

# Bug-fix workflow

## 1. Reproduce before touching code

Understand the exact failing input/state and expected vs. actual behavior. If it's a backend bug, find or write the failing test case first (`./mvnw test -Dtest=...`) — a red test is the clearest definition of "fixed."

## 2. Find the root cause, not the symptom

- Trace to the actual origin: is it a controller doing something a service should (validation, transitions)? A missing check in `ViajeService`/`DestinoService` for date logic? A missing exception registration in `GlobalExceptionHandler`? A frontend page bypassing `api/axios.ts`?
- Don't patch around a symptom in a layer that isn't where the invariant should live — that just moves the bug.

## 3. Minimal, targeted fix

- Don't refactor surrounding code while fixing a bug unless the refactor *is* the fix.
- Don't add defensive validation for cases that can't actually occur given the caller — trust internal guarantees, validate only at real boundaries (user input, external APIs).

## 4. Never bypass the safety net to make the bug "go away"

- Don't skip hooks (`--no-verify`), disable a failing test, or silently swallow an exception to stop the error from surfacing. If a test fails after your fix, the fix or the test is wrong — figure out which.

## 5. Verify

- Backend: run the specific test class plus the full suite if the fix touches shared logic.
- Frontend: manually exercise the fix in the browser per the `frontend/verify-ui-change` skill — don't rely on type-check/lint alone.
