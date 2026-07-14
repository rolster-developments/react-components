import { useCallback } from 'react';

import { RlsButton } from '../components/atoms/Button/Button';
import { useRlsContext } from '../context';
import { RlsButtonType } from '../types';
import { RlsTheme } from '../types';

const themes: RlsTheme[] = [
  'standard',
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger'
];

type ThemeSample = {
  theme: RlsTheme;
  label: string;
  type: RlsButtonType;
};

const themeSamples: ThemeSample[] = [
  { theme: 'primary', label: 'Primary', type: 'raised' },
  { theme: 'success', label: 'Success', type: 'raised' },
  { theme: 'info', label: 'Info', type: 'raised' },
  { theme: 'warning', label: 'Warning', type: 'raised' },
  { theme: 'danger', label: 'Danger', type: 'raised' }
];

function DemoContent() {
  const { notify } = useRlsContext();

  const notifyTheme = useCallback(
    (theme: RlsTheme) => {
      notify({
        title: `Notificación ${theme}`,
        content: `Este es un mensaje de tipo ${theme}`,
        icon: 'check',
        rlsTheme: theme
      });
    },
    [notify]
  );

  const notifyAll = useCallback(() => {
    themes.forEach((theme) => {
      notify({
        title: `Notificación ${theme}`,
        content: `Mensaje de tipo ${theme}`,
        icon: 'check',
        rlsTheme: theme,
        duration: 3000 + themes.indexOf(theme) * 1000
      });
    });
  }, [notify]);

  const notifySimple = useCallback(() => {
    notify({
      title: 'Sin contenido',
      icon: 'bell'
    });
  }, [notify]);

  const notifyLong = useCallback(() => {
    notify({
      title: 'Mensaje largo',
      content:
        'Este es un mensaje con mucho contenido para probar cómo se ve cuando el texto es extenso y ocupa varias líneas en la notificación.',
      icon: 'information',
      rlsTheme: 'info',
      duration: 8000
    });
  }, [notify]);

  const notifyFromContext = useCallback(() => {
    notify({
      title: 'Desde contexto',
      content: 'Usando RlsContext.notify',
      icon: 'check',
      rlsTheme: 'success'
    });
  }, [notify]);

  return (
    <div className="rls-demo">
      <div className="rls-demo__header">Rolster Components - Demo</div>

      <div className="rls-demo__content">
        <div className="rls-demo__section">
          <div className="rls-demo__section-title">Notifications por tema</div>

          <div className="rls-demo__actions">
            {themeSamples.map(({ theme, label, type }) => (
              <RlsButton
                key={theme}
                rlsTheme={theme}
                type={type}
                onClick={() => notifyTheme(theme)}
              >
                {label}
              </RlsButton>
            ))}
          </div>
        </div>

        <div className="rls-demo__section">
          <div className="rls-demo__section-title">Casos especiales</div>

          <div className="rls-demo__actions">
            <RlsButton type="raised" onClick={notifyAll}>
              Todas los temas
            </RlsButton>

            <RlsButton type="raised" onClick={notifySimple} rlsTheme="primary">
              Sin contenido
            </RlsButton>

            <RlsButton type="raised" onClick={notifyLong} rlsTheme="info">
              Mensaje largo (8s)
            </RlsButton>
          </div>
        </div>

        <div className="rls-demo__section">
          <div className="rls-demo__section-title">Desde contexto global</div>

          <div className="rls-demo__actions">
            <RlsButton
              type="raised"
              onClick={notifyFromContext}
              rlsTheme="success"
            >
              Notify desde RlsContext
            </RlsButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Demo() {
  return <DemoContent />;
}
