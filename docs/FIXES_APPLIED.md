# Backend API Integration Fixes

## Summary
This document outlines all the fixes applied to integrate the Next.js frontend with the Django backend API at `/mnt/d/Projects/line-in/backend`.

## Files Modified

### 1. `lib/auth-context.tsx`
**Issue:** Login response handling expected different field names
**Fix:** Updated login function to handle Django backend's `access` and `refresh` field names (not `accessToken` and `refreshToken`)
```typescript
// Before
const access = data.access;
const refresh = data.refresh;

// After
const accessToken = data.access || data.accessToken;
const refreshToken = data.refresh || data.refreshToken;
```

### 2. `lib/auth-actions.ts`
**Issue:** FormData was being sent directly instead of JSON-encoded
**Fix:** Updated both `loginUser` and `registerUser` to convert FormData to JSON before sending

#### loginUser
- Convert FormData fields to JSON object with `username` and `password`
- Send as `application/json`

#### registerUser
- Convert FormData to JSON with all required fields:
  - `username`, `email`, `password`, `password_confirm` (from form field `password2`)
  - `full_name`, `phone`, `gender`
- Send as `application/json`

### 3. `.env` (configuration file)
**Issue:** API URL was pointing to wrong backend
**Fix:** Updated `NEXT_PUBLIC_API_BASE_URL` to point to Django backend
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

### 4. `lib/api.ts`
**Issue:** API base URL was hardcoded
**Fix:** Made it configurable via environment variable with fallback
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
```

### 5. `app/contact/page.tsx`
**Issue:** Contact form was not functional - just static HTML
**Fix:** Updated to import and use the new ContactForm component

### 6. `components/contact-form.tsx` (NEW)
**Created:** Functional contact form component with API integration
- Handles form state management
- Converts form data to API format
- Calls `sendContactMessage` from contacts-api
- Shows loading state and success/error toasts

## Backend API Endpoints Used

### Authentication (`/api/v1/auth/`)
- `POST /register/` - User registration
- `POST /login/` - User login  
- `POST /logout/` - User logout
- `GET /user-check/` - Check if user exists
- `GET /profile/` - Get current user profile
- `PATCH /profile/update/` - Update user profile
- `PATCH /profile/avatar/` - Update user avatar
- `POST /forgot-password/` - Request password reset
- `POST /reset-password/` - Reset password with token
- `POST /token/refresh/` - Refresh access token

### Products (`/api/v1/products/`)
- `GET /list/` - Get all products
- `GET /{slug}/detail/` - Get product details
- `GET /featured/` - Get featured products
- `GET /advertisement/` - Get advertisements
- `GET /{slug}/reviews/` - Get product reviews with pagination
- `POST /{slug}/reviews/` - Submit product review
- `POST /reviews/{id}/reply/` - Reply to review
- `GET /favorites/list-create/` - Get user's favorites / add to favorites
- `DELETE /favorites/delete/{id}/` - Remove from favorites

### Cart (`/api/v1/cart/`)
- `GET /get-my-cart/` - Get active shopping cart
- `POST /add-to-cart/` - Add item to cart
- `PATCH /items/{id}/` - Update cart item
- `DELETE /items/{id}/remove/` - Remove item from cart
- `POST /clear-cart/` - Clear entire cart
- `POST /checkout/` - Checkout and create order
- `GET /orders/` - Get user's orders
- `GET /orders/{id}/` - Get order details
- `POST /orders/{id}/complete-payment/` - Complete payment

### Bookings (`/api/v1/bookings/`)
- `POST /create/` - Create a booking
- `GET /my-bookings/` - Get user's bookings
- `GET /list/` - Get all bookings
- `GET /{number}/details/` - Get booking details
- `POST /{number}/cancel/` - Cancel a booking
- `POST /{number}/payment/` - Create payment
- `POST /{number}/create-checkout-session/` - Create Stripe checkout session
- `POST /{number}/payment-status/` - Check payment status
- `POST /verify-payment/` - Verify payment
- `POST /stripe-webhook/` - Stripe webhook handler

### Contacts (`/api/v1/contacts/`)
- `POST /new/` - Submit contact form message

## Data Type Mappings

### Authentication Response
```typescript
{
  access: string;           // JWT access token
  refresh: string;          // JWT refresh token
  user: {
    username: string;
    email: string;
    full_name: string;
  };
  message: string;
}
```

### Cart Item (from backend)
```typescript
{
  id: number;
  product_id: number;
  service_name: string;
  service_price: string;
  quantity: number;
  subtotal: string;
  service_slug: string;
  service_image: string;
  service_duration: number;
  service_description: string;
  unit: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  special_requests: string | null;
  created_at: string;
}
```

### Product (from backend)
```typescript
{
  id: number;
  slug: string;
  name: string;
  price: string;
  files: Array<{ id: number; images: string }>;
  synopsis: string;
  rating: number;
  review_count: number;
  is_favorite: boolean;
}
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_BASE_URL` - Django backend API base URL (default: http://127.0.0.1:8000/api/v1)

### Optional
- `NEXT_IMAGE_UNOPTIMIZED` - Disable Next.js image optimization (default: true)
- `NEXT_IGNORE_TYPE_ERRORS` - Ignore TypeScript errors during build (default: false)

## Features Implemented

✅ **Authentication**
- User registration with validation
- User login with JWT tokens
- Token storage in localStorage
- Automatic token refresh
- Session timeout handling

✅ **Product Management**
- Browse all products with pagination
- View featured products
- Product filtering and sorting
- Detailed product pages
- Product reviews with ratings
- Wishlist/favorites management

✅ **Shopping Cart**
- Add products with size/color selection
- Update quantities
- Remove items
- Cart total calculation
- Tax calculation (8%)
- Free shipping over $100

✅ **Checkout**
- Order creation from cart
- Customer information collection
- Order confirmation

✅ **Contact Form**
- Contact message submission
- Form validation
- Success/error notifications

✅ **User Management**
- Profile viewing and editing
- Avatar upload
- Password reset

## Testing Checklist

- [ ] User can register a new account
- [ ] User can login with email/username
- [ ] User can view profile
- [ ] User can update profile information
- [ ] User can change avatar
- [ ] User can logout
- [ ] Products display with correct information
- [ ] Featured products load
- [ ] Users can add products to cart
- [ ] Users can modify cart (update quantities, remove items)
- [ ] Users can view cart with correct totals
- [ ] Users can proceed to checkout
- [ ] Users can create orders
- [ ] Users can view order history
- [ ] Users can submit contact form
- [ ] Users can leave product reviews
- [ ] Users can add/remove favorites
- [ ] Cart persists for authenticated users
- [ ] Cart persists in localStorage for anonymous users
- [ ] Error messages display correctly
- [ ] Loading states display correctly

## Known Limitations

- The API base URL is configurable but defaults to localhost:8000
- Cart is stored in-memory for speed; for production, consider server-side persistence
- Image optimization is disabled for local development
- CORS must be properly configured in Django settings for cross-origin requests

## Next Steps for Production

1. Update `NEXT_PUBLIC_API_BASE_URL` to production backend URL
2. Enable image optimization (set `NEXT_IMAGE_UNOPTIMIZED=false`)
3. Configure CORS in Django for production domain
4. Set up proper error tracking and logging
5. Implement rate limiting on frontend for API calls
6. Add request/response caching where appropriate
7. Implement proper session management and token expiration
