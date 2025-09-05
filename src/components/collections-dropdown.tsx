'use client';

import * as React from "react"
import { getBooksAction } from "@/lib/actions";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type CollectionsDropdownProps = {
    onCollectionChange: (collection: string) => void;
}

export function CollectionsDropdown({ onCollectionChange }: CollectionsDropdownProps) {
  const [collections, setCollections] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    async function fetchGenres() {
      const books = await getBooksAction();
      const allGenres = books.map(book => book.genre).filter(Boolean);
      const uniqueGenres = [...new Set(allGenres)];
      setCollections(uniqueGenres.sort());
    }
    fetchGenres();
  }, []);

  return (
    <Select onValueChange={onCollectionChange} defaultValue="All">
      <SelectTrigger className="w-full sm:w-[280px]">
        <SelectValue placeholder="Browse Collections" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Genres</SelectLabel>
          <SelectItem value="All">All Collections</SelectItem>
          {collections.map((collection) => (
            <SelectItem key={collection} value={collection}>
              {collection}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
