const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const Auth = require('../controllers/auth');
const Mgmt = require('../controllers/management');
const Reviews = require('../controllers/reviews');
const Analytics = require('../controllers/analytics');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Management
 *     description: Users, organizations, teams, locations, integrations
 *   - name: Reviews
 *     description: Review aggregation, sentiment, responses
 *   - name: Analytics
 *     description: Analytics and reports
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and optionally create an organization
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               organizationName: { type: string }
 *     responses:
 *       201:
 *         description: Registered
 */
router.post('/auth/register', Auth.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Authenticated
 */
router.post('/auth/login', Auth.login);

/**
 * @swagger
 * /api/management/users:
 *   post:
 *     summary: Create a user
 *     tags: [Management]
 */
router.post('/management/users', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.createUser);

/**
 * @swagger
 * /api/management/orgs:
 *   post:
 *     summary: Create an organization
 *     tags: [Management]
 */
router.post('/management/orgs', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.createOrganization);

/**
 * @swagger
 * /api/management/teams:
 *   post:
 *     summary: Create a team
 *     tags: [Management]
 */
router.post('/management/teams', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.createTeam);

/**
 * @swagger
 * /api/management/team-members:
 *   post:
 *     summary: Add a user to a team
 *     tags: [Management]
 */
router.post('/management/team-members', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.addUserToTeam);

/**
 * @swagger
 * /api/management/locations:
 *   post:
 *     summary: Create a location
 *     tags: [Management]
 */
router.post('/management/locations', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.createLocation);

/**
 * @swagger
 * /api/management/integrations:
 *   post:
 *     summary: Add an integration to a location
 *     tags: [Management]
 */
router.post('/management/integrations', requireAuth, requireRole('OWNER', 'ADMIN'), Mgmt.addIntegration);

/**
 * @swagger
 * /api/locations/{locationId}/reviews/sync:
 *   post:
 *     summary: Sync reviews for a location
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         schema: { type: string }
 *         required: true
 */
router.post('/locations/:locationId/reviews/sync', requireAuth, Reviews.sync);

/**
 * @swagger
 * /api/locations/{locationId}/reviews:
 *   get:
 *     summary: List reviews for a location
 *     tags: [Reviews]
 */
router.get('/locations/:locationId/reviews', requireAuth, Reviews.list);

/**
 * @swagger
 * /api/reviews/{reviewId}/respond:
 *   post:
 *     summary: Generate and store AI response for a review
 *     tags: [Reviews]
 */
router.post('/reviews/:reviewId/respond', requireAuth, Reviews.respond);

/**
 * @swagger
 * /api/locations/{locationId}/analytics:
 *   get:
 *     summary: Get analytics timeline for a location
 *     tags: [Analytics]
 */
router.get('/locations/:locationId/analytics', requireAuth, Analytics.getLocationStats);

/**
 * @swagger
 * /api/locations/{locationId}/reports/weekly:
 *   get:
 *     summary: Generate a white-label PDF analytics report
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: PDF stream
 */
router.get('/locations/:locationId/reports/weekly', requireAuth, Analytics.generateReport);

module.exports = router;
