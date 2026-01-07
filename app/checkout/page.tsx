"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { checkoutCart } from "@/lib/cart-api"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { cart, cartTotal, refreshCart } = useCart()

    const [formData, setFormData] = useState({
        customer_name: user?.full_name || "",
        customer_email: user?.email || "",
        customer_phone: "",
        special_instructions: ""
    })
    const [loading, setLoading] = useState(false)

    // Calculate totals matches cart/page.tsx
    const shipping = cartTotal > 100 ? 0 : 10
    const tax = cartTotal * 0.08
    const total = cartTotal + shipping + tax

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await checkoutCart(formData)

            if (response) {
                if (response.stripe_checkout_url) {
                    toast.success("Redirecting to payment...")
                    window.location.href = response.stripe_checkout_url
                } else {
                    toast.success("Order placed successfully!")
                    await refreshCart()
                    router.push("/shop")
                }
            } else {
                toast.error("Failed to place order.")
            }
        } catch (error) {
            toast.error("An error occurred during checkout.")
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
                        <Button onClick={() => router.push("/shop")}>Return to Shop</Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="customer_name">Full Name</Label>
                                    <Input required id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="customer_email">Email</Label>
                                    <Input required type="email" id="customer_email" name="customer_email" value={formData.customer_email} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="customer_phone">Phone</Label>
                                    <Input required type="tel" id="customer_phone" name="customer_phone" value={formData.customer_phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <Label htmlFor="special_instructions">Special Instructions</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        id="special_instructions"
                                        name="special_instructions"
                                        value={formData.special_instructions}
                                        onChange={handleChange}
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.map(item => (
                                <div key={item.cartItemId || item.id} className="flex items-center justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={loading}>
                                {loading ? "Processing..." : "Place Order"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
