// src/components/LoadingSkeleton.tsx

interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'kpi' | 'heatmap';
  count?: number;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ''}`} />;
}

function KPISkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-8 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
      <SkeletonBlock className="h-5 w-32 mb-4" />
      <div className="space-y-2">
        <SkeletonBlock className="h-64 w-full" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
      <SkeletonBlock className="h-5 w-32 mb-4" />
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function HeatmapSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
      <SkeletonBlock className="h-5 w-32 mb-4" />
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 35 }).map((_, i) => (
          <SkeletonBlock key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton({
  variant = 'card',
  count = 1,
}: LoadingSkeletonProps) {
  const Component = {
    card: CardSkeleton,
    chart: ChartSkeleton,
    kpi: KPISkeleton,
    heatmap: HeatmapSkeleton,
  }[variant];

  if (variant === 'kpi' && count > 1) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <Component key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </>
  );
}
