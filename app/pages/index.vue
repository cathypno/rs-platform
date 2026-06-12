<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AiPriceCalculator from "~/components/AiPriceCalculator.vue";
import AiPriceTable from "~/components/AiPriceTable.vue";
import VideoGallery from "~/components/VideoGallery.vue";

const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

useHead({
  title: "Rocket7 | ИИ Инструменты и Откровения",
  meta: [{ name: "description", content: "Экспертные решения по автоматизации бизнеса и внедрению ИИ." }],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden font-['Manrope'] text-[#121417]"
    style="
      background:
        radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 26%),
        radial-gradient(circle at top right, rgba(71, 85, 105, 0.06), transparent 22%),
        linear-gradient(180deg, #fbfbfa 0%, #f7f7f6 48%, #f1f3f5 100%);
    "
  >
    <header
      :class="[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-black/10 bg-[rgba(251,251,250,0.92)] py-3 shadow-[0_14px_40px_rgba(18,20,23,0.08)] backdrop-blur-xl'
          : 'py-5',
      ]"
    >
      <div class="mx-auto flex max-w-[1400px] items-center justify-between px-6">
        <a href="/" class="flex items-center gap-2 group">
          <div
            class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform"
          >
            <span class="text-white font-bold text-xl">R7</span>
          </div>
          <span class="text-xl font-extrabold tracking-tight text-[#121417]">Rocket7</span>
        </a>

        <nav class="hidden md:flex items-center gap-8">
          <a
            href="#calculator"
            class="text-[13px] font-semibold text-black/70 hover:text-blue-600 transition-colors uppercase tracking-wider"
            >Калькулятор</a
          >
          <a
            href="#videos"
            class="text-[13px] font-semibold text-black/70 hover:text-blue-600 transition-colors uppercase tracking-wider"
            >Видео</a
          >
          <a
            href="https://t.me/rocketseven"
            target="_blank"
            class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Телеграм</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.37-.49 1.02-.74 4-1.74 6.67-2.88 8.01-3.43 3.81-1.58 4.6-1.85 5.11-1.87.11 0 .37.03.54.17.14.11.18.27.2.38.01.07.02.16.01.25z"
              />
            </svg>
          </a>
        </nav>
      </div>
    </header>

    <main class="pt-32 pb-20">
      <section id="calculator" class="px-6 mb-24">
        <div class="max-w-[1400px] mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-5xl md:text-6xl font-black mb-6 tracking-tight text-[#121417]">
              Сколько стоит <span class="text-blue-600">Ваш ИИ</span>?
            </h1>
            <p class="text-xl text-black/50 max-w-2xl mx-auto font-medium">
              Рассчитайте стоимость токенов для ведущих моделей 2026 года и сравните их с традиционными затратами.
            </p>
          </div>

          <div class="space-y-10">
            <AiPriceCalculator />
            <AiPriceTable />
          </div>
        </div>
      </section>

      <section id="videos" class="px-6">
        <VideoGallery />
      </section>
    </main>

    <footer class="border-t border-black/5 py-12 px-6">
      <div class="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span class="text-white font-bold text-sm">R7</span>
          </div>
          <span class="text-lg font-bold tracking-tight">Rocket7</span>
        </div>
        <p class="text-black/40 text-sm">© 2026 Rocket7. Все права защищены технологиями.</p>
        <div class="flex gap-6">
          <a href="https://t.me/rocketseven" class="text-black/40 hover:text-blue-600 transition-colors">Телеграм</a>
          <a href="/privacy-policy" class="text-black/40 hover:text-blue-600 transition-colors"
            >Политика конфиденциальности</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");

html {
  scroll-behavior: smooth;
}

body {
  background-color: #fbfbfa;
}
</style>
