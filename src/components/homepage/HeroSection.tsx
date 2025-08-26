import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container px-4 text-white">
          <h1 className="font-headline text-5xl font-bold drop-shadow-lg md:text-7xl">
            See the World in Style
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg drop-shadow-md md:text-xl">
            Discover our exclusive collection of prescription glasses and sunglasses.
            Perfect vision, unmatched style.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg transition-transform hover:scale-105">
              <Link href="/shop">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
