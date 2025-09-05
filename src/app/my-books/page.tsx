
'use client';

import { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from "@/components/navbar";
import { BookList } from "@/components/book-list";
import { BookItem, type Book } from "@/components/book-item";
import { getMyBooksAction } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

function MyBooksContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (userId) {
        startTransition(async () => {
            const books = await getMyBooksAction(userId);
            setMyBooks(books);
        });
    }
  }, [userId]);

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
                My Borrowed Books
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
                Books you have currently checked out or reserved.
            </p>
        </header>

        <main>
           {isPending ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                   <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : myBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {myBooks.map((book) => (
                        <BookItem key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No Books Borrowed</h2>
                    <p className="mt-2">You haven't borrowed any books yet. Browse the library to find your next read!</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}


export default function MyBooksPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyBooksContent />
        </Suspense>
    );
}
