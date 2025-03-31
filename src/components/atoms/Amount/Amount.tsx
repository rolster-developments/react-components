import { currencyFormat } from '@rolster/commons';
import { useMemo } from 'react';
import { RlsTheme } from '../../definitions';
import { RlsTabularText } from '../TabularText/TabularText';
import './Amount.css';

interface AmountProps {
  value: number;
  decimals?: boolean;
  rlsTheme?: RlsTheme;
  symbol?: string;
}

export function RlsAmount({ value, decimals, rlsTheme, symbol }: AmountProps) {
  const amount = useMemo(
    () => currencyFormat({ value, decimals }),
    [value, decimals]
  );

  return (
    <div className="rls-amount" rls-theme={rlsTheme}>
      {symbol && <span>{symbol}</span>}
      <RlsTabularText value={amount} />
    </div>
  );
}
