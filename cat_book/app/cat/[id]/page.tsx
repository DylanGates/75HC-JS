"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CatImage } from "@/lib/catApi";

interface CatDetailProps {
  params: {
    id: string;
  };
}

export default function CatDetail({ params }: CatDetailProps) {
  const [cat, setCat] = useState<CatImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatDetail = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_CAT_API_KEY || "";
        const response = await fetch(
          `https://api.thecatapi.com/v1/images/${params.id}`,
          {
            headers: { "x-api-key": apiKey },
          }
        );
        const data = await response.json();
        setCat(data);
      } catch (error) {
        console.error("Failed to fetch cat details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Cat not found
          </h1>
          <p className="text-gray-600">Sorry, we couldn't find this cat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border border-gray-300 transition-colors"
        >
          ← Back
        </button>

        {/* Image */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="relative w-full h-96 bg-gray-100">
            <Image
              src={cat.url}
              alt="Cat"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {cat.breeds && cat.breeds.length > 0 ? (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {cat.breeds[0].name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.breeds[0].origin && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-1">Origin</h3>
                    <p className="text-blue-800">{cat.breeds[0].origin}</p>
                  </div>
                )}

                {cat.breeds[0].life_span && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-1">
                      Life Span
                    </h3>
                    <p className="text-green-800">
                      {cat.breeds[0].life_span} years
                    </p>
                  </div>
                )}
              </div>

              {cat.breeds[0].temperament && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Temperament
                  </h3>
                  <p className="text-purple-800">{cat.breeds[0].temperament}</p>
                </div>
              )}

              {cat.breeds[0].wikipedia_url && (
                <div>
                  <a
                    href={cat.breeds[0].wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    📖 Learn more on Wikipedia
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unknown Breed
              </h2>
              <p className="text-gray-600">
                No breed information available for this cat.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Image ID: {cat.id}</p>
            <p>
              Dimensions: {cat.width}x{cat.height}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
