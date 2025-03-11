import { PartialSealed } from '@rolster/commons';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { renderClassStatus } from '../../../helpers';
import { reactI18n } from '../../../i18n';
import { RlsButton } from '../../atoms/Button/Button';
import { RlsTheme } from '../../definitions';
import './Confirmation.css';

export class ConfirmationResult extends PartialSealed<
  void,
  void,
  {
    approved: () => void;
    reject: () => void;
  }
> {
  public static approved(): ConfirmationResult {
    return new ConfirmationResult('approved');
  }

  public static reject(): ConfirmationResult {
    return new ConfirmationResult('reject');
  }
}

type Result = Promise<ConfirmationResult>;

interface ConfirmationButton {
  label: string;
  onClick: () => void;
  identifier?: string;
}

interface ConfirmationBasic {
  content?: ReactNode;
  subtitle?: string;
  title?: string;
  rlsTheme?: RlsTheme;
}

interface ConfirmationProps extends ConfirmationBasic {
  approved?: ConfirmationButton;
  reject?: ConfirmationButton;
  visible?: boolean;
}

interface ConfirmationAction {
  label: string;
  identifier?: string;
}

interface ConfirmationOptions extends ConfirmationBasic {
  approved?: ConfirmationAction;
  reject?: ConfirmationAction;
}

export type Confirmation = (options: ConfirmationOptions) => Result;

export interface ConfirmationService {
  RlsConfirmation: ReactNode;
  confirmation: Confirmation;
}

export function RlsConfirmation({
  approved,
  content,
  reject,
  rlsTheme,
  subtitle,
  title,
  visible
}: ConfirmationProps) {
  const className = useMemo(() => {
    return renderClassStatus('rls-confirmation', { visible });
  }, [visible]);

  return (
    <div className={className} rls-theme={rlsTheme}>
      <div className="rls-confirmation__component">
        <div className="rls-confirmation__header">
          {title && <div className="rls-confirmation__title">{title}</div>}
          {subtitle && (
            <div className="rls-confirmation__subtitle">{subtitle}</div>
          )}
        </div>

        <div className="rls-confirmation__body">
          {content && (
            <div className="rls-confirmation__message">{content}</div>
          )}
        </div>

        {(approved || reject) && (
          <div className="rls-confirmation__footer">
            <div className="rls-confirmation__actions">
              {approved && (
                <RlsButton
                  identifier={approved.identifier}
                  type="raised"
                  onClick={approved.onClick}
                >
                  {approved.label}
                </RlsButton>
              )}
              {reject && (
                <RlsButton
                  identifier={reject.identifier}
                  type="outline"
                  onClick={reject.onClick}
                >
                  {reject.label}
                </RlsButton>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rls-confirmation__backdrop"></div>
    </div>
  );
}

export function useConfirmation(): ConfirmationService {
  const [config, setConfig] = useState<ConfirmationProps>({});
  const [visible, setVisible] = useState(false);

  const rlsConfirmation = ReactDOM.createPortal(
    <RlsConfirmation {...config} visible={visible} />,
    document.body
  );

  const confirmation = useCallback((options: ConfirmationOptions) => {
    return new Promise<ConfirmationResult>((resolve) => {
      const { content, rlsTheme, subtitle, title, approved, reject } = options;

      setConfig({
        content,
        rlsTheme,
        subtitle,
        title,
        approved: {
          label: approved?.label ?? reactI18n('confirmationActionApproved'),
          onClick: () => {
            setVisible(false);
            resolve(ConfirmationResult.approved());
          },
          identifier: approved?.identifier
        },
        reject: reject
          ? {
              label: reject.label,
              onClick: () => {
                setVisible(false);
                resolve(ConfirmationResult.reject());
              },
              identifier: reject.identifier
            }
          : undefined
      });

      setVisible(true);
    });
  }, []);

  return {
    RlsConfirmation: rlsConfirmation,
    confirmation
  };
}
