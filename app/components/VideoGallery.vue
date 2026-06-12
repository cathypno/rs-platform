<script setup lang="ts">
const videos = [
  {
    title: "ChatGPT: от некоммерческой мечты до войны миллиардеров",
    url: "https://www.youtube.com/watch?v=YsXGgZWf-K0",
    vkUrl: "https://vkvideo.ru/video-221021644_456239055",
    description:
      "Война на $600 миллиардов: Илон Маск против GPT. Разбираем, почему главные визионеры планеты вдруг начали судиться и паниковать.",
    thumbnail: "https://img.youtube.com/vi/YsXGgZWf-K0/maxresdefault.jpg",
  },
  {
    title: "Как погибнет наша цивилизация?",
    url: "https://www.youtube.com/watch?v=IMpytEuYYZQ",
    vkUrl: "https://vkvideo.ru/video-221021644_456239057",
    description:
      "Обсуждаем коллапс бронзового века и ищем пугающие параллели с нашей современностью. О хрупкости интернета и мировых связей.",
    thumbnail: "https://img.youtube.com/vi/IMpytEuYYZQ/maxresdefault.jpg",
  },
  {
    title: "Конец великой эпохи социальных сетей (История clubhouse)",
    url: "https://www.youtube.com/watch?v=Jz5kmdE-7EI",
    vkUrl: "https://vkvideo.ru/video-221021644_456239052",
    description:
      "Отличный кейс о том, как хайп убивает продукт. Почему «социалки» умирают и почему эксклюзивность не спасает.",
    thumbnail: "https://img.youtube.com/vi/Jz5kmdE-7EI/maxresdefault.jpg",
  },
  {
    title: "Вся правда об ИИ: Ожидания vs Реальность",
    url: "https://www.youtube.com/watch?v=t4SPTLQzpRc",
    vkUrl: "https://vkvideo.ru/video-221021644_456239054",
    description: "Трезвый взгляд на ограничения нейросетей и на то, почему хайп вокруг них сильно перегрет.",
    thumbnail: "https://img.youtube.com/vi/t4SPTLQzpRc/maxresdefault.jpg",
  },
  {
    title: "С чего начинался ИИ? Главный учёный Meta против всего мира",
    url: "https://www.youtube.com/watch?v=keUSohrQcdQ",
    vkUrl: "https://vkvideo.ru/video-221021644_456239056",
    description:
      "История Яна Лекуна, ученого, который придумал и реализовал нейросети. Фундамент современных технологий.",
    thumbnail: "https://img.youtube.com/vi/keUSohrQcdQ/maxresdefault.jpg",
  },
];
</script>

<template>
  <section class="max-w-[1400px] mx-auto px-6 py-16">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tight text-[#121417]">
        Куда катится этот <span class="text-blue-600">цифровой мир</span>?
      </h2>
      <p class="text-lg text-black/40 max-w-2xl mx-auto font-medium leading-relaxed">
        Разбираем ключевые события, которые формируют нашу реальность прямо сейчас.
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="video in videos"
        :key="video.url"
        class="group relative bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-black/[0.03] flex flex-col"
      >
        <a :href="video.url" target="_blank" class="relative aspect-[16/10] overflow-hidden block">
          <img
            :src="video.thumbnail"
            :alt="video.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div
              class="w-14 h-14 bg-white/95 backdrop-blur rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-black/20"
            >
              <div
                class="w-0 h-0 border-t-[7px] border-t-transparent border-l-[11px] border-l-blue-600 border-b-[7px] border-b-transparent ml-1"
              ></div>
            </div>
          </div>
        </a>
        <div class="p-8 flex-1 flex flex-col">
          <h3
            class="font-extrabold text-xl mb-3 text-[#121417] leading-[1.2] group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {{ video.title }}
          </h3>
          <p class="text-[13px] text-black/50 font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
            {{ video.description }}
          </p>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
            <a
              :href="video.url"
              target="_blank"
              class="flex items-center gap-2 text-blue-600 text-[11px] font-black uppercase tracking-wider hover:gap-3 transition-all"
            >
              <span>Ютуб</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              :href="video.vkUrl"
              target="_blank"
              class="flex items-center gap-2 text-[#4C75A3] text-[11px] font-black uppercase tracking-wider hover:gap-3 transition-all"
            >
              <span>ВК Видео</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
