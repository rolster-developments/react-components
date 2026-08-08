import { memo } from 'react';
import { RlsComponent } from '../../definitions';

function RlsSkeletonComponent({ rlsTheme }: RlsComponent) {
  return <div className="rls-skeleton" rls-theme={rlsTheme}></div>;
}

export const RlsSkeleton = memo(RlsSkeletonComponent);
