/** Guardrails that keep AI generation from silently burning credits. */
export const GENERATION_LIMITS = {
  /** AI (non-draft) generations allowed per rolling day, app-wide. */
  perDay: 40,
  /** AI generations allowed per browser session. */
  perSession: 6,
} as const;

/** Rough per-1M-token credit estimate for the default generation model. */
export const CREDIT_RATE = {
  inputPerMillion: 0.15,
  outputPerMillion: 0.6,
} as const;

export const estimateCredits = (inputTokens: number, outputTokens: number) =>
  Number(
    (
      (inputTokens / 1_000_000) * CREDIT_RATE.inputPerMillion +
      (outputTokens / 1_000_000) * CREDIT_RATE.outputPerMillion
    ).toFixed(4),
  );
