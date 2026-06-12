import { createLocalAiPricesResponse, type AiPricesResponse } from "~~/shared/aiPrices";

export function useAiPrices() {
  return useAsyncData<AiPricesResponse>("ai-prices", () => $fetch("/api/ai-prices"), {
    server: false,
    default: () => createLocalAiPricesResponse(),
  });
}
