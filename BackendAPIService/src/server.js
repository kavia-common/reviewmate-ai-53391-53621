const app = require('./app');
const config = require('./config');

// Start HTTP server
const server = app
  .listen(config.port, config.host, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${config.host}:${config.port}`);
  })
  .on('error', (err) => {
    // Provide clearer diagnostics if port is in use or permissions issue
    // eslint-disable-next-line no-console
    console.error(`[Server] Failed to start on ${config.host}:${config.port}`, err?.code || err?.message || err);
    process.exit(1);
  });

// Graceful shutdown
function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`${signal} received: closing HTTP server`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
