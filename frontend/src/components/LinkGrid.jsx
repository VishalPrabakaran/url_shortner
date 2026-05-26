import LinkCard from './LinkCard';

export default function LinkGrid({ links, loading, onOpenAnalytics, onDeleteClick }) {
  
  // High-Quality Wix Studio Shimmer Skeleton Loader
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-[#EAEAEA] rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-4.5 w-2/3 rounded shimmer-loader"></div>
              <div className="h-5.5 w-12 rounded-full shimmer-loader"></div>
            </div>
            <div className="h-5.5 w-1/2 rounded shimmer-loader mt-1"></div>
            <div className="pt-2 flex items-center space-x-2">
              <div className="h-3 w-24 rounded shimmer-loader"></div>
            </div>
            <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="h-8 w-20 rounded shimmer-loader"></div>
                <div className="h-8 w-24 rounded shimmer-loader"></div>
              </div>
              <div className="h-8 w-8 rounded shimmer-loader"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Beautiful Wix-style Empty State
  if (links.length === 0) {
    return (
      <div className="mx-auto max-w-xl text-center py-16 px-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 border border-dashed border-gray-300 text-gray-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-bold text-[#111111] uppercase tracking-wider">No links located</h3>
        <p className="mt-1.5 text-xs text-[#666666] leading-relaxed">
          Create a shortened link above, or adjust your active navbar filters to query other items in your directories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onOpenAnalytics={onOpenAnalytics}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
