"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Product } from "./products"
import { useAuth } from "./auth-context"
import {
  fetchActiveCart, addToCart as apiAddToCart, removeCartItem, updateCartItem as apiUpdateCartItem, clearCart as apiClearCart
} from "./cart-api"
import {
  fetchFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite
} from "./api"
import { toast } from "sonner"

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
  cartItemsCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

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

  // Fetch cart from backend
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;

    const cartData = await fetchActiveCart();
    if (cartData && cartData.items) {
      const mappedItems: CartItem[] = cartData.items.map(item => {
        const { selectedSize, selectedColor } = parseOptions(item.special_requests);
        return {
          id: item.service_id.toString(),
          cartItemId: item.id,
          slug: item.service_slug,
          name: item.service_name,
          description: item.service_description,
          price: parseFloat(item.service_price),
          images: [item.service_image],
          category: "women", // default
          colors: [selectedColor], // default context
          sizes: [selectedSize], // default context
          rating: item.rating || 0,
          reviews: item.review_count || 0,
          inStock: true,
          quantity: item.quantity,
          selectedSize,
          selectedColor,
        };
      });
      setCart(mappedItems);
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  // Fetch wishlist from backend
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    const favs = await fetchFavorites();
    const mappedFavs: Product[] = favs.map(f => ({
      id: f.product.id.toString(),
      slug: f.product.slug,
      name: f.product.name,
      description: f.product.synopsis,
      price: parseFloat(f.product.price),
      images: f.product.files.map(file => file.images),
      category: "women",
      colors: ["Default"],
      sizes: ["One Size"],
      rating: f.product.rating,
      reviews: f.product.review_count,
      inStock: true
    }));
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
      const success = await apiAddToCart({
        service_id: Number(product.id),
        quantity,
        special_requests: `Size: ${size}, Color: ${color}`
      });
      if (success) {
        toast.success("Added to cart");
        refreshCart();
      } else {
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

        const success = await apiUpdateCartItem(item.cartItemId, { quantity });
        if (!success) {
          toast.error("Failed to update quantity");
          refreshCart(); // Revert
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
      if (success) refreshCart();
    } else {
      setCart([])
    }
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
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
