import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          🐱 Cat Gallery
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
          >
            Random
          </Link>
          <Link
            href="/browse"
            className="text-gray-700 hover:text-blue-500 font-medium transition-colors"
          >
            Browse
          </Link>
        </div>
      </div>
    </nav>
  );
}
