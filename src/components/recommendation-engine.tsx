
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendations, type RecommendationState } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const initialState: RecommendationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Get Recommendations
    </Button>
  );
}

export function RecommendationEngine() {
  const [state, formAction] = useActionState(getRecommendations, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && state.recommendations) {
      // Keep the form content for user reference
      // formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="sticky top-8 bg-card/80 border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">AI Recommendations</CardTitle>
        <CardDescription>Tell our AI librarian what you're in the mood for.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="readingPreferences">Your Reading Preferences</Label>
            <Textarea
              id="readingPreferences"
              name="readingPreferences"
              placeholder="e.g., 'I love sci-fi novels with complex world-building and strong female protagonists...'"
              required
              className="bg-background"
              rows={4}
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

      {state.message && !state.recommendations && (
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      {state.recommendations && state.recommendations.length > 0 && (
        <>
          <Separator className="mx-6 my-0" />
          <CardContent className="pt-6">
            <h3 className="font-headline text-lg font-semibold mb-4">Here are some books you might enjoy:</h3>
            <div className="space-y-4">
              {state.recommendations.map((rec, index) => (
                <div key={index} className="text-sm p-3 bg-muted/50 rounded-md">
                  <p className="font-semibold text-primary">{rec.title}</p>
                  <p className="text-muted-foreground text-xs mb-1">by {rec.author}</p>
                  <p className="text-foreground/80 italic">"{rec.reason}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
