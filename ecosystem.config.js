module.exports = {
    apps: [
      {
        name: 'the-bombay-forum',
        script: 'npm',
        args: 'start',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  