import { motion } from 'framer-motion';

type SkeletonVariant = 'card' | 'text' | 'avatar' | 'table-row' | 'stat-card';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

const shimmer = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
  },
  transition: {
    duration: 1.8,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`bg-forge-iron/30 rounded ${className}`}
      animate={shimmer.animate}
      transition={shimmer.transition}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
      <SkeletonPulse className="h-5 w-28 mb-6" />
      <div className="flex flex-col items-center justify-center">
        <SkeletonPulse className="w-32 h-32 rounded-full mb-4" />
        <SkeletonPulse className="h-4 w-40 mt-2" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 backdrop-blur-md">
      <SkeletonPulse className="h-5 w-32 mb-4" />
      <SkeletonPulse className="h-4 w-full mb-3" />
      <SkeletonPulse className="h-4 w-3/4 mb-3" />
      <SkeletonPulse className="h-4 w-1/2" />
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-4/5" />
      <SkeletonPulse className="h-4 w-3/5" />
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <SkeletonPulse className="w-12 h-12 rounded-full shrink-0" />
      <div className="flex-1">
        <SkeletonPulse className="h-4 w-24 mb-2" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#1f1f1f]">
      <div className="flex items-center gap-4">
        <SkeletonPulse className="w-8 h-4 rounded" />
        <SkeletonPulse className="w-10 h-10 rounded-full" />
        <SkeletonPulse className="w-24 h-4 rounded" />
      </div>
      <SkeletonPulse className="w-16 h-4 rounded" />
    </div>
  );
}

export default function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => {
    switch (variant) {
      case 'stat-card':
        return <StatCardSkeleton key={i} />;
      case 'card':
        return <CardSkeleton key={i} />;
      case 'text':
        return <TextSkeleton key={i} />;
      case 'avatar':
        return <AvatarSkeleton key={i} />;
      case 'table-row':
        return <TableRowSkeleton key={i} />;
      default:
        return <CardSkeleton key={i} />;
    }
  });

  return <div className={`flex flex-col gap-4 ${className}`}>{skeletons}</div>;
}

export { SkeletonPulse };
