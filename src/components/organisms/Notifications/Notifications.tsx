import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers/css';
import { RlsIcon } from '../../atoms/Icon/Icon';
import { PropsWithRlsTheme } from '../../definitions';

const DURATION_ANIMATION = 240;
const DURATION_DEFAULT = 4000;

let _id = 0;

function generateId(): string {
  return `rls-notification-${++_id}`;
}

interface NotificationsBasic {
  content?: ReactNode;
  title?: ReactNode;
}

export interface NotificationsConfig
  extends PropsWithRlsTheme, NotificationsBasic {
  duration?: number;
  icon?: string;
}

interface NotificationData {
  config: NotificationsConfig;
  id: string;
  visible: boolean;
}

interface NotificationProps extends NotificationsConfig {
  onClose: () => void;
  visible?: boolean;
}

export type Notify = (config: NotificationsConfig) => void;

export interface NotificationsService {
  notify: Notify;
  RlsNotifications: ReactNode;
}

function RlsNotification({
  content,
  icon,
  onClose,
  rlsTheme,
  title,
  visible
}: NotificationProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-notification', { visible });
  }, [visible]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      {icon && (
        <div className="rls-notification__avatar">
          <RlsIcon value={icon} />
        </div>
      )}

      <div className="rls-notification__component">
        <div className="rls-notification__header">
          <div className="rls-notification__title">{title}</div>

          <button onClick={onClose}>
            <RlsIcon value="close" />
          </button>
        </div>

        <div className="rls-notification__content">{content}</div>
      </div>
    </div>
  );
}

export function useNotifications(): NotificationsService {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const remove = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setNotifications((notifications) =>
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, visible: false }
          : notification
      )
    );

    setTimeout(() => {
      setNotifications((notifications) =>
        notifications.filter((notification) => notification.id !== id)
      );
    }, DURATION_ANIMATION);
  }, []);

  const notify = useCallback(
    (config: NotificationsConfig) => {
      const id = generateId();
      const duration = config.duration ?? DURATION_DEFAULT;

      setNotifications((notifications) => [
        ...notifications,
        { id, config, visible: true }
      ]);

      const timer = setTimeout(() => {
        remove(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [remove]
  );

  const RlsNotifications = ReactDOM.createPortal(
    <div className="rls-notifications">
      {notifications.map((notification) => (
        <RlsNotification
          key={notification.id}
          {...notification.config}
          visible={notification.visible}
          onClose={() => remove(notification.id)}
        />
      ))}
    </div>,
    document.body
  );

  return {
    RlsNotifications,
    notify
  };
}
