"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        // Validate passwords match
        if (formData.get("password") !== formData.get("password2")) {
            toast.error("Passwords do not match")
            setIsLoading(false)
            return
        }

        try {
            await register(formData)
        } catch (e: any) {
            toast.error(e.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
            <div className="w-full max-w-lg space-y-8 rounded-lg border bg-background p-8 shadow-sm">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80">
                        Line-Inn
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight">Create an account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join us for exclusive offers and faster checkout
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" name="full_name" placeholder="John Doe" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" placeholder="johndoe" required disabled={isLoading} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required disabled={isLoading} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="0500000000" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select name="gender" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="F">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password2">Confirm Password</Label>
                            <Input id="password2" name="password2" type="password" required disabled={isLoading} />
                        </div>
                    </div>



                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Sign up"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
