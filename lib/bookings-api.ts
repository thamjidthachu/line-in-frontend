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
    status: string;
    payment_status: string;
    total_amount: string;
    payments: Payment[];
    checkout_url: string | null;
    order: Order | null;
    created_at: string;
    updated_at: string;
}

export async function createBooking(data: BookingCreateData): Promise<Booking | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/create/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.text();
            console.error("Booking creation failed:", err);
            throw new Error("Failed to create booking");
        }
        return await response.json();
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
        return await response.json();
    } catch (error) {
        console.error("Error fetching my bookings:", error);
        return [];
    }
}

export async function fetchBookingDetail(bookingNumber: string): Promise<Booking | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/details/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching booking detail:", error);
        return null;
    }
}

export async function cancelBooking(bookingNumber: string): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/cancel/`, {
            method: "POST",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return false;
    }
}

export async function createCheckoutSession(bookingNumber: string): Promise<{ sessionId: string, url: string } | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/bookings/${bookingNumber}/create-checkout-session/`, {
            method: "POST",
            headers: getHeaders(true),
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
        const response = await apiFetch(`${API_BASE_URL}/bookings/verify-payment/?session_id=${sessionId}`, {
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error verifying payment:", error);
        return false;
    }
}
