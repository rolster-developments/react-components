import { PropsWithChildren } from 'react';

import { RlsTheme } from '../types';

export interface PropsWithClassName {
  className?: string;
}

export interface PropsWithRlsTheme {
  rlsTheme?: RlsTheme;
}

export interface RlsComponent extends PropsWithChildren<
  PropsWithRlsTheme & PropsWithClassName
> {
  identifier?: string;
}
