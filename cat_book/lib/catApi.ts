/**
 * Cat API Service
 * Handles all requests to The Cat API
 */

const API_BASE = 'https://api.thecatapi.com/v1/images/search';
const API_KEY = process.env.NEXT_PUBLIC_CAT_API_KEY || '';

export interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds: Array<{
    id: string;
    name: string;
    temperament?: string;
    origin?: string;
    life_span?: string;
  }>;
}

interface FetchOptions {
  limit?: number;
  page?: number;
  order?: 'ASC' | 'DESC' | 'RAND';
  breed_ids?: string;
  has_breeds?: 0 | 1;
}

export async function fetchCats(options: FetchOptions = {}): Promise<CatImage[]> {
  const params = new URLSearchParams();
  
  params.append('limit', (options.limit ?? 10).toString());
  if (options.page !== undefined) params.append('page', options.page.toString());
  if (options.order) params.append('order', options.order);
  if (options.breed_ids) params.append('breed_ids', options.breed_ids);
  if (options.has_breeds) params.append('has_breeds', options.has_breeds.toString());
  
  params.append('api_key', API_KEY);

  const url = `${API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cats:', error);
    throw error;
  }
}

export async function fetchRandomCat(): Promise<CatImage | null> {
  const cats = await fetchCats({ limit: 1 });
  return cats[0] || null;
}
