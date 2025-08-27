import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { CategoryTags } from '@/components/category-tags';
import { BookList } from '@/components/book-list';
import { RecommendationEngine } from '@/components/recommendation-engine';

export default function Home() {
  return (
    <div className="bg-background text-foreground font-body">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          <div className="lg:col-span-2">
            <Header />
            <main>
              <SearchBar />
              <CategoryTags />
              <div className="mt-8">
                <BookList />
              </div>
            </main>
          </div>
          
          <aside className="lg:col-span-1 mt-8 lg:mt-0">
            <RecommendationEngine />
          </aside>

        </div>
      </div>
    </div>
  );
}
