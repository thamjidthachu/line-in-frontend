"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "./auth-actions"
import { useRouter } from "next/navigation"

interface User {
    username: string;
    email: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (formData: FormData) => Promise<void>;
    register: (formData: FormData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [refreshToken, setRefreshToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for tokens on mount
        const storedAccessToken = localStorage.getItem("accessToken")
        const storedRefreshToken = localStorage.getItem("refreshToken")
        const storedUser = localStorage.getItem("user")

        if (storedAccessToken) {
            setAccessToken(storedAccessToken)
        }

        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken)
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse user from local storage")
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (formData: FormData) => {
        try {
            const data = await loginUser(formData)
            // Response structure from Django: { access, refresh, user, message }
            const accessToken = data.access || data.accessToken;
            const refreshToken = data.refresh || data.refreshToken;

            if (accessToken && refreshToken) {
                setAccessToken(accessToken)
                setRefreshToken(refreshToken)
                localStorage.setItem("accessToken", accessToken)
                localStorage.setItem("refreshToken", refreshToken)

                // Set user from response
                if (data.user) {
                    setUser(data.user)
                    localStorage.setItem("user", JSON.stringify(data.user))
                }

                router.push("/")
            } else {
                throw new Error("No access or refresh token received")
            }
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const register = async (formData: FormData) => {
        try {
            await registerUser(formData)
            // After register, do we auto login? Or redirect to login?
            // Usually redirect to login
            router.push("/auth/login?registered=true")
        } catch (error) {
            console.error("Registration failed:", error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                isAuthenticated: !!accessToken,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
