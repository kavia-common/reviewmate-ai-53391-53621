const config = require('../config');

/**
 * Simple rule-based sentiment analysis with optional LLM stub.
 */
function basicSentiment(text) {
  const t = (text || '').toLowerCase();
  const pos = ['great', 'excellent', 'love', 'awesome', 'good', 'amazing', 'friendly', 'quick'];
  const neg = ['bad', 'terrible', 'hate', 'awful', 'slow', 'rude', 'poor', 'dirty'];
  let score = 0;
  pos.forEach((w) => { if (t.includes(w)) score += 1; });
  neg.forEach((w) => { if (t.includes(w)) score -= 1; });
  if (score > 0) return 'POSITIVE';
  if (score < 0) return 'NEGATIVE';
  return 'NEUTRAL';
}

// PUBLIC_INTERFACE
async function analyzeSentiment(text) {
  /** Returns one of: POSITIVE|NEUTRAL|NEGATIVE */
  if (config.aiProvider === 'mock') return basicSentiment(text);
  // Placeholder for OpenAI or other provider
  return basicSentiment(text);
}

// PUBLIC_INTERFACE
async function generateResponse({ reviewText, businessName, tone = 'professional', context = '' }) {
  /** Returns a context-aware response string based on the review */
  if (config.aiProvider === 'mock') {
    const sentiment = basicSentiment(reviewText);
    if (sentiment === 'NEGATIVE') {
      return `Hi there — we're sorry to hear about your experience at ${businessName}. We take feedback seriously and would like to make this right. Please reach us directly so we can help.`;
    }
    if (sentiment === 'POSITIVE') {
      return `Thank you for the kind words! We're thrilled you had a great experience at ${businessName}. We appreciate your support!`;
    }
    return `Thanks for sharing your feedback about ${businessName}. We value your input and will use it to improve.`;
  }
  // Placeholder for actual LLM call
  return `Thanks for your feedback about ${businessName}.`;
}

module.exports = {
  analyzeSentiment,
  generateResponse,
};
