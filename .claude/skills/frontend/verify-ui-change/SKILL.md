---
name: verify-ui-change
description: Mandatory manual verification steps for any CRMk frontend change before calling it done. Use before reporting a frontend/UI task complete, not just after tests or type checks pass.
---

# Verify a UI change before calling it done

Type checking (`tsc -b`) and lint (`npm run lint`) verify code correctness, not feature correctness. Neither substitutes for actually using the feature.

## Steps

1. `npm run dev` (Vite, port 5173, host: true).
2. Exercise the **golden path** for the change in a browser: the primary flow a user would actually take.
3. Exercise at least one **edge case**: empty state, validation error, a long/large dataset (remember `Ciudad` has 60k+ rows — pagination/search edge cases matter here), or a permission boundary (admin-only vs regular user).
4. Watch for regressions in adjacent features on the same page (e.g. a `Viaje` form change shouldn't silently break `Destino` date validation display, or the dashboard map if trip status rendering changed).

## If you can't test in a browser

Say so explicitly in your summary — don't report the task as verified/complete if you only ran the type checker or lint. "Type-checks and lints clean; not manually verified in browser" is the honest status, not "done."
