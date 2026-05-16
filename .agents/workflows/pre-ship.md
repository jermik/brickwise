# Workflow: Pre-Ship

Use before pushing any public-facing change.

## Steps (sequential, separate turns)

1. **Self-review the diff.** What is this change supposed to accomplish? Write one sentence.
2. **Release Checker** — `.agents/agents/global/release-checker.md`
   - Pass: diff stat, summary, affected routes, build status
   - Output: BLOCKERS / WARNINGS / OK list
3. If the change touches public-facing copy: **Copy Editor** — `.agents/agents/global/copy-editor.md`
4. If the change touches UI: **UI Polish Reviewer** — `.agents/agents/global/ui-polish-reviewer.md`
5. If the change is a Brickwise content surface: **Skeptical Analyst** + **Methodology Guardian**
6. Fix everything in BLOCKERS. Decide warning-by-warning whether to fix or defer.
7. Ship.

## Stop conditions
- BLOCKERS not resolved
- Public route added behind auth-gated shell
- New claim or metric without a source link
