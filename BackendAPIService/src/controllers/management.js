const mgmt = require('../services/management');

// PUBLIC_INTERFACE
async function createUser(req, res, next) {
  try {
    const user = await mgmt.createUser(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function createOrganization(req, res, next) {
  try {
    const org = await mgmt.createOrganization(req.body);
    res.status(201).json(org);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function createTeam(req, res, next) {
  try {
    const team = await mgmt.createTeam(req.body);
    res.status(201).json(team);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function addUserToTeam(req, res, next) {
  try {
    const tm = await mgmt.addUserToTeam(req.body);
    res.status(201).json(tm);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function createLocation(req, res, next) {
  try {
    const loc = await mgmt.createLocation(req.body);
    res.status(201).json(loc);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function addIntegration(req, res, next) {
  try {
    const integ = await mgmt.addIntegration(req.body);
    res.status(201).json(integ);
  } catch (e) { next(e); }
}

module.exports = {
  createUser,
  createOrganization,
  createTeam,
  addUserToTeam,
  createLocation,
  addIntegration,
};
