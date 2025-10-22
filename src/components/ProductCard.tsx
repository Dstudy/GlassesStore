"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import type { Product } from "@/lib/types";
import { productApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useContext(AppContext);
  const { toast } = useToast();
  const isFavorite = favorites.includes(product.id);

  const [variantColors, setVariantColors] = useState<
    { name: string; hex?: string }[]
  >([]);
  const [firstVariantId, setFirstVariantId] = useState<number | null>(null);

  const imageUrls = Array.isArray(product.picUrl) ? product.picUrl : [];
  const primaryImageUrl = imageUrls[0] ?? "/placeholder.svg";

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const variants = await productApi.getProductVariants(product.id);
        if (isCancelled) return;
        if (Array.isArray(variants) && variants.length > 0) {
          setFirstVariantId(Number(variants[0]?.id ?? null));
        }
        const seen = new Set<string>();
        const colors = variants
          .map((v) => ({ name: v.colorName, hex: v.colorHex }))
          .filter((c) => !!c.name)
          .filter((c) => {
            const key = `${c.name}|${c.hex ?? ""}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        setVariantColors(colors);
      } catch (_) {
        // ignore errors; keep card lean
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      productVariationId: firstVariantId ?? undefined,
      quantity: 1,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${product.name} has been ${
        isFavorite ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <Card className="group overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-xl h-full flex flex-col">
        <div className="overflow-hidden relative">
          <Image
            src={primaryImageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            data-ai-hint="stylish glasses"
          />
          {imageUrls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              +{imageUrls.length - 1} ảnh
            </div>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-body font-semibold leading-tight tracking-normal mb-1">
              <span className="hover:text-primary transition-colors">
                {product.name}
              </span>
            </CardTitle>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">{product.shape}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                {product.brand}
              </span>
              <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                {product.material}
              </span>
            </div>
            {variantColors.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Màu:</span>
                <div className="flex items-center gap-1">
                  {variantColors.slice(0, 6).map((c, idx) => (
                    <span
                      key={`${c.name}-${idx}`}
                      title={c.name}
                      aria-label={c.name}
                      className="inline-block h-3.5 w-3.5 rounded-full border"
                      style={{ backgroundColor: c.hex || "transparent" }}
                    />
                  ))}
                  {variantColors.length > 6 && (
                    <span className="text-muted-foreground">
                      +{variantColors.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">
            ${Number(product.price ?? 0).toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground"
                )}
              />
              <span className="sr-only">Favorite</span>
            </Button>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
