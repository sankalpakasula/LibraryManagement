'use client';

import Link from "next/link";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { LayoutDashboard, LogIn, UserPlus, Menu, Library } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card/80 border-b border-primary/10 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center gap-2 font-headline text-primary font-bold text-lg">
          <Library />
          LibroSmart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <LogIn />
              Login
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">
               <UserPlus />
              Sign Up
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-8">
                 <SheetClose asChild>
                    <Link href="/" className="flex items-center gap-2 font-headline text-primary font-bold text-lg mb-4">
                      <Library />
                      LibroSmart
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/login" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                      <LogIn />
                      Login
                    </Link>
                  </SheetClose>
                   <SheetClose asChild>
                    <Link href="/signup" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                       <UserPlus />
                      Sign Up
                    </Link>
                  </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
