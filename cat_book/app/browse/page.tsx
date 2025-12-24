'use client';

import { useState, useEffect } from 'react';
import CatGrid from '@/components/CatGrid';
import { fetchCats, CatImage } from '@/lib/catApi';

const BREEDS = [
  { id: '', name: 'All Breeds' },
  { id: 'abys', name: 'Abyssinian' },
  { id: 'beng', name: 'Bengal' },
  { id: 'birm', name: 'Birman' },
  { id: 'bomb', name: 'Bombay' },
  { id: 'bssh', name: 'British Shorthair' },
  { id: 'bslo', name: 'British Longhair' },
  { id: 'buml', name: 'Burmilla' },
  { id: 'chau', name: 'Chausie' },
  { id: 'corl', name: 'Cornish Rex' },
  { id: 'cypr', name: 'Cypriot Cat' },
  { id: 'devon', name: 'Devon Rex' },
  { id: 'egyp', name: 'Egyptian Mau' },
  { id: 'mala', name: 'Malayan' },
  { id: 'manx', name: 'Manx' },
  { id: 'ocic', name: 'Ocicat' },
  { id: 'rspx', name: 'Rex Patternless' },
  { id: 'siam', name: 'Siamese' },
];

export default function BrowsePage() {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const loadCats = async (breedId: string = '', pageNum: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchCats({
        limit: 12,
        page: pageNum,
        order: 'RAND',
        breed_ids: breedId || undefined,
      });
      setCats(cats);
    } catch (err) {
      setError('Failed to load cats. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🐱 Browse Cats</h1>
          <p className="text-gray-600">Filter and explore different cat breeds</p>
        </div>

        {/* Breed Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Breed
          </label>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {BREEDS.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Cat Grid */}
        <CatGrid cats={cats} loading={loading} />

        {/* Pagination */}
        {!loading && cats.length > 0 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 0 || loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              ← Previous
            </button>
            <span className="px-6 py-2 text-gray-700 font-semibold">
              Page {page + 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={cats.length < 12 || loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
