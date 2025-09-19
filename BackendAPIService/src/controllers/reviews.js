const reviews = require('../services/reviews');

// PUBLIC_INTERFACE
async function sync(req, res, next) {
  try {
    const result = await reviews.syncLocationReviews(req.params.locationId);
    res.json(result);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function list(req, res, next) {
  try {
    const data = await reviews.getLocationReviews(req.params.locationId, req.query);
    res.json(data);
  } catch (e) { next(e); }
}

// PUBLIC_INTERFACE
async function respond(req, res, next) {
  try {
    const updated = await reviews.respondToReview(req.params.reviewId, req.body || {});
    res.json(updated);
  } catch (e) { next(e); }
}

module.exports = { sync, list, respond };
