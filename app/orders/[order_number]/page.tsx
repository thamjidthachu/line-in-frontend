"use client"

import { useEffect, useState, use } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Order, fetchOrderDetail } from "@/lib/cart-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, MapPin, CreditCard, Calendar, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrderDetailPage({ params }: { params: Promise<{ order_number: string }> }) {
    // Unwrap params using React.use()
    const resolvedParams = use(params)
    const { order_number } = resolvedParams

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadOrder = async () => {
            if (order_number) {
                const data = await fetchOrderDetail(order_number)
                setOrder(data)
            }
            setLoading(false)
        }
        loadOrder()
    }, [order_number])

    const getStatusColor = (status?: string) => {
        if (!status) return "outline"
        switch (status.toLowerCase()) {
            case "completed":
            case "paid":
                return "default"
            case "pending":
            case "processing":
                return "secondary"
            case "cancelled":
                return "destructive"
            default:
                return "outline"
        }
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </main>
                <Footer />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                        <p className="text-muted-foreground mb-6">Could not find order details for #{order_number}</p>
                        <Button asChild>
                            <Link href="/orders">Back to Orders</Link>
                        </Button>
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
                <div className="mb-8">
                    <Button variant="ghost" className="mb-4 pl-0" asChild>
                        <Link href="/orders" className="flex items-center text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-mono">{order.order_number}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.created_at || order.order_date)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(order.status) as any} className="text-sm px-3 py-1 capitalize">
                                {order.status}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1 capitalize">
                                Payment: {order.payment_status || 'N/A'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {order.order_items?.map((item) => (
                                        <div key={item.id}>
                                            <div className="flex gap-4">
                                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted border">
                                                    {/* Note: In real app, item.product would have images field. Adjust if API structure differs */}
                                                    {item.product?.image || item.product?.files?.[0]?.images ? (
                                                        <Image
                                                            src={item.product?.image || item.product?.files?.[0]?.images}
                                                            alt={item.product?.name || "Product"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                                                            <Package className="h-8 w-8 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold">{item.product?.name || "Unknown Product"}</h3>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                Qty: {item.quantity} × ${item.unit_price}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold">${item.total_price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Separator className="mt-6 last:hidden" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>${order.tax}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${order.total_amount}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold">Customer</p>
                                    <p className="text-muted-foreground">{order.customer_name}</p>
                                    <p className="text-muted-foreground">{order.customer_email}</p>
                                    <p className="text-muted-foreground">{order.customer_phone}</p>
                                </div>
                                {order.special_instructions && (
                                    <div className="pt-2">
                                        <p className="font-semibold">Special Instructions</p>
                                        <p className="text-muted-foreground italic">"{order.special_instructions}"</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
