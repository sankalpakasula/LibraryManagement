import { Badge } from "@/components/ui/badge";

const categories = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Fantasy",
  "Biography",
  "Mystery",
  "Technology",
];

export function CategoryTags() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-headline font-semibold mb-4 text-primary/90">
        Browse Collections
      </h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant="outline" 
            className="cursor-pointer text-base py-1 px-3 border-primary/20 text-primary/80 hover:bg-primary/10 transition-colors"
            tabIndex={0}
            role="button"
            aria-label={`Browse ${category} collection`}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
