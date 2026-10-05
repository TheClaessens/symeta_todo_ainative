import config from '@faktion-com/eslint-config/base';

export default [
  ...config,
  {
    ignores: ['node_modules/*', 'dist/*', 'build/*'],
  },
];
