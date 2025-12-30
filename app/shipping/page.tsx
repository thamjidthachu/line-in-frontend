import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { Truck, Package, Globe, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Shipping Information</h1>
              <p className="text-lg text-muted-foreground">Everything you need to know about our shipping policies</p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Domestic Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">Standard Shipping (5-7 business days)</p>
                    <p className="text-sm text-muted-foreground">$10 flat rate</p>
                  </div>
                  <div>
                    <p className="font-semibold">Express Shipping (2-3 business days)</p>
                    <p className="text-sm text-muted-foreground">$20 flat rate</p>
                  </div>
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On all orders over $100</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>International Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold">Canada & Mexico</p>
                    <p className="text-sm text-muted-foreground">$25 flat rate (10-15 business days)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Europe</p>
                    <p className="text-sm text-muted-foreground">$35 flat rate (15-20 business days)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Rest of World</p>
                    <p className="text-sm text-muted-foreground">$45 flat rate (20-30 business days)</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Order Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Orders are typically processed within 1-2 business days. You will receive a confirmation email once
                    your order ships with tracking information.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Orders placed on weekends or holidays will be processed on the next business day.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Delivery Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Delivery times are estimates and may vary based on your location and customs processing for
                    international orders.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We are not responsible for delays caused by customs, weather conditions, or carrier issues beyond
                    our control.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                  <li>We currently ship to all 50 US states and most international destinations</li>
                  <li>P.O. boxes are accepted for standard shipping only</li>
                  <li>International customers are responsible for any customs fees, duties, or taxes</li>
                  <li>Tracking information is provided for all orders</li>
                  <li>For shipping questions, contact us at shipping@Line-Inn.com</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
