export const modes = ["focused", "night_shift", "marathon"] as const;
export type WorkMode = (typeof modes)[number];

export const sessionStatuses = ["active", "completed", "abandoned"] as const;
export type SessionStatus = (typeof sessionStatuses)[number];

export const confidenceLevels = ["low", "medium", "high"] as const;
export type Confidence = (typeof confidenceLevels)[number];

export const riskLevels = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof riskLevels)[number];

export const impactLevels = ["low", "medium", "high"] as const;
export type Impact = (typeof impactLevels)[number];

export type Session = {
  id: string;
  goal: string;
  mode: WorkMode;
  timezone: string;
  startedAt: string;
  deadlineAt: string;
  status: SessionStatus;
  maxWorkMinutes: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  finalSummary: string | null;
};

export type Checkpoint = {
  id: string;
  sessionId: string;
  createdAt: string;
  summary: string;
  completedTasks: string[];
  nextTasks: string[];
  blockers: string[];
  filesChanged: string[];
  validationResults: string[];
  confidence: Confidence;
  riskLevel: RiskLevel | null;
};

export type ContinuationDecisionRecord = {
  id: string;
  sessionId: string;
  createdAt: string;
  shouldContinue: boolean;
  reason: string;
  recommendedAction: string;
  policy: Record<string, unknown>;
};

export type CandidateTask = {
  title: string;
  description?: string;
  impact: Impact;
  risk: RiskLevel;
  estimated_minutes?: number;
  requires_user_approval?: boolean;
  category?: string;
};

export type RankedTask = CandidateTask & {
  score: number;
  reason: string;
};

export type RejectedTask = {
  title: string;
  reason: string;
};
