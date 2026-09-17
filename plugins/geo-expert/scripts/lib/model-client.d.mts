export const EXTRACTION_PROMPT: string;
export function modelHash(value: unknown): string;
export function loadModelEnvironment(file?: string): Promise<{ loaded: boolean }>;
export function resolveModelConfig(options?: { provider?: string, model?: string }): { provider: string, model: string, apiKey: string, url: string };
export function chatJSON(options: { system: string, input: unknown, provider?: string, model?: string, auditDir?: string, timeoutMs?: number, maxTokens?: number }): Promise<{ output: Record<string, unknown>, audit: Record<string, unknown> }>;
export function validateExtractionOutput(output: unknown, input: unknown): Record<string, unknown>;
export function extractAnswer(input: unknown, options?: { provider?: string, model?: string, auditDir?: string }): Promise<{ output: Record<string, unknown>, audit: Record<string, unknown> }>;
