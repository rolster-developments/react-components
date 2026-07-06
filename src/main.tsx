import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Demo } from './demo/Demo';
import { RlsApplication } from './context';
import { setDesignSystem } from './helpers/design-system';
import './demo/demo.scss';

setDesignSystem('filled');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RlsApplication>
      <Demo />
    </RlsApplication>
  </StrictMode>
);
