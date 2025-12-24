'use client';

import { useState, useEffect } from 'react';
import CatImageDisplay from '@/components/CatImageDisplay';
import { fetchRandomCat, CatImage } from '@/lib/catApi';

export default function Home() {
  const [cat, setCat] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🐱 Cat Gallery</h1>
          <p className="text-gray-600">Discover random cute cats from around the world</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <CatImageDisplay cat={cat} loading={loading} />

          <button
            onClick={loadRandomCat}
            disabled={loading}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? 'Loading...' : 'Get Random Cat'}
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
