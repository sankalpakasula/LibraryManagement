
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendations, type RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { BookItem } from './book-item';
import { ScrollArea } from './ui/scroll-area';

const initialState: RecommendationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
      Search Catalog
    </Button>
  );
}

export function RecommendationEngine() {
  const [state, formAction] = useActionState(getRecommendations, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.recommendations) {
      // Keep the form content for user reference
    }
  }, [state]);

  return (
    <Card className="sticky top-8 bg-card/80 border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Find a Book</CardTitle>
        <CardDescription>Search our catalog by title, author, or genre.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="readingPreferences">Search Keywords</Label>
            <Textarea
              id="readingPreferences"
              name="readingPreferences"
              placeholder="e.g., 'Clean Code', 'business', 'Frank Herbert'..."
              required
              className="bg-background"
              rows={3}
              aria-describedby="preferences-error"
            />
            {state.errors?.readingPreferences && (
              <p id="preferences-error" className="text-sm font-medium text-destructive">{state.errors.readingPreferences[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>

      {state.message && (!state.recommendations || state.recommendations.length === 0) && (
        <CardContent>
          <Alert variant="default">
            <AlertTitle>Search Results</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      {state.recommendations && state.recommendations.length > 0 && (
        <>
          <Separator className="mx-6 my-0" />
          <CardContent className="pt-6">
            <h3 className="font-headline text-lg font-semibold mb-4">{state.message}</h3>
             <ScrollArea className="h-[400px] w-full">
                <div className="grid grid-cols-4 gap-4 pr-4">
                    {state.recommendations.map((book) => (
                        <BookItem key={book.id} book={book} />
                    ))}
                </div>
            </ScrollArea>
          </CardContent>
        </>
      )}
    </Card>
  );
}
