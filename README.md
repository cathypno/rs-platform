# rs-platform

Лёгкий сайт `rocketseven.ru`: лендинг Rocket7 про ИИ, калькулятор стоимости моделей и видеоблок.

## Стек

- Nuxt 4 + Vue 3
- Nitro server API для `/api/ai-prices`
- Tailwind CSS 4
- OpenRouter как live-источник цен с fallback на локальную таблицу

## Локальный запуск

```bash
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:3000`.

## Production

```bash
npm run build
npm run preview
```

На VPS проект запускается как отдельное Nuxt/Nitro-приложение и не содержит админку `rocket7.ru`.
