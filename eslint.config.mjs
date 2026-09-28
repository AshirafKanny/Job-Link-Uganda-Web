import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['.next/', '.dev-db/', 'node_modules/', 'src/payload-types.ts', 'src/migrations/', 'src/app/(payload)/admin/importMap.js', 'next-env.d.ts'],
  },
]

export default eslintConfig
