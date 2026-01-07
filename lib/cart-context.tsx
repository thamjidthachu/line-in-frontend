"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "./products"
import { useAuth } from "./auth-context"
import {
  fetchActiveCart,
  addToCart as apiAddToCart,
  removeCartItem,
  updateCartItem as apiUpdateCartItem,
  clearCart as apiClearCart,
  type ApiCart,
  type ApiCartItem,
} from "./cart-api"
import {
  fetchFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite
} from "./api"
import { toast } from "sonner"
import { getImageUrl } from "./utils"

interface CartItem extends Product {
  quantity: number
  selectedSize: string
  selectedColor: string
  cartItemId?: number // ID from backend
}

interface CartContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product, size: string, color: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearCart: () => Promise<void>
  cartTotal: number
  cartTax: number
  cartGrandTotal: number
  cartItemsCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [cartTotals, setCartTotals] = useState({ subtotal: 0, tax: 0, total: 0 })

  // Helper to parse special options
  const parseOptions = (specialRequests: string | null) => {
    let selectedSize = "One Size";
    let selectedColor = "Default";
    if (specialRequests) {
      const sizeMatch = specialRequests.match(/Size: ([^,]+)/);
      const colorMatch = specialRequests.match(/Color: ([^,]+)/);
      if (sizeMatch) selectedSize = sizeMatch[1].trim();
      if (colorMatch) selectedColor = colorMatch[1].trim();
    }
    return { selectedSize, selectedColor };
  }

  const mapApiCart = (cartData: ApiCart) => {
    const apiItems = cartData.cart_items || cartData.items || []
    const mappedItems: CartItem[] = apiItems.map((item: ApiCartItem) => {
      const { selectedSize, selectedColor } = parseOptions(item.special_requests ?? null)

      // Accept nested product, product_* fields, or service_* fields
      const product = item.product || {
        id: item.product_id ?? 0,
        name: item.product_name ?? "Unknown",
        price: item.product_price ?? "0",
        slug: item.product_slug ?? "",
        image: item.product_image,
        description: item.product_description ?? "",
      }

      const priceNumber = typeof item.unit_price === "string"
        ? parseFloat(item.unit_price)
        : item.unit_price
      const productPrice = typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price

      const imageUrl = getImageUrl(product.image || "/placeholder.jpg")

      return {
        id: product.id?.toString() ?? "",
        cartItemId: item.id,
        slug: product.slug || product.id?.toString() || "",
        name: product.name || "Product",
        description: (product as any).description || item.product_description || "",
        price: priceNumber || productPrice || 0,
        images: [imageUrl],
        category: "women",
        colors: [selectedColor],
        sizes: [selectedSize],
        rating: item.rating || 0,
        reviews: item.review_count || 0,
        inStock: item.is_active ?? true,
        quantity: item.quantity,
        selectedSize,
        selectedColor,
      }
    })

    setCart(mappedItems)
    setCartTotals({
      subtotal: typeof cartData.subtotal === "string" ? parseFloat(cartData.subtotal) : cartData.subtotal,
      tax: typeof cartData.tax === "string" ? parseFloat(cartData.tax) : cartData.tax,
      total: typeof cartData.total_amount === "string" ? parseFloat(cartData.total_amount) : cartData.total_amount,
    })
  }

  // Fetch cart from backend
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    const cartData = await fetchActiveCart();
    if (cartData && (Array.isArray(cartData.cart_items) || Array.isArray(cartData.items))) {
      mapApiCart(cartData);
    } else {
      setCart([]);
      setCartTotals({ subtotal: 0, tax: 0, total: 0 });
    }
  }, [isAuthenticated]);

  // Fetch wishlist from backend
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    const favs = await fetchFavorites();
    const mappedFavs: Product[] = favs.map(f => {
      if (!f.product) return null
      return {
        id: f.product.id.toString(),
        slug: f.product.slug,
        name: f.product.name,
        description: f.product.synopsis,
        price: parseFloat(f.product.price),
        images: f.product.files?.map(file => file.images) || [],
        category: "women",
        colors: ["Default"],
        sizes: ["One Size"],
        rating: f.product.rating,
        reviews: f.product.review_count,
        inStock: true
      }
    }).filter((p): p is Product => p !== null)
    setWishlist(mappedFavs);
  }, [isAuthenticated]);

  // Initial load or auth change
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        await Promise.all([refreshCart(), refreshWishlist()]);
      } else {
        // Load local storage
        const savedCart = localStorage.getItem("cart")
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedCart) setCart(JSON.parse(savedCart))
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
      }
      setIsInitialized(true);
    };
    loadData();
  }, [isAuthenticated, refreshCart, refreshWishlist]);

  // Sync to local storage if NOT authenticated
  useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isAuthenticated, isInitialized])

  useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isAuthenticated, isInitialized])


  const addToCart = async (product: Product, size: string, color: string, quantity: number) => {
    if (isAuthenticated) {
      const defaultDate = new Date().toISOString().slice(0, 10)
      const cartResponse = await apiAddToCart({
        product_id: Number(product.id),
        quantity,
        booking_date: defaultDate,
        special_requests: `Size: ${size}, Color: ${color}`
      });
      if (cartResponse && (Array.isArray(cartResponse.cart_items) || Array.isArray(cartResponse.items))) {
        toast.success("Added to cart");
        mapApiCart(cartResponse);
      } else {
        await refreshCart(); // attempt to resync in case backend created cart
        toast.error("Failed to add to cart");
      }
    } else {
      // Local logic
      setCart((currentCart) => {
        const existingItem = currentCart.find(
          (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color,
        )
        if (existingItem) {
          return currentCart.map((item) =>
            item.id === product.id && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        }
        return [...currentCart, { ...product, quantity, selectedSize: size, selectedColor: color }]
      });
      toast.success("Added to cart");
    }
  }

  const removeFromCart = async (productId: string, size: string, color: string) => {
    if (isAuthenticated) {
      // Find item to remove
      const item = cart.find(i => i.id === productId && i.selectedSize === size && i.selectedColor === color);
      if (item && item.cartItemId) {
        const success = await removeCartItem(item.cartItemId);
        if (success) {
          refreshCart();
          toast.success("Removed from cart");
        } else {
          toast.error("Failed to remove item");
        }
      }
    } else {
      setCart((currentCart) =>
        currentCart.filter(
          (item) => !(item.id === productId && item.selectedSize === size && item.selectedColor === color),
        ),
      )
      toast.success("Removed from cart");
    }
  }

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (isAuthenticated) {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
      }
      const item = cart.find(i => i.id === productId && i.selectedSize === size && i.selectedColor === color);
      if (item && item.cartItemId) {
        // Optimistic update
        setCart(prev => prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity } : i));

        const updated = await apiUpdateCartItem(item.cartItemId, { quantity });
        if (!updated) {
          toast.error("Failed to update quantity");
          refreshCart(); // Revert
        } else {
          refreshCart();
        }
      }
    } else {
      if (quantity <= 0) {
        removeFromCart(productId, size, color)
        return
      }
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === productId && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity }
            : item,
        ),
      )
    }
  }

  const addToWishlist = async (product: Product) => {
    if (isAuthenticated) {
      if (isInWishlist(product.id)) return;
      const success = await apiAddFavorite(Number(product.id));
      if (success) {
        toast.success("Added to wishlist");
        refreshWishlist();
      } else {
        toast.error("Failed to add to wishlist");
      }
    } else {
      setWishlist((currentWishlist) => {
        if (currentWishlist.find((item) => item.id === product.id)) {
          return currentWishlist
        }
        toast.success("Added to wishlist");
        return [...currentWishlist, product]
      })
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated) {
      const success = await apiRemoveFavorite(Number(productId));
      if (success) {
        toast.success("Removed from wishlist");
        refreshWishlist();
      } else {
        toast.error("Failed to remove from wishlist");
      }
    } else {
      setWishlist((currentWishlist) => currentWishlist.filter((item) => item.id !== productId))
      toast.success("Removed from wishlist");
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const clearCart = async () => {
    if (isAuthenticated) {
      const success = await apiClearCart();
      if (success) {
        setCart([])
        setCartTotals({ subtotal: 0, tax: 0, total: 0 })
      }
    } else {
      setCart([])
    }
  }

  const computedSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartTotal = cartTotals.subtotal || computedSubtotal
  const cartTax = cartTotals.tax || cartTotal * 0.08
  const cartGrandTotal = cartTotals.total || cartTotal + cartTax
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartTax,
        cartGrandTotal,
        cartItemsCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
