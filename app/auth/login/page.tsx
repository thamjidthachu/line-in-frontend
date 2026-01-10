"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")

    useEffect(() => {
        if (registered) {
            toast.success("Registration successful! Please sign in.")
        }
    }, [registered])

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        try {
            await login(formData)
            // Redirect handled in context
        } catch (e) {
            toast.error("Invalid email or password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-background p-8 shadow-sm">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80">
                        Line-Inn
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Email or Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="name@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="#"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                        />
                    </div>



                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
