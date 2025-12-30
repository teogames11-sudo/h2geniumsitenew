# H2GENIUM — Next.js App

Готовый проект для выкладки на GitHub и деплой на Vercel.

## Быстрый старт
- `npm install`
- `npm run dev` — локальная разработка
- `npm run build` — продакшн-сборка
- `npm run start` — запуск собранного
- `npm run content:sync` — подтянуть контент с h2genium.ru (обновит `src/content/*.json`)

Node.js ≥ 18.

## Сборка и проверка
- Линт: `npm run lint`
- Прод-сборка (то же, что на Vercel): `npm run build`

## Переменные окружения
Создайте `.env.local` (или задайте в Vercel):
- `BITRIX_WEBHOOK_URL` — вебхук Bitrix24 для /api/lead
- `BITRIX_LEAD_TITLE_TEMPLATE` — (опционально) шаблон заголовка заявки

## Деплой на Vercel
1. Запушьте репозиторий на GitHub.
2. В Vercel: New Project → Import Git Repository.
3. Build Command: `npm run build`
4. Output Directory: `.vercel/output` (по умолчанию для App Router) — можно оставить пустым, Vercel определит сам.
5. Установите переменные окружения (см. выше).
6. Deploy — после деплоя `npm run build` должен проходить без ошибок.

## Структура
- `src/app` — страницы (App Router)
- `src/components` — UI/секции
- `scripts/crawl-h2genium.ts` — краулер контента
- `public/` — статика (фон, hero, брендинг)

## Примечания
- Используются Tailwind v4 и Framer Motion.
- ESLint сконфигурирован под Next 15.5.9.
- SWC в WebAssembly: для dev/prod установлены флаги `NEXT_SWC_USE_WASM=1` в скриптах.
