import { ReactControl } from '@rolster/react-forms';
import { memo } from 'react';
import { RlsComponent } from '../../definitions';
import { ImageMymeType, ImageRatio } from '../../types';
import { ImageEditorValue, RlsImageEditor } from '../ImageEditor/ImageEditor';
import { RlsModal } from '../Modal/Modal';

interface ImageEditorModalProps extends RlsComponent {
  visible: boolean;
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  maxWidth?: number;
  mimeType?: ImageMymeType;
  onValue?: (value: ImageEditorValue) => void;
  quality?: number;
  ratio?: ImageRatio;
  selection?: number;
  src?: string;
}

function RlsImageEditorModalComponent(props: ImageEditorModalProps) {
  return (
    <RlsModal className="rls-image-editor-modal" visible={props.visible}>
      <RlsImageEditor {...props}>{props.children}</RlsImageEditor>
    </RlsModal>
  );
}

export const RlsImageEditorModal = memo(RlsImageEditorModalComponent);
