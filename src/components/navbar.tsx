
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LayoutDashboard, LogIn, UserPlus, Menu, Library, BookUser, LogOut, UserCircle, Mail, KeySquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

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
            <Button variant="ghost" asChild>
                <Link href="/my-books" {...sheetCloseProps} className={inSheet ? commonClasses : ''}>
                    <BookUser />
                    My Books
                </Link>
            </Button>
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
          {user ? (
            <>
              <NavLinks />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                     <UserCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">My Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Your personal account details.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Mail className="mr-1.5 h-3 w-3"/>
                                        {user.email}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                       <KeySquare className="mr-1.5 h-3 w-3" />
                                       User ID: {user.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col space-y-1">
                             <Button variant="ghost" size="sm" className="justify-start" onClick={() => router.push('/my-books')}>
                                <BookUser className="mr-2 h-4 w-4" />
                                <span>My Books</span>
                            </Button>
                             {user.role === 'admin' && (
                                <Button variant="ghost" size="sm" className="justify-start" onClick={() => router.push('/dashboard')}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Admin</span>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
              </Popover>
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
