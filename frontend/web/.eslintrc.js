module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'codyduong',
  ],
  plugins: ['jsx-a11y'],
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.mts', '*.cts', '*.js', '*.mjs', '*.cjs'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
