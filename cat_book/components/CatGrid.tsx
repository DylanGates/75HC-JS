/**
 * Cat Grid Display Component
 * Shows multiple cat images in a responsive grid
 */

import Image from 'next/image';
import { CatImage } from '@/lib/catApi';

interface CatGridProps {
  cats: CatImage[];
  loading?: boolean;
}

export default function CatGrid({ cats, loading = false }: CatGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse overflow-hidden">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cats.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500 text-lg">No cats found. Try adjusting your filters!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cats.map((cat) => (
        <div key={cat.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative w-full h-48 bg-gray-100">
            <Image
              src={cat.url}
              alt={cat.breeds?.[0]?.name || 'Cat'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          
          <div className="p-4">
            {cat.breeds && cat.breeds.length > 0 ? (
              <>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {cat.breeds[0].name}
                </h3>
                {cat.breeds[0].origin && (
                  <p className="text-sm text-gray-600 truncate">
                    📍 {cat.breeds[0].origin}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">Unknown breed</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
