/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    status: 500,
    message: 'Internal server error'
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Validation failed';
    error.details = err.details;
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    error.status = 503;
    error.message = 'Database connection failed';
  }

  // PostgreSQL errors
  if (err.code && err.code.startsWith('23')) { // Constraint violations
    error.status = 409;
    error.message = 'Data conflict';
    
    if (err.code === '23505') { // Unique constraint violation
      error.message = 'Resource already exists';
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.status = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.status = 401;
    error.message = 'Token expired';
  }

  // Rate limiting errors
  if (err.message && err.message.includes('rate limit')) {
    error.status = 429;
    error.message = 'Too many requests';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && error.status === 500) {
    error.message = 'Something went wrong';
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err.message 
    })
  });
};

module.exports = errorHandler;
