'use client';

import { useEffect, useRef, useState, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Navbar } from "@/components/navbar";
import { getBooksAction } from "@/lib/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/components/book-item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { addBook, type AddBookState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState: AddBookState = {};

function AddBookSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Add Book
    </Button>
  );
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();


  const [state, formAction] = useActionState(addBook, initialState);

  useEffect(() => {
    startTransition(async () => {
        const allBooks = await getBooksAction();
        setBooks(allBooks);
    });
  }, [state]); 

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Failed to Add Book',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
        setOpen(false);
      }
    }
  }, [state, toast]);

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
              Librarian Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track book inventory and status.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Enter the details of the new book to add it to the catalog.
                </DialogDescription>
              </DialogHeader>
              <form ref={formRef} action={formAction}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" name="title" placeholder="The Great Gatsby" className="col-span-3" />
                  </div>
                  {state?.errors?.title && <p className="text-sm font-medium text-destructive col-start-2 col-span-3">{state.errors.title[0]}</p>}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">
                      Author
                    </Label>
                    <Input id="author" name="author" placeholder="F. Scott Fitzgerald" className="col-span-3" />
                  </div>
                  {state?.errors?.author && <p className="text-sm font-medium text-destructive col-start-2 col-span-3">{state.errors.author[0]}</p>}
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="copies" className="text-right">
                      Copies
                    </Label>
                    <Input id="copies" name="copies" type="number" placeholder="5" className="col-span-3" />
                  </div>
                   {state?.errors?.copies && <p className="text-sm font-medium text-destructive col-start-2 col-span-3">{state.errors.copies[0]}</p>}
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="genre" className="text-right">
                      Genre
                    </Label>
                    <Input id="genre" name="genre" placeholder="Fiction" className="col-span-3" />
                  </div>
                   {state?.errors?.genre && <p className="text-sm font-medium text-destructive col-start-2 col-span-3">{state.errors.genre[0]}</p>}
                </div>
                <DialogFooter>
                  <AddBookSubmitButton />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </header>
        <main>
          <div className="bg-card/80 border-primary/10 rounded-lg">
            <ScrollArea className="w-full whitespace-nowrap">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Copies</TableHead>
                    <TableHead>Available Copies</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={book.status === 'Available' ? 'outline' : book.status === 'Reserved' ? 'destructive' : 'secondary'}
                          className={book.status === 'Available' ? 'border-green-600/50 text-green-700' : ''}
                        >
                          {book.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.copies}</TableCell>
                      <TableCell>{book.available}</TableCell>
                      <TableCell>{book.dueDate || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}