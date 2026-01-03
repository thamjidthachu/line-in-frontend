"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { getImageUrl } from "@/lib/utils"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant={inWishlist ? "default" : "secondary"}
              className="h-8 w-8"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>
          {!product.inStock && (
            <Badge className="absolute left-2 top-2" variant="secondary">
              Out of Stock
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold text-card-foreground line-clamp-1">{product.name}</h3>
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="mb-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          <p className="text-xl font-bold text-card-foreground">${product.price}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={handleQuickAdd} disabled={!product.inStock || isAdding}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? "Added!" : "Quick Add"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
