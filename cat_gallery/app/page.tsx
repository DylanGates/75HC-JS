"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import CatImageDisplay from "@/components/CatImageDisplay";
import { fetchRandomCat, CatImage } from "@/lib/catApi";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Heart, Loader } from "lucide-react";

export default function Home() {
  const [cat, setCat] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<CatImage[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const loadRandomCat = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomCat = await fetchRandomCat();
      setCat(randomCat);
    } catch (err) {
      setError("Failed to load cat. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomCat();
    // Load favorites from localStorage
    const saved = localStorage.getItem("catFavorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load favorites:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem("catFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (!cat) return;

    const isFavorited = favorites.some((fav) => fav.id === cat.id);
    if (isFavorited) {
      setFavorites(favorites.filter((fav) => fav.id !== cat.id));
    } else {
      setFavorites([...favorites, cat]);
    }
  };

  const isFavorited = cat ? favorites.some((fav) => fav.id === cat.id) : false;

  if (showFavorites) {
    return (
      <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setShowFavorites(false)}
            variant="outline"
            className="mb-6"
          >
            ← Back to Random
          </Button>

          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            ❤️ Favorite Cats
          </h2>
          <p className="text-slate-600 mb-6">({favorites.length} saved)</p>

          {favorites.length === 0 ? (
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                No favorites yet! Add some cute cats to your collection.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((favCat) => (
                <div
                  key={favCat.id}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="relative w-full h-40 bg-slate-100">
                    <Image
                      src={favCat.url}
                      alt="Favorite cat"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    {favCat.breeds && favCat.breeds.length > 0 ? (
                      <p className="font-semibold text-slate-900">
                        {favCat.breeds[0].name}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">Unknown breed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">
            🐱 Random Cat
          </h1>
          <p className="text-slate-600 text-lg">
            Discover and favorite adorable cats
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-center gap-6">
          <CatImageDisplay cat={cat} loading={loading} />

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button
              onClick={loadRandomCat}
              disabled={loading}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>🎲 Get Random Cat</>
              )}
            </Button>

            {cat && (
              <Button
                onClick={toggleFavorite}
                size="lg"
                variant={isFavorited ? "default" : "outline"}
                className={
                  isFavorited ? "bg-rose-500 hover:bg-rose-600 text-white" : ""
                }
              >
                {isFavorited ? (
                  <>
                    <Heart className="mr-2 h-4 w-4 fill-current" />
                    Favorited
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </>
                )}
              </Button>
            )}
          </div>

          <Button
            onClick={() => setShowFavorites(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Heart className="mr-2 h-4 w-4" />
            View Favorites ({favorites.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
