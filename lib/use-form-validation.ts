import { useState, useCallback } from 'react';
import { z } from 'zod';

// Generic form validation hook
export function useFormValidation<T extends z.ZodObject>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback((data: unknown) => {
    try {
      const result = schema.safeParse(data);

      if (result.success) {
        setErrors({});
        setIsValid(true);
        return { success: true, data: result.data, errors: {} };
      } else {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path.join('.');
          fieldErrors[field] = issue.message;
        });

        setErrors(fieldErrors);
        setIsValid(false);
        return { success: false, data: null, errors: fieldErrors };
      }
    } catch (error) {
      console.error('Validation error:', error);
      setErrors({ general: 'Validation failed' });
      setIsValid(false);
      return { success: false, data: null, errors: { general: 'Validation failed' } };
    }
  }, [schema]);

  const validateField = useCallback((fieldName: string, value: unknown) => {
    try {
      // For field-level validation, we'll validate the entire object with just that field
      const partialData = { [fieldName]: value };
      const result = schema.partial().safeParse(partialData);

      if (result.success) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return { success: true, error: null };
      } else {
        const errorMessage = result.error.issues[0]?.message || 'Invalid value';
        setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.log(error)
      const errorMessage = 'Validation failed';
      setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError
  };
}

// Specific validation schemas for common forms
export const checkoutFormSchema = z.object({
  customerName: z.string()
    .min(1, 'Customer name is required')
    .max(100, 'Name too long')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  shippingAddress: z.string()
    .min(1, 'Shipping address is required')
    .max(500, 'Address too long')
    .trim(),
  billingAddress: z.string()
    .max(500, 'Address too long')
    .trim()
    .optional(),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'whatsapp_order', 'cash_on_delivery'], {
    message: 'Invalid payment method'
  }),
  shippingOption: z.enum(['standard', 'express', 'pickup'], {
    message: 'Invalid shipping option'
  }),
  notes: z.string()
    .max(500, 'Notes too long')
    .trim()
    .optional()
});

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name too long')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(100, 'Subject too long')
    .trim(),
  message: z.string()
    .min(1, 'Message is required')
    .max(1000, 'Message too long')
    .trim()
});

export const productFormSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name too long')
    .trim(),
  description: z.string()
    .max(500, 'Description too long')
    .trim()
    .optional(),
  selling_price: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price too high'),
  stock_quantity: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(99999, 'Stock too high'),
  category_id: z.string()
    .uuid('Invalid category ID'),
  vendor_id: z.string()
    .uuid('Invalid vendor ID')
    .optional()
});

// Type exports
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProductFormData = z.infer<typeof productFormSchema>;
