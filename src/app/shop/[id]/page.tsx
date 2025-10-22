"use client";

import { useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from "@/context/AppContext";
import { productApi, ApiError } from "@/lib/api";
import type { Product, ProductVariant } from "@/lib/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = parseInt(id as string, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, toggleFavorite, favorites } = useContext(AppContext);
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productDataRaw, variantsRaw] = await Promise.all([
          productApi.getProductById(productId),
          productApi.getProductVariants(productId),
        ]);

        const productData = productDataRaw as Product;
        setProduct(productData);

        // Fetch related products by shape (smaller payload than getAllProducts)
        const relatedByShape = await productApi.getProductsByShape(
          productData.shape
        );
        const relatedSource = Array.isArray(relatedByShape)
          ? relatedByShape
          : Array.isArray((relatedByShape as any)?.data)
          ? (relatedByShape as any).data
          : [];
        const related = relatedSource
          .filter(
            (p: any) => p && typeof p.id === "number" && p.id !== productData.id
          )
          .slice(0, 4);
        setRelatedProducts(related);

        const variantArray = Array.isArray(variantsRaw)
          ? (variantsRaw as ProductVariant[])
          : [];
        setVariants(variantArray);
        if (variantArray.length > 0) {
          setSelectedVariantId(variantArray[0].id);
          const initialVariantImages = Array.isArray(variantArray[0].images)
            ? variantArray[0].images
            : [];
          const fallback = Array.isArray(productData.picUrl)
            ? productData.picUrl
            : [];
          const first =
            (initialVariantImages[0] || fallback[0]) ?? "/placeholder.svg";
          setSelectedImageUrl(first);
        } else {
          const fallback = Array.isArray(productData.picUrl)
            ? productData.picUrl
            : [];
          const first = fallback[0] ?? "/placeholder.svg";
          setSelectedImageUrl(first);
        }
      } catch (err) {
        console.error("Failed to load product:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50/50">
          <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading product...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50/50">
          <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              {error ? "Error Loading Product" : "Product Not Found"}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {error ||
                "Sorry, we couldn't find the product you're looking for."}
            </p>
            <Button
              asChild
              className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || null;

  // Aggregate all variant images (fallback to product images)
  const allVariantImages: string[] = Array.isArray(variants)
    ? Array.from(
        new Set(
          variants
            .flatMap((v) => (Array.isArray(v.images) ? v.images : []))
            .filter((u) => typeof u === "string" && u.length > 0)
        )
      )
    : [];
  const fallbackImages = Array.isArray(product.picUrl) ? product.picUrl : [];
  const galleryImages =
    allVariantImages.length > 0 ? allVariantImages : fallbackImages;

  // Removed extra useEffect to avoid changing hook order; initial image is set in loadProduct

  const primaryImageUrl =
    selectedImageUrl ?? galleryImages[0] ?? "/placeholder.svg";

  const handleAddToCart = () => {
    const variant = selectedVariantId
      ? variants.find((v) => v.id === selectedVariantId)
      : null;
    addToCart(product, {
      productVariationId: variant ? variant.id : undefined,
      quantity: 1,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} is now in your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${product.name} has been ${
        isFavorite ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all products
          </Link>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border shadow-lg">
                <Image
                  src={primaryImageUrl}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  data-ai-hint="product photo"
                />
              </div>
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {galleryImages.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImageUrl(url)}
                      className={cn(
                        "rounded-lg overflow-hidden border focus:outline-none",
                        selectedImageUrl === url
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-primary/50"
                      )}
                      aria-label={`View image ${index + 1}`}
                      title={`View image ${index + 1}`}
                    >
                      <Image
                        src={url}
                        alt={`${product.name} view ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-3xl font-bold text-primary">
                  ${Number(product.price ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Hình dáng:</span>
                  <span className="text-muted-foreground">{product.shape}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Thương hiệu:</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {product.brand}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Chất liệu:</span>
                  <span className="bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-sm">
                    {product.material}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">Màu sắc:</span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          const imgs = Array.isArray(v.images) ? v.images : [];
                          if (imgs.length > 0) setSelectedImageUrl(imgs[0]);
                        }}
                        className={cn(
                          "h-8 px-3 rounded-full border flex items-center gap-2 text-sm",
                          selectedVariantId === v.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input bg-background text-foreground hover:bg-muted"
                        )}
                        title={v.colorName}
                        aria-label={`Select color ${v.colorName}`}
                      >
                        {v.colorHex && (
                          <span
                            className="inline-block h-3 w-3 rounded-full border"
                            style={{ backgroundColor: v.colorHex }}
                          />
                        )}
                        <span>{v.colorName || "Color"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Chiều ngang kính:
                    </span>
                    <span className="font-medium">
                      {product.dimensions.width}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Chiều dài kính:
                    </span>
                    <span className="font-medium">
                      {product.dimensions.length}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Độ rộng tròng:
                    </span>
                    <span className="font-medium">
                      {product.dimensions.lensWidth}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Độ cao tròng:</span>
                    <span className="font-medium">
                      {product.dimensions.lensHeight}mm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cầu mũi:</span>
                    <span className="font-medium">
                      {product.dimensions.bridge}mm
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={cn(
                      "mr-2 h-5 w-5",
                      isFavorite && "fill-red-500 text-red-500"
                    )}
                  />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="bg-primary/5 py-12 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center">
                You Might Also Like
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
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
