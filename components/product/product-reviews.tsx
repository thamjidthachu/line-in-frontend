"use client"


import { Star, User, Loader2, StarHalf } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Product } from "@/lib/products"
import { useState, useEffect, useRef } from "react"
import { fetchProductReviews, submitProductReview, type Review } from "@/lib/api"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface ProductReviewsProps {
  product: Product
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const { accessToken, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalReviews, setTotalReviews] = useState(0)

  console.log("Rendering ProductReviews component for:", product.slug) // Debug log

  // Review Form State
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadReviews = async (currentPage: number, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true)
      else setLoading(true)

      const data = await fetchProductReviews(product.slug, currentPage)

      if (isLoadMore) {
        setReviews((prev) => [...prev, ...data.results])
      } else {
        setReviews(data.results)
      }

      setHasMore(!!data.next)
      setTotalReviews(data.count)
    } catch (error) {
      console.error("Failed to load reviews", error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    // Reset state when product changes
    setPage(1)
    setReviews([])
    loadReviews(1)
  }, [product.slug])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadReviews(nextPage, true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return // Should act as guard
    if (rating === 0) return toast.warning("Please select a rating")

    setIsSubmitting(true)
    try {
      const success = await submitProductReview(product.slug, message, rating)
      if (success) {
        setMessage("")
        setRating(0)
        setPage(1)
        loadReviews(1) // Reload to show new review
        toast.success("Review submitted successfully!")
      } else {
        toast.error("Failed to submit review. Please try again.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error submitting review")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate generic distribution for visual
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const star = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5
    if (star >= 1 && star <= 5) ratingCounts[star]++
  })

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    percentage: reviews.length ? (ratingCounts[stars as keyof typeof ratingCounts] / reviews.length) * 100 : 0
  }))

  // Star Rating Interaction Logic for .5 increments
  const ratingContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ratingContainerRef.current) return

    const rect = ratingContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const percent = x / width
    // 5 stars, so 0-5 range. Round to nearest 0.5
    let newRating = Math.ceil(percent * 5 * 2) / 2
    if (newRating < 0.5) newRating = 0.5
    if (newRating > 5) newRating = 5

    setHoverRating(newRating)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const handleClickRating = () => {
    setRating(hoverRating)
  }

  const renderStars = (value: number, size = "md") => {
    const stars = []
    const fullStars = Math.floor(value)
    const hasHalfStar = value % 1 !== 0
    const starSize = size === "lg" ? "h-6 w-6" : "h-4 w-4"

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className={cn(starSize, "fill-primary text-primary")} />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className={cn(starSize, "fill-primary text-primary")} />)
    }

    const emptyStars = 5 - Math.ceil(value)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={cn(starSize, "text-muted-foreground opacity-30")} />)
    }

    return <div className="flex items-center gap-0.5">{stars}</div>
  }

  return (
    <div className="mt-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Customer Reviews ({totalReviews})</h2>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Summary & Form */}
        <div className="lg:col-span-4 space-y-8">
          {/* Summary Card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold">{product.rating ? product.rating.toFixed(1) : "0.0"}</span>
                <span className="text-muted-foreground text-sm">/ 5</span>
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(product.rating || 0, "lg")}
              </div>
              <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>

            <div className="space-y-3">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-3 font-medium">{dist.stars}</span>
                  <Star className="h-3 w-3 fill-muted text-muted" />
                  <Progress value={dist.percentage} className="h-2 flex-1" />
                  <span className="w-10 text-right text-muted-foreground">{Math.round(dist.percentage)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Form */}
          {isAuthenticated ? (
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">Rating</Label>
                  {/* Interactive Star Rating */}
                  <div
                    ref={ratingContainerRef}
                    className="flex w-fit cursor-pointer gap-1 py-1"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClickRating}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const activeVal = hoverRating || rating;
                      // Logic for display during hover/selection
                      const isFull = activeVal >= star;
                      const isHalf = activeVal >= star - 0.5 && activeVal < star;

                      return (
                        <div key={star} className="relative">
                          <Star
                            className={cn(
                              "h-8 w-8 transition-colors",
                              isFull ? "fill-primary text-primary" : "text-muted-foreground opacity-30"
                            )}
                          />
                          {/* Overlay for half star rendering if strictly needed visually, 
                                but simpler to just swap icons if library supported. 
                                Lucide StarHalf is left-half. */}
                          {isHalf && (
                            <StarHalf className="absolute top-0 left-0 h-8 w-8 fill-primary text-primary" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 h-5">
                    {hoverRating > 0 ? `${hoverRating} Stars` : rating > 0 ? `${rating} Stars` : "Select a rating"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="message">Your Review</Label>
                  <Textarea
                    id="message"
                    placeholder="Share your experience with this product..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 min-h-[120px] resize-none"
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-6 text-center">
              <h3 className="mb-2 text-lg font-semibold">Share your thoughts</h3>
              <p className="mb-4 text-sm text-muted-foreground">Sign in to write a review for this product.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div key={idx} className="group relative rounded-xl border bg-card p-6 transition-colors hover:bg-accent/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={review.author.avatar || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {review.author.full_name
                            ? review.author.full_name.charAt(0).toUpperCase()
                            : review.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{review.author.full_name || review.author.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.created_at ? format(new Date(review.created_at), "MMMM d, yyyy") : ""}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                    {review.message}
                  </p>
                </div>
              ))}

              {hasMore && (
                <div className="mt-8 text-center pt-4 border-t border-dashed">
                  <Button
                    variant="ghost"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="min-w-[200px]"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      "Load More Reviews"
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Star className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No reviews yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-1">
                Be the first to share your thoughts on this product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div >
  )
}
