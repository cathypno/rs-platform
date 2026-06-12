<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  createLocalAiPricesResponse,
  fallbackAiModels,
  type AiModelPrice,
} from "~~/shared/aiPrices";

const localPrices = createLocalAiPricesResponse();

const { data: pricesData } = useAiPrices();

const selectedModelId = ref(fallbackAiModels[0].id);
const wordCount = ref(1000);
const language = ref("ru");
const useCaching = ref(false);
const outputRatio = ref(1);
const engineeringMinutes = ref(0);
const hourlyRate = ref(50);

const models = computed(() => pricesData.value?.models?.length ? pricesData.value.models : fallbackAiModels);

const groupedModels = computed(() => {
  return models.value.reduce<Record<string, AiModelPrice[]>>((groups, model) => {
    groups[model.provider] ||= [];
    groups[model.provider].push(model);
    return groups;
  }, {});
});

const selectedModel = computed(() => {
  return models.value.find((model) => model.id === selectedModelId.value) || models.value[0] || fallbackAiModels[0];
});

watch(models, (nextModels) => {
  if (!nextModels.some((model) => model.id === selectedModelId.value)) {
    selectedModelId.value = nextModels[0]?.id || fallbackAiModels[0].id;
  }
});

function toPositiveNumber(value: number, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function normalizeInputs() {
  wordCount.value = Math.round(toPositiveNumber(wordCount.value));
  outputRatio.value = Math.min(10, toPositiveNumber(outputRatio.value, 1));
  engineeringMinutes.value = Math.round(toPositiveNumber(engineeringMinutes.value));
  hourlyRate.value = toPositiveNumber(hourlyRate.value);
}

function formatMoney(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "0.00";
  if (value > 0 && value < 0.01) return value.toFixed(6);
  return value.toFixed(digits);
}

function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
}

const safeWordCount = computed(() => toPositiveNumber(wordCount.value));
const safeEngineeringMinutes = computed(() => toPositiveNumber(engineeringMinutes.value));
const safeHourlyRate = computed(() => toPositiveNumber(hourlyRate.value));
const safeOutputRatio = computed(() => Math.min(10, toPositiveNumber(outputRatio.value, 1)));

const tokensPerWord = computed(() => (language.value === "ru" ? 2 : 1.33));
const inputTokens = computed(() => safeWordCount.value * tokensPerWord.value);
const outputTokens = computed(() => inputTokens.value * safeOutputRatio.value);

const cost = computed(() => {
  const model = selectedModel.value;
  const cachedInputPrice = model.cachedInput ?? model.input * (1 - (model.cacheDiscount || 0));
  const inputPrice = useCaching.value && model.cacheDiscount ? cachedInputPrice : model.input;

  const inputCost = (inputTokens.value / 1_000_000) * inputPrice;
  const outputCost = (outputTokens.value / 1_000_000) * model.output;
  const totalAICost = Math.max(0, inputCost + outputCost);
  const manualCost = (safeEngineeringMinutes.value / 60) * safeHourlyRate.value;
  const totalCost = totalAICost + manualCost;

  return {
    aiRaw: totalAICost,
    manualRaw: manualCost,
    totalRaw: totalCost,
    ai: formatMoney(totalAICost, 6),
    manual: formatMoney(manualCost),
    total: formatMoney(totalCost),
  };
});

const compareFreelance = computed(() => {
  if (safeWordCount.value < 100) return 10;
  if (safeWordCount.value < 500) return 50;
  return (safeWordCount.value / 1000) * 150;
});

const efficiency = computed(() => {
  const base = cost.value.totalRaw > 0 ? cost.value.totalRaw : 0.01;
  return formatNumber(compareFreelance.value / base);
});
</script>

<template>
  <div class="w-full rounded-lg border border-black/10 bg-white/80 p-4 shadow-[0_12px_36px_rgba(18,20,23,0.05)]">
    <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-lg font-black tracking-tight text-[#121417]">Калькулятор стоимости</h2>
        <p class="mt-0.5 max-w-2xl text-xs font-medium text-black/45">
          Input, output, кэш и ручная работа в одном расчёте
        </p>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs font-black text-black/45 sm:flex">
        <span class="rounded-lg bg-blue-50 px-2.5 py-1 text-blue-700">{{ formatNumber(inputTokens) }} input</span>
        <span class="rounded-lg bg-black/[0.04] px-2.5 py-1">{{ formatNumber(outputTokens) }} output</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr_0.9fr]">
      <section class="rounded-lg border border-black/10 bg-white p-3">
        <p class="mb-3 text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Параметры запроса</p>
        <div class="space-y-3">
          <div>
            <label class="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Модель ИИ</label>
            <select
              v-model="selectedModelId"
              class="h-9 w-full rounded-lg border border-black/10 bg-white px-3 pr-9 text-sm font-bold text-[#121417] outline-none transition focus:border-blue-300"
            >
              <optgroup v-for="(providerModels, provider) in groupedModels" :key="provider" :label="provider">
                <option v-for="model in providerModels" :key="model.id" :value="model.id">
                  {{ model.name }}
                </option>
              </optgroup>
            </select>
          </div>

          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Кол-во слов</label>
              <input
                v-model.number="wordCount"
                type="number"
                min="0"
                inputmode="numeric"
                class="h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-[#121417] outline-none transition focus:border-blue-300"
                @blur="normalizeInputs"
              />
            </div>

            <div>
              <label class="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Язык контента</label>
              <select
                v-model="language"
                class="h-9 w-full rounded-lg border border-black/10 bg-white px-3 pr-9 text-sm font-bold text-[#121417] outline-none transition focus:border-blue-300"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Ответ модели</label>
            <div class="rounded-lg border border-black/10 bg-white px-3 py-2.5">
              <div class="flex items-center justify-between gap-4">
                <span class="text-sm font-bold text-[#121417]">Output x{{ safeOutputRatio.toFixed(1) }}</span>
                <span class="text-xs font-bold text-black/35">{{ formatNumber(outputTokens) }} токенов</span>
              </div>
              <input
                v-model.number="outputRatio"
                type="range"
                min="0"
                max="3"
                step="0.1"
                class="mt-3 w-full accent-blue-600"
                @blur="normalizeInputs"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-lg border border-black/10 bg-white p-3">
        <p class="mb-3 text-[11px] font-black uppercase tracking-[0.12em] text-black/40">Оптимизация и труд</p>
        <div class="space-y-3">
          <label
            class="flex cursor-pointer items-center gap-3 rounded-lg border border-black/10 bg-white px-3 py-2.5 transition hover:border-blue-200 hover:bg-blue-50/40"
          >
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition"
              :class="useCaching ? 'border-blue-600 bg-blue-600 text-white' : 'border-black/15 text-transparent'"
            >
              <input v-model="useCaching" type="checkbox" class="absolute h-5 w-5 cursor-pointer opacity-0" />
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>
              <span class="block text-sm font-black text-[#121417]">Кэширование input</span>
              <span class="block text-xs font-semibold leading-relaxed text-black/40">
                Приближённая экономия на повторном контексте
              </span>
            </span>
          </label>

          <div class="rounded-lg border border-black/10 bg-black/[0.02] p-3">
            <label class="mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-black/40">
              Инженерные трудозатраты
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/30">Минуты</span>
                <input
                  v-model.number="engineeringMinutes"
                  type="number"
                  min="0"
                  class="w-full bg-transparent text-lg font-black text-[#121417] outline-none"
                  @blur="normalizeInputs"
                />
              </div>
              <div class="border-l border-black/10 pl-4">
                <span class="mb-1 block text-[10px] font-black uppercase tracking-wider text-black/30">$/час</span>
                <input
                  v-model.number="hourlyRate"
                  type="number"
                  min="0"
                  class="w-full bg-transparent text-lg font-black text-[#121417] outline-none"
                  @blur="normalizeInputs"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-black/[0.03] px-3 py-2">
              <span class="block text-[10px] font-black uppercase tracking-wider text-black/30">AI</span>
              <span class="mt-1 block truncate text-lg font-black tabular-nums text-blue-600">${{ formatMoney(cost.aiRaw) }}</span>
            </div>
            <div class="rounded-lg bg-black/[0.03] px-3 py-2">
              <span class="block text-[10px] font-black uppercase tracking-wider text-black/30">Труд</span>
              <span class="mt-1 block truncate text-lg font-black tabular-nums text-[#121417]">${{ cost.manual }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-4">
        <div>
          <p class="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700/70">Итоговая стоимость</p>
          <p class="mt-2 break-words text-4xl font-black tabular-nums tracking-tight text-[#121417] md:text-5xl">
            ${{ cost.total }}
          </p>
          <p class="mt-3 text-sm font-semibold leading-relaxed text-black/45">
            Для такого объёма ручная подготовка обычно стоит около ${{ formatMoney(compareFreelance) }}.
          </p>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 border-t border-black/10 pt-4">
          <div>
            <span class="block text-[10px] font-black uppercase tracking-wider text-black/35">Расчёт AI</span>
            <span class="mt-1 block truncate text-lg font-black tabular-nums text-blue-600">${{ formatMoney(cost.aiRaw) }}</span>
          </div>
          <div class="text-right">
            <span class="block text-[10px] font-black uppercase tracking-wider text-black/35">Разница</span>
            <span class="mt-1 block text-lg font-black tabular-nums text-[#121417]">{{ efficiency }}x</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
