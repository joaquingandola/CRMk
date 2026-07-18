---
name: ship-checklist
description: Final checklist before reporting a CRMk task as complete. Use right before telling the user a change is done, especially before offering to commit.
---

# Before calling a task done

1. **Tests** — backend: relevant `./mvnw test -Dtest=...` (and full suite if shared logic changed). Frontend: `npm run lint`, `tsc -b` via `npm run build`.
2. **Manual verification** — for any frontend/UI change, actually used the feature in a browser (golden path + one edge case). Type checks and tests verify correctness, not that the feature works — see `frontend/verify-ui-change`.
3. **Scope check** — did the change stay within what was asked, or did it drift into unrelated cleanup/refactoring? Trim anything not requested.
4. **No unsolicited commits** — implementing the change is not the same as committing it. Only run `git commit` when the user explicitly asks.
5. **Security surface touched?** — if `SecurityConfig`, JWT handling, or any admin-only route changed, double check the authorization rule is what was intended before reporting done.
6. **Summary, not an essay** — report what changed and what's left in 1-2 sentences, not a full recap of steps taken.
