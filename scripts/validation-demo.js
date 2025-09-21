#!/usr/bin/env node

/**
 * Input Validation Demo Script
 *
 * This script demonstrates how to use the validation system in your PEC application.
 */

console.log('🔒 Input Validation Implementation Guide');
console.log('=====================================\n');

console.log('📋 How to Apply Input Validation:');
console.log('');

console.log('1. 🖥️  CLIENT-SIDE VALIDATION (React Components)');
console.log('   ──────────────────────────────────────────────');
console.log('');
console.log('   // Import validation hook and schema');
console.log('   import { useFormValidation, checkoutFormSchema } from "@/lib/use-form-validation";');
console.log('');
console.log('   // In your component');
console.log('   const { errors, validate, validateField, clearFieldError } = useFormValidation(checkoutFormSchema);');
console.log('');
console.log('   // Handle form submission');
console.log('   const handleSubmit = (e) => {');
console.log('     e.preventDefault();');
console.log('     const validation = validate(formData);');
console.log('     if (!validation.success) return;');
console.log('     // Proceed with validated data...');
console.log('   };');
console.log('');

console.log('2. 🖥️  SERVER-SIDE VALIDATION (API Routes)');
console.log('   ────────────────────────────────────────');
console.log('');
console.log('   // Import security utilities');
console.log('   import { withSecurity, withValidation } from "@/lib/api-security";');
console.log('   import { productSchema } from "@/lib/validations";');
console.log('');
console.log('   // Wrap your API handler');
console.log('   export const POST = withSecurity(');
console.log('     withValidation(');
console.log('       productSchema,');
console.log('       async (request, validatedData) => {');
console.log('         // validatedData is already validated and typed');
console.log('         const product = await createProduct(validatedData);');
console.log('         return NextResponse.json({ product });');
console.log('       }');
console.log('     ),');
console.log('     { requireAdmin: true }');
console.log('   );');
console.log('');

console.log('3. 📝 FORM COMPONENTS');
console.log('   ──────────────────');
console.log('');
console.log('   // Use the ValidatedInput component');
console.log('   <ValidatedInput');
console.log('     field="email"');
console.log('     label="Email Address"');
console.log('     type="email"');
console.log('     required');
console.log('     placeholder="your@email.com"');
console.log('   />');
console.log('');

console.log('4. 🛡️  ERROR HANDLING');
console.log('   ──────────────────');
console.log('');
console.log('   // Display field errors');
console.log('   {errors.email && (');
console.log('     <p className="text-red-500 text-xs mt-1">');
console.log('       {errors.email}');
console.log('     </p>');
console.log('   )}');
console.log('');

console.log('5. 📊 AVAILABLE VALIDATION SCHEMAS');
console.log('   ──────────────────────────────');
console.log('');
console.log('   ✅ userSchema - User registration/login');
console.log('   ✅ productSchema - Product creation/editing');
console.log('   ✅ categorySchema - Category management');
console.log('   ✅ orderSchema - Order processing');
console.log('   ✅ checkoutFormSchema - Shopping cart checkout');
console.log('   ✅ contactFormSchema - Contact form');
console.log('   ✅ searchSchema - Search and filtering');
console.log('   ✅ urlParamsSchema - URL parameter validation');
console.log('');

console.log('6. 🚀 QUICK START EXAMPLES');
console.log('   ──────────────────────');
console.log('');
console.log('   📁 Files to check:');
console.log('   • components/ValidatedCartContainer.tsx - Complete form with validation');
console.log('   • components/ContactForm.tsx - Simple contact form');
console.log('   • app/api/contact/route.ts - API route with validation');
console.log('   • lib/use-form-validation.ts - Validation hook');
console.log('   • lib/server-validation.ts - Server-side utilities');
console.log('');

console.log('7. 🔧 IMPLEMENTATION STEPS');
console.log('   ──────────────────────');
console.log('');
console.log('   1. Choose the appropriate validation schema');
console.log('   2. Import the validation hook in your component');
console.log('   3. Add form state management');
console.log('   4. Implement input change handlers');
console.log('   5. Add form submission validation');
console.log('   6. Display validation errors to users');
console.log('   7. Test with valid and invalid data');
console.log('');

console.log('8. ⚠️  IMPORTANT NOTES');
console.log('   ──────────────────');
console.log('');
console.log('   • Always validate on both client AND server');
console.log('   • Client validation improves UX');
console.log('   • Server validation ensures security');
console.log('   • Clear errors when user starts typing');
console.log('   • Provide clear, helpful error messages');
console.log('   • Use TypeScript for type safety');
console.log('');

console.log('9. 🧪 TESTING VALIDATION');
console.log('   ────────────────────');
console.log('');
console.log('   // Test valid data');
console.log('   const validData = { name: "Test", email: "test@example.com" };');
console.log('   const result = schema.safeParse(validData);');
console.log('   console.log(result.success); // true');
console.log('');
console.log('   // Test invalid data');
console.log('   const invalidData = { name: "", email: "invalid" };');
console.log('   const invalidResult = schema.safeParse(invalidData);');
console.log('   console.log(invalidResult.success); // false');
console.log('   console.log(invalidResult.error.issues); // Array of errors');
console.log('');

console.log('📚 For more detailed examples, see:');
console.log('   • VALIDATION_EXAMPLES.md - Comprehensive examples');
console.log('   • SECURITY.md - Security implementation guide');
console.log('   • lib/validations.ts - All available schemas');
console.log('');

console.log('✨ Ready to implement secure input validation!');
