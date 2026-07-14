import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { PropsWithRlsTheme } from '../../definitions';

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

export interface SnackbarConfig extends PropsWithRlsTheme, SnackbarBasic {
  icon?: string;
}

interface SnackbarProps extends SnackbarConfig {
  onClose: () => void;
  visible?: boolean;
}

export type Snackbar = (config: SnackbarConfig) => void;

export interface SnackbarService {
  RlsSnackbar: ReactNode;
  snackbar: Snackbar;
}

export function RlsSnackbar({
  content,
  onClose,
  icon,
  rlsTheme,
  title,
  visible
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
        <div className="rls-snackbar__header">
          <div className="rls-snackbar__title">{title}</div>

          <button onClick={onClose}>
            <RlsIcon value="close" />
          </button>
        </div>

        <div className="rls-snackbar__content">{content}</div>
      </div>
    </div>
  );
}

interface SnackbarState {
  config: SnackbarConfig;
  visible: boolean;
}

export function useSnackbar(): SnackbarService {
  const timeoutId = useRef<any>(undefined);
  const duration = useRef(4000);

  const [state, setState] = useState<SnackbarState>({
    config: {},
    visible: false
  });

  const onClose = useCallback(() => {
    timeoutId.current && clearTimeout(timeoutId.current);
    timeoutId.current = undefined;

    setState((state) => ({ ...state, visible: false }));
  }, []);

  const rlsSnackbar = (
    <RlsSnackbar {...state.config} visible={state.visible} onClose={onClose} />
  );

  useEffect(() => {
    if (state.visible) {
      timeoutId.current = setTimeout(() => {
        timeoutId.current = undefined;
        setState((state) => ({ ...state, visible: false }));
      }, duration.current);
    } else if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = undefined;

      setTimeout(() => {
        snackbar(state.config);
      }, DURATION_ANIMATION);
    }
  }, [state.visible]);

  const snackbar = useCallback((config: SnackbarConfig) => {
    duration.current = calculateDuration(String(config.content));

    setState((state) => ({
      ...state,
      config,
      visible: !state.visible
    }));
  }, []);

  return {
    RlsSnackbar: rlsSnackbar,
    snackbar
  };
}
