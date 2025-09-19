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
- Run: npm run dev

Docs:
- Swagger UI at /docs
- Base API mounted at /api

Security:
- Use Bearer JWT tokens in Authorization header or x-api-key
- Built-in rate limiting, helmet, CORS, and morgan logging
