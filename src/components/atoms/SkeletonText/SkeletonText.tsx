import { RlsComponent } from '../../definitions';
import { RlsSkeleton } from '../Skeleton/Skeleton';

interface SkeletonTextProps extends RlsComponent {
  active?: boolean;
}

export function RlsSkeletonText({
  active,
  children,
  rlsTheme
}: SkeletonTextProps) {
  return (
    <div className="rls-skeleton-text" rls-theme={rlsTheme}>
      {active ? (
        <RlsSkeleton />
      ) : (
        <div className="rls-skeleton-text__value">{children}</div>
      )}
    </div>
  );
}
