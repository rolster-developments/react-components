import { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';
import './BottomSheet.css';

interface BottomSheetProps extends RlsComponent {
  onAutoClose?: () => void;
  visible?: boolean;
}

export function RlsBottomSheet({
  children,
  className,
  onAutoClose,
  visible,
  rlsTheme
}: BottomSheetProps) {
  const classNameSheet = useMemo(() => {
    return renderClassStatus('rls-bottom-sheet', { visible }, className);
  }, [className, visible]);

  const onClickBackdrop = useCallback(() => {
    onAutoClose && onAutoClose();
  }, [onAutoClose]);

  return ReactDOM.createPortal(
    <div className={classNameSheet} rls-theme={rlsTheme}>
      <div className="rls-bottom-sheet__component">{children}</div>

      <div
        className="rls-bottom-sheet__backdrop"
        onClick={onClickBackdrop}
      ></div>
    </div>,
    document.body
  );
}
