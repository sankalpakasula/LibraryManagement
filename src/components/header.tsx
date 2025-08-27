import { BookHeart } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center space-x-3 sm:space-x-4 mb-8">
      <BookHeart className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
      <div>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
          LibroSmart
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">Your smart library companion</p>
      </div>
    </header>
  );
}
