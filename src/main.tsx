import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DesignSystemFilled } from './demo/DesignSystemFilled';
import { RlsApplication, setDesignSystem } from './index';

import './demo/design-system.scss';

setDesignSystem('filled');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RlsApplication>
      <DesignSystemFilled />
    </RlsApplication>
  </StrictMode>
);
