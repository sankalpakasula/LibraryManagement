import { BookItem, type Book } from "./book-item";

const books: Book[] = [
  {
    title: 'The Whispering Woods of Eldoria',
    author: 'Elara Vance',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/400',
    width: 300,
    height: 400,
    dataAiHint: 'fantasy book',
  },
  {
    title: 'Echoes of the Void',
    author: 'Kaelen Cross',
    status: 'Checked Out',
    dueDate: '2024-08-15',
    imageUrl: 'https://picsum.photos/300/401',
    width: 300,
    height: 401,
    dataAiHint: 'scifi book',
  },
  {
    title: 'The Clockwork Conspiracy',
    author: 'Silas Thorne',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/402',
    width: 300,
    height: 402,
    dataAiHint: 'steampunk book',
  },
  {
    title: 'A Glimmer of Rome',
    author: 'Julia Octavia',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/403',
    width: 300,
    height: 403,
    dataAiHint: 'history book',
  },
    {
    title: 'Silicon Dreams',
    author: 'Alex Chaney',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/404',
    width: 300,
    height: 404,
    dataAiHint: 'cyberpunk novel',
  },
  {
    title: 'The Last Alchemist',
    author: 'Isabelle Dubois',
    status: 'Checked Out',
    dueDate: '2024-08-22',
    imageUrl: 'https://picsum.photos/300/405',
    width: 300,
    height: 405,
    dataAiHint: 'historical fiction',
  },
  {
    title: 'Beneath the Cerulean Sea',
    author: 'Mara Lin',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/406',
    width: 300,
    height: 406,
    dataAiHint: 'underwater adventure',
  },
  {
    title: 'The Quantum Paradox',
    author: 'Dr. Aris Thorne',
    status: 'Available',
    imageUrl: 'https://picsum.photos/300/407',
    width: 300,
    height: 407,
    dataAiHint: 'theoretical physics',
  },
];


export function BookList() {
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
