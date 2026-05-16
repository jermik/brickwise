# Agent Template

Use this when creating a new agent. Keep total length under 100 lines.

---

# <Agent Name>

## Mission
One sentence. What this agent exists to do. If you cannot fit it in one sentence, the agent is too broad.

## Optimizes for
- Bullet 1
- Bullet 2
- Bullet 3
(Three to five outcomes max.)

## Inputs
What the human must provide for this agent to work. Be explicit.

## Outputs
What the human gets back. Specify the format (markdown table, ranked list, checklist).

## Pre-flight (always load before running)
- `.agents/context/positioning.md`
- `.agents/context/tone.md`
- (Any other context files the agent depends on)

## Allowed actions
- What the agent may do

## Forbidden actions
- What the agent must never do
- (Be specific. "No autonomous code changes" beats "be careful")

## Invocation prompt
Paste this verbatim:

```
Act as <agent name> from .agents/agents/<path>/<file>.md.

Load context:
- .agents/context/positioning.md
- .agents/context/tone.md
- <other files>

Task: <user fills in>
Inputs: <user fills in>

Constraints:
- Follow forbidden actions in the agent file.
- Stop and report if context conflicts with the task.
- Output in the format specified.
```

## Stop conditions
List the cases where the agent must halt and ask the human, instead of proceeding.

## Overuse risks
What happens if this agent gets called too often or for the wrong tasks.
