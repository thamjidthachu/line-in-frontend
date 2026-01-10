import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { BannerSection } from "@/components/home/banner-section"
import { FAQSection } from "@/components/home/faq-section"

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <FeaturedProducts />
                <BannerSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    )
}
