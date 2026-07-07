import { z } from "zod";

export const workModeSchema = z.enum(["focused", "night_shift", "marathon"]);
export const sessionStatusSchema = z.enum(["active", "completed", "abandoned"]);
export const confidenceSchema = z.enum(["low", "medium", "high"]);
export const riskLevelSchema = z.enum(["low", "medium", "high"]);
export const impactSchema = z.enum(["low", "medium", "high"]);

export const startInputSchema = z.object({
  goal: z.string().trim().min(1),
  deadline: z.string().trim().min(1),
  timezone: z.string().trim().min(1).optional(),
  mode: workModeSchema.optional(),
  max_work_minutes: z.number().int().positive().optional(),
  notes: z.string().trim().optional(),
  force_new: z.boolean().optional(),
});

export const statusInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
});

export const checkpointInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1),
  completed_tasks: z.array(z.string().trim().min(1)),
  next_tasks: z.array(z.string().trim().min(1)),
  blockers: z.array(z.string().trim().min(1)).optional(),
  files_changed: z.array(z.string().trim().min(1)).optional(),
  validation_results: z.array(z.string().trim().min(1)).optional(),
  confidence: confidenceSchema,
  risk_level: riskLevelSchema.optional(),
});

export const shouldContinueInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
  current_task_done: z.boolean(),
  has_next_tasks: z.boolean(),
  requires_user_approval: z.boolean().optional(),
  risk_level: riskLevelSchema,
  destructive_action_pending: z.boolean().optional(),
  validation_passed: z.boolean().optional(),
  notes: z.string().trim().optional(),
});

export const candidateTaskSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  impact: impactSchema,
  risk: riskLevelSchema,
  estimated_minutes: z.number().int().positive().optional(),
  requires_user_approval: z.boolean().optional(),
  category: z.string().trim().optional(),
});

export const planNextInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
  candidate_tasks: z.array(candidateTaskSchema).min(1),
});

export const endInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
  final_summary: z.string().trim().min(1),
  remaining_tasks: z.array(z.string().trim().min(1)).optional(),
  validation_results: z.array(z.string().trim().min(1)).optional(),
  status: z.enum(["completed", "abandoned"]).optional(),
});

export const listSessionsInputSchema = z.object({
  status: z.enum(["active", "completed", "abandoned", "all"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export const reportInputSchema = z.object({
  session_id: z.string().trim().min(1).optional(),
});

export type StartInput = z.infer<typeof startInputSchema>;
export type StatusInput = z.infer<typeof statusInputSchema>;
export type CheckpointInput = z.infer<typeof checkpointInputSchema>;
export type ShouldContinueInput = z.infer<typeof shouldContinueInputSchema>;
export type PlanNextInput = z.infer<typeof planNextInputSchema>;
export type EndInput = z.infer<typeof endInputSchema>;
export type ListSessionsInput = z.infer<typeof listSessionsInputSchema>;
export type ReportInput = z.infer<typeof reportInputSchema>;
