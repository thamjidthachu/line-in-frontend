"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

function CartContent() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart()



  const shipping = cartTotal > 100 ? 0 : 10
  const tax = cartTotal * 0.08 // 8% tax
  const total = cartTotal + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
        <ShoppingBag className="mb-4 h-24 w-24 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add some items to get started</p>
        <Button asChild size="lg">
          <Link href="/shop">
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart ({cart.length} items)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-48 w-full sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted self-center sm:self-start"
                    >
                      <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div className="flex-1 space-y-1">
                          <Link href={`/product/${item.slug}`} className="font-semibold hover:text-primary line-clamp-1">
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Color: {item.selectedColor} | Size: {item.selectedSize}
                          </p>
                        </div>
                        <p className="font-semibold text-lg sm:text-base">${item.price}</p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:gap-4">
                          <p className="font-bold sm:hidden">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {cartTotal < 100 && shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Add ${(100 - cartTotal).toFixed(2)} more to get free shipping!
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

    </>
  )
}

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="border-b border-border bg-secondary/30 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <CartContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
