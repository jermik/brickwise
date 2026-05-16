# Agent OS

A reusable agent system that works across multiple products without making them converge.

## Philosophy

Agents are specialized senior teammates. Not autonomous founders, not feature factories, not redesign engines. Each agent has a narrow mission, clear boundaries, and explicit forbidden actions. The system is designed to **prevent AI sameness** by always loading per-project context before any agent runs.

## Three-layer architecture

```
.agents/
├── README.md                       # this file
├── product-marketing-context.md    # project marketing context (existing)
├── context/                        # PROJECT IDENTITY — load before any agent runs
│   ├── positioning.md              # who we are / who we are NOT
│   ├── tone.md                     # voice rules, words to use/avoid
│   ├── anti-patterns.md            # what we never do
│   ├── ux-philosophy.md            # how we build the product
│   └── growth-model.md             # how we grow
├── agents/
│   ├── _template.md                # template for new agents
│   ├── global/                     # reusable across projects
│   │   ├── conversion-reviewer.md
│   │   ├── seo-reviewer.md
│   │   ├── ui-polish-reviewer.md
│   │   ├── copy-editor.md
│   │   ├── release-checker.md
│   │   └── distribution-strategist.md
│   └── project/                    # project-specific specialists
│       ├── skeptical-analyst.md         # Brickwise
│       └── methodology-guardian.md      # Brickwise
├── workflows/                      # composed agent sequences
│   ├── pre-ship.md
│   ├── content-publish.md
│   └── ui-change.md
└── portable/                       # starter packs for other projects
    ├── seoterrain/
    └── factuurdirect/
```

## How to invoke an agent

Use this exact pattern in chat:

```
Act as [agent name] from .agents/agents/<global|project>/<agent>.md.

Load context:
- .agents/context/positioning.md
- .agents/context/tone.md
- .agents/context/anti-patterns.md
- (any other relevant context file)

Task: <one specific task>
Inputs: <paste or reference>
```

Rules:
- One agent per task. Do not chain agents in a single prompt.
- Always load the context files the agent declares as pre-flight.
- The agent's `Forbidden actions` are hard limits, not suggestions.

## Workflow invocation

For multi-step jobs use a workflow:

```
Run workflow .agents/workflows/<name>.md for: <thing>
```

The workflow file lists the agents in order. Run them sequentially in separate turns so each stays focused and reviewable.

## When NOT to use agents

Don't invoke an agent for:
- One-line copy edits or trivial code changes
- Questions answerable by reading the codebase
- Brainstorming or open exploration (use `superpowers:brainstorm` skill instead)
- Anything where you already know what to do
- "Just make it better" tasks with no defined output

If you can't write a single concrete sentence describing what good looks like, you don't need an agent. You need to think more first.

## Safety rules (apply to every agent)

1. **Reviewers flag, do not edit.** Reviewer agents output findings + suggestions. They never write the fix themselves unless explicitly told to.
2. **No agent may modify `context/` files.** Positioning, tone, and anti-patterns are owner-owned.
3. **No agent ships.** `release-checker` surfaces blockers; humans push.
4. **No autonomous chaining.** If an agent suggests calling another agent, the human decides.
5. **No invented claims.** Numbers, customer names, testimonials, and case studies must trace to source files. If unsourced, the agent must flag and stop.
6. **No tone drift.** If a fix would conflict with `tone.md` or `anti-patterns.md`, the agent must report the conflict and stop.

## Replicating for SEO Terrain and FactuurDirect

1. Copy this entire `.agents/` directory into the target project.
2. Replace `context/*.md` files with the starter pack in `.agents/portable/<project>/`.
3. Keep `agents/global/` as-is (they read project context, so they auto-adapt).
4. Replace `agents/project/*.md` with the project's specialists (see `portable/<project>/agents/`).
5. Workflows stay identical.

The global agents stay the same across all three projects. Only the context files and the project-specific specialists differ. **That is the entire mechanism that prevents AI sameness.**

## Anti-overengineering guardrails

- Six global agents. Two-to-three project specialists per project. That is the ceiling. If you feel the urge to add a seventh global agent, write a workflow instead.
- Agent files should be under 100 lines. If yours grows longer, the agent is doing too much.
- Workflows should have three to five steps. More than that is a process problem, not an agent problem.
- If an agent has not been used in 60 days, delete it. Dead agents are noise.
