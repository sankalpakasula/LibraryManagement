import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="flex w-full max-w-2xl items-center space-x-2">
      <Input
        type="search"
        placeholder="Search by keywords, titles, or authors..."
        className="flex-grow bg-card"
        aria-label="Search library materials"
      />
      <Button type="submit" variant="default">
        <Search className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
      </Button>
    </div>
  );
}
