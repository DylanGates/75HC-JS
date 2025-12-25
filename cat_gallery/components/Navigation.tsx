import Link from "next/link";
import { Heart, Search } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          <span>🐱</span>
          <span>Cat Gallery</span>
        </Link>

        <div className="flex gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition-colors duration-200"
          >
            <span>🎲</span>
            Random
          </Link>

          <Link
            href="/browse"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            <Search size={18} />
            Browse
          </Link>
        </div>
      </div>
    </nav>
  );
}
