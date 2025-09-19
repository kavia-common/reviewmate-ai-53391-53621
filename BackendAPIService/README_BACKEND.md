# ReviewMate AI - BackendAPIService

Tech: Node.js, Express, Prisma ORM

Setup:
- Create a .env file (see .env.example) and set:
  - PORT
  - HOST
  - DATABASE_PROVIDER (sqlite | postgresql | mysql)
  - DATABASE_URL
  - JWT_SECRET
  - AI_PROVIDER (mock | openai)
  - OPENAI_API_KEY (if AI_PROVIDER=openai)
- Install deps: npm install
- Prisma:
  - npx prisma generate
  - For SQLite dev: set DATABASE_PROVIDER=sqlite and DATABASE_URL="file:./dev.db"; run `npm run prisma:dev`
- Run:
  - Dev: npm run dev
  - Prod: npm start

Docs:
- Swagger UI at /docs
- Base API mounted at /api
- Liveness: GET /
- Health: GET /health
- Readiness: GET /ready

Notes:
- The server now starts even if the database is temporarily unavailable. Database-backed routes may respond with errors until the DB is ready.
- For first-time local dev with SQLite, use DATABASE_PROVIDER=sqlite and DATABASE_URL="file:./dev.db", then run `npm run prisma:dev`.

Security:
- Use Bearer JWT tokens in Authorization header or x-api-key
- Built-in rate limiting, helmet, CORS, and morgan logging
