import {
  AI_PRICE_CACHE_TTL_SECONDS,
  createLocalAiPricesResponse,
  fallbackAiModels,
  type AiModelPrice,
  type AiPricesResponse,
} from "~~/shared/aiPrices";

interface OpenRouterModel {
  id: string;
  name?: string;
  pricing?: {
    prompt?: string;
    completion?: string;
    input_cache_read?: string;
  };
}

interface OpenRouterModelsResponse {
  data?: OpenRouterModel[];
}

let cachedPrices: AiPricesResponse | null = null;
let cachedAt = 0;

function pricePerMillion(value?: string): number | null {
  if (!value) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return Math.round(parsed * 1_000_000 * 1_000_000) / 1_000_000;
}

function findOpenRouterModel(models: OpenRouterModel[], localModel: AiModelPrice): OpenRouterModel | undefined {
  const searchTerms = [localModel.id, localModel.name, ...(localModel.aliases || [])].map((term) => term.toLowerCase());

  return models.find((model) => {
    const haystack = `${model.id} ${model.name || ""}`.toLowerCase();
    return searchTerms.some((term) => haystack.includes(term));
  });
}

function priceChangePercent(livePrice: number | null, localPrice: number): number | undefined {
  if (livePrice === null || localPrice <= 0) return undefined;

  const change = ((livePrice - localPrice) / localPrice) * 100;
  return Math.round(change * 10) / 10;
}

async function loadOpenRouterPrices(): Promise<AiPricesResponse> {
  const response = await $fetch<OpenRouterModelsResponse>("https://openrouter.ai/api/v1/models", {
    headers: {
      "HTTP-Referer": "https://rocketseven.ru",
      "X-Title": "Rocket7 AI Price Calculator",
    },
    timeout: 8000,
  });

  const remoteModels = response.data || [];

  const models = fallbackAiModels.map((localModel) => {
    const remoteModel = findOpenRouterModel(remoteModels, localModel);
    const input = pricePerMillion(remoteModel?.pricing?.prompt);
    const output = pricePerMillion(remoteModel?.pricing?.completion);
    const cachedInput = pricePerMillion(remoteModel?.pricing?.input_cache_read);

    return {
      ...localModel,
      input: input ?? localModel.input,
      output: output ?? localModel.output,
      cachedInput: cachedInput ?? localModel.cachedInput,
      inputChangePercent: priceChangePercent(input, localModel.input),
      outputChangePercent: priceChangePercent(output, localModel.output),
      hasLivePrice: Boolean(input || output),
    };
  });

  return {
    meta: {
      source: "openrouter",
      sourceLabel: "OpenRouter",
      fetchedAt: new Date().toISOString(),
      cacheTtlSeconds: AI_PRICE_CACHE_TTL_SECONDS,
      isFallback: false,
    },
    models,
  };
}

export default defineEventHandler(async () => {
  const now = Date.now();
  const ttlMs = AI_PRICE_CACHE_TTL_SECONDS * 1000;

  if (cachedPrices && now - cachedAt < ttlMs) {
    return cachedPrices;
  }

  try {
    cachedPrices = await loadOpenRouterPrices();
  } catch {
    cachedPrices = createLocalAiPricesResponse();
  }

  cachedAt = now;
  return cachedPrices;
});
