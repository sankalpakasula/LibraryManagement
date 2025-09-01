
'use client';

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const collections = [
  "Technology",
  "Business",
  "Science",
  "History",
  "Fantasy",
  "Fiction",
  "Science Fiction",
  "Biography",
  "Mystery",
];

type CollectionsDropdownProps = {
    onCollectionChange: (collection: string) => void;
}

export function CollectionsDropdown({ onCollectionChange }: CollectionsDropdownProps) {
  return (
    <Select onValueChange={onCollectionChange} defaultValue="All">
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Browse Collections" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Collections</SelectLabel>
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
