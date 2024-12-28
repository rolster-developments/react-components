import './TabularText.css';

const className = 'rls-tabular-text';
const pointers = ['.', ','];

function charClass(char: string): string {
  return pointers.includes(char)
    ? `${className}__pointer`
    : `${className}__char`;
}

interface TabularTextProps {
  value?: string;
}

export function RlsTabularText({ value }: TabularTextProps) {
  return (
    <div className="rls-tabular-text">
      {value?.split('').map((char, index) => (
        <span key={index} className={charClass(char)}>
          {char}
        </span>
      ))}
    </div>
  );
}
