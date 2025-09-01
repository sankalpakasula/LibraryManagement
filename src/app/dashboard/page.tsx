import { Navbar } from "@/components/navbar";
import { getBooks } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/components/book-item";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export default async function Dashboard() {
  const books: Book[] = await getBooks();

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
              Librarian Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track book inventory and status.
            </p>
          </div>
          <Dialog>
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" placeholder="The Great Gatsby" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input id="author" placeholder="F. Scott Fitzgerald" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="copies" className="text-right">
                    Copies
                  </Label>
                  <Input id="copies" type="number" placeholder="5" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Book</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        <main>
          <div className="bg-card/80 border-primary/10 rounded-lg p-4">
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
          </div>
        </main>
      </div>
    </div>
  );
}