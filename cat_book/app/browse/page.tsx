"use client";

import { useState, useEffect } from "react";
import CatGrid from "@/components/CatGrid";
import { fetchCats, CatImage } from "@/lib/catApi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BREEDS = [
  { id: "", name: "All Breeds" },
  { id: "abys", name: "Abyssinian" },
  { id: "beng", name: "Bengal" },
  { id: "birm", name: "Birman" },
  { id: "bomb", name: "Bombay" },
  { id: "bssh", name: "British Shorthair" },
  { id: "bslo", name: "British Longhair" },
  { id: "buml", name: "Burmilla" },
  { id: "chau", name: "Chausie" },
  { id: "corl", name: "Cornish Rex" },
  { id: "cypr", name: "Cypriot Cat" },
  { id: "devon", name: "Devon Rex" },
  { id: "egyp", name: "Egyptian Mau" },
  { id: "mala", name: "Malayan" },
  { id: "manx", name: "Manx" },
  { id: "ocic", name: "Ocicat" },
  { id: "rspx", name: "Rex Patternless" },
  { id: "siam", name: "Siamese" },
];

export default function BrowsePage() {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const loadCats = async (breedId: string = "", pageNum: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchCats({
        limit: 12,
        page: pageNum,
        order: "RAND",
        breed_ids: breedId || undefined,
      });
      setCats(cats);
    } catch (err) {
      setError("Failed to load cats. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCats(selectedBreed, 0);
    setPage(0);
  }, [selectedBreed]);

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCats(selectedBreed, nextPage);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      const prevPage = page - 1;
      setPage(prevPage);
      loadCats(selectedBreed, prevPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">
            🐱 Browse Cats
          </h1>
          <p className="text-slate-600 text-lg">
            Filter and explore different cat breeds
          </p>
        </div>

        {/* Breed Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter by Breed</CardTitle>
            <CardDescription>Select a cat breed to view</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedBreed} onValueChange={setSelectedBreed}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BREEDS.map((breed) => (
                  <SelectItem key={breed.id} value={breed.id}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cat Grid */}
        <CatGrid cats={cats} loading={loading} />

        {/* Pagination */}
        {!loading && cats.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Button
              onClick={handlePrevPage}
              disabled={page === 0 || loading}
              variant="outline"
              size="lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="px-6 py-2 bg-white border border-slate-200 rounded-lg">
              <p className="text-slate-700 font-semibold">Page {page + 1}</p>
            </div>

            <Button
              onClick={handleNextPage}
              disabled={cats.length < 12 || loading}
              size="lg"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
