# Monaco Aquapark — MVP

Новый сайт Monaco Aquapark в Ташкенте с рабочей заявкой на бронирование, PostgreSQL, Telegram-уведомлениями для сотрудников и простой административной панелью.

## Что входит

- публичный одностраничный сайт в светлой editorial-стилистике утверждённого референса;
- реальные данные Monaco, вынесенные в `lib/site.ts`;
- реальные фотографии с официального сайта Monaco, которые скачиваются в локальный `public/images/monaco/` и не хотлинкуются в браузере;
- форма заявки: имя, телефон, Telegram (необязательно), дата, взрослые, дети, комментарий;
- серверная Zod-валидация, honeypot и базовый rate limit;
- PostgreSQL + Prisma migrations;
- Telegram-уведомления нескольким администраторам;
- inline-кнопки `Связались / Подтверждено / Отменено`;
- синхронизация статуса между Telegram и `/admin`;
- защищённая админка с httpOnly session cookie;
- фильтры заявок, показатели на сегодня и карточка заявки;
- Docker Compose для `db`, `web`, `bot`;
- unit + e2e тесты и CI.

## Стек

- Next.js App Router
- React + TypeScript
- Tailwind CSS + индивидуальный CSS
- PostgreSQL
- Prisma
- Zod
- grammY
- Vitest
- Playwright
- Docker / Docker Compose

## Структура

```text
app/
  admin/
  api/
  page.tsx
components/
  admin/
  site/
lib/
  admin/
  booking/
  telegram/
  validation/
bot/
prisma/
  migrations/
scripts/
tests/
public/
```

## Официальный контент

Основные источники проекта:

- официальный сайт: `https://monaqua.uz/`
- официальный Instagram: `https://www.instagram.com/monaco.aquapark/`

В коде сейчас используются:

- телефон: `+998 95 215 15 15`;
- адрес: Карасу-4 / ул. Гулсанам, Ташкент;
- подтверждённые зоны: взрослый и детский бассейны, фуд-корт, финские сауны, турецкие хаммамы, SPA, гидромассаж и джакузи;
- тарифы: будни 130 000 / 75 000 сум, выходные 180 000 / 100 000 сум, детям до 5 лет бесплатно;
- режим работы вынесен в `lib/site.ts` и перед production-запуском должен быть повторно сверён с последней публикацией официального Instagram.

Цены, режим работы и акции перед production-запуском нужно ещё раз сверить с последними публикациями официального Instagram, потому что они могут меняться оперативно.

## Фотографии

Runtime-сайт не использует временные Instagram/CDN-ссылки. Скрипт `scripts/sync-media.mjs` скачивает разрешённые фотографии с официального сайта Monaco в:

```text
public/images/monaco/
```

Перед локальным запуском:

```bash
npm run media:sync
```

Docker выполняет этот шаг во время сборки образа. После сборки картинки обслуживаются локально приложением.

## ENV

Создайте `.env` из примера:

```bash
cp .env.example .env
```

Обязательные переменные:

```env
DATABASE_URL=postgresql://monaco:monaco@db:5432/monaco?schema=public

TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_IDS=

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`TELEGRAM_ADMIN_CHAT_IDS` — один или несколько приватных Telegram chat ID сотрудников через запятую, например:

```env
TELEGRAM_ADMIN_CHAT_IDS=123456789,987654321
```

Секреты не коммитить.

## Локальный запуск без Docker

Нужен Node.js 22+ и PostgreSQL. Для запуска без Docker укажите в `DATABASE_URL` адрес локального PostgreSQL вместо hostname `db`.

```bash
npm install
npm run media:sync
npx prisma generate
npm run db:migrate
npm run db:seed
npm run dev
```

Сайт: `http://localhost:3000`

Админка: `http://localhost:3000/admin`

Telegram-бот отдельным процессом:

```bash
npm run bot:dev
```

## Docker

```bash
cp .env.example .env
# заполнить .env

docker compose up -d --build
```

После первого запуска создать/обновить администратора:

```bash
docker compose exec web npm run db:seed
```

Проверка:

```bash
docker compose ps
docker compose logs -f web
docker compose logs -f bot
```

## Prisma migrations

Для разработки:

```bash
npm run db:migrate
```

Для production/контейнера:

```bash
npm run db:deploy
```

Создание первого администратора выполняется seed-командой и использует только `ADMIN_EMAIL` / `ADMIN_PASSWORD` из окружения. Пароль сохраняется в БД как bcrypt hash.

## Booking flow

1. Гость отправляет форму, при желании указывает Telegram username.
2. API проверяет данные, honeypot и rate limit.
3. Заявка сохраняется в PostgreSQL со статусом `NEW`.
4. Только после успешной записи отправляются Telegram-уведомления сотрудникам.
5. Если Telegram временно недоступен, заявка остаётся в БД, а ошибка только логируется.
6. Администратор меняет статус в Telegram или `/admin`.
7. Статус синхронизируется в базе и Telegram-сообщениях.

Статусы:

- `NEW`
- `CONTACTED`
- `CONFIRMED`
- `CANCELLED`

## Telegram

Бот предназначен только для сотрудников. Неавторизованные chat ID игнорируются.

После новой заявки каждый ID из `TELEGRAM_ADMIN_CHAT_IDS` получает карточку заявки с именем, телефоном, Telegram гостя (если указан), датой, количеством гостей и комментарием, а также кнопки:

- `📞 Связались`
- `✅ Подтверждено`
- `❌ Отменено`

Telegram, который гость вводит в форме бронирования, — это его контакт для связи. Он не связан с административными chat ID бота и хранится вместе с заявкой.

## Админка

`/admin` содержит:

- новые / подтверждённые / отменённые заявки на сегодня;
- суммарное количество гостей по заявкам;
- поиск по имени, телефону, Telegram и номеру заявки;
- фильтр по дате;
- фильтр по статусу;
- карточку заявки;
- действия `Связались / Подтвердить / Отменить`.

Авторизация серверная. Session token хранится в httpOnly cookie, в БД сохраняется только SHA-256 hash токена.

## Тесты

Unit:

```bash
npm test
```

Проверяются:

- Booking validation, включая Telegram username;
- создание Booking и public ID;
- сохранение Telegram-контакта гостя;
- изменение статуса;
- проверка административных credentials;
- Telegram callback parsing.

E2E/визуальная проверка:

```bash
npm run build
npx playwright install chromium
npm run e2e
```

Playwright проверяет desktop 1440px и mobile 390px, реальную отправку заявки в PostgreSQL, вход в админку и изменение статуса. Скриншоты сохраняются в `artifacts/`.

## Production build

```bash
npm run media:sync
npm run db:deploy
npm run build
npm start
```
