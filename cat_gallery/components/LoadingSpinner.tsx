/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
      </div>
      <span className="ml-3 text-gray-600 font-medium">Loading...</span>
    </div>
  );
}
