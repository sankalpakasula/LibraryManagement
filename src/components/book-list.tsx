import { BookItem } from "./book-item";
import { getBooks } from "@/lib/data";

export async function BookList() {
  const books = await getBooks();
  return (
    <section id="library-catalog">
      <h2 className="text-2xl font-headline font-semibold mb-4 text-primary/90">
        In the Catalog
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 group">
        {books.map((book, index) => (
          <BookItem key={index} book={book} />
        ))}
      </div>
    </section>
  );
}
