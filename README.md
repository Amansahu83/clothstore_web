# Cloth Store Frontend

Next.js frontend application for the cloth store with admin and user interfaces.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Pages

### User Pages
- `/` - Home page with product listing
- `/login` - User login
- `/register` - User registration
- `/cart` - Shopping cart
- `/orders` - Order history

### Admin Pages
- `/admin` - Admin dashboard for product management

## Features

### User Features
- Browse products with images, prices, and details
- Add products to cart with quantity management
- Secure checkout with shipping address
- View order history
- Responsive design with Tailwind CSS

### Admin Features
- Add new products with image upload
- Edit existing products
- Delete products
- Manage inventory and stock levels
- Admin-only access control

## Components

- `Layout.js` - Main layout with navigation
- Authentication utilities in `utils/auth.js`
- API integration in `utils/api.js`

## Styling

The application uses Tailwind CSS for styling with a clean, modern design that's fully responsive across devices.