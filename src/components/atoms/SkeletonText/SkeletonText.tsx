import { memo } from 'react';
import { RlsComponent } from '../../definitions';
import { RlsSkeleton, RlsSkeletonAnimation } from '../Skeleton/Skeleton';

interface SkeletonTextProps extends RlsComponent {
  active?: boolean;
  animation?: RlsSkeletonAnimation;
}

function RlsSkeletonTextComponent({
  active,
  animation,
  children,
  rlsTheme
}: SkeletonTextProps) {
  return (
    <div className="rls-skeleton-text" rls-theme={rlsTheme}>
      {active ? (
        <RlsSkeleton animation={animation} />
      ) : (
        <div className="rls-skeleton-text__value">{children}</div>
      )}
    </div>
  );
}

export const RlsSkeletonText = memo(RlsSkeletonTextComponent);
