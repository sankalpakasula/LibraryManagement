
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { BookList } from '@/components/book-list';
import { RecommendationEngine } from '@/components/recommendation-engine';
import { Navbar } from '@/components/navbar';
import { CollectionsDropdown } from '@/components/collections-dropdown';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [selectedCollection, setSelectedCollection] = useState<string>('All');

  const handleShowAll = () => {
    setSelectedCollection('All');
  };

  return (
    <div className="bg-background text-foreground font-body">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          <div className="lg:col-span-2">
            <Header />
            <main>
              <SearchBar />

              <div className="mt-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
                  <CollectionsDropdown onCollectionChange={setSelectedCollection} />
                  <Button variant="outline" onClick={handleShowAll} className="w-full sm:w-auto">All Books</Button>
                </div>
                <BookList collection={selectedCollection} />
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
