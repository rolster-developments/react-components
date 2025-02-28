import { useEffect, useState } from 'react';
import './TabularText.css';

const className = 'rls-tabular-text';
const pointers = ['.', ','];

function getCharClass(char: string): string {
  return pointers.includes(char)
    ? `${className}__pointer`
    : `${className}__char`;
}

interface TabularTextProps {
  value?: string;
}

export function RlsTabularText({ value }: TabularTextProps) {
  const [codes, setCodes] = useState(<></>);

  useEffect(() => {
    setCodes(
      <>
        {value?.split('').map((char, index) => (
          <span key={index} className={getCharClass(char)}>
            {char}
          </span>
        ))}
      </>
    );
  }, [value]);

  return <div className="rls-tabular-text">{codes}</div>;
}
