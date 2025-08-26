'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products, categories, frameStyles } from '@/lib/products';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrameStyles, setSelectedFrameStyles] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleFrameStyleChange = (style: string) => {
    setSelectedFrameStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedFrameStyles.length > 0) {
      filtered = filtered.filter(p => selectedFrameStyles.includes(p.frameStyle));
    }

    switch (sortOrder) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [searchTerm, sortOrder, selectedCategories, selectedFrameStyles]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-primary/5">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-headline text-5xl font-bold text-primary">Shop Our Collection</h1>
            <p className="mt-2 text-lg text-muted-foreground">Find the perfect pair of glasses to match your style and vision.</p>
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
                
                <Accordion type="multiple" defaultValue={['category', 'style']} className="w-full">
                  <AccordionItem value="category">
                    <AccordionTrigger className="font-headline text-lg">Category</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox id={category} onCheckedChange={() => handleCategoryChange(category)} checked={selectedCategories.includes(category)} />
                          <Label htmlFor={category} className="font-normal">{category}</Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="style">
                    <AccordionTrigger className="font-headline text-lg">Frame Style</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                      {frameStyles.map(style => (
                        <div key={style} className="flex items-center space-x-2">
                          <Checkbox id={style} onCheckedChange={() => handleFrameStyleChange(style)} checked={selectedFrameStyles.includes(style)} />
                          <Label htmlFor={style} className="font-normal">{style}</Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between pb-4 border-b">
                <p className="text-muted-foreground">{filteredAndSortedProducts.length} products</p>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
