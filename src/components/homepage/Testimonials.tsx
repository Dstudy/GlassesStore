'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Fashion Blogger',
    quote: "I'm in love with my new glasses from Spectra Specs! The quality is amazing, and I get compliments everywhere I go. The AI assistant helped me find the perfect pair.",
    image: 'https://picsum.photos/100/100?random=1',
    rating: 5,
  },
  {
    name: 'Michael B.',
    role: 'Software Engineer',
    quote: "Finally, glasses that are both stylish and comfortable for long hours in front of the screen. The ordering process was seamless, and they arrived super fast.",
    image: 'https://picsum.photos/100/100?random=2',
    rating: 5,
  },
  {
    name: 'Jessica T.',
    role: 'Graphic Designer',
    quote: "The collection is stunning! It was hard to choose just one pair. The frames are lightweight and the prescription is spot on. Highly recommended!",
    image: 'https://picsum.photos/100/100?random=3',
    rating: 5,
  },
];

const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
        <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
    ));
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">What Our Customers Say</h2>
          <p className="mt-3 text-lg text-muted-foreground">Real stories from our happy customers.</p>
        </div>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="mx-auto mt-12 w-full max-w-xs sm:max-w-xl lg:max-w-4xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full shadow-sm">
                    <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="mb-4 rounded-full"
                        data-ai-hint="person photo"
                      />
                      <p className="flex-grow text-muted-foreground">"{testimonial.quote}"</p>
                      <div className="mt-4">
                        <h4 className="font-bold text-primary">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <div className="mt-2 flex justify-center">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
