import { API_BASE_URL, getHeaders, apiFetch } from "./api";
import { Order } from "./cart-api";

export interface BookingProductData {
    product_id: number;
    quantity: number;
}

export interface BookingCreateData {
    booking_date: string; // YYYY-MM-DD
    booking_time: string; // HH:MM
    number_of_guests: number;
    special_requests?: string;
    products: {
        product: number; // product ID (service_id)
        quantity: number;
    }[];
}

export interface Payment {
    id: number;
    amount: string;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    payment_date: string;
    notes: string;
}

export interface Booking {
    id: number;
    booking_number: string;
    booking_date: string;
    booking_time: string;
    number_of_guests: number;
    special_requests?: string;
    status: string;
    payment_status: string;
    subtotal?: string;
    tax?: string;
    total_amount: string;
    payments: Payment[];
    checkout_url: string | null;
    order: Order | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

export async function createBooking(data: BookingCreateData): Promise<Booking | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/create/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.text();
            console.error("Booking creation failed:", err);
            throw new Error("Failed to create booking");
        }
        const result = await response.json();
        return result.booking || result;
    } catch (error) {
        console.error("Error creating booking:", error);
        return null;
    }
}

export async function fetchMyBookings(): Promise<Booking[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/my-bookings/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.results || data;
    } catch (error) {
        console.error("Error fetching my bookings:", error);
        return [];
    }
}

export async function fetchBookingDetail(bookingNumber: string): Promise<Booking | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/details/`, {
            headers: getHeaders(false),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching booking detail:", error);
        return null;
    }
}

export async function cancelBooking(bookingNumber: string, reason?: string, email?: string): Promise<boolean> {
    try {
        const body: any = {};
        if (reason) body.reason = reason;
        if (email) body.email = email;
        
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/cancel/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify(body),
        });
        return response.ok;
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return false;
    }
}

export async function createCheckoutSession(bookingNumber: string): Promise<{ checkout_url: string, session_id: string } | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/create-checkout-session/`, {
            method: "POST",
            headers: getHeaders(false),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return null;
    }
}

export async function verifyPayment(sessionId: string): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/verify-payment/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify({ session_id: sessionId }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error verifying payment:", error);
        return false;
    }
}

export async function getBookingPaymentStatus(bookingNumber: string): Promise<any> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/payment-status/`, {
            headers: getHeaders(false),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error getting payment status:", error);
        return null;
    }
}

export async function createManualPayment(bookingNumber: string, amount: number, paymentMethod: string, transactionId?: string, notes?: string): Promise<Payment | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/payment/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify({ amount, payment_method: paymentMethod, transaction_id: transactionId, notes }),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error creating manual payment:", error);
        return null;
    }
}

export async function updateBookingStatus(bookingNumber: string, status: string, adminNotes?: string): Promise<Booking | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/update-status/`, {
            method: "PATCH",
            headers: getHeaders(true),
            body: JSON.stringify({ status, admin_notes: adminNotes }),
        });
        if (!response.ok) return null;
        const result = await response.json();
        return result.booking || result;
    } catch (error) {
        console.error("Error updating booking status:", error);
        return null;
    }
}
