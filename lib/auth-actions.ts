import { API_BASE_URL, getHeaders, getAccessToken, apiFetch } from "./api";

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        username: string;
        email: string;
        full_name: string;
    };
}

// ... existing types ...

export async function loginUser(data: FormData): Promise<any> {
    // Login shouldn't necessarily use apiFetch because 401 just means wrong password, not expired token
    // But it's fine if we use it, though "Token is expired" response is unlikely here.
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        body: data,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }

    return response.json();
}

export async function registerUser(data: FormData): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        body: data,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }

    return response.json();
}

export async function checkAuth(): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/user-check/`, {
            headers: getHeaders(true),
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

export async function logoutUser(): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/logout/`, {
            method: "POST",
            headers: getHeaders(true),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function refreshToken(refresh: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });
        if (!response.ok) throw new Error("Refresh failed");
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function googleSignup(token: string, additionalData?: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/google/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...additionalData }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return response.json();
}

export async function googleSignin(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/google/signin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return response.json();
}

export interface UserProfile {
    username: string;
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    avatar: string | null;
}

export async function fetchProfile(): Promise<UserProfile | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/profile/`, {
            headers: getHeaders(true),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/profile/update/`, {
            method: "PATCH",
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function updateAvatar(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("avatar", file);

    const token = getAccessToken();
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // Using simple fetch here because FormData handling might be simpler than wrapping everything, 
    // but better to use apiFetch if possible. However, since headers content-type is special for FormData, 
    // and apiFetch doesn't alter request options much, it should be fine. 
    // BUT apiFetch call to fetch() simply passes options.
    // The issue is if apiFetch did modify headers. Currently it doesn't.

    // However, I'll stick to fetch for special content-types just to be safe, 
    // UNLESS I need the 401 handling.
    // If token expired during avatar upload, we do want to catch it.

    const response = await apiFetch(`${API_BASE_URL}/auth/profile/avatar/`, {
        method: "PATCH",
        headers: headers,
        body: formData,
    });

    if (!response.ok) throw new Error("Avatar update failed");
    return response.json();
}

export async function forgotPassword(username: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function resetPassword(data: any): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return response.ok;
    } catch {
        return false;
    }
}
