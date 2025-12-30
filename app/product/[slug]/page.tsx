"use client"

import { use, useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { fetchProductBySlug } from "@/lib/api"
import type { Product } from "@/lib/products"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { RelatedProducts } from "@/components/product/related-products"
import { ProductReviews } from "@/components/product/product-reviews"
import { notFound } from "next/navigation"

export default function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params)
    // Force refresh
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await fetchProductBySlug(slug)
                if (!data) {
                    notFound()
                }
                setProduct(data)
            } catch (error) {
                console.error("Failed to load product", error)
                notFound()
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [slug])

    if (loading) {
        return (
            <>
                <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <main className="flex-1">
                        <div className="container mx-auto px-4 py-8">
                            <div className="flex h-96 items-center justify-center">
                                <div className="text-lg text-muted-foreground">Loading product...</div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        )
    }

    if (!product) {
        notFound()
    }

    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-8">
                        {/* Product Details */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <ProductGallery images={product.images} productName={product.name} />
                            <ProductInfo product={product} />
                        </div>

                        {/* Product Description & Details */}
                        <div className="mt-12 border-t border-border pt-12">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div>
                                    <h2 className="mb-4 text-2xl font-bold">Product Description</h2>
                                    <div
                                        className="prose prose-sm max-w-none leading-relaxed text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>

                                <div>
                                    <h2 className="mb-4 text-2xl font-bold">Care Instructions</h2>
                                    <div className="space-y-2 text-muted-foreground">
                                        <p>• Machine wash cold or lukewarm (30-40°C)</p>
                                        <p>• Use mild detergent</p>
                                        <p>• Tumble dry on low or line dry</p>
                                        <p>• Iron while slightly damp if desired</p>
                                        <p>• Do not bleach</p>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="mb-2 font-semibold">Shipping & Returns</h3>
                                        <p className="text-muted-foreground">
                                            Free shipping on orders over $100. Easy 30-day returns on all unworn items.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <ProductReviews product={product} />

                        {/* Related Products - Can be implemented later */}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}
