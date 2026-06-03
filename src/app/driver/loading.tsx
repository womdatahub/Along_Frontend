export default function DriverLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar skeleton */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 h-20 animate-pulse shadow-sm" />
            <div className="bg-white rounded-2xl h-44 animate-pulse shadow-sm" />
            <div className="bg-white rounded-2xl h-16 animate-pulse shadow-sm" />
          </div>

          {/* Main content skeleton */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl h-40 animate-pulse shadow-sm" />
              <div className="bg-white rounded-2xl h-40 animate-pulse shadow-sm" />
            </div>
            <div className="bg-white rounded-2xl h-32 animate-pulse shadow-sm" />
            <div className="bg-white rounded-2xl h-48 animate-pulse shadow-sm" />
            <div className="bg-white rounded-2xl h-64 animate-pulse shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
