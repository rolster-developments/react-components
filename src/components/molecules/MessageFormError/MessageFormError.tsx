import { i18nSubscribe, LanguageCode } from '@rolster/i18n';
import { ReactControl } from '@rolster/react-forms';
import { memo, useEffect, useMemo, useState } from 'react';
import { msgErrorsI18n } from '../../../helpers/language';
import { RlsMessageIcon } from '../../atoms/MessageIcon/MessageIcon';
import { PropsWithRlsSize } from '../../definitions';

interface MessageFormErrorProps extends PropsWithRlsSize {
  className: string;
  formControl?: ReactControl<HTMLElement>;
}

function RlsMessageFormErrorComponent({
  className,
  formControl,
  rlsSize
}: MessageFormErrorProps) {
  const [language, setLanguage] = useState<LanguageCode>('es');

  useEffect(() => {
    return i18nSubscribe((language) => {
      setLanguage(language);
    });
  }, []);

  const msgError = useMemo(() => {
    return (
      formControl?.error &&
      (msgErrorsI18n(formControl.error.id, language, formControl.error.data) ||
        msgErrorsI18n('_unknown', language, { error: formControl.error.id }))
    );
  }, [formControl?.error, language]);

  return (
    <>
      {formControl?.wrong && (
        <div className={className} rls-size={rlsSize}>
          <RlsMessageIcon icon="alert-triangle" rlsTheme="danger">
            {msgError}
          </RlsMessageIcon>
        </div>
      )}
    </>
  );
}

export const RlsMessageFormError = memo(RlsMessageFormErrorComponent);
