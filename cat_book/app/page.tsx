'use client';

import { useState, useEffect } from 'react';
import CatImageDisplay from '@/components/CatImageDisplay';
import { fetchRandomCat, CatImage } from '@/lib/catApi';

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
      setError('Failed to load cat. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomCat();
    // Load favorites from localStorage
    const saved = localStorage.getItem('catFavorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem('catFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (!cat) return;
    
    const isFavorited = favorites.some(fav => fav.id === cat.id);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== cat.id));
    } else {
      setFavorites([...favorites, cat]);
    }
  };

  const isFavorited = cat ? favorites.some(fav => fav.id === cat.id) : false;

  if (showFavorites) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowFavorites(false)}
            className="mb-6 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            ← Back to Random
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">❤️ My Favorite Cats ({favorites.length})</h2>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No favorites yet! Add some cute cats to your collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((favCat) => (
                <div key={favCat.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-40 bg-gray-100">
                    <img
                      src={favCat.url}
                      alt="Favorite cat"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    {favCat.breeds && favCat.breeds.length > 0 ? (
                      <p className="font-semibold text-gray-900">{favCat.breeds[0].name}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Unknown breed</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🐱 Random Cat</h1>
          <p className="text-gray-600">Discover and favorite adorable cats</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <CatImageDisplay cat={cat} loading={loading} />

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={loadRandomCat}
              disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Loading...' : '🎲 Get Random Cat'}
            </button>

            {cat && (
              <button
                onClick={toggleFavorite}
                className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 shadow-md ${
                  isFavorited
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50'
                }`}
              >
                {isFavorited ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFavorites(true)}
            className="px-6 py-2 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            ❤️ View Favorites ({favorites.length})
          </button>
        </div>
      </div>
    </div>
  );
}
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
