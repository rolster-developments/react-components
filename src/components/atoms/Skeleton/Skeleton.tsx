import { memo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

export type RlsSkeletonAnimation = 'shimmer' | 'pulse' | 'wave';

export interface SkeletonProps extends RlsComponent {
  animation?: RlsSkeletonAnimation;
}

function RlsSkeletonComponent({ animation, rlsTheme }: SkeletonProps) {
  const className = renderClassStatus('rls-skeleton', {
    animation: animation !== 'shimmer' && animation
  });

  return <div className={className} rls-theme={rlsTheme}></div>;
}

export const RlsSkeleton = memo(RlsSkeletonComponent);
