import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { renderClassStatus } from '../../../helpers/css';
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
  duration: number;
  visible: boolean;
  timeoutId?: number;
}

export function useSnackbar(): SnackbarService {
  const [state, setState] = useState<SnackbarState>({
    config: {},
    duration: 4000,
    timeoutId: undefined,
    visible: false
  });

  const onClose = useCallback(() => {
    setState((state) => ({ ...state, timeoutId: undefined, visible: false }));
  }, []);

  const rlsSnackbar = (
    <RlsSnackbar {...state.config} visible={state.visible} onClose={onClose} />
  );

  useEffect(() => {
    if (state.visible) {
      const timeoutId = setTimeout(() => {
        setState((state) => ({
          ...state,
          timeoutId: undefined,
          visible: false
        }));
      }, state.duration);

      setState((state) => ({ ...state, timeoutId }));
    } else if (state.timeoutId) {
      clearTimeout(state.timeoutId);

      setTimeout(() => snackbar(state.config), DURATION_ANIMATION);
    }
  }, [state.visible]);

  const snackbar = useCallback((config: SnackbarConfig) => {
    setState((state) => ({
      ...state,
      config,
      duration: calculateDuration(String(config.content)),
      visible: !state.visible
    }));
  }, []);

  return {
    RlsSnackbar: rlsSnackbar,
    snackbar
  };
}
