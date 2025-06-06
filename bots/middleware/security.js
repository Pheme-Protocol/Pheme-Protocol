const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const config = require('../security.config');

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: config.rateLimit.message,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
});

// CORS middleware
const corsOptions = {
  origin: config.accessControl.allowedOrigins,
  methods: config.accessControl.allowedMethods,
  allowedHeaders: config.accessControl.allowedHeaders,
  exposedHeaders: config.accessControl.exposedHeaders,
  credentials: config.accessControl.credentials,
  maxAge: config.accessControl.maxAge,
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  Object.entries(config.securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
};

// API key validation middleware
const validateApiKey = (req, res, next) => {
  if (!config.apiKeyValidation.enabled) {
    return next();
  }

  const apiKey = req.headers[config.apiKeyValidation.headerName.toLowerCase()];
  if (!apiKey || !config.apiKeyValidation.validate(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

// Request validation middleware
const validateRequest = (req, res, next) => {
  if (!config.requestValidation.enabled) {
    return next();
  }

  // Check content type
  if (config.requestValidation.validateContentType) {
    const contentType = req.headers['content-type'];
    if (!contentType || !config.requestValidation.allowedContentTypes.includes(contentType)) {
      return res.status(415).json({ error: 'Unsupported media type' });
    }
  }

  // Check body size
  if (req.headers['content-length'] > config.requestValidation.maxBodySize) {
    return res.status(413).json({ error: 'Request entity too large' });
  }

  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  if (!config.errorHandling.enabled) {
    return next(err);
  }

  // Log error
  if (config.errorHandling.logErrors) {
    console.error(err);
  }

  // Send error response
  const statusCode = err.statusCode || 500;
  const message = config.errorHandling.hideErrorDetails
    ? 'An error occurred'
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(config.errorHandling.hideErrorDetails ? {} : { stack: err.stack }),
  });
};

module.exports = {
  rateLimiter,
  cors: cors(corsOptions),
  securityHeaders,
  validateApiKey,
  validateRequest,
  errorHandler,
}; 