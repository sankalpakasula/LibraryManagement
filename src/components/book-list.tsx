
'use client';
import { BookItem, type Book } from "./book-item";
import { getBooksAction } from "@/lib/actions";
import { useEffect, useState, useMemo } from "react";
import { Skeleton } from "./ui/skeleton";

export function BookList({ collection }: { collection: string }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const allBooks = await getBooksAction();
      setBooks(allBooks);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    if (collection === 'All') {
      return books;
    }
    return books.filter(book => book.genre === collection);
  }, [books, collection]);

  if (loading) {
    return (
      <section id="library-catalog">
        <h2 className="text-xl font-headline font-semibold mb-4 text-primary/90">
          In the Catalog
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
             <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="library-catalog">
      <h2 className="text-xl font-headline font-semibold mb-4 text-primary/90">
        {collection === 'All' ? 'All Genres' : `Collection: ${collection}`}
      </h2>
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBooks.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No books found in this collection.</p>
        </div>
      )}
    </section>
  );
}
