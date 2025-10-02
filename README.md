# Percusión Ecuador - E-commerce Platform

A modern, full-stack e-commerce platform for percussion instruments built with Next.js 15, Supabase, and TypeScript. This application serves as the digital storefront for Percusión Ecuador, a specialized percussion instruments retailer established in 2011.

## 🥁 About Percusión Ecuador

Percusión Ecuador is Ecuador's specialized percussion accessories store, established in 2011. We offer the best service with top national and international brands, providing continuous education through certifications and classes for percussionists, drummers, educators, and musicians in general.

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse and search percussion instruments by categories
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Complete checkout process with order tracking
- **User Authentication**: Secure login/signup with Supabase Auth
- **Admin Dashboard**: Full CRUD operations for products, categories, orders, and users

### 🎯 Key Capabilities
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live cart updates and inventory management
- **Form Validation**: Comprehensive client and server-side validation
- **Payment Integration**: Multiple payment methods (bank transfer, cash on delivery, credit card)
- **WhatsApp Integration**: Direct ordering through WhatsApp Business
- **Image Management**: Supabase Storage for product images
- **Order Tracking**: Complete order lifecycle management

### 🔧 Technical Features
- **Next.js 15**: Latest App Router with Server Components
- **TypeScript**: Full type safety throughout the application
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **Zustand**: State management for shopping cart
- **Zod**: Schema validation for forms and API
- **FontAwesome**: Comprehensive icon library
- **Tailwind CSS**: Utility-first CSS framework


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **Validation**: Zod
- **Icons**: FontAwesome
- **Deployment**: Vercel (recommended)

## 📱 Pages & Features

### Public Pages
- **Home**: Hero section, featured products, company info
- **Products**: Product catalog with filtering and search
- **Categories**: Browse products by category
- **Cart**: Shopping cart with checkout form
- **Orders**: Order tracking and history

### Admin Pages
- **Dashboard**: Overview of products, orders, and users
- **Products**: Add, edit, delete products
- **Categories**: Manage product categories
- **Orders**: View and manage customer orders
- **Users**: User management and roles

### Authentication
- **Login/Signup**: User registration and authentication
- **Password Reset**: Forgot password functionality
- **Protected Routes**: Admin-only access controls

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **API Security**: Server-side validation and sanitization
- **Authentication**: Secure user authentication with Supabase
- **Authorization**: Role-based access control
- **Input Validation**: Client and server-side form validation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Configure your hosting platform with the built files

## 📄 License

This project is proprietary software owned by Percusión Ecuador.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [FontAwesome](https://fontawesome.com/)
