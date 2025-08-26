'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useContext(AppContext);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">Your Cart</h1>
          
          {cart.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-6 text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-2">
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <ul role="list" className="divide-y divide-border">
                      {cart.map(item => (
                        <li key={item.product.id} className="flex p-4 sm:p-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:h-32 sm:w-32">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={128}
                              height={128}
                              className="h-full w-full object-cover object-center"
                              data-ai-hint="product photo"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                            <div>
                              <div className="flex justify-between text-base font-medium">
                                <h3>
                                  <Link href="#" className="hover:underline">{item.product.name}</Link>
                                </h3>
                                <p className="ml-4">${item.product.price.toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{item.product.frameStyle}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-200 rounded-md">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex">
                                <Button variant="ghost" type="button" className="font-medium text-accent hover:text-accent/90" onClick={() => removeFromCart(item.product.id)}>
                                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <Button asChild size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
