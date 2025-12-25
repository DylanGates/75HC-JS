/**
 * Cat Image Display Component
 * Displays a single cat image with shadcn/ui
 */

import Image from "next/image";
import { CatImage } from "@/lib/catApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CatImageDisplayProps {
  cat: CatImage | null;
  loading?: boolean;
}

export default function CatImageDisplay({
  cat,
  loading = false,
}: CatImageDisplayProps) {
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-0">
          <Skeleton className="w-full h-64" />
        </CardContent>
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2 mt-2" />
        </CardHeader>
      </Card>
    );
  }

  if (!cat) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">No cat loaded</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-600">
            Click refresh to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-64 bg-slate-100">
        <Image
          src={cat.url}
          alt="Random cat"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 448px"
          priority
        />
      </div>

      <CardHeader>
        {cat.breeds && cat.breeds.length > 0 ? (
          <>
            <CardTitle className="text-2xl">{cat.breeds[0].name}</CardTitle>
            <CardDescription>
              {cat.breeds[0].origin && `🌍 From ${cat.breeds[0].origin}`}
            </CardDescription>

            {cat.breeds[0].temperament && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  Temperament
                </p>
                <div className="flex flex-wrap gap-2">
                  {cat.breeds[0].temperament
                    .split(", ")
                    .slice(0, 4)
                    .map((trait) => (
                      <Badge key={trait} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {cat.breeds[0].life_span && (
              <p className="text-sm text-slate-600 mt-3">
                <span className="font-medium">Life Span:</span>{" "}
                {cat.breeds[0].life_span} years
              </p>
            )}
          </>
        ) : (
          <CardTitle className="text-slate-600">No breed information</CardTitle>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-xs text-slate-400">
          ID: {cat.id} • {cat.width}×{cat.height}px
        </p>
      </CardContent>
    </Card>
  );
}
