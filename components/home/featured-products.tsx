"use client"

import { ProductCard } from "@/components/product-card"
import { fetchFeaturedProducts } from "@/lib/api"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/products"

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const data = await fetchFeaturedProducts()
        setFeaturedProducts(data)
      } catch (error) {
        console.error("Failed to load featured products", error)
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedProducts()
  }, [])

  return (
    <section id="featured" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Featured Collection</h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Discover our handpicked selection of premium linen pieces
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-lg text-muted-foreground">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
