import { Button } from "@/components/ui/button"
import { Globe } from "@/components/ui/globe"
import Link from "next/link"
import { Leaf, Truck, Shield } from "lucide-react"

export function BannerSection() {
	return (
		<>
			{/* Main Banner */}
			<section className="bg-primary py-16 text-primary-foreground md:py-24">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-3xl text-center">
						<h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
							Sustainable Fashion for a Better Tomorrow
						</h2>
						<p className="mb-8 text-pretty text-lg opacity-90">
							Our linen is sourced from sustainable farms and crafted with care for the environment. Join us in making
							fashion more sustainable.
						</p>
						<Button asChild size="lg" variant="secondary">
							<Link href="/shop">Discover Our Story</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Globe Banner */}
			<section className="relative overflow-hidden border-y border-border bg-secondary/30">
				<div className="container relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-4 md:flex-row md:gap-4 md:py-4">
					<div className="relative z-10 flex flex-1 flex-col items-start gap-4 text-left">
						<h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
							Sourced Globally
						</h2>
						<p className="max-w-[500px] text-lg text-muted-foreground md:text-xl">
							We partner with sustainable farms worldwide to bring you the finest linen, reducing our carbon footprint one garment at a time.
						</p>
					</div>
					<div className="relative flex h-[350px] w-full flex-1 items-center justify-center sm:h-[400px] md:h-[450px]">
						<Globe className="opacity-80 transition-opacity duration-1000 hover:opacity-100 dark:opacity-60" />
					</div>
				</div>
			</section>

			{/* Features Banner */}
			<section className="border-y border-border bg-secondary/30 py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						<div className="flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Leaf className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-2 font-semibold">100% Sustainable</h3>
							<p className="text-sm text-muted-foreground">Eco-friendly linen from certified sustainable sources</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Truck className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-2 font-semibold">Free Shipping</h3>
							<p className="text-sm text-muted-foreground">Free delivery on orders over $100</p>
						</div>

						<div className="flex flex-col items-center text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Shield className="h-8 w-8 text-primary" />
							</div>
							<h3 className="mb-2 font-semibold">Quality Guarantee</h3>
							<p className="text-sm text-muted-foreground">30-day return policy on all products</p>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
