// import { createClient } from '@/lib/supabase/server';
// import { NextRequest, NextResponse } from 'next/server';
// import { handleAuthError, handleAuthzError, handleError, AppError, ErrorType } from './error-handler';

// // Rate limiting store (in production, use Redis or similar)
// const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// // Rate limiting configuration
// const RATE_LIMIT_CONFIG = {
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   maxRequests: 100, // Max requests per window
//   maxAuthRequests: 10, // Max auth requests per window
//   maxAdminRequests: 50 // Max admin requests per window
// };

// // Check rate limit for a given IP
// export const checkRateLimit = (ip: string, endpoint: string): boolean => {
//   const now = Date.now();
//   const key = `${ip}:${endpoint}`;
//   const limit = getRateLimitForEndpoint(endpoint);

//   const current = rateLimitStore.get(key);

//   if (!current || now > current.resetTime) {
//     rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_CONFIG.windowMs });
//     return true;
//   }

//   if (current.count >= limit) {
//     return false;
//   }

//   current.count++;
//   return true;
// };

// // Get rate limit based on endpoint type
// const getRateLimitForEndpoint = (endpoint: string): number => {
//   if (endpoint.includes('/auth/')) {
//     return RATE_LIMIT_CONFIG.maxAuthRequests;
//   }
//   if (endpoint.includes('/admin/')) {
//     return RATE_LIMIT_CONFIG.maxAdminRequests;
//   }
//   return RATE_LIMIT_CONFIG.maxRequests;
// };

// // Get client IP address
// export const getClientIP = (request: NextRequest): string => {
//   const forwarded = request.headers.get('x-forwarded-for');
//   const realIP = request.headers.get('x-real-ip');

//   if (forwarded) {
//     return forwarded.split(',')[0].trim();
//   }

//   if (realIP) {
//     return realIP;
//   }

//   return 'unknown';
// };

// // Authentication middleware
// export const requireAuth = async (request: NextRequest): Promise<{ user: any; supabase: any }> => {
//   const supabase = await createClient();
//   const { data: { user }, error } = await supabase.auth.getUser();

//   if (error || !user) {
//     throw new AppError('Authentication required', ErrorType.AUTHENTICATION_ERROR, 401);
//   }

//   return { user, supabase };
// };

// // Admin authorization middleware
// export const requireAdmin = async (request: NextRequest): Promise<{ user: any; supabase: any }> => {
//   const { user, supabase } = await requireAuth(request);

//   // Get user role from database
//   const { data: userData, error } = await supabase
//     .from('users')
//     .select('role')
//     .eq('id', user.id)
//     .single();

//   if (error || !userData) {
//     throw new AppError('User data not found', ErrorType.AUTHENTICATION_ERROR, 401);
//   }

//   if (userData.role !== 'admin') {
//     throw new AppError('Admin access required', ErrorType.AUTHORIZATION_ERROR, 403);
//   }

//   return { user, supabase };
// };

// // API route wrapper with security checks
// export const withSecurity = (
//   handler: (request: NextRequest, context: any) => Promise<NextResponse>,
//   options: {
//     requireAuth?: boolean;
//     requireAdmin?: boolean;
//     rateLimit?: boolean;
//   } = {}
// ) => {
//   return async (request: NextRequest, context: any): Promise<NextResponse> => {
//     try {
//       // Rate limiting check
//       if (options.rateLimit !== false) {
//         const ip = getClientIP(request);
//         const endpoint = request.nextUrl.pathname;

//         if (!checkRateLimit(ip, endpoint)) {
//           return NextResponse.json(
//             {
//               error: 'Too many requests. Please try again later.',
//               type: 'RATE_LIMIT_ERROR',
//               timestamp: new Date().toISOString()
//             },
//             { status: 429 }
//           );
//         }
//       }

//       // Authentication check
//       if (options.requireAuth || options.requireAdmin) {
//         if (options.requireAdmin) {
//           await requireAdmin(request);
//         } else {
//           await requireAuth(request);
//         }
//       }

//       // Call the actual handler
//       return await handler(request, context);

//     } catch (error) {
//       return handleError(error, `API route: ${request.nextUrl.pathname}`);
//     }
//   };
// };

// // Input validation wrapper
// export const withValidation = <T>(
//   schema: any,
//   handler: (request: NextRequest, validatedData: T, context: any) => Promise<NextResponse>
// ) => {
//   return async (request: NextRequest, context: any): Promise<NextResponse> => {
//     try {
//       let data: any;

//       if (request.method === 'GET') {
//         // Parse query parameters
//         const url = new URL(request.url);
//         data = Object.fromEntries(url.searchParams);
//       } else {
//         // Parse request body
//         data = await request.json();
//       }

//       // Validate data
//       const validatedData = schema.parse(data);

//       // Call handler with validated data
//       return await handler(request, validatedData, context);

//     } catch (error) {
//       if (error instanceof Error && error.name === 'ZodError') {
//         return NextResponse.json(
//           {
//             error: 'Validation failed',
//             type: 'VALIDATION_ERROR',
//             details: error.message,
//             timestamp: new Date().toISOString()
//           },
//           { status: 400 }
//         );
//       }

//       return handleError(error, `Validation error in ${request.nextUrl.pathname}`);
//     }
//   };
// };

// // CORS headers for API routes
// export const addCORSHeaders = (response: NextResponse): NextResponse => {
//   response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
//     ? process.env.NEXT_PUBLIC_SITE_URL || 'https://tienda.percusionecuador.com'
//     : 'http://localhost:3000'
//   );
//   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   response.headers.set('Access-Control-Max-Age', '86400');

//   return response;
// };

// // Security headers for API responses
// export const addSecurityHeaders = (response: NextResponse): NextResponse => {
//   response.headers.set('X-Content-Type-Options', 'nosniff');
//   response.headers.set('X-Frame-Options', 'DENY');
//   response.headers.set('X-XSS-Protection', '1; mode=block');
//   response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

//   return response;
// };

// // Sanitize user input
// export const sanitizeInput = (input: any): any => {
//   if (typeof input === 'string') {
//     return input
//       .trim()
//       .replace(/[<>]/g, '') // Remove potential HTML tags
//       .replace(/['"]/g, '') // Remove quotes that could break SQL
//       .substring(0, 1000); // Limit length
//   }

//   if (Array.isArray(input)) {
//     return input.map(sanitizeInput);
//   }

//   if (input && typeof input === 'object') {
//     const sanitized: any = {};
//     for (const [key, value] of Object.entries(input)) {
//       sanitized[key] = sanitizeInput(value);
//     }
//     return sanitized;
//   }

//   return input;
// };

// // Log security events
// export const logSecurityEvent = (
//   event: string,
//   request: NextRequest,
//   details?: any
// ): void => {
//   const ip = getClientIP(request);
//   const userAgent = request.headers.get('user-agent') || 'unknown';

//   console.log({
//     timestamp: new Date().toISOString(),
//     event,
//     ip,
//     userAgent,
//     path: request.nextUrl.pathname,
//     method: request.method,
//     details
//   });
// };
