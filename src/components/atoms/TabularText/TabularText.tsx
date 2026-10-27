import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';
import { PropsWithRlsSize } from '../../definitions';

const className = 'rls-tabular-text';
const pointers = ['.', ','];

function getCharClass(char: string): string {
  return pointers.includes(char)
    ? `${className}__pointer`
    : `${className}__char`;
}

interface TabularTextProps extends PropsWithRlsSize {
  className?: string;
  value?: string;
}

function RlsTabularTextComponent({
  className,
  rlsSize,
  value
}: TabularTextProps) {
  const codes = useMemo(() => {
    return (
      <>
        {value?.split('').map((char, index) => (
          <span key={index} className={getCharClass(char)}>
            {char}
          </span>
        ))}
      </>
    );
  }, [value]);

  const _className = renderClassStatus('rls-tabular-text', {}, className);

  return (
    <div className={_className} rls-size={rlsSize}>
      {codes}
    </div>
  );
}

export const RlsTabularText = memo(RlsTabularTextComponent);
