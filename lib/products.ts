export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  colors: string[]
  sizes: string[]
  rating: number
  reviews: number
  inStock: boolean
  isFavorite?: boolean
  stock_available?: number
}
