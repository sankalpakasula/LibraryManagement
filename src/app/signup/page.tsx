import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center py-12 sm:py-24">
        <Card className="w-full max-w-md bg-card/80 border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-primary">Create an Account</CardTitle>
            <CardDescription>Enter your details below to register.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="student@example.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
            </Button>
            <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}