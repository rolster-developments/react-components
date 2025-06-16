import { currencyFormat } from '@rolster/commons';
import { useMemo } from 'react';
import { RlsTheme } from '../../definitions';
import { RlsTabularText } from '../TabularText/TabularText';
import './Amount.css';

interface AmountProps {
  value: number;
  decimals?: number;
  rlsTheme?: RlsTheme;
  symbol?: string;
}

export function RlsAmount({ value, decimals, rlsTheme, symbol }: AmountProps) {
  const { decimal, integer } = useMemo(() => {
    const currency = currencyFormat({ value, decimals });

    if (!currency.includes(',')) {
      return { integer: currency, decimal: '' };
    }

    const currencySplit = currency.split(',');

    return {
      integer: currencySplit[0] + (currencySplit[1] ? ',' : ''),
      decimal: currencySplit[1] || ''
    };
  }, [value, decimals]);

  return (
    <div className="rls-amount" rls-theme={rlsTheme}>
      {symbol && <span className="rls-amount__symbol">{symbol}</span>}

      <div className="rls-amount__content">
        <RlsTabularText className="rls-amount__integer" value={integer} />

        {decimal && (
          <RlsTabularText className="rls-amount__decimal" value={decimal} />
        )}
      </div>
    </div>
  );
}
