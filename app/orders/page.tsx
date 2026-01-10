"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Order, fetchOrders } from "@/lib/cart-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ArrowRight, Calendar } from "lucide-react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadOrders = async () => {
            const data = await fetchOrders()
            // Sort by date desc
            const sorted = data.sort((a, b) => {
                const dateA = new Date(a.fulfillment_date || a.created_at || a.order_date || 0).getTime()
                const dateB = new Date(b.fulfillment_date || b.created_at || b.order_date || 0).getTime()
                return dateB - dateA
            })
            setOrders(sorted)
            setLoading(false)
        }
        loadOrders()
    }, [])

    const getStatusColor = (status?: string) => {
        if (!status) return "outline"
        switch (status.toLowerCase()) {
            case "completed":
            case "paid":
                return "default" // primary/black
            case "pending":
            case "processing":
                return "secondary" // gray
            case "cancelled":
                return "destructive" // red
            default:
                return "outline"
        }
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <Button variant="outline" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                        <Package className="h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No orders found</h3>
                        <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                        <Button asChild>
                            <Link href="/shop">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <Link href={`/orders/${order.order_number}`} key={order.order_number} className="block group">
                                <Card className="transition-all hover:shadow-md hover:border-primary/50">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-mono">
                                                {order.order_number}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(order.fulfillment_date || order.created_at)}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={getStatusColor(order.status) as any} className="capitalize">
                                            {order.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between pt-4">
                                            <div className="grid gap-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {order.total_items || 0} items
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Total: <span className="font-semibold text-foreground">${order.total_amount}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                                                <span className="text-sm font-medium mr-2">View Details</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
