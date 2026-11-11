import { memo, useEffect } from 'react';
import { PopoverController } from '../../../controllers/PopoverController';
import { renderClassStatus } from '../../../helpers/css';
import { RlsComponent } from '../../definitions';

interface PopoverProps extends RlsComponent {
  controller: PopoverController;
}

function RlsPopoverComponent({
  children,
  controller,
  rlsSize,
  rlsTheme
}: PopoverProps) {
  const className = renderClassStatus('rls-popover', {
    placement: controller.placement,
    visible: controller.visible
  });

  useEffect(() => {
    function onClosePopover({ target }: MouseEvent) {
      if (!controller.component.current.contains(target as any)) {
        controller.close();
      }
    }

    document.addEventListener('click', onClosePopover);

    return () => {
      document.removeEventListener('click', onClosePopover);
    };
  }, []);

  return (
    <div
      ref={controller.component}
      className={className}
      rls-size={rlsSize}
      rls-theme={rlsTheme}
    >
      <div className="rls-popover__content">{children}</div>
    </div>
  );
}

export const RlsPopover = memo(RlsPopoverComponent);
