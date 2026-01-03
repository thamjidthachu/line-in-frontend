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
    // Convert FormData to JSON object for Django backend
    const loginData = {
        username: data.get('username'),
        password: data.get('password'),
    };

    const response = await apiFetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify(loginData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }

    return response.json();
}

export async function registerUser(data: FormData): Promise<any> {
    // Convert FormData to JSON object for Django backend
    const registerData = {
        username: data.get('username'),
        email: data.get('email'),
        password: data.get('password'),
        password2: data.get('password2'),  // API expects password2
        full_name: data.get('full_name') || '',
        phone: data.get('phone') || '',
        gender: data.get('gender') || '',
    };

    const response = await apiFetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify(registerData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
    }

    return response.json();
}

export async function checkUsernameEmail(username?: string, email?: string): Promise<boolean> {
    try {
        const params = new URLSearchParams();
        if (username) params.append('username', username);
        if (email) params.append('email', email);
        const response = await apiFetch(`${API_BASE_URL}/auth/user-check/?${params.toString()}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === true; // true if user exists
    } catch (error) {
        return false;
    }
}

export async function logoutUser(refresh?: string): Promise<boolean> {
    try {
        const refreshToken = refresh || (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);
        const response = await apiFetch(`${API_BASE_URL}/auth/logout/`, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({ refresh: refreshToken }),
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

export async function googleSignup(idToken: string): Promise<any> {
    const response = await apiFetch(`${API_BASE_URL}/auth/google/signup/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ id_token: idToken }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
    }
    return response.json();
}

export async function googleSignin(idToken: string): Promise<any> {
    const response = await apiFetch(`${API_BASE_URL}/auth/google/signin/`, {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify({ id_token: idToken }),
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
        const response = await apiFetch(`${API_BASE_URL}/auth/forgot-password/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify({ username }),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function resetPassword(username: string, token: string, newPassword: string): Promise<boolean> {
    try {
        const response = await apiFetch(`${API_BASE_URL}/auth/reset-password/`, {
            method: "POST",
            headers: getHeaders(false),
            body: JSON.stringify({ username, token, new_password: newPassword }),
        });
        return response.ok;
    } catch {
        return false;
    }
}
