const RfpSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 border border-gray-100 rounded-xl bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Left side mock */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-6">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            {/* Right side mock */}
            <div className="flex gap-2 justify-end">
              <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RfpSkeleton;