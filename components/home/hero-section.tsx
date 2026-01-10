"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getImageUrl } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl("/hero-section-image.jpg")}
          alt="Premium Linen Collection"
          className="h-full w-full object-cover"
        />
        {/* Overlays for readability */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl text-white">
          <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md">
            New Collection Available
          </div>

          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Premium Linen
            <br />
            <span>Redefined</span>
          </h1>

          <p className="mb-8 text-pretty text-lg text-white/90 md:text-xl lg:text-2xl">
            Discover our collection of sustainable, comfortable, and timeless linen clothing. Crafted for the modern
            lifestyle.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 border-none">
              <Link href="/shop">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
              <Link href="#featured">Explore More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
