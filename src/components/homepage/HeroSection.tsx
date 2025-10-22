import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const slides = ["hero1.avif", "hero2.avif", "hero3.avif"];

export default function HeroSection() {
  return (
    <Carousel>
      <CarouselContent>
        {slides.map((name) => (
          <CarouselItem key={name}>
            <div className="relative h-[480px] w-full">
              <Image
                src={`/homepage/hero/${name}`}
                alt=""
                fill
                priority
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
