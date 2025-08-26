
'use client';

import { useContext } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AppContext } from '@/context/AppContext';
import { products } from '@/lib/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = parseInt(id as string, 10);
  const product = products.find(p => p.id === productId);

  const { addToCart, toggleFavorite, favorites } = useContext(AppContext);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50/50">
          <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">Product Not Found</h1>
            <p className="mt-4 text-lg text-muted-foreground">Sorry, we couldn't find the product you're looking for.</p>
            <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} is now in your cart.`,
    });
  };
  
  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: `${product.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link href="/shop" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to all products
          </Link>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
            <div className="rounded-lg overflow-hidden border shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint="product photo"
              />
            </div>
            <div>
              <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-5 h-5 fill-current"/>
                    <span className="text-lg font-semibold">{product.rating}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-semibold">Category:</span>
                <span className="text-muted-foreground">{product.category}</span>
              </div>
               <div className="mt-1 flex items-center gap-2">
                <span className="font-semibold">Frame Style:</span>
                <span className="text-muted-foreground">{product.frameStyle}</span>
              </div>
              
              <Separator className="my-6" />

              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              
              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1" onClick={handleToggleFavorite}>
                  <Heart className={cn("mr-2 h-5 w-5", isFavorite && "fill-red-500 text-red-500")} /> 
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-primary/5 py-12 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center">You Might Also Like</h2>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
