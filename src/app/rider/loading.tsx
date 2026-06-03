export default function RiderLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar skeleton */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
              <div className="size-12 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-48 animate-pulse" />
            <div className="bg-primary-deep rounded-2xl p-5 h-36 animate-pulse opacity-50" />
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-16 animate-pulse" />
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl h-40 animate-pulse shadow-sm border border-gray-100" />
              <div className="rounded-2xl h-40 animate-pulse bg-gray-200" />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
