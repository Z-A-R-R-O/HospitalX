import type {
  QuestionResponse,
  ScreeningResult,
  RiskLevel,
  CategoryScore,
  ContributingObservation,
  ScreeningCategory,
} from './types';
import { CATEGORY_LABELS, RISK_LABELS } from './types';
import { SCREENING_QUESTIONS, QUESTIONS_BY_CATEGORY, CATEGORY_ORDER } from './questions';

/**
 * Deterministic Neurological Screening Engine
 *
 * This engine produces explainable, deterministic results from health worker observations.
 * It is NOT a diagnostic tool — it identifies patterns warranting professional evaluation.
 *
 * Scoring thresholds:
 * - Total score ≥ 60% of max → specialist_referral_recommended
 * - Total score ≥ 35% of max → review_recommended
 * - Total score < 35% of max → low_concern
 *
 * Override rule: If ANY single category scores ≥ 75%, the minimum risk is elevated
 * to review_recommended (even if the total score is low).
 */

// ─── Threshold Constants ────────────────────────────────────────────
const REFERRAL_THRESHOLD = 0.60;
const REVIEW_THRESHOLD = 0.35;
const CATEGORY_CRITICAL_THRESHOLD = 0.75;

// ─── Main Scoring Function ─────────────────────────────────────────

export function calculateScreeningResult(
  responses: QuestionResponse[],
  startedAt: number,
  completedAt: number
): ScreeningResult {
  const totalScore = responses.reduce((sum, r) => sum + r.score, 0);
  const maxScore = responses.reduce((sum, r) => sum + r.maxScore, 0);
  const percentage = maxScore > 0 ? totalScore / maxScore : 0;

  // Calculate per-category scores
  const categoryScores = calculateCategoryScores(responses);

  // Check for critical categories (≥75% in any single category)
  const criticalCategories = categoryScores.filter((c) => c.isCritical);

  // Determine risk level
  let riskLevel: RiskLevel;
  if (percentage >= REFERRAL_THRESHOLD) {
    riskLevel = 'specialist_referral_recommended';
  } else if (percentage >= REVIEW_THRESHOLD) {
    riskLevel = 'review_recommended';
  } else {
    riskLevel = 'low_concern';
  }

  // Override: if any category is critical, minimum risk is review_recommended
  if (criticalCategories.length > 0 && riskLevel === 'low_concern') {
    riskLevel = 'review_recommended';
  }

  // Generate human-readable observations
  const contributingObservations = generateContributingObservations(responses);

  // Generate limitation statements
  const limitations = generateLimitations(responses);

  // Duration
  const completedInSeconds = Math.round((completedAt - startedAt) / 1000);

  return {
    riskLevel,
    totalScore,
    maxScore,
    percentage: Math.round(percentage * 100),
    categoryScores,
    contributingObservations,
    limitations,
    disclaimer:
      'This is a screening tool, not a medical diagnosis. Results should be reviewed by a qualified healthcare professional. This screening does not diagnose any specific condition.',
    confidenceStatement: generateConfidenceStatement(responses, categoryScores),
    recommendedAction: generateRecommendedAction(riskLevel, criticalCategories),
    completedInSeconds,
  };
}

// ─── Category Score Calculation ─────────────────────────────────────

function calculateCategoryScores(responses: QuestionResponse[]): CategoryScore[] {
  return CATEGORY_ORDER.map((category) => {
    const categoryResponses = responses.filter((r) => r.category === category);
    const score = categoryResponses.reduce((sum, r) => sum + r.score, 0);
    const maxScore = categoryResponses.reduce((sum, r) => sum + r.maxScore, 0);
    const percentage = maxScore > 0 ? score / maxScore : 0;

    return {
      category,
      label: CATEGORY_LABELS[category],
      score,
      maxScore,
      percentage: Math.round(percentage * 100),
      isCritical: percentage >= CATEGORY_CRITICAL_THRESHOLD,
    };
  });
}

// ─── Contributing Observations ──────────────────────────────────────

function generateContributingObservations(
  responses: QuestionResponse[]
): ContributingObservation[] {
  const observations: ContributingObservation[] = [];

  for (const response of responses) {
    if (response.score === 0) continue; // No concern, skip

    const question = SCREENING_QUESTIONS.find((q) => q.id === response.questionId);
    if (!question) continue;

    const severity: 'mild' | 'moderate' | 'significant' =
      response.score === 1 ? 'mild' : 'significant';

    const finding = generateFinding(question.category, question.id, response);

    observations.push({
      category: CATEGORY_LABELS[question.category],
      question: question.text,
      finding,
      severity,
    });
  }

  // Sort by severity (significant first)
  return observations.sort((a, b) => {
    const order = { significant: 0, moderate: 1, mild: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function generateFinding(
  category: ScreeningCategory,
  questionId: string,
  response: QuestionResponse
): string {
  // Map specific question results to human-readable findings
  const findingMap: Record<string, Record<number, string>> = {
    om_01: {
      1: 'Temporal orientation showed uncertainty about the current year',
      2: 'Unable to identify the current year, indicating significant disorientation',
    },
    om_02: {
      1: 'Partial difficulty identifying current location',
      2: 'Unable to identify current location, suggesting spatial disorientation',
    },
    om_03: {
      1: 'Short-term recall showed partial difficulty (1–2 of 3 words)',
      2: 'Short-term recall was significantly impaired (0 of 3 words)',
    },
    sl_01: {
      1: 'Speech showed occasional word-finding pauses or incomplete sentences',
      2: 'Speech was fragmented or very difficult to understand',
    },
    sl_02: {
      1: 'Verbal fluency was below expected range (5–9 animals in 30 seconds)',
      2: 'Verbal fluency was significantly reduced (fewer than 5 animals in 30 seconds)',
    },
    sl_03: {
      1: 'Voice was somewhat soft or monotone compared to normal',
      2: 'Voice was very soft or slurred, difficult to hear clearly',
    },
    mf_01: {
      1: 'Finger tapping was slower or more irregular than expected',
      2: 'Finger tapping was very slow with frequent stops, suggesting bradykinesia',
    },
    mf_02: {
      1: 'Some difficulty rising from chair without hand support',
      2: 'Significant difficulty standing, required support or multiple attempts',
    },
    mf_03: {
      1: 'Gait showed slight abnormality (small steps or reduced arm swing)',
      2: 'Gait was clearly abnormal (shuffling, freezing, or required support)',
    },
    tc_01: {
      1: 'Mild postural tremor observed with hands extended',
      2: 'Prominent postural tremor visible with hands extended',
    },
    tc_02: {
      1: 'Intermittent resting tremor observed in hands at rest',
      2: 'Persistent resting tremor observed, a key concern for specialist review',
    },
    tc_03: {
      1: 'Slight inaccuracy in finger-nose coordination test',
      2: 'Significant difficulty with finger-nose coordination, suggesting cerebellar involvement',
    },
    di_01: {
      1: 'Reports some difficulty with fine motor daily tasks',
      2: 'Reports needing assistance with daily activities',
    },
    di_02: {
      1: 'Symptoms have been present for 1–6 months',
      2: 'Symptoms have been present for more than 6 months, suggesting progressive course',
    },
    di_03: {
      1: 'Symptoms reported as slowly worsening over time',
      2: 'Symptoms clearly worsening, suggesting progressive neurological change',
    },
  };

  const questionFindings = findingMap[questionId];
  if (questionFindings && questionFindings[response.score]) {
    return questionFindings[response.score];
  }

  // Fallback
  return `${response.selectedOption} observed during ${CATEGORY_LABELS[category]} assessment`;
}

// ─── Limitations ────────────────────────────────────────────────────

function generateLimitations(responses: QuestionResponse[]): string[] {
  const limitations: string[] = [
    'This screening assesses a limited set of neurological indicators and cannot detect all conditions.',
    'Results may be influenced by factors such as fatigue, medication, pain, or recent illness.',
  ];

  const totalQuestions = SCREENING_QUESTIONS.length;
  const answeredQuestions = responses.length;

  if (answeredQuestions < totalQuestions) {
    limitations.push(
      `Only ${answeredQuestions} of ${totalQuestions} screening items were completed, which may affect accuracy.`
    );
  }

  // Check if any categories were completely skipped
  for (const category of CATEGORY_ORDER) {
    const categoryResponses = responses.filter((r) => r.category === category);
    if (categoryResponses.length === 0) {
      limitations.push(
        `The ${CATEGORY_LABELS[category]} category was not assessed.`
      );
    }
  }

  return limitations;
}

// ─── Confidence Statement ───────────────────────────────────────────

function generateConfidenceStatement(
  responses: QuestionResponse[],
  categoryScores: CategoryScore[]
): string {
  const totalQuestions = SCREENING_QUESTIONS.length;
  const answeredQuestions = responses.length;
  const categoriesAssessed = categoryScores.filter((c) => c.maxScore > 0).length;

  if (answeredQuestions === totalQuestions) {
    return `Based on ${answeredQuestions} observations across ${categoriesAssessed} categories. All screening items were completed.`;
  }

  return `Based on ${answeredQuestions} of ${totalQuestions} observations across ${categoriesAssessed} categories. Incomplete screening may affect accuracy.`;
}

// ─── Recommended Action ─────────────────────────────────────────────

function generateRecommendedAction(
  riskLevel: RiskLevel,
  criticalCategories: CategoryScore[]
): string {
  switch (riskLevel) {
    case 'specialist_referral_recommended':
      return 'Refer to a neurologist or geriatric specialist for comprehensive evaluation. Multiple areas of concern were identified that warrant professional assessment.';

    case 'review_recommended': {
      if (criticalCategories.length > 0) {
        const categoryNames = criticalCategories
          .map((c) => c.label)
          .join(' and ');
        return `Schedule a follow-up review with a physician. Elevated concern in ${categoryNames} warrants closer monitoring and possible specialist consultation.`;
      }
      return 'Schedule a follow-up review with a physician within the next 2–4 weeks. Monitor for any worsening of symptoms.';
    }

    case 'low_concern':
      return 'No immediate specialist referral indicated. Continue routine health monitoring. Re-screen in 6–12 months or sooner if symptoms change.';

    default:
      return 'Discuss results with a healthcare provider for guidance on next steps.';
  }
}
