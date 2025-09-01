'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { signupUser, type SignupState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: SignupState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" suppressHydrationWarning>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
      Sign Up
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupUser, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: state.message,
        });
      } else {
        toast({
          variant: 'default',
          title: 'Success!',
          description: state.message,
          className: 'bg-green-100 border-green-600/50 text-green-800'
        });
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center py-12 sm:py-24">
        <Card className="w-full max-w-md bg-card/80 border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl text-primary">Create an Account</CardTitle>
            <CardDescription>Enter your details below to register.</CardDescription>
          </CardHeader>
          <form ref={formRef} action={formAction}>
            <CardContent className="space-y-4">
               {state.message && !state.errors && (
                <Alert variant="default" className='border-green-600/50 text-green-700 bg-green-50'>
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" suppressHydrationWarning />
                {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="student@example.edu" suppressHydrationWarning />
                 {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" suppressHydrationWarning />
                 {state.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" suppressHydrationWarning />
                 {state.errors?.confirmPassword && <p className="text-sm font-medium text-destructive">{state.errors.confirmPassword[0]}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <SubmitButton />
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
