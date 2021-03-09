const cluster = require('cluster');
const { init: initializeTasks } = require('@tasks/init');
const { init: app } = require('./app');

if (cluster.isMaster && process.env.NODE_ENV !== 'development') {
  const WORKERS = process.env.WEB_CONCURRENCY || 1;

  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        `Worker ${worker.process.pid} crashed. Starting a new worker.`
      );
      const nw = cluster.fork();
      console.log(
        `Worker ${nw.process.pid} will replace worker ${worker.process.pid}`
      );
    }
  });

  console.log(`Master PID: ${process.pid} Workers: ${WORKERS}`);
  initializeTasks();
} else {
  app();
}
