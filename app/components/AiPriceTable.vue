<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  createLocalAiPricesResponse,
  fallbackAiModels,
  type AiModelPrice,
} from "~~/shared/aiPrices";

const localPrices = createLocalAiPricesResponse();

const { data: pricesData, pending } = useAiPrices();

const models = computed(() => pricesData.value?.models?.length ? pricesData.value.models : fallbackAiModels);
const meta = computed(() => pricesData.value?.meta || localPrices.meta);

const categories = computed(() => {
  const groups = models.value.reduce<Record<string, AiModelPrice[]>>((acc, model) => {
    acc[model.category] ||= [];
    acc[model.category].push(model);
    return acc;
  }, {});

  return Object.entries(groups).map(([title, categoryModels]) => {
    const minInput = categoryModels.reduce((best, model) => model.input < best.input ? model : best, categoryModels[0]);
    const minOutput = categoryModels.reduce((best, model) => model.output < best.output ? model : best, categoryModels[0]);
    const topModel = categoryModels.find((model) => model.featured) || categoryModels[0];

    return {
      title,
      models: categoryModels,
      minInput,
      minOutput,
      topModel,
      hasFeatured: categoryModels.some((model) => model.featured),
    };
  });
});

const openCategories = ref<string[]>([]);

const featuredModel = computed(() => models.value.find((model) => model.featured) || models.value[0]);
const cheapestInputModel = computed(() => {
  return models.value.reduce((best, model) => model.input < best.input ? model : best, models.value[0]);
});
const cheapestOutputModel = computed(() => {
  return models.value.reduce((best, model) => model.output < best.output ? model : best, models.value[0]);
});
const analysisModel = computed(() => {
  return models.value.reduce((best, model) => model.output > best.output ? model : best, models.value[0]);
});

const recommendationCards = computed(() => [
  {
    label: "Выбор Rocket7",
    model: featuredModel.value,
    caption: "ориентир для большинства рабочих задач",
    tone: "blue",
  },
  {
    label: "Дешёвый input",
    model: cheapestInputModel.value,
    caption: "когда важен большой входной контекст",
    tone: "green",
  },
  {
    label: "Дешёвый output",
    model: cheapestOutputModel.value,
    caption: "когда модель много отвечает",
    tone: "emerald",
  },
  {
    label: "Сложный анализ",
    model: analysisModel.value,
    caption: "дороже, но полезно для глубоких задач",
    tone: "dark",
  },
]);

function formatPrice(value: number): string {
  if (value > 0 && value < 0.01) return `$${value.toFixed(6)}`;
  if (value < 1) {
    const precise = value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
    const [whole, decimal = ""] = precise.split(".");
    return `$${whole}.${decimal.padEnd(2, "0")}`;
  }
  return `$${value.toFixed(2)}`;
}

function priceChangeView(change = 0) {
  const isUp = change > 0;

  return {
    label: `${isUp ? "↑" : "↓"} ${Math.abs(change).toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`,
    title: `${isUp ? "Дороже" : "Дешевле"} локальной базовой цены`,
    class: isUp ? "bg-red-500/10 text-red-600" : "bg-green-500/10 text-green-600",
  };
}

function hasPriceChange(change?: number): boolean {
  return change !== undefined && Math.abs(change) >= 0.1;
}

function isSameModel(a?: AiModelPrice, b?: AiModelPrice): boolean {
  return Boolean(a && b && a.id === b.id);
}

function modelBadges(model: AiModelPrice): string[] {
  const badges: string[] = [];
  if (model.featured) badges.push("Rocket7");
  if (isSameModel(model, cheapestInputModel.value)) badges.push("Дешёвый вход");
  if (isSameModel(model, cheapestOutputModel.value)) badges.push("Дешёвый выход");
  if (model.featured) badges.push("Top");
  return badges;
}

function badgeClass(label: string): string {
  if (label === "Rocket7") return "bg-blue-600 text-white";
  if (label.includes("Дешёвый")) return "bg-green-500/10 text-green-700";
  return "bg-blue-600/10 text-blue-600";
}

function isCategoryOpen(title: string): boolean {
  return openCategories.value.includes(title);
}

function toggleCategory(title: string) {
  openCategories.value = isCategoryOpen(title)
    ? openCategories.value.filter((item) => item !== title)
    : [...openCategories.value, title];
}

watch(
  categories,
  (nextCategories) => {
    if (!nextCategories.length || openCategories.value.length) return;
    const defaults = new Set<string>();
    defaults.add(nextCategories[0].title);
    const featuredCategory = nextCategories.find((category) => category.hasFeatured);
    if (featuredCategory) defaults.add(featuredCategory.title);
    openCategories.value = Array.from(defaults);
  },
  { immediate: true },
);

const updatedLabel = computed(() => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(meta.value.fetchedAt));
});
</script>

<template>
  <div class="w-full rounded-lg border border-black/10 bg-white/80 p-4 shadow-[0_12px_36px_rgba(18,20,23,0.05)]">
    <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-lg font-black tracking-tight text-[#121417]">Цены моделей</h2>
        <p class="mt-0.5 max-w-2xl text-xs font-medium text-black/45">
          Стоимость за 1 млн токенов. Категории раскрываются по клику.
        </p>
      </div>
      <div
        class="inline-flex w-fit items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-black"
        :class="meta.isFallback ? 'border-black/10 bg-black/[0.02] text-black/35' : 'border-blue-200 bg-blue-50 text-blue-700'"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="meta.isFallback ? 'bg-black/20' : 'bg-green-500'" />
        <span>{{ pending ? "обновляем" : updatedLabel }}</span>
      </div>
    </div>

    <section class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in recommendationCards"
        :key="card.label"
        class="rounded-lg border border-black/10 bg-white p-3 transition hover:border-blue-200"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">{{ card.label }}</p>
            <h3 class="mt-1 truncate text-base font-black tracking-tight text-[#121417]">{{ card.model?.name }}</h3>
            <p class="mt-0.5 truncate text-xs font-semibold text-black/45">{{ card.caption }}</p>
          </div>
          <span class="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">
            {{ card.model?.provider }}
          </span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <div class="rounded-lg bg-black/[0.03] px-2.5 py-2">
            <span class="block text-[9px] font-black uppercase tracking-wider text-black/30">Input</span>
            <span class="mt-1 block truncate font-['JetBrains_Mono'] text-sm font-black text-blue-600">
              {{ formatPrice(card.model?.input || 0) }}
            </span>
          </div>
          <div class="rounded-lg bg-black/[0.03] px-2.5 py-2">
            <span class="block text-[9px] font-black uppercase tracking-wider text-black/30">Output</span>
            <span class="mt-1 block truncate font-['JetBrains_Mono'] text-sm font-black text-red-600">
              {{ formatPrice(card.model?.output || 0) }}
            </span>
          </div>
        </div>
      </article>
    </section>

    <div class="mt-4 divide-y divide-black/10 rounded-lg border border-black/10 bg-white">
      <section v-for="category in categories" :key="category.title">
        <button
          class="grid w-full grid-cols-1 gap-3 px-3 py-3 text-left transition hover:bg-blue-50/40 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_auto] lg:items-center"
          type="button"
          @click="toggleCategory(category.title)"
        >
          <div class="min-w-0">
            <h3 class="truncate text-sm font-black tracking-tight text-[#121417]">{{ category.title }}</h3>
            <p class="mt-0.5 text-xs font-semibold text-black/40">{{ category.models.length }} моделей</p>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs lg:contents">
            <p class="font-bold text-black/45">
              <span class="block text-[9px] font-black uppercase tracking-[0.12em] text-black/30">Мин. input</span>
              <span class="font-['JetBrains_Mono'] text-sm text-blue-600">{{ formatPrice(category.minInput.input) }}</span>
            </p>
            <p class="font-bold text-black/45">
              <span class="block text-[9px] font-black uppercase tracking-[0.12em] text-black/30">Мин. output</span>
              <span class="font-['JetBrains_Mono'] text-sm text-red-600">{{ formatPrice(category.minOutput.output) }}</span>
            </p>
            <p class="col-span-2 min-w-0 font-bold text-black/45 lg:col-span-1">
              <span class="block text-[9px] font-black uppercase tracking-[0.12em] text-black/30">Ориентир</span>
              <span class="truncate text-sm text-[#121417]">{{ category.topModel.name }}</span>
            </p>
          </div>
          <span class="justify-self-start rounded-lg border border-black/10 px-2.5 py-1 text-xs font-black text-black/45 lg:justify-self-end">
            {{ isCategoryOpen(category.title) ? "Свернуть" : "Развернуть" }}
          </span>
        </button>

        <div v-if="isCategoryOpen(category.title)" class="grid grid-cols-1 gap-3 border-t border-black/10 bg-black/[0.015] p-3 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="model in category.models"
            :key="model.id"
            class="group flex min-h-[160px] flex-col justify-between rounded-lg border border-black/10 bg-white p-3 transition hover:border-blue-200"
          >
            <div>
              <div class="mb-2 flex flex-wrap gap-1.5">
                <span
                  v-for="badge in modelBadges(model)"
                  :key="badge"
                  class="rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider"
                  :class="badgeClass(badge)"
                >
                  {{ badge }}
                </span>
              </div>
              <h4 class="text-base font-black tracking-tight text-[#121417] transition-colors group-hover:text-blue-600">
                {{ model.name }}
              </h4>
              <p class="mt-0.5 text-xs font-semibold leading-relaxed text-black/45">{{ model.note }}</p>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="rounded-lg bg-black/[0.025] px-2.5 py-2">
                <span class="mb-1 block text-[9px] font-bold uppercase tracking-[1px] text-black/25">Вход</span>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-['JetBrains_Mono'] text-base font-bold leading-none text-[#2563eb]">
                    {{ formatPrice(model.input) }}
                  </span>
                  <span
                    v-if="model.hasLivePrice && hasPriceChange(model.inputChangePercent)"
                    class="rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none"
                    :class="priceChangeView(model.inputChangePercent).class"
                    :title="priceChangeView(model.inputChangePercent).title"
                  >
                    {{ priceChangeView(model.inputChangePercent).label }}
                  </span>
                </div>
              </div>
              <div class="rounded-lg bg-black/[0.025] px-2.5 py-2">
                <span class="mb-1 block text-[9px] font-bold uppercase tracking-[1px] text-black/25">Выход</span>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-['JetBrains_Mono'] text-base font-bold leading-none text-[#dc2626]">
                    {{ formatPrice(model.output) }}
                  </span>
                  <span
                    v-if="model.hasLivePrice && hasPriceChange(model.outputChangePercent)"
                    class="rounded-full px-1.5 py-0.5 text-[9px] font-black leading-none"
                    :class="priceChangeView(model.outputChangePercent).class"
                    :title="priceChangeView(model.outputChangePercent).title"
                  >
                    {{ priceChangeView(model.outputChangePercent).label }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
