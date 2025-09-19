const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReviewMate AI Backend API',
      version: '1.0.0',
      description: 'REST API for ReviewMate AI — reviews aggregation, AI sentiment & responses, management, analytics, and reports.',
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Management', description: 'Users, organizations, teams, locations, integrations' },
      { name: 'Reviews', description: 'Review aggregation, sentiment, response generation' },
      { name: 'Analytics', description: 'Analytics and white-label reporting' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
