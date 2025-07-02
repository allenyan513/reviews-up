module.exports = {
  apps: [
    {
      name: 'reviewsup-api',
      script: 'dist/main.js',
      cwd: './apps/api',
      watch: false,
    },
    {
      name: 'reviewsup-app',
      cwd: './apps/web',
      script: 'pnpm',
      args: 'exec next start -p 5510',
      interpreter: 'bash',
    },
    {
      name: 'reviewsup-www',
      cwd: './apps/landing',
      script: 'pnpm',
      args: 'exec next start -p 5520',
      interpreter: 'bash',
    },
    {
      name: 'reviewsup-docs',
      cwd: './apps/docs',
      script: 'pnpm',
      args: 'exec next start -p 5540',
      interpreter: 'bash',
    }
  ],
};
