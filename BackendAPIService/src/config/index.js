require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'change_me', // Request to set in .env for production
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  databaseProvider: process.env.DATABASE_PROVIDER || 'sqlite',
  aiProvider: process.env.AI_PROVIDER || 'mock', // mock or openai
  openaiApiKey: process.env.OPENAI_API_KEY,
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '120', 10),
};

module.exports = config;
