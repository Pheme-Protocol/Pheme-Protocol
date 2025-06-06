module.exports = {
  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Access control configuration
  accessControl: {
    enabled: true,
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['https://phemeai.xyz'],
    allowedMethods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Rate-Limit-Remaining'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Audit logging configuration
  auditLogging: {
    enabled: true,
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    transports: ['file', 'console'],
    file: {
      filename: 'logs/audit.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    },
  },

  // Security headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  },

  // API key validation
  apiKeyValidation: {
    enabled: true,
    headerName: 'X-API-Key',
    validate: (key) => {
      // Implement your API key validation logic here
      return process.env.API_KEYS?.split(',').includes(key) || false;
    },
  },

  // Request validation
  requestValidation: {
    enabled: true,
    maxBodySize: '1mb',
    validateContentType: true,
    allowedContentTypes: ['application/json'],
  },

  // Error handling
  errorHandling: {
    enabled: true,
    hideErrorDetails: process.env.NODE_ENV === 'production',
    logErrors: true,
    notifyOnError: true,
  },
}; 