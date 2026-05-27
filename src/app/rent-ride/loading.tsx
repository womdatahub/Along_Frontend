export default function RentRideLoading() {
  return (
    <div className="flex flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Left panel skeleton */}
      <div className="w-full md:w-[440px] lg:w-[480px] shrink-0 h-full bg-background border-r border-gray-100 p-5 flex flex-col gap-5">
        <div className="bg-white rounded-2xl h-20 animate-pulse shadow-sm border border-gray-100" />
        <div className="bg-white rounded-2xl h-28 animate-pulse shadow-sm border border-gray-100" />
        <div className="bg-white rounded-2xl h-16 animate-pulse shadow-sm border border-gray-100" />
        <div className="flex flex-col gap-3">
          <div className="h-28 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
          <div className="h-28 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
          <div className="h-28 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
        </div>
      </div>

      {/* Map panel skeleton */}
      <div className="hidden md:block flex-1 h-full bg-gray-100 animate-pulse" />
    </div>
  );
}
