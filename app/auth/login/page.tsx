"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function LoginPage() {
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")

    useEffect(() => {
        if (registered) {
            toast.success("Registration successful! Please sign in.")
        }
    }, [registered])

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setErrors({})

        const formData = new FormData(event.currentTarget)
        const email = formData.get("username") as string
        const password = formData.get("password") as string
        const newErrors: { [key: string]: string } = {}

        if (!email) {
            newErrors.username = "Email is required"
        }
        if (!password) {
            newErrors.password = "Password is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        try {
            await login(formData)
        } catch (e) {
            toast.error("Invalid email or password")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 flex-row">
                {/* Left Side - Image */}
                <div className="relative hidden w-[55%] lg:block">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
                    <img
                        src="/sign-image.jpg"
                        alt="VR Experience"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute left-10 top-10 text-white">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-mono tracking-tighter hover:opacity-80">
                            {/* Logo Icon Placeholder */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Line-Inn
                        </Link>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col justify-center bg-background px-8 py-12 lg:w-[45%] lg:px-16 xl:px-24">
                    <div className="mx-auto w-full max-w-sm">
                        {/* Header */}
                        <Link href="/" className="lg:hidden mb-8 block font-mono text-2xl font-bold">
                            Line-Inn
                        </Link>

                        <div className="mb-2">
                            <Button
                                variant="ghost"
                                className="bg-transparent pl-0 hover:bg-transparent hover:text-muted-foreground transition-colors -ml-4"
                                onClick={() => window.history.back()}
                            >
                                ← Back
                            </Button>
                        </div>

                        <h1 className="text-4xl font-normal tracking-tight text-foreground">Log in</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-primary hover:underline">
                                Create an Account
                            </Link>
                        </p>

                        <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="john.doe@gmail.com"
                                        disabled={isLoading}
                                        className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.username ? "border-red-500" : "border-input"}`}
                                    />
                                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            disabled={isLoading}
                                            className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] pr-10 ${errors.password ? "border-red-500" : "border-input"}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-primary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                                            )}
                                            <span className="sr-only">Toggle password visibility</span>
                                        </Button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </Button>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" required />
                                <Label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    I agree to the <Link href="/terms" className="underline">Terms & Condition</Link>
                                </Label>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-4">
                                {/* Social Placeholders */}
                                <div className="flex justify-center gap-6 col-span-2">
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground" type="button">
                                        <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                        <span className="sr-only">Login with Google</span>
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground" type="button">
                                        <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                        </svg>
                                        <span className="sr-only">Login with Facebook</span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
