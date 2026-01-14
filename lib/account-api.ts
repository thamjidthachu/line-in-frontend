import { apiFetch, API_BASE_URL, getHeaders } from "./api";

export interface AccountProfile {
    user: {
        id: number;
        avatar: string | null;
        username: string;
        full_name: string;
        email: string;
        phone: string;
        gender: string | null;
        is_active: boolean;
    };
    username: string;
    bio: string;
    interests: { id: number; name: string; slug: string }[];
    wallet_balance: string;
}

export interface AccountDashboardData {
    profile: AccountProfile;
    recent_orders: any[];
    default_address: any;
    wallet_balance: string;
    referral_code: string;
}

export interface Address {
    id: number;
    address_type: string;
    full_name: string;
    phone_number: string;
    street_address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    is_default: boolean;
}

export async function fetchAccountDashboard(): Promise<AccountDashboardData | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/account/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching account dashboard:", error);
        return null;
    }
}

export async function updateProfile(data: Partial<{
    username: string;
    bio: string;
    interest_ids: number[];
}>): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/profile/update/`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating profile:", error);
        return false;
    }
}

export async function updateCoreProfile(data: Partial<{
    full_name: string;
    email: string;
    phone: string;
    gender: string;
}>): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/profile/update`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating core profile:", error);
        return false;
    }
}

export async function updateAvatar(file: File): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await apiFetch(`${API_BASE_URL}/profile/avatar/`, {
            method: "PUT",
            headers: getHeaders(true, true),
            body: formData,
        });
        return response.ok;
    } catch (error) {
        console.error("Error updating avatar:", error);
        return false;
    }
}

export async function fetchAddresses(): Promise<Address[]> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/account/addresses/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
}

export async function createAddress(data: Omit<Address, "id">): Promise<Address | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/account/addresses/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error creating address:", error);
        return null;
    }
}

export async function updateAddress(id: number, data: Partial<Address>): Promise<Address | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/account/addresses/${id}/`, {
            method: "PATCH",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error updating address:", error);
        return null;
    }
}

export async function deleteAddress(id: number): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/account/addresses/${id}/`, {
            method: "DELETE",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting address:", error);
        return false;
    }
}

export async function deleteAccount(): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/delete-account/`, {
            method: "POST",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting account:", error);
        return false;
    }
}
