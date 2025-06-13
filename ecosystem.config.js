module.exports = {
  apps: [
    {
      name: 'reviewsup-api',
      script: 'dist/src/main.js',
      cwd: './apps/api',
      watch: false,
    },
    {
      name: 'reviewsup-app',
      script: 'next',
      args: 'start -p 5551',
      cwd: './apps/web',
    },
    {
      name: 'reviewsup-www',
      script: 'next',
      args: 'start -p 5552',
      cwd: './apps/landing',
    }
  ],
};
