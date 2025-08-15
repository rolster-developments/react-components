import { ReactNode, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { RlsAvatar } from '../../atoms/Avatar/Avatar';
import { RlsSkeletonText } from '../../atoms/SkeletonText/SkeletonText';
import { RlsComponent } from '../../definitions';
import './Ballot.css';

interface BallotProps extends RlsComponent {
  bordered?: boolean;
  img?: string;
  initials?: string;
  skeleton?: boolean;
  subtitle?: ReactNode;
}

export function RlsBallot({
  bordered,
  children,
  img,
  initials,
  skeleton,
  subtitle,
  rlsTheme
}: BallotProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-ballot', { bordered, skeleton });
  }, [bordered, skeleton]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {(img || initials) && (
        <RlsAvatar skeleton={skeleton}>
          {img && <img src={img} />}
          {initials && <span>{initials}</span>}
        </RlsAvatar>
      )}

      <div className="rls-ballot__component">
        <div className="rls-ballot__title">
          <RlsSkeletonText active={skeleton}>{children}</RlsSkeletonText>
        </div>
        {subtitle && (
          <div className="rls-ballot__subtitle">
            <RlsSkeletonText active={skeleton}>{subtitle}</RlsSkeletonText>
          </div>
        )}
      </div>
    </div>
  );
}
