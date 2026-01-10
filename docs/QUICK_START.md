# Quick Reference Guide

## Running the Application

### Prerequisites
- Node.js 18.17+
- pnpm (or yarn/npm)
- Django backend running on `http://127.0.0.1:8000`

### Quick Start
```bash
cd /mnt/d/Projects/line-in/frontend
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Key API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - Create account
- `POST /api/v1/auth/login/` - Log in
- `POST /api/v1/auth/logout/` - Log out
- `GET /api/v1/auth/profile/` - Get profile
- `PATCH /api/v1/auth/profile/update/` - Update profile

### Products
- `GET /api/v1/products/list/` - All products
- `GET /api/v1/products/featured/` - Featured products
- `GET /api/v1/products/{slug}/detail/` - Product details
- `GET /api/v1/products/{slug}/reviews/` - Product reviews
- `POST /api/v1/products/{slug}/reviews/` - Post review

### Cart
- `GET /api/v1/cart/get-my-cart/` - Get cart
- `POST /api/v1/cart/add-to-cart/` - Add item
- `DELETE /api/v1/cart/items/{id}/remove/` - Remove item
- `POST /api/v1/cart/checkout/` - Create order

### Other
- `POST /api/v1/contacts/new/` - Submit contact form

## Environment Configuration

**File:** `.env`

```env
# Backend API URL (must point to Django)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Development settings
NEXT_IMAGE_UNOPTIMIZED=true
NEXT_IGNORE_TYPE_ERRORS=false
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| API connection refused | Ensure Django backend is running on port 8000 |
| CORS error | Check Django CORS settings include frontend URL |
| Login fails | Verify credentials are correct, check console for error details |
| Cart not saving | Verify user is authenticated (check localStorage) |
| Images not loading | Check media URL configuration in Django |

## Frontend Features

- ✅ User authentication (register, login, logout)
- ✅ Product browsing and search
- ✅ Shopping cart management
- ✅ Checkout and order creation
- ✅ Product reviews
- ✅ Wishlist/favorites
- ✅ User profile management
- ✅ Contact form
- ✅ Responsive design
- ✅ Dark/light mode

## Important Files

| File | Purpose |
|------|---------|
| `lib/api.ts` | Product and review API functions |
| `lib/auth-actions.ts` | Authentication functions |
| `lib/auth-context.tsx` | Authentication state management |
| `lib/cart-context.tsx` | Shopping cart state management |
| `components/contact-form.tsx` | Contact form component |
| `.env` | Environment configuration |

## Database Tables Used (Backend)

- `auth_user` - User accounts
- `products` - Products (called "services" in backend)
- `cart` - Shopping carts
- `cart_items` - Items in cart
- `orders` - Completed orders
- `bookings` - Booking records
- `reviews` - Product reviews
- `favorites` - User favorites

## Testing the API

### Using cURL
```bash
# Get featured products
curl http://127.0.0.1:8000/api/v1/products/featured/

# Login
curl -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### Using Frontend
1. Navigate to pages to test features
2. Open browser DevTools (F12)
3. Go to Network tab to see API calls
4. Go to Application > Local Storage to see tokens

## Development Tips

1. **Debug API calls**: Check Network tab in DevTools
2. **Check auth state**: Run `localStorage.getItem('accessToken')` in console
3. **Check cart state**: Use React DevTools browser extension
4. **API errors**: Check response in Network tab > Preview/Response
5. **Hot reload**: Changes automatically reload in browser

## Build & Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Check for errors
pnpm lint
```

## Support

Refer to detailed documentation in:
- `SETUP.md` - Installation guide
- `FIXES_APPLIED.md` - Technical details of fixes
- `INTEGRATION_STATUS.md` - Complete integration status
