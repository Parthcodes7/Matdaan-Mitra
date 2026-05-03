/**
 * Candidate search routes using MyNeta data.
 * Includes rate limiting, input length validation, and sanitized query params.
 * @module routes/candidateRoutes
 */
const express = require('express');

const router = express.Router();
const { searchCandidates } = require('../services/mynetaService');
const { HTTP_STATUS, ERROR_MESSAGES, MAX_SEARCH_QUERY_LENGTH } = require('../constants');
const { candidateLimiter } = require('../middleware/security');
const logger = require('../services/logger');

/**
 * GET /api/candidates/search
 * Searches candidates by name using MyNeta data.
 * Applies rate limiting and validates the query length.
 *
 * @route GET /search
 * @param {string} req.query.q - Candidate name search query.
 * @returns {{ candidates: Array }} List of matching candidates.
 */
router.get('/search', candidateLimiter, async (req, res) => {
  const { q } = req.query;

  // Validate query exists and is a non-empty string
  if (!q || typeof q !== 'string' || q.trim() === '') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.SEARCH_QUERY_REQUIRED,
    });
  }

  // Validate query does not exceed maximum length
  if (q.trim().length > MAX_SEARCH_QUERY_LENGTH) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.SEARCH_QUERY_TOO_LONG,
    });
  }

  // Strip HTML/script tags from query to prevent log injection
  const safeQuery = q.trim().replace(/<[^>]*>/g, '').replace(/[<>'"`;]/g, '');

  try {
    const candidates = await searchCandidates(safeQuery);
    res.json({ candidates });
  } catch (error) {
    logger.error('Error in candidate search route', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to retrieve candidate data',
    });
  }
});

module.exports = router;
