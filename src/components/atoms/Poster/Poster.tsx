import { renderClassStatus } from '../../../helpers';
import { RlsComponent } from '../../definitions';
import './Poster.css';

interface PosterProps extends RlsComponent {
  contrast?: boolean;
}

export function RlsPoster({ children, contrast, rlsTheme }: PosterProps) {
  return (
    <div
      className={renderClassStatus('rls-poster', { contrast })}
      rls-theme={rlsTheme}
    >
      {children}
    </div>
  );
}
