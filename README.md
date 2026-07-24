# Meeting Room Booking

Веб-додаток для бронювання переговорних кімнат

## Стек технологій

**Frontend** (`client/`)
- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- React Hook Form + Zod — форми та валідація
- TanStack Query — серверний стан (кеш, мутації)
- Zustand — клієнтський стан авторизації
- Axios — HTTP-клієнт

**Backend** (`server/`)
- Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT (httpOnly cookie) + bcrypt

## Можливості

- Реєстрація/логін, сесія тримається на JWT у httpOnly cookie
- Створення/редагування/видалення переговорних кімнат
- Ролі в межах кімнати: **ADMIN** (створив кімнату або доданий адміном) — керує кімнатою, учасниками та будь-якими бронюваннями; **USER** — переглядає кімнату, бронює для себе, може самостійно приєднатись до кімнати
- Додавання учасників у кімнату за email
- Бронювання з перевіркою перетину часу (`startTime < existing.endTime AND endTime > existing.startTime`) всередині Prisma-транзакції з рівнем ізоляції `Serializable` — унеможливлює подвійне бронювання навіть при одночасних запитах

## Передумови

- Node.js 20+
- Docker (для PostgreSQL) або власний PostgreSQL-сервер

## Запуск

### 1. База даних

У корені `server/` лежить `docker-compose.yml`:

```bash
cd server
docker compose up -d
```

Піднімає PostgreSQL на `localhost:5432` (база `meeting_room_booking`, користувач/пароль `postgres`/`postgres`).

### 2. Backend

```bash
cd server
npm install
cp .env.example .env      # за потреби відредагувати DATABASE_URL / JWT_SECRET
npx prisma migrate dev
npm run dev
```

Сервер стартує на **http://localhost:5000**.

### 3. Frontend

У новому терміналі:

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

Клієнт стартує на **http://localhost:3000**.

### 4. Перегляд бази даних (опційно)

```bash
cd server
npx prisma studio
```

Відкриється GUI на **http://localhost:5555**.

## Структура проєкту

```
client/src/
  app/(auth)/          — сторінки логіну/реєстрації
  app/(private)/       — приватні сторінки (dashboard, rooms, bookings) + layout з Header/Sidebar
  api/                 — HTTP-запити (axios)
  components/          — ui / forms / layout / room / booking / shared
  store/                — Zustand-стор авторизації
  validations/          — Zod-схеми форм
  lib/                  — axios instance, query client, утиліти

server/src/
  routes/               — Express-роути
  controllers/          — обробка request/response, без бізнес-логіки
  services/             — вся бізнес-логіка та єдина точка роботи з Prisma
  middleware/           — auth, role-check, валідація, обробка помилок
  validations/          — Zod-схеми запитів
  config/, utils/, types/
```
