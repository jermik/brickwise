# SEO Routines

Three daily remote routines run on Anthropic cloud infra via `/schedule`. One per project.

| Project | Repo | Live URL | Prompt file |
|---|---|---|---|
| Brickwise | jermik/brickwise | (TBD, agent discovers) | [brickwise.md](brickwise.md) |
| SEO Terrain | jermik/localrank-intel | (TBD, agent discovers) | [seoterrain.md](seoterrain.md) |
| FactuurDirect | jermik/factuur-maatje-plus | factuur-maatje-plus.vercel.app | [factuurdirect.md](factuurdirect.md) |

## Schedule

All three: `0 4 * * *` (04:00 UTC daily = 06:00 Europe/Amsterdam).

## Mode logic (inside each prompt)

The single daily cron branches by date:

- `DOM == 01` → **MONTHLY REFRESH** — content-decay candidates, briefs only
- Else `DOW == 7` (Sun) → **WEEKLY FIX** — apply safe whitelist fixes, open PR
- Else → **DAILY MONITOR** — read-only, open report PR

## Safety model

- All three routines branch + auto-PR. Never push to main.
- Each has a strict whitelist of files allowed for edit; everything else → "Needs human."
- Project-specific invariants (FactuurDirect schema rules, Brickwise positioning, SEO Terrain trust signals) are baked into each prompt.

## Prerequisites

- Claude GitHub App installed on each repo, OR `/web-setup` run
- (Optional) GSC MCP connector if you want real Search Console data — not required for live-site WebFetch checks
- Each repo has (or will have) `.agents/skill-log.md` and `.agents/seo-reports/` — routines append, don't delete

## Outputs

Each run writes to the target repo:
- `.agents/seo-reports/YYYY-MM-DD-<mode>.md` — finding report
- `.agents/skill-log.md` — append row with mode and PR URL
- New branch `seo/<mode>-YYYY-MM-DD` with the report (+ fixes on Sun)
- PR titled `SEO <mode> — YYYY-MM-DD`

## Editing prompts

These files are the source of truth. To change routine behavior, edit the relevant `.md`, then update the routine via `/schedule` → update.
