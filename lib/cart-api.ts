import { API_BASE_URL, getHeaders, apiFetch } from "./api";

export interface CartItem {
    id: number;
    service_id: number;
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

export interface Cart {
    id: number;
    user: number | null;
    session_id: string | null;
    status: string;
    subtotal: string;
    tax: string;
    total_amount: string;
    total: string;
    items: CartItem[];
    items_count: number;
    expires_at: string;
    last_activity: string;
    created_at: string;
}

export interface AddToCartData {
    service_id: number;
    quantity?: number;
    booking_date?: string; // YYYY-MM-DD
    booking_time?: string; // HH:MM
    special_requests?: string;
}

export interface UpdateCartItemData {
    quantity?: number;
    booking_date?: string;
    booking_time?: string;
    special_requests?: string;
}

export interface CheckoutData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_instructions?: string;
}

export interface OrderItem {
    id: number;
    product: any; // Simplified, or use ApiProduct
    quantity: number;
    unit_price: string;
    total_price: string;
    status: string;
}

export interface Order {
    id: number;
    order_number: string;
    user: number | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    status: string;
    payment_status: string;
    subtotal: string;
    tax: string;
    total_amount: string;
    order_date: string;
    checkout_date: string;
    fulfillment_date: string | null;
    special_instructions: string;
    order_items: OrderItem[];
}

export async function fetchActiveCart(): Promise<Cart | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/get-my-cart/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
    }
}

export async function addToCart(data: AddToCartData): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/add-to-cart/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return false;
    }
}

export async function updateCartItem(itemId: number, data: UpdateCartItemData): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/items/${itemId}/`, {
            method: "PATCH", // Or PUT, usually PATCH for partial
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating cart item:", error);
        return false;
    }
}

export async function removeCartItem(itemId: number): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/items/${itemId}/remove/`, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error removing cart item:", error);
        return false;
    }
}

export async function clearCart(): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/clear-cart/`, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
}

export async function checkoutCart(data: CheckoutData): Promise<Order | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/checkout/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Checkout failed");
        return await response.json();
    } catch (error) {
        console.error("Error checking out:", error);
        return null;
    }
}

export async function fetchOrders(): Promise<Order[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/orders/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.results || data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function fetchOrderDetail(orderId: number): Promise<Order | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/orders/${orderId}/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching order detail:", error);
        return null;
    }
}

export async function completeOrderPayment(orderId: number, paymentMethod: string, transactionId?: string): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/orders/${orderId}/complete-payment/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ payment_method: paymentMethod, transaction_id: transactionId }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error completing order payment:", error);
        return false;
    }
}

export async function getCartDetail(cartId: number): Promise<Cart | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/cart/${cartId}/detail/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching cart detail:", error);
        return null;
    }
}
