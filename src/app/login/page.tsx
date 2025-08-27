import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center py-12 sm:py-24">
        <Card className="w-full max-w-md bg-card/80 border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-primary">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="student@example.edu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
