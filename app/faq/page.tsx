import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FAQPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our products and services
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orders & Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Questions about ordering and delivery</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Information about our linen products</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Returns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Return policy and procedures</p>
                  </CardContent>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What makes linen special?</AccordionTrigger>
                  <AccordionContent>
                    Linen is a natural fiber known for its exceptional breathability, durability, and comfort. It gets
                    softer with each wash and has natural moisture-wicking properties, making it perfect for all
                    seasons. Our premium European linen is sustainably sourced and crafted with care.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I care for linen clothing?</AccordionTrigger>
                  <AccordionContent>
                    Linen is easy to care for. Machine wash in cold or lukewarm water with mild detergent. Tumble dry on
                    low or line dry for best results. Linen naturally wrinkles, which is part of its charm, but you can
                    iron while slightly damp if you prefer a crisp look.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What is your return policy?</AccordionTrigger>
                  <AccordionContent>
                    We offer a 30-day return policy on all unworn, unwashed items with original tags attached. Contact
                    our customer service team to initiate a return. Free return shipping is provided for defective items
                    or wrong deliveries.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Free
                    shipping is available on orders over $100 within the continental US. International orders may be
                    subject to customs fees and import duties.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I choose the right size?</AccordionTrigger>
                  <AccordionContent>
                    Each product page includes a detailed size guide. Our linen garments are designed for a relaxed,
                    comfortable fit. If you're between sizes, we recommend sizing up for a more relaxed look. Contact
                    our team for personalized sizing assistance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Are your products sustainable?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Sustainability is at the core of our brand. Our linen is sourced from European flax farms that
                    practice responsible farming without harmful pesticides. The flax plant requires minimal water and
                    naturally regenerates the soil.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>How long does shipping take?</AccordionTrigger>
                  <AccordionContent>
                    Standard shipping within the US takes 5-7 business days. Express shipping takes 2-3 business days.
                    International shipping times vary by location (10-30 business days). All orders include tracking
                    information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Can I track my order?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Once your order ships, you'll receive a confirmation email with tracking information. You can
                    use this to monitor your package's journey.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay,
                    and Google Pay. All transactions are secure and encrypted.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>Do you have a physical store?</AccordionTrigger>
                  <AccordionContent>
                    We are primarily an online retailer, but we do have a flagship store in New York City at 123 Linen
                    Street. Store hours are Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM. Call ahead to schedule a personal
                    styling appointment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Card className="mt-12">
                <CardHeader>
                  <CardTitle>Still have questions?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground">
                    Can't find what you're looking for? Our customer service team is here to help.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
