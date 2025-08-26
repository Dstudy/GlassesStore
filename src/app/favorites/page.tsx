'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { User, Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { user, favorites } = useContext(AppContext);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">Your Favorites</h1>
          
          {!user ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <User className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-6 text-xl font-semibold">Log in to see your favorites</h2>
              <p className="mt-2 text-muted-foreground">
                Create an account or log in to save the styles you love.
              </p>
              <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/login">Log In / Sign Up</Link>
              </Button>
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Heart className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-6 text-xl font-semibold">No favorites yet</h2>
              <p className="mt-2 text-muted-foreground">
                Click the heart icon on any product to save it here.
              </p>
              <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/shop">Find Your Perfect Pair</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {favoriteProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
