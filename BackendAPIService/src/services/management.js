const prisma = require('../lib/prisma');
const { hashPassword } = require('../lib/security');

// PUBLIC_INTERFACE
async function createUser({ email, name, password, role = 'MEMBER', orgId = null }) {
  /** Create a user with hashed password */
  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: { email, name, passwordHash, role, orgId },
  });
}

// PUBLIC_INTERFACE
async function createOrganization({ name, ownerId }) {
  /** Create an organization and set owner */
  return prisma.organization.create({
    data: { name, ownerId },
  });
}

// PUBLIC_INTERFACE
async function createTeam({ name, orgId }) {
  return prisma.team.create({ data: { name, orgId } });
}

// PUBLIC_INTERFACE
async function addUserToTeam({ userId, teamId, role = 'EDITOR' }) {
  return prisma.teamMember.create({ data: { userId, teamId, role } });
}

// PUBLIC_INTERFACE
async function createLocation({ name, address, orgId, teamId = null }) {
  return prisma.location.create({ data: { name, address, orgId, teamId } });
}

// PUBLIC_INTERFACE
async function addIntegration({ locationId, type, providerId, accessToken }) {
  return prisma.integration.create({
    data: { locationId, type, providerId, accessToken },
  });
}

module.exports = {
  createUser,
  createOrganization,
  createTeam,
  addUserToTeam,
  createLocation,
  addIntegration,
};
