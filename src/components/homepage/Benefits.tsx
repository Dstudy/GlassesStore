import { ShieldCheck, Droplets, Sparkles, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'UV Protection',
    description: 'All our lenses come with 100% UV protection to keep your eyes safe and sound.',
  },
  {
    icon: Droplets,
    title: 'Waterproof Frames',
    description: 'Our specially treated frames are resistant to water and sweat for lasting durability.',
  },
  {
    icon: Sparkles,
    title: 'Premium Materials',
    description: 'Crafted from high-quality acetate and lightweight metals for ultimate comfort and style.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Enjoy free and fast shipping on all orders, delivered right to your doorstep.',
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">Why Choose Spectra Specs?</h2>
          <p className="mt-3 text-lg text-muted-foreground">We blend style with function to give you the best vision experience.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <benefit.icon className="h-6 w-6" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-xl text-primary">{benefit.title}</CardTitle>
                <p className="mt-2 text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
