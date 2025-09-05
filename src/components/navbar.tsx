
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { LayoutDashboard, LogIn, UserPlus, Menu, Library, BookUser, LogOut, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

type User = {
    id: string;
    name: string;
    email: string;
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
  
  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => {
    const commonClasses = "flex items-center gap-3 p-2 rounded-md hover:bg-muted";
    const sheetCloseProps = inSheet ? { asChild: true } : {};

    return (
        <>
            {user && (
                 <Button variant="ghost" asChild>
                    <Link href="/my-books" {...sheetCloseProps} className={inSheet ? commonClasses : ''}>
                        <BookUser />
                        My Books
                    </Link>
                </Button>
            )}
            {user?.role === 'admin' && (
                <Button variant="ghost" asChild>
                    <Link href="/dashboard" {...sheetCloseProps} className={inSheet ? commonClasses : ''}>
                        <LayoutDashboard />
                        Admin
                    </Link>
                </Button>
            )}
        </>
    );
};


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
          <NavLinks />
          {user ? (
              <Button variant="ghost" asChild>
                <Link href="/account" className="flex items-center gap-2">
                   <Avatar className="h-6 w-6">
                       <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   {user.name}
                </Link>
              </Button>
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
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold">{user.name}</span>
                      </div>
                       <SheetClose asChild>
                          <Link href="/account" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                            <UserCircle />
                            My Account
                          </Link>
                       </SheetClose>
                       <SheetClose asChild>
                         <NavLinks inSheet={true} />
                       </SheetClose>
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
