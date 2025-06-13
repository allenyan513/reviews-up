module.exports = {
  apps: [
    {
      name: 'reviewsup-api',
      script: 'dist/src/main.js',
      cwd: './apps/api',
      watch: false,
    },
    {
      name: 'reviewsup-web',
      script: 'next',
      args: 'start -p 5551',
      cwd: './apps/web',
    },
    {
      name: 'reviewsup-landing',
      script: 'next',
      args: 'start -p 5552',
      cwd: './apps/landing',
    }
  ],
};
