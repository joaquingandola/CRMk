---
name: commit-and-pr
description: Conventions for git commits and pull requests in CRMk. Use when the user explicitly asks to commit changes or open a pull request.
---

# Commits and PRs

Only commit or open a PR when explicitly asked — implementing a change is not implicit permission to commit it.

## Commit messages

- Focus on *why*, not *what* (the diff already shows what changed).
- 1-2 sentences.
- Match the style of recent commits — check `git log` for this repo's tone (this repo's history uses short, plain-language subject lines, e.g. "agrego correcciones modulo pdf", "add feature pdf for frontend").
- Stage specific files by name, not `git add -A`/`git add .` — avoids accidentally sweeping in `.env` or unrelated work-in-progress.
- Create a new commit rather than amending, unless the user explicitly asks for `--amend`.
- Never use `--no-verify` or skip hooks without explicit instruction.

## Pull requests

- Title under ~70 characters; details go in the body.
- Body: a short summary (bullets) + a test plan checklist.
- Check `git status`/`git diff` against the PR's base branch and review **all** commits being included, not just the latest one, before writing the summary.
- Never force-push to `main`/`master`.

## Before either

Run through `workflows/ship-checklist` first — tests, manual verification, scope check — a commit/PR should represent verified, complete work.
