import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-card/80 border-b border-primary/10">
      <div className="container mx-auto flex justify-end items-center p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">
               <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}