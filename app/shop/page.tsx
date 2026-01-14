"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { type Product } from "@/lib/products"
import { fetchProducts, fetchCategories, type Category } from "@/lib/api"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { BentoProductCard } from "@/components/bento-product-card"

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "bento">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [category, setCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsList, setProductsList] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 8

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories", error)
      }
    }
    loadCategories()
  }, [])

  // Fetch products when category or sort changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const categorySlug = category === "all" ? undefined : category

        // Parse sort option to extract field and order
        let sortField: string | undefined
        let sortOrder: 'asc' | 'desc' | undefined

        if (sortBy !== "featured") {
          const [field, order] = sortBy.split('-')

          // Map UI field names to API field names
          const fieldMap: Record<string, string> = {
            'price': 'price',
            'name': 'name',
            'stock': 'stock_available',
            'rating': 'rating'
          }

          sortField = fieldMap[field]
          sortOrder = order as 'asc' | 'desc'
        }

        const data = await fetchProducts(categorySlug, sortField, sortOrder)
        setProductsList(data)
      } catch (error) {
        console.error("Failed to load products", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [category, sortBy])

  // No need for client-side filtering/sorting since it's done by API
  const filteredProducts = useMemo(() => {
    return productsList
  }, [productsList])

  // Reset to page 1 when category or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [category, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Header */}
          <section className="border-b border-border bg-secondary/30 py-12">
            <div className="container mx-auto px-4">
              <h1 className="mb-2 text-4xl font-bold">Shop Collection</h1>
              <p className="text-lg text-muted-foreground">Discover our complete range of premium linen clothing</p>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            {/* Filters and Controls */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="category">Category:</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="sort">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort" className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                      <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
                      <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
                      <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
                  <Switch
                    checked={viewMode === "bento"}
                    onCheckedChange={(checked) => setViewMode(checked ? "bento" : "grid")}
                  />
                  <LayoutList
                    className={`h-5 w-5 ${viewMode === "bento" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{filteredProducts.length} products</span>
              </div>
            </div>


            {/* Products Grid/Bento */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-lg text-muted-foreground">Loading products...</div>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px]">
                {currentProducts.map((product, index) => (
                  <BentoProductCard
                    key={product.id}
                    product={product}
                    className={
                      index % 7 === 0
                        ? "md:col-span-2 md:row-span-2"
                        : index % 7 === 3
                          ? "lg:col-span-2"
                          : index % 7 === 5
                            ? "md:row-span-2"
                            : ""
                    }
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
