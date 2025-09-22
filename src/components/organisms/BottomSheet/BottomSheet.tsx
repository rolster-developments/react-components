import { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './BottomSheet.css';

interface BottonSheetProps extends RlsComponent {
  className?: string;
  visible?: boolean;
}

export function RlsBottonSheet({
  children,
  className,
  visible,
  rlsTheme
}: BottonSheetProps) {
  const classNameSheet = useMemo(() => {
    return renderClassStatus('rls-bottom-sheet', { visible }, className);
  }, [className, visible]);

  return ReactDOM.createPortal(
    <div className={classNameSheet} rls-theme={rlsTheme}>
      <div className="rls-bottom-sheet__component">{children}</div>

      <div className="rls-bottom-sheet__backdrop"></div>
    </div>,
    document.body
  );
}
