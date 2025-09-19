const prisma = require('../lib/prisma');
const { analyzeSentiment, generateResponse } = require('./ai');
const { fetchProviderReviews } = require('./integrations');
const dayjs = require('dayjs');

// PUBLIC_INTERFACE
async function syncLocationReviews(locationId) {
  /** Fetch new reviews for a location across all integrations and store them */
  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: { integrations: true },
  });
  if (!location) throw new Error('Location not found');

  const since = dayjs().subtract(30, 'day').toDate(); // last 30 days for mock
  let created = 0;
  for (const integ of location.integrations) {
    const reviews = await fetchProviderReviews(integ.type, { since, location });
    // Upsert reviews
    for (const r of reviews) {
      const sentiment = await analyzeSentiment(r.content);
      await prisma.review.upsert({
        where: { source_externalId: { source: integ.type, externalId: r.externalId } },
        update: {
          rating: r.rating,
          content: r.content,
          author: r.author,
          reviewAt: new Date(r.reviewAt),
          sentiment,
        },
        create: {
          source: integ.type,
          externalId: r.externalId,
          locationId: location.id,
          rating: r.rating,
          content: r.content,
          author: r.author,
          reviewAt: new Date(r.reviewAt),
          sentiment,
        },
      });
      created += 1;
    }
    await prisma.integration.update({
      where: { id: integ.id },
      data: { lastSyncAt: new Date() },
    });
  }
  // Update analytics snapshot for today
  await updateAnalytics(locationId, new Date());
  return { created };
}

// PUBLIC_INTERFACE
async function respondToReview(reviewId, options = {}) {
  /** Generate and store AI response to a review */
  const review = await prisma.review.findUnique({ where: { id: reviewId }, include: { location: true } });
  if (!review) throw new Error('Review not found');
  const response = await generateResponse({
    reviewText: review.content,
    businessName: review.location.name,
    tone: options.tone || 'professional',
  });
  const updated = await prisma.review.update({
    where: { id: review.id },
    data: { aiResponse: response, responseAt: new Date() },
  });
  return updated;
}

async function updateAnalytics(locationId, date) {
  const start = dayjs(date).startOf('day').toDate();
  const end = dayjs(date).endOf('day').toDate();

  const reviews = await prisma.review.findMany({
    where: { locationId, reviewAt: { gte: start, lte: end } },
  });

  const reviewCount = reviews.length;
  const avgRating = reviewCount ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0;
  const positive = reviews.filter((r) => r.sentiment === 'POSITIVE').length;
  const neutral = reviews.filter((r) => r.sentiment === 'NEUTRAL').length;
  const negative = reviews.filter((r) => r.sentiment === 'NEGATIVE').length;

  await prisma.analyticsSnapshot.upsert({
    where: { locationId_date: { locationId, date: start } },
    update: { avgRating, reviewCount, positive, neutral, negative },
    create: { locationId, date: start, avgRating, reviewCount, positive, neutral, negative },
  });
}

// PUBLIC_INTERFACE
async function getLocationReviews(locationId, query = {}) {
  /** List paginated reviews for a location */
  const take = Math.min(parseInt(query.limit || '20', 10), 100);
  const skip = parseInt(query.offset || '0', 10);
  const orderBy = { reviewAt: 'desc' };
  const where = { locationId };
  const [items, total] = await Promise.all([
    prisma.review.findMany({ where, orderBy, take, skip }),
    prisma.review.count({ where }),
  ]);
  return { items, total, limit: take, offset: skip };
}

module.exports = {
  syncLocationReviews,
  respondToReview,
  getLocationReviews,
};
