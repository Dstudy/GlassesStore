import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export default function FeaturedProducts() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section id="featured" className="bg-primary/5 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">Featured Styles</h2>
          <p className="mt-3 text-lg text-muted-foreground">Handpicked for you, discover our most popular frames.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
