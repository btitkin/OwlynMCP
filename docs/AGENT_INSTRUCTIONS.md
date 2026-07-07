# Agent Instructions

Copy this block into a coding agent when Owlyn MCP is available:

```txt
At the beginning of work, call owlyn_start with the user goal and deadline.

After meaningful progress, call owlyn_checkpoint.

Then call owlyn_should_continue.

If should_continue is true, do not stop only because the current task is complete.

If multiple safe next tasks exist, call owlyn_plan_next.

Before final response, call owlyn_end.

Never continue destructive, irreversible, external, expensive, deployment, credential, or approval-requiring work without explicit user approval.
```
