import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Slide = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  align: "left" | "right";
};

const slides: Slide[] = [
  {
    imageSrc: "/homepage/hero/slide-1.jpg",
    imageAlt: "New arrivals eyewear on model",
    title: "See the World in Style",
    description:
      "Discover our exclusive collection of prescription glasses and sunglasses.",
    cta: { label: "Shop New Arrivals", href: "/shop" },
    align: "left",
  },
  {
    imageSrc: "/homepage/hero/slide-2.jpg",
    imageAlt: "Premium sunglasses close-up",
    title: "Premium Lenses. Crystal Vision.",
    description: "Ultra-clear, scratch‑resistant, blue‑light filtering options available.",
    cta: { label: "Explore Lenses", href: "/shop" },
    align: "right",
  },
  {
    imageSrc: "/homepage/hero/slide-3.jpg",
    imageAlt: "Everyday frames on desk",
    title: "Comfort Meets Design",
    description: "Lightweight frames crafted for all‑day wear.",
    cta: { label: "Browse Frames", href: "/shop" },
    align: "left",
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full">
      <Carousel
        opts={{ loop: true }}
        className="h-[60vh] min-h-[400px] w-full md:h-[80vh]"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, idx) => (
            <CarouselItem key={slide.imageSrc} className="h-full">
              <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden md:h-[80vh]">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover object-center"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div
                  className={cn(
                    "absolute inset-0 z-10 flex items-center",
                    slide.align === "left" ? "justify-start" : "justify-end"
                  )}
                >
                  <div className={cn("container px-4", slide.align === "left" ? "text-left" : "text-right")}>
                    <div className={cn("max-w-xl text-white", slide.align === "right" ? "ml-auto" : undefined)}>
                      <h1 className="font-semibold text-5xl md:text-7xl">
                        {slide.title}
                      </h1>
                      <p className="mt-4 max-w-prose text-lg md:text-xl text-white/90">
                        {slide.description}
                      </p>
                      <div className={cn("mt-8", slide.align === "right" ? "ml-auto" : undefined)}>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-2 border-white bg-transparent text-white transition-colors hover:bg-white hover:text-black"
                        >
                          <Link href={slide.cta.href}>{slide.cta.label}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </section>
  );
}
