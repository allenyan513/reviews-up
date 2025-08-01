module.exports = {
  apps: [
    {
      name: 'reviewsup-api',
      cwd: './apps/api',
      script: 'dist/main.js',
      watch: false,
    },
    {
      name: 'reviewsup-app',
      cwd: './apps/web',
      script: './start.sh',
    },
    {
      name: 'reviewsup-docs',
      cwd: './apps/docs',
      script: './start.sh',
    }
  ],
};
