import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Poster.css';

interface PosterProps extends RlsComponent {
  contrast?: boolean;
  outline?: boolean;
}

export function RlsPoster({
  children,
  contrast,
  outline,
  rlsTheme
}: PosterProps) {
  return (
    <div
      className={renderClassStatus('rls-poster', { contrast, outline })}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}
