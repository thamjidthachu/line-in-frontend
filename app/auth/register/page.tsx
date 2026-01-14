"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { checkUsernameEmail } from "@/lib/auth-actions"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
    const { register } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleUsernameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value) {
            setErrors(prev => ({ ...prev, username: "" }))
            return
        }
        const exists = await checkUsernameEmail(value, undefined)
        if (exists) {
            setErrors(prev => ({ ...prev, username: "Username is already taken" }))
        } else {
            setErrors(prev => ({ ...prev, username: "" }))
        }
    }

    const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value
        if (!value) {
            setErrors(prev => ({ ...prev, email: "" }))
            return
        }
        const exists = await checkUsernameEmail(undefined, value)
        if (exists) {
            setErrors(prev => ({ ...prev, email: "Email is already registered" }))
        } else {
            setErrors(prev => ({ ...prev, email: "" }))
        }
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("password2") as string
        const newErrors: { [key: string]: string } = {}

        // Basic validation
        if (!formData.get("full_name")) newErrors.full_name = "Full name is required"
        if (!formData.get("username")) newErrors.username = "Username is required"
        if (!formData.get("email")) newErrors.email = "Email is required"
        if (!formData.get("phone")) newErrors.phone = "Phone is required"
        if (!formData.get("gender")) newErrors.gender = "Gender is required"
        if (!password) newErrors.password = "Password is required"
        if (!confirmPassword) newErrors.password2 = "Confirm Password is required"

        // Password match validation
        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.password2 = "Passwords do not match"
        }

        // Check if there are any existing errors from blur events (like taken username/email)
        if (errors.username && errors.username !== "Username is required") newErrors.username = errors.username
        if (errors.email && errors.email !== "Email is required") newErrors.email = errors.email

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Please fix the errors before submitting")
            return
        }

        setIsLoading(true)

        try {
            await register(formData)
        } catch (e: any) {
            toast.error(e.message || "Registration failed. Please try again.")
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
                <div className="flex w-full flex-col justify-center bg-background px-8 py-12 lg:w-[45%] lg:px-16 xl:px-24 h-full min-h-screen overflow-y-auto">
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

                        <h1 className="text-4xl font-normal tracking-tight text-foreground">Sign up</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="font-medium text-primary hover:underline">
                                Log in
                            </Link>
                        </p>

                        <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate>
                            {/* Name Fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                        className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.full_name ? "border-red-500" : "border-input"}`}
                                    />
                                    {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="johndoe"
                                        disabled={isLoading}
                                        onBlur={handleUsernameBlur}
                                        className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.username ? "border-red-500" : "border-input"}`}
                                    />
                                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        disabled={isLoading}
                                        onBlur={handleEmailBlur}
                                        className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.email ? "border-red-500" : "border-input"}`}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="050..."
                                            disabled={isLoading}
                                            className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.phone ? "border-red-500" : "border-input"}`}
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Gender</Label>
                                        <Select name="gender">
                                            <SelectTrigger className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors focus:ring-0 focus:border-primary rounded-[2px] ${errors.gender ? "border-red-500" : "border-input"}`}>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="M">Male</SelectItem>
                                                <SelectItem value="F">Female</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</Label>
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
                                <div className="space-y-2">
                                    <Label htmlFor="password2" className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                                    <Input
                                        id="password2"
                                        name="password2"
                                        type="password"
                                        disabled={isLoading}
                                        className={`h-auto border-0 border-b bg-transparent px-0 py-3 text-base shadow-none transition-colors placeholder:text-muted-foreground/40 focus-visible:border-primary focus-visible:ring-0 rounded-[2px] ${errors.password2 ? "border-red-500" : "border-input"}`}
                                    />
                                    {errors.password2 && <p className="text-xs text-red-500 mt-1">{errors.password2}</p>}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Sign up"
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
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
