import { ReactControl } from '@rolster/react-forms';
import { useCallback, useEffect, useState } from 'react';
import { useImageEditorController } from '../../../controllers/ImageEditorController';
import { ImageRatio } from '../../types';
import { ImageEditorValue } from '../ImageEditor/ImageEditor';

interface ImageChooserProps {
  disabled?: boolean;
  formControl?:
    | ReactControl<HTMLElement, ImageEditorValue>
    | ReactControl<HTMLElement, ImageEditorValue | undefined>;
  maxWidth?: number;
  onValue?: (value: ImageEditorValue) => void;
  quality?: number;
  ratio?: ImageRatio;
  selection?: number;
  src?: string;
}

export function RlsImageChooser(props: ImageChooserProps) {
  const [src, setSrc] = useState<string>();

  const onValue = useCallback(
    (image: ImageEditorValue) => {
      setSrc(image.base64);
      props.onValue?.(image);
    },
    [props.onValue]
  );

  const controller = useImageEditorController({ ...props, onValue });

  useEffect(() => {
    if (props.src) {
      setSrc(props.src);
    }
  }, [props.src]);

  return (
    <div className="rls-image-chooser">
      <div
        className="rls-image-chooser__avatar"
        onClick={controller.onImageChooser}
      >
        {src && <img src={src} />}
      </div>

      {controller.RlsImageEditorChooser}
    </div>
  );
}
