"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { cn, getImageUrl } from "@/lib/utils"

interface BentoProductCardProps {
  product: Product
  className?: string
}

export function BentoProductCard({ product, className }: BentoProductCardProps) {
  const { addToCart, addToWishlist, isInWishlist } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const inWishlist = isInWishlist(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addToCart(product, product.sizes[0], product.colors[0], 1)
    setTimeout(() => setIsAdding(false), 1000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    addToWishlist(product)
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg",
        className,
      )}
    >
      <div className="relative h-full w-full">
        <Image
          src={getImageUrl(product.images[0])}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-start justify-between">
            {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
            <Button
              size="icon"
              variant={inWishlist ? "default" : "secondary"}
              className="ml-auto h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="text-white">
            <div className="mb-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm opacity-80">({product.reviews})</span>
            </div>

            <h3 className="mb-1 font-semibold line-clamp-1">{product.name}</h3>
            <p className="mb-2 text-2xl font-bold">${product.price}</p>

            <Button className="w-full" size="sm" onClick={handleQuickAdd} disabled={!product.inStock || isAdding}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAdding ? "Added!" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
