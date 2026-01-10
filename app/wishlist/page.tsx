"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider, useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useState } from "react"

function WishlistContent() {
  const { wishlist, removeFromWishlist, addToCart } = useCart()
  const [addingProduct, setAddingProduct] = useState<string | null>(null)



  const handleAddToCart = (productId: string) => {
    const product = wishlist.find((p) => p.id === productId)
    if (product) {
      setAddingProduct(productId)
      addToCart(product, product.sizes[0], product.colors[0], 1)
      setTimeout(() => setAddingProduct(null), 1000)
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
        <Heart className="mb-4 h-24 w-24 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Your wishlist is empty</h2>
        <p className="mb-6 text-muted-foreground">Save items you love for later</p>
        <Button asChild size="lg">
          <Link href="/shop">
            Browse Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">{wishlist.length} items in your wishlist</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  removeFromWishlist(product.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Link>

            <CardContent className="p-4">
              <Link href={`/product/${product.slug}`} className="block">
                <h3 className="mb-1 font-semibold hover:text-primary line-clamp-1">{product.name}</h3>
                <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <p className="mb-4 text-xl font-bold">${product.price}</p>
              </Link>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.inStock || addingProduct === product.id}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {addingProduct === product.id ? "Added!" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => removeFromWishlist(product.id)}>
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </>
  )
}

export default function WishlistPage() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="border-b border-border bg-secondary/30 py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3">
                <Heart className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">My Wishlist</h1>
              </div>
              <p className="mt-2 text-muted-foreground">
                Save your favorite items and never lose track of what you love
              </p>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <WishlistContent />
          </div>
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
