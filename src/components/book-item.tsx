
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, BookCheck, BookX } from 'lucide-react';

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
  genre?: string;
};

export function BookItem({ book }: { book: Book }) {
  // This is a placeholder. In a real app, you'd get the current user's role.
  const userRole = 'student'; // or 'librarian'

  const isAvailable = book.status === 'Available';
  const isCheckedOut = book.status === 'Checked Out';
  const isReserved = book.status === 'Reserved';

  const getStatusBadge = () => {
    if (isAvailable) {
      return <Badge variant="outline" className="border-green-600/50 text-green-700 text-xs">Available</Badge>;
    }
    if (isCheckedOut) {
      return <Badge variant="secondary" className="text-xs">Checked Out</Badge>;
    }
    if (isReserved) {
      return <Badge variant="destructive" className="text-xs">Reserved</Badge>;
    }
    return <Badge className="text-xs">{book.status}</Badge>
  }

  const getActionButton = () => {
    // In a real app, these buttons would trigger server actions to update the book's status in a database.
    if (isAvailable) {
      return (
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Bookmark className="mr-1 h-3.5 w-3.5" />
          Borrow
        </Button>
      );
    }
    if (isCheckedOut) {
      // Typically, only a librarian or the borrowing student can return a book.
      // We can add role checks here.
      return (
        <Button variant="outline" size="sm" className="text-xs h-8">
          <BookCheck className="mr-1 h-3.5 w-3.5" />
          Return
        </Button>
      );
    }
    if (isReserved) {
       return (
        <Button variant="outline" size="sm" disabled className="text-xs h-8">
          <BookX className="mr-1 h-3.5 w-3.5" />
          Reserved
        </Button>
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
          {!isAvailable && book.dueDate && (
            <p className="text-xs text-muted-foreground">Due: {book.dueDate}</p>
          )}
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
