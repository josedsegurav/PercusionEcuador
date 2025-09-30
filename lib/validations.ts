import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long').trim(),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long').trim(),
  email: z.string().email('Invalid email address').max(100, 'Email too long'),
  role: z.enum(['admin', 'user'], { message: 'Invalid role' }),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
    message: 'Invalid phone number format'
  })
});

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name too long').trim(),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
  selling_price: z.number().positive('Price must be positive').max(999999.99, 'Price too high'),
  stock_quantity: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative').max(99999, 'Stock too high'),
  category_id: z.string().uuid('Invalid category ID'),
  vendor_id: z.string().uuid('Invalid vendor ID').optional(),
  image_name: z.string().optional(),
  bucket_id: z.string().optional()
});

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long').trim(),
  description: z.string().max(200, 'Description too long').optional().or(z.literal(''))
});

// Order validation schemas
export const orderSchema = z.object({
  order_number: z.string().min(1, 'Order number is required').max(50, 'Order number too long').trim(),
  customer_name: z.string().min(1, 'Customer name is required').max(100, 'Customer name too long').trim(),
  customer_email: z.string().email('Invalid email address').max(100, 'Email too long'),
  customer_phone: z.string().optional().refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
    message: 'Invalid phone number format'
  }),
  total_amount: z.number().positive('Total amount must be positive'),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded'], {
    message: 'Invalid payment status'
  }),
  shipping_address: z.string().min(1, 'Shipping address is required').max(500, 'Address too long').trim()
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'File type must be JPEG, PNG, WebP, or GIF'
    )
});

// Search and filter validation
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query too long').trim().optional(),
  category: z.string().uuid('Invalid category ID').optional(),
  min_price: z.number().min(0, 'Min price cannot be negative').optional(),
  max_price: z.number().min(0, 'Max price cannot be negative').optional(),
  page: z.number().int('Page must be a whole number').min(1, 'Page must be at least 1').optional(),
  limit: z.number().int('Limit must be a whole number').min(1, 'Limit must be at least 1').max(100, 'Limit too high').optional()
});

// URL parameter validation
export const urlParamsSchema = z.object({
  id: z.coerce.number('Invalid ID format').positive().optional(),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
});

export const urlOrderParamsSchema = z.object({
  slug: z.string().min(1, 'Slug is required').max(16, 'Slug too long').regex(/^[a-zA-Z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
});

// Sanitization helper
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .substring(0, 1000); // Limit length
};

// Validation error formatter
export const formatValidationError = (error: z.ZodError): string => {
  return error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
};

// Type exports for TypeScript
export type UserInput = z.infer<typeof userSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type UrlParams = z.infer<typeof urlParamsSchema>;
export type UrlOrderParams = z.infer<typeof urlOrderParamsSchema>;
