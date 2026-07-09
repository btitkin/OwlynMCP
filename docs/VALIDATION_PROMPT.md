# Validation Prompt

Use this prompt in each real MCP host validation.

```txt
Use Owlyn MCP.

Start a work session until 06:00 Europe/Warsaw for this goal:
“Validate Owlyn MCP host integration.”

After starting, create a checkpoint saying the first host validation step is complete.

Then call owlyn_should_continue with:
current_task_done: true
has_next_tasks: true
requires_user_approval: false
risk_level: low

If Owlyn says should_continue is true, confirm that the returned recommendation includes:
“Do not stop only because the current task is complete.”

Then call owlyn_plan_next with these safe candidate tasks:
1. Review README host setup docs
2. Review AGENT_INSTRUCTIONS.md
3. Review RELEASE_CHECKLIST.md

Then call owlyn_end with a short final summary.

Report:
- whether all 8 Owlyn tools were visible
- whether structuredContent worked
- whether the session flow passed
- any errors
```
