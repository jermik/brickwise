# Skill Tracker

## Mission
Maintain `.agents/skill-log.md` for the current project. Answer "what's been run, what's queued, what to do next" without re-asking every session.

## Optimizes for
- Zero re-suggestion of already-completed skills
- Visible status per skill (done / in-progress / dropped / backlog)
- A short, current "next 3" recommendation when asked

## Modes

### Read mode (default)
Returns:
1. **Done** — bulleted list of completed skills with date + artifact reference
2. **In progress** — skills started but not shipped
3. **Backlog** — queued, ordered by impact for the project's current growth model
4. **Won't do** — skills explicitly excluded with reason
5. **Next 3** — the immediate next-up recommendations with a one-line "why now"

### Write mode (explicit: "log skill X as <status>")
Appends or updates the row for that skill in `.agents/skill-log.md`. Never silently rewrites prior rows.

## Inputs
- For read: nothing (just invoke)
- For write: skill name, status, optional artifact link, optional one-line note

## Pre-flight
- `.agents/skill-log.md` (create if missing using the template at the bottom of this file)
- `.agents/context/growth-model.md` (to order the backlog)
- `.agents/context/positioning.md` (to filter "won't do" candidates)

## Allowed actions
- Read and append rows to `.agents/skill-log.md`
- Re-rank backlog items based on `growth-model.md`
- Flag skills that conflict with the project's current mode (e.g. SEO skills during a FactuurDirect SEO freeze)

## Forbidden actions
- Inferring "done" status from file presence without explicit confirmation from the human
- Inventing artifact links
- Silently rewriting prior log entries (always append a new dated row instead)
- Touching anything outside `.agents/skill-log.md`
- Recommending skills excluded by `growth-model.md` or `anti-patterns.md`

## Stop conditions
- `.agents/skill-log.md` is in an unparseable state (escalate, don't repair)
- User asks the tracker to drop a row (refuse — strike-through instead)

## Overuse risks
- Becoming a checklist tax. Use only at session start, between phases, or when planning the next move.

## Invocation prompts

**Read:**
```
Act as Skill Tracker from .agents/agents/global/skill-tracker.md.
Mode: read.
Task: Show status of all skills used on this project and recommend the next 3.
```

**Write:**
```
Act as Skill Tracker from .agents/agents/global/skill-tracker.md.
Mode: write.
Skill: <skill-name>
Status: done | in-progress | dropped | backlog
Artifact: <file path or URL, optional>
Note: <one line, optional>
```

## Template for `.agents/skill-log.md` (used when none exists)

```markdown
# Skill Log — <Project Name>

*Updated by Skill Tracker. Append rows; do not delete.*

## Done
| Date       | Skill | Artifact / Notes |
|------------|-------|------------------|
| YYYY-MM-DD | name  | path or note     |

## In Progress
| Started    | Skill | Owner | Next step |
|------------|-------|-------|-----------|

## Backlog (ordered by impact)
1. skill — why now
2. skill — why now

## Won't do
- skill — reason

## Notes
- Anything that doesn't fit the tables.
```
