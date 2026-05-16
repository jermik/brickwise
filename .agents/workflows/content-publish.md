# Workflow: Content Publish

Use for any Brickwise blog post, property writeup, newsletter, or Reddit/HN post.

## Steps (sequential, separate turns)

1. **Draft** — write the piece yourself, or use a copy skill. Anchor on one specific number, address, or finding.
2. **Skeptical Analyst** — `.agents/agents/project/skeptical-analyst.md`
   - Surfaces hype, unsourced claims, missing risk framing
3. **Methodology Guardian** (if the piece references scores or signals) — `.agents/agents/project/methodology-guardian.md`
4. **Copy Editor** — `.agents/agents/global/copy-editor.md`
5. **Distribution Strategist** — `.agents/agents/global/distribution-strategist.md`
   - Produces channel-adapted versions
6. Publish canonical, then distribute the adapted versions in ship order.

## Stop conditions
- Skeptical Analyst rejects the piece (fix and re-run, do not override silently)
- Methodology Guardian fails the page on independence or methodology visibility
- No specific number or named entity in the first 100 words
