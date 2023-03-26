module.exports = {
  plugins: ['prettier'],
  extends: ['codyduong'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.cts', '*.js', '*.mjs', '*.cjs'],
      rules: {
        'no-empty-function': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            varsIgnorePattern: '^_',
            argsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'off',
          {
            allowExpressions: true,
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
};
