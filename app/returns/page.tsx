import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { RefreshCw, Package, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Returns & Exchanges</h1>
              <p className="text-lg text-muted-foreground">
                We want you to love your purchase. Here's our return policy.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Our 30-Day Return Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in
                    their original condition with all tags attached. We provide free returns for defective items or
                    wrong deliveries.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>What Can Be Returned</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Unworn items with original tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Unwashed items in original packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Defective or damaged items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Wrong items delivered</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle>What Cannot Be Returned</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Worn or washed items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Items without original tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Sale items (final sale only)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Items returned after 30 days</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>How to Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Contact our support team at returns@Line-Inn.com</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">2.</span>
                      <span>Receive your return authorization and shipping label</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">3.</span>
                      <span>Pack items securely in original packaging if possible</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">4.</span>
                      <span>Attach the return label and ship via provided carrier</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-primary">5.</span>
                      <span>Receive refund within 5-10 business days of delivery</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Exchanges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    We currently do not offer direct exchanges. To exchange an item, please return it for a refund and
                    place a new order for the desired item.
                  </p>
                  <p className="text-muted-foreground">
                    If you received a defective or wrong item, contact us immediately at support@Line-Inn.com for
                    priority exchange processing.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Refund Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Once we receive and inspect your return, we'll send you an email confirmation. Refunds are processed
                  to your original payment method within 5-10 business days.
                </p>
                <p className="text-muted-foreground">
                  Original shipping costs are non-refundable unless the return is due to our error (defective item or
                  wrong delivery). Customer is responsible for return shipping costs for standard returns.
                </p>
                <p className="text-muted-foreground">
                  For questions about returns, contact us at returns@Line-Inn.com or call +1 (555) 123-4567.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
