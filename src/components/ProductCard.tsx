'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppContext } from '@/context/AppContext';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useContext(AppContext);
  const { toast } = useToast();
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} is now in your cart.`,
    });
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      description: `${product.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
    <Card className="group overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-xl h-full flex flex-col">
      <div className="overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          data-ai-hint="stylish glasses"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-body font-semibold leading-tight tracking-normal mb-1">
                <span className="hover:text-primary transition-colors">{product.name}</span>
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-amber-500">
                <Star className="w-4 h-4 fill-current"/>
                <span>{product.rating}</span>
            </div>
        </div>
        <p className="text-muted-foreground text-sm">{product.frameStyle}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            <span className="sr-only">Favorite</span>
          </Button>
          <Button variant="default" className="bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Add to Cart</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
    </Link>
  );
}
