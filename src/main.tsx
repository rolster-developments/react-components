import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoApp } from './demo/DemoApp';
import { RlsApplication } from './index';

import './demo/design-system.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RlsApplication>
      <DemoApp />
    </RlsApplication>
  </StrictMode>
);
