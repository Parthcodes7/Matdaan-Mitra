/**
 * Matdaan-Mitra — Express Application Server
 *
 * Production-grade backend with:
 * - Google Cloud Logging & BigQuery analytics
 * - Compression, Helmet security, CORS
 * - Rate limiting, input validation, caching
 * - Health monitoring with uptime & metrics
 *
 * @module server
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const logger = require('./services/logger');
const {
  GLOBAL_RATE_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  MAX_BODY_SIZE,
  COMPRESSION_THRESHOLD,
  COMPRESSION_LEVEL,
  DEFAULT_PORT,
  HTTP_STATUS,
  ERROR_MESSAGES,
} = require('./constants');

const app = express();
const PORT = process.env.PORT || DEFAULT_PORT;

// ─── Performance & Security Middlewares ─────────────────────────────
app.use(compression({ level: COMPRESSION_LEVEL, threshold: COMPRESSION_THRESHOLD }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Remove 'unsafe-inline' — use nonces/hashes for inline scripts instead
      scriptSrc: ["'self'", "apis.google.com"],
      connectSrc: ["'self'", "*.googleapis.com", "*.firebaseapp.com", "*.firebase.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS — restrict to known origins; avoid wildcard in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin '${origin}' not allowed`), false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: MAX_BODY_SIZE }));
app.use(express.urlencoded({ extended: false, limit: MAX_BODY_SIZE }));

// ─── Response Time Tracking ─────────────────────────────────────────
app.use((req, res, next) => {
  req._startTime = Date.now();
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - req._startTime;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration}ms`);
    }
    originalEnd.apply(res, args);
  };
  next();
});

// ─── Global Rate Limiting ───────────────────────────────────────────
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: GLOBAL_RATE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: ERROR_MESSAGES.GLOBAL_RATE_LIMITED },
});
app.use('/api/', limiter);

// ─── Cache static assets ───────────────────────────────────────────
app.use("/_next", express.static(".next", {
  maxAge: "1y",
  immutable: true
}));

// ─── Health + Metrics Endpoint ──────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version
  });
});

// ─── Root Status ────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Matdaan-Mitra Backend Running ✅");
});

// ─── Routes ─────────────────────────────────────────────────────────
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');
const quizRoutes = require('./routes/quizRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/api/ai', aiRoutes);
// NOTE: Do NOT also mount aiRoutes on '/api' — it would shadow all other /api/* routes.
app.use('/api/health', healthRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/candidates', candidateRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND });
});

// ─── Error Handling ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  logger.error('Unhandled server error', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_ERROR,
  });
});

// ─── Start Server (only when not imported for testing) ──────────────
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
