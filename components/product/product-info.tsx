"use client"

import { useState } from "react"
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter()
  const { addToCart, addToWishlist, isInWishlist } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const inWishlist = product.isFavorite || isInWishlist(product.id)

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity)
    router.push("/cart")
  }

  const handleWishlist = () => {
    addToWishlist(product)
  }

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
          {product.category && (
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
          )}
        </div>
        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{product.name}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted",
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-4xl font-bold">${product.price}</p>
        <p className="mt-1 text-sm text-muted-foreground">Free shipping on orders over $100</p>
      </div>

      {/* Color Selection */}
      <div>
        <Label className="mb-3 block text-base font-semibold">
          Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
        </Label>
        <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <div key={color}>
              <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
              <Label
                htmlFor={`color-${color}`}
                className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-secondary px-4 py-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
              >
                {color}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Size Selection */}
      <div>
        <Label className="mb-3 block text-base font-semibold">
          Size: <span className="font-normal text-muted-foreground">{selectedSize}</span>
        </Label>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <div key={size}>
              <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`size-${size}`}
                className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-secondary px-4 py-2 hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Quantity */}
      <div>
        <Label className="mb-3 block text-base font-semibold">Quantity</Label>
        <div className="flex w-32 items-center justify-between rounded-md border border-input">
          <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={incrementQuantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleBuyNow}
            disabled={!product.inStock}
          >
            Buy Now
          </Button>
        </div>
        <Button variant={inWishlist ? "default" : "outline"} size="lg" className="w-full" onClick={handleWishlist}>
          <Heart className={`mr-2 h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 rounded-lg bg-secondary/30 p-4">
        <div className="flex items-start gap-3">
          <Truck className="mt-1 h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">Free Shipping</p>
            <p className="text-sm text-muted-foreground">On orders over $100</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <svg className="mt-1 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-semibold">Quality Guarantee</p>
            <p className="text-sm text-muted-foreground">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
