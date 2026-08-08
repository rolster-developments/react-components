import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Demo } from './demo/Demo';
import { RlsApplication, setDesignSystem } from './index';

import './demo/design-system.scss';

setDesignSystem('filled');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RlsApplication>
      <Demo />
    </RlsApplication>
  </StrictMode>
);
