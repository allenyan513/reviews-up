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
      script: 'next',
      args: 'start -p 5510',
      cwd: './apps/web',
    },
    {
      name: 'reviewsup-www',
      script: 'next',
      args: 'start -p 5520',
      cwd: './apps/landing',
    },
    {
      name: 'reviewsup-docs',
      script: 'next',
      args: 'start -p 5530',
      cwd: './apps/docs',
    }
  ],
};
