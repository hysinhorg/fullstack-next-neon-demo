# Fullstack Next.js + Neon Demo

End-to-end demo app that proves:
- Next.js frontend
- Next.js API route
- Neon Postgres read/write

## Local run

1. Install deps
```bash
npm install
```

2. Configure env
```bash
cp .env.example .env.local
# set DATABASE_URL
```

3. Run
```bash
npm run dev
```

Open http://localhost:3000 and add a message.

## API

- `GET /api/messages` - list last 20 messages
- `POST /api/messages` - create message: `{ "body": "hello" }`

On first request, the API creates the `messages` table if it doesn't exist.
