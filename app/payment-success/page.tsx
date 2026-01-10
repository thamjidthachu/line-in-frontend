"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { completeOrderPayment, fetchOrderDetail, fetchBookingDetail } from "@/lib/cart-api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { refreshCart } = useCart()

    const sessionId = searchParams.get("session_id")
    const bookingNumber = searchParams.get("booking_number")
    const orderNumber = searchParams.get("order_number")

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("Verifying your payment...")

    useEffect(() => {
        if (!sessionId && !orderNumber) {
            setStatus("error")
            setMessage("Invalid payment validation details.")
            return
        }

        const verifyPayment = async () => {
            try {
                // Determine if it's a Booking (BK...) or Order (ORD...)
                const isBooking = orderNumber?.startsWith("BK")

                if (isBooking) {
                    // It's a booking, fetching details to confirm existence
                    const bookingDetail = await fetchBookingDetail(orderNumber!)

                    if (bookingDetail) {
                        // Call complete payment with the order number (which is a BK... string here)
                        const success = await completeOrderPayment(orderNumber!, "stripe", sessionId!)

                        if (success || bookingDetail.payment_status === 'paid') {
                            await refreshCart()
                            setStatus("success")
                            setMessage("Thank you! Your booking is confirmed.")
                        } else {
                            throw new Error("Booking payment completion failed")
                        }
                    } else {
                        throw new Error("Booking not found")
                    }

                } else {
                    // It's likely an Order Number (ORD...) or generic identifier
                    // Call the complete-payment API with the order number string
                    const success = await completeOrderPayment(orderNumber!, "stripe", sessionId!)

                    if (success) {
                        await refreshCart()
                        setStatus("success")
                        setMessage("Thank you for your purchase!")
                    } else {
                        // Fallback: Check if it's already marked as paid
                        const orderDetail = await fetchOrderDetail(orderNumber!)
                        if (orderDetail && (orderDetail.payment_status === 'paid' || orderDetail.status === 'completed')) {
                            await refreshCart()
                            setStatus("success")
                            setMessage("Thank you for your purchase! (Already verified)")
                        } else {
                            throw new Error("Payment completion failed")
                        }
                    }
                }

            } catch (error) {
                console.error("Payment verification check failed", error)
                setStatus("error")
                setMessage("Something went wrong verifying your payment. Please contact support.")
            }
        }

        if (status === 'loading') {
            verifyPayment()
        }
    }, [sessionId, orderNumber, refreshCart, status])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
            {status === "loading" && (
                <>
                    <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
                    <h1 className="mb-2 text-2xl font-bold">Processing Payment...</h1>
                    <p className="text-muted-foreground">{message}</p>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
                    <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
                    <p className="mb-6 text-muted-foreground">
                        {message}<br />
                        Your reference number is <span className="font-mono font-medium text-foreground">{orderNumber}</span>
                    </p>
                    <div className="flex gap-4">
                        <Button asChild>
                            <Link href="/orders">View Orders</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/shop">Continue Shopping</Link>
                        </Button>
                    </div>
                </>
            )}

            {status === "error" && (
                <>
                    <XCircle className="mb-4 h-16 w-16 text-destructive" />
                    <h1 className="mb-2 text-2xl font-bold">Payment Failed</h1>
                    <p className="mb-6 text-muted-foreground">{message}</p>
                    <Button asChild>
                        <Link href="/contact">Contact Support</Link>
                    </Button>
                </>
            )}
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Suspense fallback={
                    <div className="flex min-h-[60vh] flex-col items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                }>
                    <PaymentSuccessContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
