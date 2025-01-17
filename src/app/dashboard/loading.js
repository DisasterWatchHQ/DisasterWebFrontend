export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Skeleton loader for dashboard content */}
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}