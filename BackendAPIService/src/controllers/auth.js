const prisma = require('../lib/prisma');
const { verifyPassword, signJwt, hashPassword } = require('../lib/security');

// PUBLIC_INTERFACE
async function register(req, res, next) {
  /** Register a new user and org (optional) */
  try {
    const { email, name, password, organizationName } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, name, passwordHash, role: 'OWNER' } });
    if (organizationName) {
      await prisma.organization.create({ data: { name: organizationName, ownerId: user.id } });
    }
    const token = signJwt({ id: user.id, role: user.role, email: user.email, orgId: user.orgId });
    return res.status(201).json({ token, user });
  } catch (e) {
    return next(e);
  }
}

// PUBLIC_INTERFACE
async function login(req, res, next) {
  /** Login with email/password, returns JWT */
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwt({ id: user.id, role: user.role, email: user.email, orgId: user.orgId });
    return res.json({ token, user });
  } catch (e) {
    return next(e);
  }
}

module.exports = { register, login };
