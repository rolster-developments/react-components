import rolster from '@rolster/rollup';

import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default rolster({
  entryFiles: ['index'],
  packages: [
    '@rolster/commons',
    '@rolster/components',
    '@rolster/dates',
    '@rolster/i18n',
    '@rolster/react-forms',
    '@rolster/strings',
    'react',
    'react-dom'
  ],
  plugins: [peerDepsExternal()],
  requiredEsm: true
});
