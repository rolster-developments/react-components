import { PropsWithChildren } from 'react';
import { RlsSize, RlsTheme } from '../types';

export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithRlsTheme {
  rlsTheme?: RlsTheme;
}

export interface PropsWithRlsSize {
  /**
   * Escala visual del componente. `normal` conserva las dimensiones
   * originales; `small` reduce alto, espaciados, radios y tipografía
   * a un escalón menor de los tokens de foundations (≈80%).
   */
  rlsSize?: RlsSize;
}

export interface RlsComponent extends PropsWithChildren<
  PropsWithRlsTheme & PropsWithRlsSize & PropsWithClassName
> {
  identifier?: string;
}
