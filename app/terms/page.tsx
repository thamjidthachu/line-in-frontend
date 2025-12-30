import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"

export default function TermsPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: November 2024</p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="prose prose-lg mx-auto max-w-4xl">
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 text-2xl font-bold">1. Agreement to Terms</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    By accessing and using Line-Inn's website and services, you agree to be bound by these Terms of
                    Service and all applicable laws and regulations. If you do not agree with any of these terms, you
                    are prohibited from using this site.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">2. Use License</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Permission is granted to temporarily download one copy of the materials on Line-Inn's website for
                    personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                    title.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">3. Product Information</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We strive to provide accurate product descriptions and pricing. However, we do not warrant that
                    product descriptions, pricing, or other content is accurate, complete, reliable, current, or
                    error-free. We reserve the right to correct any errors or omissions.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">4. Orders and Payment</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We reserve the right to refuse or cancel any order for any reason. Payment must be received before
                    order processing. All prices are in USD and are subject to change without notice.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">5. Shipping and Delivery</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Shipping times are estimates and not guaranteed. We are not responsible for delays caused by
                    customs, weather, or carrier issues. Risk of loss passes to you upon delivery to the carrier.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">6. Returns and Refunds</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We accept returns within 30 days of purchase for unworn, unwashed items with original tags. Refunds
                    will be processed to the original payment method within 5-10 business days of receiving the return.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">7. Limitation of Liability</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Line-Inn shall not be liable for any indirect, incidental, special, or consequential damages
                    arising out of or in connection with the use of our products or services.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">8. Contact Information</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Questions about the Terms of Service should be sent to us at legal@Line-Inn.com.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
