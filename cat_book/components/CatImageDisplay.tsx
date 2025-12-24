/**
 * Cat Image Display Component
 * Displays a single cat image
 */

import Image from 'next/image';
import { CatImage } from '@/lib/catApi';

interface CatImageDisplayProps {
  cat: CatImage | null;
  loading?: boolean;
}

export default function CatImageDisplay({ cat, loading = false }: CatImageDisplayProps) {
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-500">No cat loaded. Click refresh to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative w-full h-64 bg-gray-100">
        <Image
          src={cat.url}
          alt="Random cat"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 448px"
          priority
        />
      </div>
      
      <div className="p-6">
        {cat.breeds && cat.breeds.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900">
              {cat.breeds[0].name}
            </h3>
            {cat.breeds[0].origin && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Origin:</span> {cat.breeds[0].origin}
              </p>
            )}
            {cat.breeds[0].temperament && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Temperament:</span> {cat.breeds[0].temperament}
              </p>
            )}
            {cat.breeds[0].life_span && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Life Span:</span> {cat.breeds[0].life_span} years
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No breed information available</p>
        )}
        <p className="text-xs text-gray-400 mt-4">
          ID: {cat.id} • {cat.width}x{cat.height}
        </p>
      </div>
    </div>
  );
}
