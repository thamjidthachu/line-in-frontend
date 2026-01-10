import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { apiFetch, API_BASE_URL, getHeaders } from "@/lib/api"

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

async function getFAQs(): Promise<FAQItem[]> {
  try {
    const response = await apiFetch(`${API_BASE_URL}/faq/`, {
      headers: getHeaders(false),
    });
    if (!response.ok) {
      console.error(`Failed to fetch FAQs: ${response.status} ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return [];
  }
}

export async function FAQSection() {
  const faqs = await getFAQs();

  // Sort FAQs or use as is. Assuming API returns implicitly ordered or relevant order.
  // API response example shows IDs 6, 5, 4... so desc order.
  // We can sort by ID or just render as received. 
  // Let's render as received for now.

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Everything you need to know about our linen products
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No FAQs available at the moment.</p>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
