
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendations, type RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, BookHeart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const initialState: RecommendationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
      Get Recommendations
    </Button>
  );
}

export function RecommendationEngine() {
  const [state, formAction] = useActionState(getRecommendations, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors || state.message.includes('error') || state.message.includes('try again')) {
         toast({
          variant: "destructive",
          title: "An Error Occurred",
          description: state.message,
        });
      }
    }
    if (state.recommendations && state.recommendations.length > 0) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <Card className="sticky top-8 bg-card/80 border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">AI Recommendations</CardTitle>
        <CardDescription>Let our AI suggest your next read based on your tastes.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="borrowingHistory">Your Borrowing History</Label>
            <Textarea
              id="borrowingHistory"
              name="borrowingHistory"
              placeholder="e.g., 'The Hobbit' by J.R.R. Tolkien, 'Dune' by Frank Herbert..."
              required
              className="bg-background"
              aria-describedby='history-error'
            />
            {state.errors?.borrowingHistory && (
              <p id="history-error" className="text-sm font-medium text-destructive">{state.errors.borrowingHistory[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="readingPreferences">Your Reading Preferences</Label>
            <Textarea
              id="readingPreferences"
              name="readingPreferences"
              placeholder="e.g., I enjoy epic fantasy, hard science fiction, and historical novels."
              required
              className="bg-background"
              aria-describedby='preferences-error'
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
      
      {state.recommendations && state.recommendations.length > 0 && (
        <>
          <Separator className="mx-6 my-0" />
          <CardContent className="pt-6">
            <h3 className="font-headline text-lg font-semibold mb-2">Our Suggestions for You:</h3>
            <div className="space-y-4">
                {state.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4 items-start bg-muted/50 p-3 rounded-md border">
                        <BookHeart className="h-5 w-5 mt-1 text-primary/80 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-sm text-foreground">{rec.title}</p>
                            <p className="text-xs text-muted-foreground italic mb-1">by {rec.author}</p>
                            <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>
                    </div>
                ))}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
