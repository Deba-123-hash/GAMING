import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
];

export default eslintConfig;

