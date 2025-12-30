import { toast } from "sonner";
import { Product } from "./products";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Helper function to get the access token from localStorage
export function getAccessToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("accessToken");
    }
    return null;
}

// Helper function to build headers with Bearer token
export function getHeaders(includeAuth: boolean = true, isMultipart: boolean = false): HeadersInit {
    const headers: any = {};

    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }

    if (includeAuth) {
        const token = getAccessToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return headers;
}

export { API_BASE_URL };

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, options);

    if (response.status === 401) {
        try {
            const clone = response.clone();
            const data = await clone.json();

            if (
                data.code === "token_not_valid" &&
                data.messages?.some((m: any) => m.message === "Token is expired")
            ) {
                toast.error("Session Expired! Please Login😊");
                if (typeof window !== "undefined") {
                    // Clear auth data
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("user");

                    // Redirect
                    window.location.href = "/auth/login";
                }
            }
        } catch (e) {
            // ignore JSON parse error or other issues
        }
    }

    return response;
}


export interface ApiProductFile {
    id: number;
    images: string;
}

export interface ApiProduct {
    id: number;
    slug: string;
    name: string;
    price: string;
    files: ApiProductFile[];
    synopsis: string;
    rating: number;
    review_count: number;
    is_favorite: boolean;
}

export interface ApiProductDetail {
    id: number;
    slug: string;
    name: string;
    synopsis: string;
    description: string;
    price: string;
    files: ApiProductFile[];
    rating: number;
    review_count: number;
    reviews: any;
    is_favorite: boolean;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    is_deleted: boolean;
    time: number;
    stock_available: number;
    availability: string;
    policy: string;
}

export interface Advertisement {
    title: string;
    file: string;
    link: string;
}

export interface Favorite {
    id: number;
    product: ApiProduct;
    service_id: number;
    created_at: string;
}

export async function fetchProducts(): Promise<Product[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/list/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data: ApiProduct[] = await response.json();

        return data.map((item) => ({
            id: item.id.toString(),
            slug: item.slug,
            name: item.name,
            description: item.synopsis,
            price: parseFloat(item.price),
            images: item.files.map((f) => f.images),
            category: "women", // Default or inferred
            colors: ["Default"], // Default
            sizes: ["One Size"], // Default
            rating: item.rating,
            reviews: item.review_count,
            inStock: true, // Default
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/${slug}/detail/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const data: ApiProductDetail = await response.json();

        return {
            id: data.id.toString(),
            slug: data.slug,
            name: data.name,
            description: data.description || data.synopsis,
            price: parseFloat(data.price),
            images: data.files.map((f) => f.images),
            category: "women", // Default or inferred
            colors: ["Default"], // Default
            sizes: ["One Size"], // Default
            rating: data.rating,
            reviews: data.review_count,
            inStock: data.stock_available > 0,
        };
    } catch (error) {
        console.error("Error fetching product detail:", error);
        return null;
    }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/featured/`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch featured products: ${response.statusText}`);
        }
        const data: ApiProductDetail[] = await response.json();

        return data.map((item) => ({
            id: item.id.toString(),
            slug: item.slug,
            name: item.name,
            description: item.synopsis,
            price: parseFloat(item.price),
            images: item.files.map((f) => f.images),
            category: "women",
            colors: ["Default"],
            sizes: ["One Size"],
            rating: item.rating,
            reviews: item.review_count,
            inStock: item.stock_available > 0,
        }));
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}

export async function fetchAdvertisements(): Promise<Advertisement[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/advertisement/`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error("Failed to fetch advertisements");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching advertisements:", error);
        return [];
    }
}

export interface ReviewAuthor {
    id: number;
    avatar: string | null;
    username: string;
    full_name: string;
    email: string;
    phone: string;
    gender: string | null;
    is_active: boolean;
}

export interface Review {
    author: ReviewAuthor;
    message: string;
    rating: number;
    created_at: string;
}

export interface ReviewsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Review[];
}

export async function fetchProductReviews(slug: string, page: number = 1): Promise<ReviewsResponse> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/${slug}/reviews/?page=${page}`, {
            headers: getHeaders(true),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { count: 0, next: null, previous: null, results: [] };
    }
}

export async function submitProductReview(slug: string, message: string, rating: number): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/${slug}/reviews/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ message, rating }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error submitting review:", error);
        return false;
    }
}

export async function replyToReview(commentId: number, message: string): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/reviews/${commentId}/reply/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ message }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error replying to review:", error);
        return false;
    }
}

export async function fetchFavorites(): Promise<Favorite[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/favorites/list-create/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
}

export async function addFavorite(serviceId: number): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/favorites/list-create/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ service_id: serviceId }),
        });
        return response.ok;
    } catch (error) {
        console.error("Error adding favorite:", error);
        return false;
    }
}

export async function removeFavorite(serviceId: number): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/products/favorites/delete/${serviceId}/`, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error removing favorite:", error);
        return false;
    }
}
