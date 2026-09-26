// Screening question and result types

export type ScreeningCategory =
  | 'orientation_memory'
  | 'speech_language'
  | 'motor_function'
  | 'tremor_coordination'
  | 'daily_impact';

export const CATEGORY_LABELS: Record<ScreeningCategory, string> = {
  orientation_memory: 'Orientation & Memory',
  speech_language: 'Speech & Language',
  motor_function: 'Motor Function',
  tremor_coordination: 'Tremor & Coordination',
  daily_impact: 'Daily Impact',
};

export const CATEGORY_ICONS: Record<ScreeningCategory, string> = {
  orientation_memory: '🧠',
  speech_language: '🗣️',
  motor_function: '🤚',
  tremor_coordination: '🎯',
  daily_impact: '📋',
};

export type QuestionType = 'choice' | 'observation' | 'timed' | 'voice';

export interface ScreeningQuestion {
  id: string;
  category: ScreeningCategory;
  type: QuestionType;
  text: string;
  instruction: string;          // What the health worker should do/observe
  hindiText?: string;           // Hindi translation (Phase 5)
  hindiInstruction?: string;
  options: ScoringOption[];
  maxScore: number;             // Always 2 for consistency
  timeLimit?: number;           // Seconds, for timed tasks
}

export interface ScoringOption {
  score: number;  // 0, 1, or 2
  label: string;
  description: string;
}

export type RiskLevel = 'low_concern' | 'review_recommended' | 'specialist_referral_recommended';

export const RISK_LABELS: Record<RiskLevel, string> = {
  low_concern: 'Low Concern',
  review_recommended: 'Review Recommended',
  specialist_referral_recommended: 'Specialist Referral Recommended',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low_concern: '#0a9c6d',
  review_recommended: '#ef9519',
  specialist_referral_recommended: '#ef4148',
};

export interface QuestionResponse {
  questionId: string;
  category: ScreeningCategory;
  score: number;
  maxScore: number;
  selectedOption: string;       // label of selected option
  observation?: string;         // Optional worker note
  answeredAt: number;           // timestamp
}

export interface CategoryScore {
  category: ScreeningCategory;
  label: string;
  score: number;
  maxScore: number;
  percentage: number;
  isCritical: boolean;          // true if >= 75%
}

export interface ContributingObservation {
  category: string;
  question: string;
  finding: string;
  severity: 'mild' | 'moderate' | 'significant';
}

export interface ScreeningResult {
  riskLevel: RiskLevel;
  totalScore: number;
  maxScore: number;
  percentage: number;
  categoryScores: CategoryScore[];
  contributingObservations: ContributingObservation[];
  limitations: string[];
  disclaimer: string;
  confidenceStatement: string;
  recommendedAction: string;
  completedInSeconds: number;
}
