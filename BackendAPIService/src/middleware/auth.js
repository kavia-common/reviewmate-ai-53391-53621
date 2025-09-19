const rateLimit = require('express-rate-limit');
const prisma = require('../lib/prisma');
const { verifyJwt } = require('../lib/security');
const config = require('../config');

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Authenticate via Bearer token (JWT) or x-api-key; populates req.user */
  try {
    const apiKey = req.get('x-api-key');
    if (apiKey) {
      return prisma.apiKey.findUnique({ where: { key: apiKey }, include: { user: true } })
        .then((ak) => {
          if (!ak) return res.status(401).json({ message: 'Invalid API key' });
          req.user = { id: ak.user.id, role: ak.user.role, email: ak.user.email, orgId: ak.user.orgId };
          next();
        })
        .catch(next);
    }

    const auth = req.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = verifyJwt(token);
    req.user = decoded;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// PUBLIC_INTERFACE
function requireRole(...roles) {
  /** Require the authenticated user to have one of the allowed roles */
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
});

module.exports = {
  requireAuth,
  requireRole,
  limiter,
};
