export function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse space-y-6">
      <div className="h-8 w-48 bg-subtle rounded-lg"></div>
      <div className="h-4 w-64 bg-subtle rounded"></div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-subtle rounded-lg"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[
            ...Array(4).map((_, i) => (
              <div key={i} className="h-16 bg-subtle rounded-lg"></div>
            )),
          ]}
        </div>
      </div>
    </div>
  );
}
