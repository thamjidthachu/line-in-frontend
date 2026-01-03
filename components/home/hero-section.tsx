"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PixelImage } from "@/components/ui/pixel-image"
import { getImageUrl } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary self-center lg:self-start">
              New Collection Available
            </div>

            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Premium Linen
              <br />
              <span className="text-primary">Redefined</span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl lg:text-2xl">
              Discover our collection of sustainable, comfortable, and timeless linen clothing. Crafted for the modern
              lifestyle.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="group">
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#featured">Explore More</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[400px] lg:min-h-[600px] w-full items-center justify-center flex">
            <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
              <PixelImage
                src={getImageUrl("/hero-section-image.jpg")}
                grid="8x8"
                className="h-full w-full"
              />
            </div>
            {/* Decorative Background Blob */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-primary/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
