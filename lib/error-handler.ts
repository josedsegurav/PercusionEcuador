import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// Error types for better error handling
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR'
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Secure error handler that doesn't leak sensitive information
export const handleError = (error: unknown, context?: string): NextResponse => {
  // Log the full error for debugging (server-side only)
  console.error(`Error in ${context || 'unknown context'}:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    context
  });

  // Handle different error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
        timestamp: new Date().toISOString()
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return NextResponse.json(
      {
        error: 'Validation failed',
        type: ErrorType.VALIDATION_ERROR,
        details: validationErrors,
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    );
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string };

    // Map Supabase error codes to appropriate HTTP status codes
    const statusCode = getSupabaseErrorStatusCode(supabaseError.code);

    return NextResponse.json(
      {
        error: getSafeErrorMessage(supabaseError.message),
        type: ErrorType.DATABASE_ERROR,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }

  // Generic error response (never expose internal details)
  return NextResponse.json(
    {
      error: 'An unexpected error occurred. Please try again later.',
      type: ErrorType.INTERNAL_ERROR,
      timestamp: new Date().toISOString()
    },
    { status: 500 }
  );
};

// Map Supabase error codes to HTTP status codes
const getSupabaseErrorStatusCode = (code?: string): number => {
  switch (code) {
    case 'PGRST116': // Row not found
      return 404;
    case '23505': // Unique constraint violation
      return 409;
    case '23503': // Foreign key constraint violation
      return 400;
    case '23514': // Check constraint violation
      return 400;
    case '42501': // Insufficient privilege
      return 403;
    default:
      return 500;
  }
};

// Sanitize error messages to prevent information disclosure
const getSafeErrorMessage = (message: string): string => {
  // Remove sensitive information from error messages
  const safeMessage = message
    .replace(/password/gi, '[REDACTED]')
    .replace(/token/gi, '[REDACTED]')
    .replace(/key/gi, '[REDACTED]')
    .replace(/secret/gi, '[REDACTED]')
    .replace(/connection/gi, '[REDACTED]')
    .replace(/database/gi, '[REDACTED]')
    .replace(/table/gi, '[REDACTED]')
    .replace(/column/gi, '[REDACTED]');

  // Return generic message for potentially sensitive errors
  if (safeMessage.includes('[REDACTED]') || safeMessage.length > 200) {
    return 'An error occurred while processing your request.';
  }

  return safeMessage;
};

// Validation error handler
export const handleValidationError = (error: ZodError): NextResponse => {
  const formattedErrors = error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));

  return NextResponse.json(
    {
      error: 'Validation failed',
      type: ErrorType.VALIDATION_ERROR,
      details: formattedErrors,
      timestamp: new Date().toISOString()
    },
    { status: 400 }
  );
};

// Authentication error handler
export const handleAuthError = (message: string = 'Authentication required'): NextResponse => {
  return NextResponse.json(
    {
      error: message,
      type: ErrorType.AUTHENTICATION_ERROR,
      timestamp: new Date().toISOString()
    },
    { status: 401 }
  );
};

// Authorization error handler
export const handleAuthzError = (message: string = 'Insufficient permissions'): NextResponse => {
  return NextResponse.json(
    {
      error: message,
      type: ErrorType.AUTHORIZATION_ERROR,
      timestamp: new Date().toISOString()
    },
    { status: 403 }
  );
};

// Not found error handler
export const handleNotFoundError = (resource: string = 'Resource'): NextResponse => {
  return NextResponse.json(
    {
      error: `${resource} not found`,
      type: ErrorType.NOT_FOUND_ERROR,
      timestamp: new Date().toISOString()
    },
    { status: 404 }
  );
};

// Rate limit error handler
export const handleRateLimitError = (): NextResponse => {
  return NextResponse.json(
    {
      error: 'Too many requests. Please try again later.',
      type: ErrorType.RATE_LIMIT_ERROR,
      timestamp: new Date().toISOString()
    },
    { status: 429 }
  );
};
