# API Integration Summary

## Overview
All APIs from the Line In Backend API Documentation have been successfully integrated into the frontend. The integration follows the documented API specifications precisely.

---

## Base Configuration
- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: JWT Bearer Token (stored in `localStorage.accessToken`)
- **Error Handling**: Centralized in `lib/api.ts` with automatic 401 handling and token refresh prompts

---

## Authentication Endpoints (`lib/auth-actions.ts`)

### Implemented Functions:
1. **`loginUser(data: FormData)`**
   - POST `/auth/login/`
   - Accepts: `username`, `password`
   - Returns: Access token, refresh token, user object
   - Authentication: Not required

2. **`registerUser(data: FormData)`**
   - POST `/auth/register/`
   - Accepts: `username`, `email`, `password`, `password2`, `full_name`, `phone`, `gender`
   - Returns: User object with confirmation message
   - Authentication: Not required

3. **`checkUsernameEmail(username?: string, email?: string)`**
   - GET `/auth/user-check/?username=X&email=Y`
   - Checks if username or email exists
   - Returns: `{ status: boolean }`
   - Authentication: Not required

4. **`logoutUser(refresh?: string)`**
   - POST `/auth/logout/`
   - Accepts: `refresh` token
   - Returns: Success message
   - Authentication: Required

5. **`refreshToken(refresh: string)`**
   - POST `/auth/token/refresh/`
   - Accepts: `refresh` token
   - Returns: New `access` token
   - Authentication: Not required

6. **`fetchProfile()`**
   - GET `/auth/profile/`
   - Returns: User profile object
   - Authentication: Required

7. **`updateProfile(data: Partial<UserProfile>)`**
   - PATCH `/auth/profile/update/`
   - Accepts: `username`, `email`, `full_name`, `phone`, `gender`
   - Returns: Updated user profile
   - Authentication: Required

8. **`updateAvatar(file: File)`**
   - PATCH `/auth/profile/avatar/`
   - Accepts: `avatar` (multipart file)
   - Returns: Updated user profile with new avatar URL
   - Authentication: Required

9. **`forgotPassword(username: string)`**
   - POST `/auth/forgot-password/`
   - Accepts: `username` (email or username)
   - Returns: Success message
   - Authentication: Not required

10. **`resetPassword(username: string, token: string, newPassword: string)`**
    - POST `/auth/reset-password/`
    - Accepts: `username`, `token`, `new_password`
    - Returns: Success message
    - Authentication: Not required

11. **`googleSignup(idToken: string)`**
    - POST `/auth/google/signup/`
    - Accepts: `id_token` (from Google)
    - Returns: User object, access/refresh tokens
    - Authentication: Not required

12. **`googleSignin(idToken: string)`**
    - POST `/auth/google/signin/`
    - Accepts: `id_token` (from Google)
    - Returns: User object, access/refresh tokens
    - Authentication: Not required

---

## Products Endpoints (`lib/api.ts`)

### Implemented Functions:

1. **`fetchProducts()`**
   - GET `/products/list/`
   - Returns: Paginated list of products
   - Handles pagination automatically

2. **`fetchProductBySlug(slug: string)`**
   - GET `/products/{slug}/detail/`
   - Returns: Detailed product information

3. **`fetchFeaturedProducts()`**
   - GET `/products/featured/`
   - Returns: 4 most recent featured products

4. **`fetchAdvertisements()`**
   - GET `/products/advertisement/`
   - Returns: Top 5 active advertisements

5. **`fetchProductReviews(slug: string, page: number)`**
   - GET `/products/{slug}/reviews/?page=X`
   - Returns: Paginated reviews with author info

6. **`submitProductReview(slug: string, message: string, rating: number)`**
   - POST `/products/{slug}/reviews/`
   - Accepts: `message`, `rating` (1-5)
   - Returns: Review object
   - Authentication: Required

7. **`replyToReview(commentId: number, message: string)`**
   - POST `/products/reviews/{comment_id}/reply/`
   - Accepts: `reply` (message text)
   - Returns: Success message
   - Authentication: Required

8. **`fetchFavorites()`**
   - GET `/products/favorites/list-create/`
   - Returns: List of favorite products
   - Authentication: Required

9. **`addFavorite(serviceId: number)`**
   - POST `/products/favorites/list-create/`
   - Accepts: `product_id`
   - Returns: Favorite object
   - Authentication: Required

10. **`removeFavorite(serviceId: number)`**
    - DELETE `/products/favorites/delete/{product_id}/`
    - Returns: Success (204 No Content)
    - Authentication: Required

---

## Bookings Endpoints (`lib/bookings-api.ts`)

### Implemented Functions:

1. **`createBooking(data: BookingCreateData)`**
   - POST `/bookings/create/`
   - Accepts: `booking_date`, `booking_time`, `number_of_guests`, `special_requests`, `products[]`
   - Returns: Booking object with booking_number
   - Authentication: Not required (but can be authenticated)

2. **`fetchMyBookings()`**
   - GET `/bookings/my-bookings/`
   - Returns: Paginated list of user's bookings
   - Authentication: Required

3. **`fetchBookingDetail(bookingNumber: string)`**
   - GET `/bookings/{booking_number}/details/`
   - Returns: Full booking details including payments
   - Authentication: Not required

4. **`cancelBooking(bookingNumber: string, reason?: string, email?: string)`**
   - POST `/bookings/{booking_number}/cancel/`
   - Accepts: `reason`, `email` (required if not authenticated)
   - Returns: Success message
   - Authentication: Not required

5. **`createCheckoutSession(bookingNumber: string)`**
   - POST `/bookings/{booking_number}/create-checkout-session/`
   - Returns: `{ checkout_url, session_id }`
   - Authentication: Not required

6. **`verifyPayment(sessionId: string)`**
   - POST `/bookings/verify-payment/`
   - Accepts: `session_id`
   - Returns: Success status
   - Authentication: Not required

7. **`getBookingPaymentStatus(bookingNumber: string)`**
   - GET `/bookings/{booking_number}/payment-status/`
   - Returns: Payment status, total amount, paid amount
   - Authentication: Not required

8. **`createManualPayment(bookingNumber: string, amount: number, paymentMethod: string, transactionId?: string, notes?: string)`**
   - POST `/bookings/{booking_number}/payment/`
   - Accepts: `amount`, `payment_method`, `transaction_id`, `notes`
   - Returns: Payment object
   - Authentication: Not required

9. **`updateBookingStatus(bookingNumber: string, status: string, adminNotes?: string)`**
   - PATCH `/bookings/{booking_number}/update-status/`
   - Accepts: `status`, `admin_notes`
   - Returns: Updated booking
   - Authentication: Required (Admin only)

---

## Cart Endpoints (`lib/cart-api.ts`)

### Implemented Functions:

1. **`fetchActiveCart()`**
   - GET `/cart/get-my-cart/`
   - Returns: Cart object with items, totals
   - Authentication: Required

2. **`addToCart(data: AddToCartData)`**
   - POST `/cart/add-to-cart/`
   - Accepts: `product_id`, `quantity`, `booking_date`, `booking_time`, `special_requests`
   - Returns: Updated cart
   - Authentication: Required

3. **`updateCartItem(itemId: number, data: UpdateCartItemData)`**
   - PATCH `/cart/items/{item_id}/`
   - Accepts: `quantity`, `booking_date`, `booking_time`, `special_requests`
   - Returns: Updated cart item
   - Authentication: Required

4. **`removeCartItem(itemId: number)`**
   - DELETE `/cart/items/{item_id}/remove/`
   - Returns: Success message
   - Authentication: Required

5. **`clearCart()`**
   - DELETE `/cart/clear-cart/`
   - Returns: Success message
   - Authentication: Required

6. **`checkoutCart(data: CheckoutData)`**
   - POST `/cart/checkout/`
   - Accepts: `customer_name`, `customer_email`, `customer_phone`, `special_instructions`
   - Returns: Order object
   - Authentication: Required

7. **`fetchOrders()`**
   - GET `/cart/orders/`
   - Returns: Paginated list of user's orders
   - Authentication: Required

8. **`fetchOrderDetail(orderId: number)`**
   - GET `/cart/orders/{order_id}/`
   - Returns: Full order details with items
   - Authentication: Required

9. **`completeOrderPayment(orderId: number, paymentMethod: string, transactionId?: string)`**
   - POST `/cart/orders/{order_number}/complete-payment/`
   - Accepts: `payment_method`, `transaction_id`
   - Returns: Success status
   - Authentication: Required

10. **`getCartDetail(cartId: number)`**
    - GET `/cart/{cart_id}/detail/`
    - Returns: Cart details
    - Authentication: Required

---

## Contacts Endpoints (`lib/contacts-api.ts`)

### Implemented Functions:

1. **`sendContactMessage(data: ContactMessageData)`**
   - POST `/contacts/new/`
   - Accepts: `name`, `email`, `subject`, `message`
   - Returns: Success message
   - Authentication: Not required
   - Auto-sends confirmation email to customer
   - Auto-sends notification to admin

---

## API Response Handling

### Pagination Support
Endpoints returning paginated results follow this format:
```json
{
  "count": 100,
  "next": "http://...",
  "previous": null,
  "results": [...]
}
```
Functions automatically extract the `results` array.

### Error Handling
- **401 Unauthorized**: Automatically handled with user notification and redirect to login
- **400 Bad Request**: Validation errors with field details
- **404 Not Found**: Returns null or empty array depending on function
- **500 Server Error**: Logged and returns null or false

### Token Management
- Access tokens are stored in `localStorage.accessToken`
- Refresh tokens are stored in `localStorage.refreshToken`
- Tokens are automatically included in `Authorization: Bearer {token}` header
- Token expiration is detected and prompts user to login

---

## Type Definitions

All API response types are properly defined:
- `User`, `UserProfile` for authentication
- `Product`, `ApiProduct`, `ApiProductDetail` for products
- `Review`, `ReviewsResponse` for reviews
- `Booking`, `BookingCreateData` for bookings
- `Cart`, `CartItem`, `Order`, `OrderItem` for cart/orders
- `ContactMessageData` for contacts
- `Payment` for payment information
- `Favorite` for favorites
- `Advertisement` for advertisements

---

## Features Implemented

✅ Complete authentication flow (login, register, password reset)
✅ Google OAuth2 integration (signup/signin)
✅ Profile management (view, update, avatar upload)
✅ Product browsing (list, featured, search by slug)
✅ Product reviews (read, create, reply)
✅ Favorites management (add, remove, list)
✅ Bookings creation and management
✅ Payment processing (Stripe, manual)
✅ Shopping cart (add, update, remove, checkout)
✅ Order management
✅ Contact message submission
✅ Automatic error handling and user notifications
✅ JWT token refresh flow

---

## Important Notes

1. **CORS**: Make sure backend CORS settings include your frontend URL
2. **Environment Variables**: Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. **Error Messages**: All errors are logged to console for debugging
4. **Toast Notifications**: Uses Sonner for user-friendly error messages
5. **Default Base URL**: Falls back to `http://127.0.0.1:8000/api/v1` if env var not set
6. **Multipart Requests**: Avatar uploads automatically exclude Content-Type header for proper FormData handling

---

## API Documentation Reference
See the attached `API_DOCUMENTATION.md` for complete endpoint specifications, request/response formats, and integration examples.

**Last Updated**: January 3, 2026
**Status**: All endpoints integrated and tested
