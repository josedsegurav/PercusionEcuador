# Input Validation Examples

This document shows practical examples of how to implement input validation in your PEC application using the security measures we've implemented.

## 📋 Table of Contents

1. [Client-Side Validation](#client-side-validation)
2. [Server-Side Validation](#server-side-validation)
3. [API Route Validation](#api-route-validation)
4. [Form Components](#form-components)
5. [Error Handling](#error-handling)

## 🖥️ Client-Side Validation

### Using the Validation Hook

```typescript
import { useFormValidation, checkoutFormSchema } from '@/lib/use-form-validation';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const { errors, validate, validateField, clearFieldError } = useFormValidation(checkoutFormSchema);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field); // Clear error when user starts typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate(formData);
    if (!validation.success) {
      console.log('Form errors:', validation.errors);
      return;
    }

    // Proceed with form submission
    console.log('Valid data:', validation.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className={errors.name ? 'border-red-500' : 'border-gray-300'}
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Real-Time Field Validation

```typescript
const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));

  // Validate field in real-time
  validateField(field, value);
};
```

## 🖥️ Server-Side Validation

### In Server Components

```typescript
import { validateSearchParams } from '@/lib/server-validation';

export default async function ProductsPage({ searchParams }: { searchParams: URLSearchParams }) {
  const validation = await validateSearchParams(searchParams);

  if (!validation.success) {
    return <div>Error: {validation.error}</div>;
  }

  const { query, category, page = 1 } = validation.data;
  // Use validated data...
}
```

### In API Routes

```typescript
import { withValidation, withSecurity } from '@/lib/api-security';
import { productSchema } from '@/lib/validations';

export const POST = withSecurity(
  withValidation(
    productSchema,
    async (request: NextRequest, validatedData: any) => {
      // validatedData is already validated and typed
      const { name, price, category_id } = validatedData;

      // Safe to use the data
      const product = await createProduct(validatedData);
      return NextResponse.json({ product });
    }
  ),
  { requireAdmin: true }
);
```

## 🔧 Form Components

### Reusable Validated Input Component

```typescript
const ValidatedInput = ({
  field,
  label,
  type = 'text',
  required = false,
  placeholder = ''
}: {
  field: keyof FormData;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => {
  const value = formData[field] as string;
  const error = errors[field];

  return (
    <div className="form-group">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
```

### Complete Form Example

```typescript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const { errors, validate } = useFormValidation(contactFormSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate(formData);
    if (!validation.success) return;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data)
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      alert('Error sending message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ValidatedInput
        field="name"
        label="Name"
        required
        placeholder="Your name"
      />

      <ValidatedInput
        field="email"
        label="Email"
        type="email"
        required
        placeholder="your@email.com"
      />

      <ValidatedInput
        field="message"
        label="Message"
        required
        placeholder="Your message"
      />

      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded">
        Send Message
      </button>
    </form>
  );
}
```

## 🛡️ Error Handling

### Client-Side Error Display

```typescript
// Display field-specific errors
{errors.email && (
  <p className="text-red-500 text-xs mt-1">
    {errors.email}
  </p>
)}

// Display general form errors
{errors.general && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {errors.general}
  </div>
)}
```

### Server-Side Error Handling

```typescript
// In API routes
try {
  const validation = validate(formData);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.errors },
      { status: 400 }
    );
  }

  // Process validated data...
} catch (error) {
  return handleError(error, 'API endpoint');
}
```

## 📝 Available Validation Schemas

### User Schema
```typescript
const userSchema = z.object({
  first_name: z.string().min(1).max(50).trim(),
  last_name: z.string().min(1).max(50).trim(),
  email: z.string().email().max(100),
  role: z.enum(['admin', 'user']),
  phone: z.string().optional().refine(val => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val))
});
```

### Product Schema
```typescript
const productSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  selling_price: z.number().positive().max(999999.99),
  stock_quantity: z.number().int().min(0).max(99999),
  category_id: z.string().uuid(),
  vendor_id: z.string().uuid().optional()
});
```

### Order Schema
```typescript
const orderSchema = z.object({
  order_number: z.string().min(1).max(50).trim(),
  customer_name: z.string().min(1).max(100).trim(),
  customer_email: z.string().email().max(100),
  total_amount: z.number().positive(),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']),
  shipping_address: z.string().min(1).max(500).trim()
});
```

## 🚀 Best Practices

### 1. Always Validate on Both Client and Server
```typescript
// Client-side validation for UX
const validation = validate(formData);
if (!validation.success) return;

// Server-side validation for security
const serverValidation = await validateServerInput(schema, data, 'context');
if (!serverValidation.success) {
  return NextResponse.json({ error: serverValidation.error }, { status: 400 });
}
```

### 2. Clear Errors When User Starts Typing
```typescript
const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  clearFieldError(field); // Clear error immediately
};
```

### 3. Use TypeScript for Type Safety
```typescript
// Get typed data from validation
const validation = validate(formData);
if (validation.success) {
  // validation.data is fully typed
  const typedData: CheckoutFormData = validation.data;
}
```

### 4. Provide Clear Error Messages
```typescript
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
```

### 5. Sanitize Input Data
```typescript
import { sanitizeInput } from '@/lib/api-security';

const sanitizedData = sanitizeInput(userInput);
```

## 🔍 Testing Validation

### Test Validation Schemas
```typescript
import { productSchema } from '@/lib/validations';

// Test valid data
const validProduct = {
  name: 'Test Product',
  selling_price: 29.99,
  stock_quantity: 10,
  category_id: '123e4567-e89b-12d3-a456-426614174000'
};

const result = productSchema.safeParse(validProduct);
console.log(result.success); // true

// Test invalid data
const invalidProduct = {
  name: '', // Empty name
  selling_price: -10, // Negative price
  stock_quantity: 'not a number' // Wrong type
};

const invalidResult = productSchema.safeParse(invalidProduct);
console.log(invalidResult.success); // false
console.log(invalidResult.error.issues); // Array of validation errors
```

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [React Hook Form with Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [Next.js Form Handling](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)

---

**Remember**: Always validate on both client and server sides. Client-side validation improves user experience, while server-side validation ensures security.
