# Workflow: UI Change

Use for any frontend visual change.

## Steps (sequential, separate turns)

1. **Invoke the `frontend-design` skill first.** Per global CLAUDE.md, every session before writing frontend code.
2. **Implement** — make the change. Start the dev server, do not screenshot `file:///`.
3. **Screenshot pass 1.** Compare against reference if provided. Fix mismatches.
4. **Screenshot pass 2.** Iterate at least twice per global CLAUDE.md.
5. **UI Polish Reviewer** — `.agents/agents/global/ui-polish-reviewer.md`
6. **Release Checker** — `.agents/agents/global/release-checker.md`

## Stop conditions
- Reference image exists but the implementation diverges in layout, spacing, type, or color
- Default Tailwind palette in use as primary brand color
- Any `transition-all` introduced
- New public route uses an auth-gated shell (SEO regression)
