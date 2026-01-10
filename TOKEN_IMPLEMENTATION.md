# Token Storage & Bearer Authentication Implementation

## Overview
This document explains how tokens are now stored and used for API authentication.

## What Changed

### 1. **Auth Context** ([lib/auth-context.tsx](lib/auth-context.tsx))
- Now stores both **access token** and **refresh token** separately
- Tokens are persisted in `localStorage` with keys:
  - `accessToken` - JWT access token
  - `refreshToken` - JWT refresh token
  - `user` - User data object

#### Token Flow:
```
Login Response: { access, refresh, user, message }
                    ↓
Auth Context stores in localStorage
                    ↓
Persists across page refreshes
                    ↓
Automatically retrieved on app initialization
                    ↓
Cleared on logout
```

### 2. **API Helper Functions** ([lib/api.ts](lib/api.ts))

#### Helper Functions Added:
```typescript
// Get access token from localStorage
function getAccessToken(): string | null

// Build headers with Bearer token
function getHeaders(includeAuth: boolean = true): HeadersInit
```

#### Token Injection:
- Every API call now automatically includes the Bearer token in headers
- Format: `Authorization: Bearer {accessToken}`
- Works for both authenticated and unauthenticated requests

#### Updated Functions:
- `fetchProducts()` - Auto includes token
- `fetchProductBySlug()` - Auto includes token
- `fetchFeaturedProducts()` - Auto includes token
- `fetchProductReviews()` - Auto includes token
- `submitProductReview()` - Auto includes token (no longer requires manual token parameter)

### 3. **Product Reviews Component** ([components/product/product-reviews.tsx](components/product/product-reviews.tsx))
- Updated to use `accessToken` instead of `token`
- Removed manual token parameter from `submitProductReview()` call

## Usage

### Login
```tsx
const { login } = useAuth()
await login(formData)  // Tokens automatically stored
```

### Access Token in Components
```tsx
const { accessToken, isAuthenticated } = useAuth()

if (isAuthenticated) {
  // User is logged in, token available in accessToken
}
```

### API Requests
```tsx
// Token automatically included in all API calls
const products = await fetchProducts()  // Bearer token added automatically
const reviews = await fetchProductReviews(slug)  // Bearer token added automatically
```

### Logout
```tsx
const { logout } = useAuth()
logout()  // Clears all tokens and user data from localStorage
```

## Token Persistence

Tokens are automatically:
- **Stored** in `localStorage` after successful login
- **Retrieved** on app initialization (page refresh)
- **Cleared** on logout
- **Included** in all API requests automatically

## Security Notes

✅ **Implemented:**
- Tokens stored in `localStorage` (accessible to JavaScript)
- Bearer token format in Authorization header
- Tokens cleared on logout
- Persistent across page refreshes

🔄 **Future Enhancements:**
- Implement refresh token rotation
- Handle 401 errors to refresh token automatically
- Consider secure cookie storage for refresh token
- Add token expiration handling

## File Changes Summary

| File | Changes |
|------|---------|
| `lib/auth-context.tsx` | Added accessToken & refreshToken state, updated token storage logic |
| `lib/api.ts` | Added getAccessToken() & getHeaders() helpers, updated all fetch calls |
| `components/product/product-reviews.tsx` | Updated to use accessToken, removed manual token parameter |
