import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

interface RelatedProductsProps {
  products: Product[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-12 border-t border-border pt-12">
      <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
