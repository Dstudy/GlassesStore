"use client";

// THAY ĐỔI: Thêm 'useRef'
import { useState, useMemo, useEffect, useRef } from "react";
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
// THAY ĐỔI: Thêm các component Pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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

  // THAY ĐỔI: Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // THAY ĐỔI: Cập nhật các hàm xử lý để reset về trang 1
  const handleShapeChange = (shape: string) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1); // Reset về trang 1
  };

  // THAY ĐỔI: Cập nhật hàm xử lý tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1
  };

  // THAY ĐỔI: Cập nhật hàm xử lý sắp xếp
  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1); // Reset về trang 1
  };

  // THAY ĐỔI: Xóa cả 2 useEffect cũ và thay bằng 1 useEffect duy nhất
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Xây dựng bộ lọc (filters)
        // GIẢ ĐỊNH: API của bạn giờ có thể chấp nhận mảng (vd: brands: string[])
        // Nếu API chỉ chấp nhận 1 giá trị, bạn phải quay lại logic `length === 1`
        const filters: ProductFilters = {
          search: searchTerm || undefined,
          sortBy: sortOrder as any,
          shape: selectedShapes.length > 0 ? selectedShapes[0] : undefined, // Cập nhật nếu API hỗ trợ mảng
          color: selectedColors.length > 0 ? selectedColors[0] : undefined, // Cập nhật nếu API hỗ trợ mảng
          brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined, // Cập nhật nếu API hỗ trợ mảng
          material:
            selectedMaterials.length > 0 ? selectedMaterials[0] : undefined, // Cập nhật nếu API hỗ trợ mảng
          page: currentPage, // <-- THÊM TRANG HIỆN TẠI
        };

        // 2. Tải dữ liệu sản phẩm VÀ bộ lọc (chỉ khi cần)
        // GIẢ ĐỊNH: API trả về { products, totalPages, totalProducts, currentPage }

        const tasks: Promise<any>[] = [productApi.getAllProducts(filters)];

        // Chỉ tải các tùy chọn bộ lọc trong lần đầu tiên
        if (!initialLoaded) {
          tasks.push(productApi.getFilterOptions());
        }

        const [productsData, filterOptions] = await Promise.all(tasks);

        // 3. Cập nhật state
        setProducts(productsData.products || []);
        setTotalPages(productsData.totalPages || 1);
        setTotalProducts(productsData.totalProducts || 0);
        setCurrentPage(productsData.currentPage || 1);

        if (filterOptions) {
          setShapes(filterOptions.shapes || []);
          setBrands(filterOptions.brands || []);
          setMaterials(filterOptions.materials || []);
          setColors(filterOptions.colors || []);
          setInitialLoaded(true);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(
          err instanceof ApiError ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    // Chạy lại khi bất kỳ bộ lọc hoặc trang nào thay đổi
    searchTerm,
    sortOrder,
    selectedShapes,
    selectedBrands,
    selectedMaterials,
    selectedColors,
    currentPage,
  ]);

  // THAY ĐỔI: Xóa bỏ `useMemo` (filteredAndSortedProducts)
  // Máy chủ sẽ thực hiện tất cả việc lọc và sắp xếp

  // Hàm xử lý phân trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Cuộn lên đầu trang sản phẩm khi đổi trang
      document
        .querySelector(".lg\\:col-span-3")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* ... (Phần Header của trang không đổi) ... */}
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
            {/* ... (Phần <aside> bộ lọc không đổi) ... */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearchChange} // THAY ĐỔI
                  />
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["shape", "brand", "material", "color"]}
                  className="w-full"
                >
                  {/* (Các AccordionItem không thay đổi, chúng đã gọi đúng hàm) */}
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
                    // THAY ĐỔI: Sử dụng totalProducts từ state
                    `${totalProducts} products`
                  )}
                </p>
                <Select
                  value={sortOrder}
                  onValueChange={handleSortChange} // THAY ĐỔI
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
                  {/* THAY ĐỔI: Render 'products' trực tiếp từ state */}
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              {/* THAY ĐỔI: Kiểm tra 'products.length' */}
              {!loading && !error && products.length === 0 && (
                <div className="mt-8 text-center py-12">
                  <p className="text-muted-foreground">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
              {/* THAY ĐỔI: Thêm component Pagination */}
              {!loading && totalPages > 1 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>

                    {/* Logic hiển thị số trang (ví dụ đơn giản) */}
                    {/* Bạn có thể tạo logic phức tạp hơn với dấu "..." */}
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Logic đơn giản để chỉ hiển thị vài trang
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === page}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
