const express = require('express');
const router = express.Router();
const { searchCandidates } = require('../services/mynetaService');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');
const logger = require('../services/logger');

/**
 * GET /api/candidates/search
 * Searches candidates by name using MyNeta data.
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim() === '') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Query parameter "q" is required for candidate search',
    });
  }

  try {
    const candidates = await searchCandidates(q.trim());
    res.json({ candidates });
  } catch (error) {
    logger.error('Error in candidate search route', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to retrieve candidate data',
    });
  }
});

module.exports = router;
