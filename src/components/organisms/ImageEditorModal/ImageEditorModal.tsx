import { ReactControl } from '@rolster/react-forms';
import { RlsComponent } from '../../definitions';
import { ImageMymeType, ImageRatio } from '../../types';
import { ImageEditorValue, RlsImageEditor } from '../ImageEditor/ImageEditor';
import { RlsModal } from '../Modal/Modal';
import './ImageEditorModal.css';

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
  rateSelection?: number;
  ratio?: ImageRatio;
  src?: string;
}

export function RlsImageEditorModal(props: ImageEditorModalProps) {
  return (
    <RlsModal className="rls-image-editor-modal" visible={props.visible}>
      <RlsImageEditor {...props}>{props.children}</RlsImageEditor>
    </RlsModal>
  );
}
