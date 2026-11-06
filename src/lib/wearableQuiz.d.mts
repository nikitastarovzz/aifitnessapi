/** Types for src/lib/wearableQuiz.mjs. */
export type QuestionId = "platform" | "devices" | "data" | "server" | "budget" | "compliance" | "team" | "timeline";
export type QuizQuestion = { id: QuestionId; label: string; options: [string, string][] };
export type QuizAnswers = Record<QuestionId, string>;
export type Outcome =
  | "healthkit"
  | "health-connect"
  | "healthkit-and-health-connect"
  | "direct-wearable-apis"
  | "aggregator"
  | "bluetooth-direct"
  | "research-platform"
  | "camera-motion";
export type Approach = "store" | "direct" | "aggregator";
export type Decision = {
  outcome: Outcome;
  rule: "camera" | "study" | "sensors" | "score";
  scores: Record<Approach, number>;
  runnerUp: Outcome | null;
  reasons: string[];
};

export const QUIZ_PATH: string;
export const QUESTIONS: QuizQuestion[];
export const OUTCOMES: Outcome[];
export const APPROACHES: Approach[];
export const SCORES: Record<string, Record<string, [Approach, number, string][]>>;
export function isComplete(answers: Partial<QuizAnswers> | null | undefined): answers is QuizAnswers;
export function storeFor(platform: string, devices: string): Outcome;
export function decide(answers: QuizAnswers): Decision;
export function encodeAnswers(answers: Partial<QuizAnswers>): string;
export function decodeAnswers(search: string | null | undefined): QuizAnswers | null;
export function allAnswerSets(): Generator<QuizAnswers>;
