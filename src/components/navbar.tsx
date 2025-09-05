'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LayoutDashboard, LogIn, UserPlus, Menu, Library, BookUser, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
    id: string;
    name: string;
    role: 'admin' | 'user';
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This effect runs on the client and can safely access localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
    setIsOpen(false);
  };
  
  const NavLinks = () => (
    <>
       <Button variant="ghost" asChild>
        <Link href="/my-books">
          <BookUser />
          My Books
        </Link>
      </Button>
      {user?.role === 'admin' && (
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Admin
          </Link>
        </Button>
      )}
    </>
  );

  const AuthButtons = () => (
     <>
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
    </>
  );

  return (
    <nav className="bg-card/80 border-b border-primary/10 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center gap-2 font-headline text-primary font-bold text-lg">
          <Library />
          LibroSmart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLinks />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                     <UserCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/my-books')}>
                    <BookUser className="mr-2 h-4 w-4" />
                    <span>My Books</span>
                  </DropdownMenuItem>
                   {user.role === 'admin' && (
                     <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </DropdownMenuItem>
                   )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <AuthButtons />
          )}
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

                  {user ? (
                    <>
                      <div className="flex items-center gap-3 p-2 rounded-md bg-muted">
                        <UserCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold">{user.name}</span>
                      </div>
                       <SheetClose asChild>
                        <Link href="/my-books" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                          <BookUser />
                          My Books
                        </Link>
                      </SheetClose>
                      {user.role === 'admin' && (
                        <SheetClose asChild>
                          <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                            <LayoutDashboard />
                            Admin
                          </Link>
                        </SheetClose>
                      )}
                       <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-3 p-2 justify-start hover:bg-muted">
                          <LogOut />
                          Logout
                       </Button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
