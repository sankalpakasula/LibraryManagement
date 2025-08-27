import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark } from 'lucide-react';

export type Book = {
  title: string;
  author: string;
  status: 'Available' | 'Checked Out';
  dueDate?: string;
  imageUrl: string;
  width: number;
  height: number;
  dataAiHint: string;
};

export function BookItem({ book }: { book: Book }) {
  const isAvailable = book.status === 'Available';

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:bg-card/60 bg-card/80 border-primary/10">
      <CardHeader className="p-4 pb-2">
        <div className="relative aspect-[3/4] w-full mb-4 overflow-hidden rounded-md">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={book.dataAiHint}
          />
        </div>
        <CardTitle className="font-headline text-lg leading-tight tracking-tight h-14">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground pt-1">{book.author}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex justify-between items-center">
          <Badge variant={isAvailable ? 'outline' : 'secondary'} className={isAvailable ? 'border-green-600/50 text-green-700' : ''}>
            {book.status}
          </Badge>
          {!isAvailable && book.dueDate && (
            <p className="text-xs text-muted-foreground">Due: {book.dueDate}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
         <div className="flex justify-between w-full items-center">
            <Button variant="outline" size="sm" disabled={!isAvailable}>
              <Bookmark className="mr-2 h-4 w-4" />
              {isAvailable ? 'Place Hold' : 'On Hold'}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://www.goodreads.com/" target="_blank" rel="noopener noreferrer" aria-label={`Find ${book.title} on Goodreads`}>
                <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </a>
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
