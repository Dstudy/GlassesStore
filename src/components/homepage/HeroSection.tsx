import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden md:h-[80vh]">
      <Image
        src="https://picsum.photos/1800/1200"
        alt="A person wearing stylish glasses"
        fill
        className="object-cover object-center"
        priority
        data-ai-hint="fashion model sunglasses"
      />
      {/* Sử dụng một lớp phủ màu đen đồng nhất, tinh tế thay vì gradient
       */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container px-4 text-white">
          <h1
            className="font-semibold text-5xl md:text-7xl" // <-- Bỏ font-headline, font-bold, drop-shadow, và tất cả animation
          >
            See the World in Style
          </h1>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg md:text-xl" // <-- Bỏ drop-shadow và tất cả animation
          >
            Discover our exclusive collection of prescription glasses and
            sunglasses. Perfect vision, unmatched style.
          </p>
          <div
            className="mt-8" // <-- Bỏ tất cả animation
          >
            <Button
              asChild
              size="lg"
              variant="outline" // <-- Đổi sang 'outline'
              // <-- Style cho nút outline trên nền tối: viền trắng, chữ trắng, hover nền trắng chữ đen
              className="border-2 border-white bg-transparent text-white transition-colors
                         hover:bg-white hover:text-black"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
