import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"

export default function PrivacyPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: November 2024</p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="prose prose-lg mx-auto max-w-4xl">
              <div className="space-y-8">
                <section>
                  <h2 className="mb-4 text-2xl font-bold">1. Information We Collect</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an account, make a
                    purchase, subscribe to our newsletter, or contact us for support. This may include your name, email
                    address, shipping address, payment information, and phone number.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">2. How We Use Your Information</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We use the information we collect to process your orders, communicate with you about your purchases,
                    send you marketing communications (with your consent), improve our products and services, and comply
                    with legal obligations.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">3. Information Sharing</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We do not sell or rent your personal information to third parties. We may share your information
                    with service providers who assist us in operating our website, conducting our business, or serving
                    you, as long as those parties agree to keep this information confidential.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">4. Data Security</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal information
                    against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no
                    method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">5. Your Rights</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    You have the right to access, correct, or delete your personal information. You may also object to
                    or restrict certain processing of your data. To exercise these rights, please contact us at
                    privacy@Line-Inn.com.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">6. Cookies</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    We use cookies and similar tracking technologies to track activity on our website and hold certain
                    information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
                    being sent.
                  </p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-bold">7. Contact Us</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at privacy@Line-Inn.com or
                    by mail at 123 Linen Street, New York, NY 10001.
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
