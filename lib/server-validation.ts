import { z } from 'zod';

// Server-side validation utility
export async function validateServerInput<T extends z.ZodType>(
  schema: T,
  data: unknown,
  context: string
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: string }> {
  try {
    const result = schema.safeParse(data);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errorMessage = result.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');

      console.error(`Validation error in ${context}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error(`Validation error in ${context}:`, error);
    return { success: false, error: 'Validation failed' };
  }
}

// Example: Validate search parameters
export async function validateSearchParams(searchParams: URLSearchParams) {
  const searchSchema = z.object({
    query: z.string().max(100, 'Search query too long').optional(),
    category: z.string().uuid('Invalid category ID').optional(),
    min_price: z.coerce.number().min(0, 'Min price cannot be negative').optional(),
    max_price: z.coerce.number().min(0, 'Max price cannot be negative').optional(),
    page: z.coerce.number().int('Page must be a whole number').min(1, 'Page must be at least 1').optional(),
    limit: z.coerce.number().int('Limit must be a whole number').min(1, 'Limit must be at least 1').max(100, 'Limit too high').optional()
  });

  const data = Object.fromEntries(searchParams.entries());
  return validateServerInput(searchSchema, data, 'search parameters');
}

// Example: Validate URL parameters
export async function validateUrlParams(params: { id: string; slug: string }) {
  const urlParamsSchema = z.object({
    id: z.string().uuid('Invalid ID format'),
    slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  });

  return validateServerInput(urlParamsSchema, params, 'URL parameters');
}

// Example: Validate form data from request
export async function validateFormData<T extends z.ZodType>(
  schema: T,
  request: Request,
  context: string
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: string }> {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    return validateServerInput(schema, data, context);
  } catch (error) {
    console.error(`Error parsing form data in ${context}:`, error);
    return { success: false, error: 'Failed to parse form data' };
  }
}

// Example: Validate JSON data from request
export async function validateJsonData<T extends z.ZodType>(
  schema: T,
  request: Request,
  context: string
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: string }> {
  try {
    const jsonData = await request.json();
    return validateServerInput(schema, jsonData, context);
  } catch (error) {
    console.error(`Error parsing JSON data in ${context}:`, error);
    return { success: false, error: 'Failed to parse JSON data' };
  }
}
