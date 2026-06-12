export interface AiModelPrice {
  id: string;
  name: string;
  provider: string;
  category: string;
  input: number;
  output: number;
  cachedInput?: number;
  cacheDiscount?: number;
  note: string;
  featured?: boolean;
  aliases?: string[];
  inputChangePercent?: number;
  outputChangePercent?: number;
  hasLivePrice?: boolean;
}

export interface AiPricesMeta {
  source: "openrouter" | "local";
  sourceLabel: string;
  fetchedAt: string;
  cacheTtlSeconds: number;
  isFallback: boolean;
}

export interface AiPricesResponse {
  meta: AiPricesMeta;
  models: AiModelPrice[];
}

export const AI_PRICE_CACHE_TTL_SECONDS = 60 * 60 * 6;

export const fallbackAiModels: AiModelPrice[] = [
  { id: "openai/gpt-5.5", name: "GPT-5.5", provider: "OpenAI", category: "OpenAI (GPT-5.x)", input: 5, output: 30, cachedInput: 0.5, cacheDiscount: 0.9, note: "Флагман", featured: true, aliases: ["gpt-5.5"] },
  { id: "openai/gpt-5.4", name: "GPT-5.4", provider: "OpenAI", category: "OpenAI (GPT-5.x)", input: 2.5, output: 15, cachedInput: 0.25, cacheDiscount: 0.9, note: "Баланс цены/качества", aliases: ["gpt-5.4"] },
  { id: "openai/gpt-5.4-mini", name: "GPT-5.4 mini", provider: "OpenAI", category: "OpenAI (GPT-5.x)", input: 0.75, output: 4.5, cachedInput: 0.075, cacheDiscount: 0.9, note: "Для большинства задач", aliases: ["gpt-5.4-mini", "gpt-5.4 mini"] },
  { id: "openai/gpt-5.4-nano", name: "GPT-5.4 nano", provider: "OpenAI", category: "OpenAI (GPT-5.x)", input: 0.2, output: 1.25, cachedInput: 0.02, cacheDiscount: 0.9, note: "Ультра-бюджетный", aliases: ["gpt-5.4-nano", "gpt-5.4 nano"] },
  { id: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic", category: "Anthropic (Claude 4.x)", input: 5, output: 25, cachedInput: 0.5, cacheDiscount: 0.9, note: "Топ для анализа", aliases: ["claude-opus-4.6"] },
  { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic", category: "Anthropic (Claude 4.x)", input: 3, output: 15, cachedInput: 0.3, cacheDiscount: 0.9, note: "Самый популярный", aliases: ["claude-sonnet-4.6"] },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", category: "Anthropic (Claude 4.x)", input: 1, output: 5, cachedInput: 0.1, cacheDiscount: 0.9, note: "Быстрый и лёгкий", aliases: ["claude-haiku-4.5"] },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek", category: "Китайские (лидеры выгоды)", input: 0.435, output: 0.87, note: "Абсолютный лидер", aliases: ["deepseek-v4-pro", "deepseek v4 pro"] },
  { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "DeepSeek", category: "Китайские (лидеры выгоды)", input: 0.14, output: 0.28, cachedInput: 0.007, cacheDiscount: 0.95, note: "Почти бесплатно", aliases: ["deepseek-v4-flash", "deepseek v4 flash"] },
  { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6", provider: "Moonshot AI", category: "Китайские (лидеры выгоды)", input: 0.65, output: 2.85, cachedInput: 0.13, cacheDiscount: 0.8, note: "Длинный контекст", aliases: ["kimi-k2.6", "kimi k2.6"] },
  { id: "zhipu/glm-5", name: "GLM-5", provider: "Zhipu AI", category: "Китайские (лидеры выгоды)", input: 1.2, output: 3.8, cachedInput: 0.3, cacheDiscount: 0.75, note: "Силен в коде", aliases: ["glm-5"] },
  { id: "x-ai/grok-4.3", name: "Grok-4.3", provider: "xAI", category: "Остальные", input: 1.25, output: 2.5, note: "Конкурент GPT-5", aliases: ["grok-4.3"] },
  { id: "x-ai/grok-4.1-fast", name: "Grok 4.1 Fast", provider: "xAI", category: "Остальные", input: 0.2, output: 0.5, note: "Быстрый режим", aliases: ["grok-4.1-fast", "grok 4.1 fast"] },
  { id: "google/gemini-3.1-pro", name: "Gemini 3.1 Pro", provider: "Google", category: "Остальные", input: 2, output: 12, note: "Глубокий анализ", aliases: ["gemini-3.1-pro", "gemini 3.1 pro"] },
  { id: "google/gemini-3-flash", name: "Gemini 3 Flash", provider: "Google", category: "Остальные", input: 0.5, output: 3, note: "От Google", aliases: ["gemini-3-flash", "gemini 3 flash"] },
  { id: "google/gemini-3.1-flash-lite", name: "Gemini 3.1 Flash-Lite", provider: "Google", category: "Остальные", input: 0.25, output: 1.5, note: "Экономный режим", aliases: ["gemini-3.1-flash-lite", "gemini 3.1 flash-lite"] },
];

export function createLocalAiPricesResponse(): AiPricesResponse {
  return {
    meta: {
      source: "local",
      sourceLabel: "локальная таблица",
      fetchedAt: new Date().toISOString(),
      cacheTtlSeconds: AI_PRICE_CACHE_TTL_SECONDS,
      isFallback: true,
    },
    models: fallbackAiModels,
  };
}
