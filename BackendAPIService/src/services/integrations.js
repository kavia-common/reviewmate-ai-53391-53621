const axios = require('axios');

async function mockFetch(provider, { since, location }) {
  // Simulate fetching 3 reviews
  const now = new Date();
  const sample = [
    {
      externalId: `${provider}-${location.id}-1`,
      rating: 5,
      author: 'Alice',
      content: `Great service at ${location.name}!`,
      reviewAt: now.toISOString(),
    },
    {
      externalId: `${provider}-${location.id}-2`,
      rating: 2,
      author: 'Bob',
      content: `Slow and unhelpful at ${location.name}.`,
      reviewAt: now.toISOString(),
    },
    {
      externalId: `${provider}-${location.id}-3`,
      rating: 4,
      author: 'Charlie',
      content: `Good overall at ${location.name}.`,
      reviewAt: now.toISOString(),
    },
  ];
  return sample;
}

async function fetchGoogleReviews(params) {
  return mockFetch('GOOGLE', params);
}
async function fetchYelpReviews(params) {
  return mockFetch('YELP', params);
}
async function fetchFacebookReviews(params) {
  return mockFetch('FACEBOOK', params);
}

// PUBLIC_INTERFACE
async function fetchProviderReviews(type, params) {
  /** Dispatch to the correct provider implementation */
  if (type === 'GOOGLE') return fetchGoogleReviews(params);
  if (type === 'YELP') return fetchYelpReviews(params);
  if (type === 'FACEBOOK') return fetchFacebookReviews(params);
  return [];
}

module.exports = {
  fetchProviderReviews,
};
