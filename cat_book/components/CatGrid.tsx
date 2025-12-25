/**
 * Cat Grid Display Component
 * Shows multiple cat images in a responsive grid with shadcn/ui
 */

import Image from "next/image";
import { CatImage } from "@/lib/catApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CatGridProps {
  cats: CatImage[];
  loading?: boolean;
}

export default function CatGrid({ cats, loading = false }: CatGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="w-full h-48" />
            </CardContent>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (cats.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="py-12 text-center">
          <p className="text-slate-500 text-lg">
            No cats found. Try adjusting your filters!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map((cat) => (
        <Card
          key={cat.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="relative w-full h-48 bg-slate-100">
            <Image
              src={cat.url}
              alt={cat.breeds?.[0]?.name || "Cat"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <CardHeader>
            {cat.breeds && cat.breeds.length > 0 ? (
              <>
                <CardTitle className="text-lg">{cat.breeds[0].name}</CardTitle>
                {cat.breeds[0].origin && (
                  <CardDescription className="flex items-center gap-1">
                    📍 {cat.breeds[0].origin}
                  </CardDescription>
                )}
              </>
            ) : (
              <CardTitle className="text-slate-500 text-sm">Unknown breed</CardTitle>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
