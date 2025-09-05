
'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, BookCheck, BookX, Loader2 } from 'lucide-react';
import { borrowBook, returnBook, reserveBook } from '@/app/actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Book = {
  id: string;
  title: string;
  author: string;
  status: 'Available' | 'Checked Out' | 'Reserved';
  dueDate?: string;
  imageUrl: string;
  width: number;
  height: number;
  dataAiHint: string;
  copies: number;
  available: number;
  genre: string;
};

export function BookItem({ book }: { book: Book }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAction = async (action: (id: string) => Promise<void>, id: string, successMessage: string, errorMessage: string) => {
    startTransition(async () => {
      try {
        await action(id);
        toast({
          title: 'Success',
          description: successMessage,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        });
      }
    });
  };

  const isAvailable = book.available > 0;
  const isCheckedOut = book.available < book.copies && book.status !== 'Reserved';
  const isReserved = book.status === 'Reserved';

  const getStatusBadge = () => {
    if (isReserved) {
      return <Badge variant="destructive" className="text-xs">Reserved</Badge>;
    }
    if (isAvailable) {
      return <Badge variant="outline" className="border-green-600/50 text-green-700 text-xs">Available</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Checked Out</Badge>;
  }

  const getActionButton = () => {
    const buttonContent = (pending: boolean, Icon: React.ElementType, text: string) => (
      <>
        {pending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Icon className="mr-1 h-3.5 w-3.5" />}
        {text}
      </>
    );

    if (isReserved) {
      return (
        <Button variant="outline" size="sm" disabled className="text-xs h-8">
          <BookX className="mr-1 h-3.5 w-3.5" />
          Reserved
        </Button>
      );
    }
    
    if (isAvailable) {
       return (
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8"
          disabled={isPending}
          onClick={() => handleAction(borrowBook, book.id, `"${book.title}" has been borrowed.`, "Failed to borrow book.")}
        >
          {buttonContent(isPending, Bookmark, 'Borrow')}
        </Button>
      );
    }

    if (!isAvailable && !isReserved) { // All copies checked out, not reserved yet
       return (
         <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
              disabled={isPending}
              onClick={() => handleAction(returnBook, book.id, `One copy of "${book.title}" has been returned.`, "Failed to return book.")}
            >
              {buttonContent(isPending, BookCheck, 'Return')}
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="text-xs h-8"
              disabled={isPending}
              onClick={() => handleAction(reserveBook, book.id, `"${book.title}" has been reserved.`, "Failed to reserve book.")}
            >
              {buttonContent(isPending, BookX, 'Reserve')}
            </Button>
         </div>
      );
    }

    return null;
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg dark:bg-card/60 bg-card/80 border-primary/10">
      <CardHeader className="p-3 pb-2">
        <div className="relative aspect-[2/3] w-full mb-2 overflow-hidden rounded-sm">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            data-ai-hint={book.dataAiHint}
            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
          />
        </div>
        <CardTitle className="font-headline text-sm leading-tight tracking-tight h-10">{book.title}</CardTitle>
        <p className="text-xs text-muted-foreground pt-1 truncate">{book.author}</p>
      </CardHeader>
      <CardContent className="p-3 pt-1 flex-grow">
        <div className="flex justify-between items-center">
          {getStatusBadge()}
           <p className="text-xs text-muted-foreground">{book.available} / {book.copies} left</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
         <div className="flex justify-between w-full items-center">
            {getActionButton()}
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <a href="https://www.goodreads.com/" target="_blank" rel="noopener noreferrer" aria-label={`Find ${book.title} on Goodreads`}>
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}