export function KpiSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${count} gap-4 mb-12`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#E8E8E4] p-6 animate-pulse">
          <div className="h-3 w-20 bg-arca-sand rounded mb-4" />
          <div className="h-8 w-16 bg-arca-bone rounded" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-arca-sand divide-y divide-arca-sand animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <div className="space-y-1.5">
            <div className="h-3 w-32 bg-arca-bone rounded" />
            <div className="h-2.5 w-20 bg-arca-sand rounded" />
          </div>
          <div className="h-3 w-16 bg-arca-sand rounded" />
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="p-8">
      <div className="h-8 w-48 bg-arca-bone rounded mb-8 animate-pulse" />
      <KpiSkeleton />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="h-3 w-32 bg-arca-sand rounded mb-4 animate-pulse" />
          <ListSkeleton />
        </div>
        <div>
          <div className="h-3 w-32 bg-arca-sand rounded mb-4 animate-pulse" />
          <ListSkeleton />
        </div>
      </div>
    </div>
  )
}
