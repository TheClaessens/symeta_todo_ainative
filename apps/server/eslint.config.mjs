import config from '@faktion-com/eslint-config/node';

export default [
  ...config,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
