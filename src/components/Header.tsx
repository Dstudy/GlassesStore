"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Heart, User, Menu, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/#ai-assistant", label: "AI Assistant" },
  { href: "/#testimonials", label: "Testimonials" },
];

export default function Header() {
  const { cart, user, logout } = useContext(AppContext);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === link.href ? "text-primary" : "text-muted-foreground",
          isMobile && "block w-full p-3 text-lg"
        )}
        onClick={() => isMobile && setMobileMenuOpen(false)}
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-headline text-2xl font-bold text-primary">
            Spectra Specs
          </span>
        </Link>
        <nav className="hidden gap-6 md:flex">{renderNavLinks()}</nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0 text-xs bg-accent text-accent-foreground">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <Package className="h-5 w-5" />
              <span className="sr-only">Orders</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/favorites">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Link>
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" onClick={logout}>
              <User className="h-5 w-5 text-accent" />
              <span className="sr-only">Log Out</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Log In</span>
              </Link>
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-8">
                <span className="font-headline text-2xl font-bold text-primary">
                  Spectra Specs
                </span>
              </Link>
              <nav className="grid gap-4">{renderNavLinks(true)}</nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
