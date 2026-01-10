"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Order, fetchOrders } from "@/lib/cart-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ArrowRight, Calendar } from "lucide-react"

export function ProfileOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders()
                const sorted = data.sort((a, b) => {
                    const dateA = new Date(a.fulfillment_date || a.created_at || a.order_date || 0).getTime()
                    const dateB = new Date(b.fulfillment_date || b.created_at || b.order_date || 0).getTime()
                    return dateB - dateA
                })
                setOrders(sorted)
            } catch (e) {
                console.error("Failed to load orders")
            } finally {
                setLoading(false)
            }
        }
        loadOrders()
    }, [])

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
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-muted/10">
                <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No orders yet</h3>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-primary hover:underline font-medium">
                    Start shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="grid gap-4">
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            {orders.map((order) => (
                <Link
                    href={`/orders/${order.order_number}`}
                    key={order.order_number}
                    className="block group"
                >
                    <Card className="transition-all hover:shadow-md border-primary/5 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-mono">
                                    #{order.order_number}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(order.fulfillment_date || order.created_at)}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusColor(order.status) as any} className="capitalize py-0.5 px-2 text-[10px]">
                                {order.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between mt-2">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">{order.total_items || 0} items — </span>
                                    <span className="font-semibold">${order.total_amount}</span>
                                </div>
                                <div className="flex items-center text-xs text-primary font-medium">
                                    View <ArrowRight className="h-3 w-3 ml-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
