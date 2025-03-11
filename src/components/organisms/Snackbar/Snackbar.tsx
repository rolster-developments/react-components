import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { RlsTheme } from '../../definitions';
import './Snackbar.css';

const DURATION_ANIMATION = 240;
const DURATION_CHAR = 75;
const DURATION_MAX = 9000;
const DURATION_MIN = 3000;
const DURATION_RESET = 480;

function calculateDuration({ length }: string): number {
  let duration = length * DURATION_CHAR;

  if (duration < DURATION_MIN) {
    duration = DURATION_MIN;
  } else if (duration > DURATION_MAX) {
    duration = DURATION_MAX;
  }

  return duration + DURATION_RESET;
}

interface SnackbarBasic {
  content?: ReactNode;
  title?: ReactNode;
}

export interface SnackbarConfig extends SnackbarBasic {
  icon?: string;
  rlsTheme?: RlsTheme;
}

interface SnackbarProps extends SnackbarConfig {
  visible?: boolean;
}

export type Snackbar = (config: SnackbarConfig) => void;

export interface SnackbarService {
  RlsSnackbar: ReactNode;
  snackbar: Snackbar;
}

export function RlsSnackbar({
  content,
  icon,
  title,
  visible,
  rlsTheme
}: SnackbarProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-snackbar', { visible });
  }, [visible]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {icon && (
        <div className="rls-snackbar__avatar">
          <RlsIcon value={icon} />
        </div>
      )}

      <div className="rls-snackbar__component">
        {title && <div className="rls-snackbar__title">{title}</div>}
        <div className="rls-snackbar__content">{content}</div>
      </div>
    </div>
  );
}

export function useSnackbar(): SnackbarService {
  const [config, setConfig] = useState<SnackbarConfig>({});
  const [duration, setDuration] = useState(4000);
  const [timeoutId, setTimeoutId] = useState<number>();
  const [visible, setVisible] = useState(false);

  const rlsSnackbar = <RlsSnackbar {...config} visible={visible} />;

  useEffect(() => {
    if (visible) {
      const timeoutId = setTimeout(() => {
        setVisible(false);
        setTimeoutId(undefined);
      }, duration);

      setTimeoutId(timeoutId);
    } else if (timeoutId) {
      clearTimeout(timeoutId);

      setTimeout(() => snackbar(config), DURATION_ANIMATION);
    }
  }, [visible]);

  const snackbar = useCallback((config: SnackbarConfig) => {
    const { content } = config;

    setConfig(config);

    setDuration(calculateDuration(String(content)));

    setVisible((visible) => !visible);
  }, []);

  return {
    RlsSnackbar: rlsSnackbar,
    snackbar
  };
}
