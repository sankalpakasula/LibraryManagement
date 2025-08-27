import { Navbar } from "@/components/navbar";
import { books } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
            Librarian Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track book inventory and status.
          </p>
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
                {books.map((book, index) => (
                  <TableRow key={index}>
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
