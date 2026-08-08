import { memo, useMemo } from 'react';
import { renderClassStatus } from '../../../helpers/css';

const className = 'rls-tabular-text';
const pointers = ['.', ','];

function getCharClass(char: string): string {
  return pointers.includes(char)
    ? `${className}__pointer`
    : `${className}__char`;
}

interface TabularTextProps {
  className?: string;
  value?: string;
}

function RlsTabularTextComponent({ className, value }: TabularTextProps) {
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

  return <div className={_className}>{codes}</div>;
}

export const RlsTabularText = memo(RlsTabularTextComponent);
