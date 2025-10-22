"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { getGlassesRecommendation, AIFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { Sparkles, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState: AIFormState = {
  message: null,
  recommendation: null,
  recommendedProducts: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
    >
      {pending ? "Thinking..." : "Get Recommendation"}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export default function AIAssistant() {
  const [state, formAction] = useActionState(
    getGlassesRecommendation,
    initialState
  );
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.recommendation) {
      toast({
        title: "Oops!",
        description: state.message,
        variant: "destructive",
      });
    }
    if (state.recommendation) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section
      id="ai-assistant"
      className="w-full py-12 md:py-24 lg:py-32 bg-primary/5"
    >
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                AI Style Assistant
              </CardTitle>
              <CardDescription className="text-lg">
                Tell us what you need, and our AI will find the perfect pair for
                you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={formAction} className="space-y-4">
                <Textarea
                  id="needs"
                  name="needs"
                  placeholder="e.g., 'I need stylish sunglasses for driving' or 'durable glasses for playing basketball'"
                  className="min-h-[100px] text-base"
                  required
                />
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                  <SubmitButton />
                </div>
              </form>

              {state.recommendation && (
                <div
                  key={state.timestamp}
                  className="mt-6 animate-in fade-in-50 duration-500"
                >
                  <Card className="bg-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Recommendation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-primary/90">{state.recommendation}</p>
                      {state.recommendedProducts &&
                        state.recommendedProducts.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-headline text-lg text-primary mb-4">
                              Suggested Products:
                            </h4>
                            <Carousel
                              opts={{ align: "start", loop: true }}
                              className="w-full"
                            >
                              <CarouselContent className="-ml-4">
                                {state.recommendedProducts.map(
                                  (product, index) => (
                                    <CarouselItem
                                      key={index}
                                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                                    >
                                      <div className="p-1">
                                        <ProductCard product={product} />
                                      </div>
                                    </CarouselItem>
                                  )
                                )}
                              </CarouselContent>
                              <CarouselPrevious className="ml-12" />
                              <CarouselNext className="mr-12" />
                            </Carousel>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
