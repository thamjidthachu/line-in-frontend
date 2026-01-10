"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const { cartItemsCount } = useCart()
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.svg"
            alt="Line-Inn logo"
            width={650}
            height={250}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Shop
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-500 hover:text-red-600 focus:text-red-600">
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full max-w-xs flex-col gap-0 p-0 sm:max-w-sm">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logos/logo.svg"
                    alt="Line-Inn logo"
                    width={120}
                    height={40}
                    priority
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <nav className="flex flex-col gap-6">
                  <Link href="/" className="group flex items-center justify-between text-lg font-medium transition-colors hover:text-primary">
                    Home
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                  <Link href="/shop" className="group flex items-center justify-between text-lg font-medium transition-colors hover:text-primary">
                    Shop
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                  <Link href="/contact" className="group flex items-center justify-between text-lg font-medium transition-colors hover:text-primary">
                    Contact
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                  <Link href="/privacy" className="group flex items-center justify-between text-lg font-medium transition-colors hover:text-primary">
                    Privacy Policy
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                </nav>
              </div>

              <div className="border-t bg-muted/40 p-6">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-sm font-medium">{user?.full_name || user?.username}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link href="/profile">Profile</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="w-full justify-start">
                        <Link href="/orders">Orders</Link>
                      </Button>
                    </div>

                    <Button onClick={() => logout()} variant="destructive" className="w-full">
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Sign in to your account
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline">
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/auth/register">Sign Up</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
