"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productApi, ApiError, type ProductFilters } from "@/lib/api";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [shapes, setShapes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const handleShapeChange = (shape: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, filterOptions] = await Promise.all([
          productApi.getAllProducts(),
          productApi.getFilterOptions(),
        ]);

        setProducts(productsData);
        setShapes(filterOptions.shapes || []);
        setBrands(filterOptions.brands || []);
        setMaterials(filterOptions.materials || []);
        setColors(filterOptions.colors || []);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    };

    loadInitialData();
  }, []);

  // Load filtered products when filters change
  useEffect(() => {
    const loadFilteredProducts = async () => {
      if (!initialLoaded) return; // Wait for initial load to complete

      try {
        setLoading(true);
        setError(null);

        const filters: ProductFilters = {
          search: searchTerm || undefined,
          sortBy: sortOrder as any,
        };

        // Add shape filter if only one is selected (API expects single shape)
        if (selectedShapes.length === 1) {
          filters.shape = selectedShapes[0];
        }

        // Add color filter if only one is selected (API may expect single color)
        if (selectedColors.length === 1) {
          filters.color = selectedColors[0];
        }

        // Add brand/material filters when a single option is selected
        if (selectedBrands.length === 1) {
          filters.brand = selectedBrands[0];
        }
        if (selectedMaterials.length === 1) {
          filters.material = selectedMaterials[0];
        }

        const productsData = await productApi.getAllProducts(filters);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load filtered products:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFilteredProducts();
  }, [
    initialLoaded,
    searchTerm,
    sortOrder,
    selectedShapes,
    selectedColors,
    selectedBrands,
    selectedMaterials,
  ]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Client-side filtering for multiple selections (when API doesn't support it)
    if (selectedShapes.length > 1) {
      filtered = filtered.filter((p) => selectedShapes.includes(p.shape));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((p) => selectedMaterials.includes(p.material));
    }

    if (selectedColors.length > 1) {
      filtered = filtered.filter((p) => selectedColors.includes(p.color));
    }

    // Client-side sorting (when API doesn't support it)
    switch (sortOrder) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return filtered.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
    }
  }, [
    products,
    selectedShapes,
    selectedBrands,
    selectedMaterials,
    selectedColors,
    sortOrder,
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-primary/5">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-5xl font-bold text-primary">
              Shop Our Collection
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Find the perfect pair of glasses to match your style and vision.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["shape", "brand", "material", "color"]}
                  className="w-full"
                >
                  <AccordionItem value="shape">
                    <AccordionTrigger className="font-headline text-lg">
                      Hình dáng
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {shapes.map((shape) => (
                        <div
                          key={shape}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={shape}
                            onCheckedChange={() => handleShapeChange(shape)}
                            checked={selectedShapes.includes(shape)}
                          />
                          <Label htmlFor={shape} className="font-normal">
                            {shape}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="brand">
                    <AccordionTrigger className="font-headline text-lg">
                      Thương hiệu
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={brand}
                            onCheckedChange={() => handleBrandChange(brand)}
                            checked={selectedBrands.includes(brand)}
                          />
                          <Label htmlFor={brand} className="font-normal">
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="material">
                    <AccordionTrigger className="font-headline text-lg">
                      Chất liệu
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {materials.map((material) => (
                        <div
                          key={material}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={material}
                            onCheckedChange={() =>
                              handleMaterialChange(material)
                            }
                            checked={selectedMaterials.includes(material)}
                          />
                          <Label htmlFor={material} className="font-normal">
                            {material}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="color">
                    <AccordionTrigger className="font-headline text-lg">
                      Màu sắc
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {colors.map((color) => (
                        <div
                          key={color}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={color}
                            onCheckedChange={() => handleColorChange(color)}
                            checked={selectedColors.includes(color)}
                          />
                          <Label htmlFor={color} className="font-normal">
                            {color}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between pb-4 border-b">
                <p className="text-muted-foreground">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading products...
                    </span>
                  ) : (
                    `${filteredAndSortedProducts.length} products`
                  )}
                </p>
                <Select
                  value={sortOrder}
                  onValueChange={setSortOrder}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="mt-8 flex items-center justify-center py-12">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading products...</span>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {!loading && !error && filteredAndSortedProducts.length === 0 && (
                <div className="mt-8 text-center py-12">
                  <p className="text-muted-foreground">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
