import cluster from 'cluster';

import db from './db';
db.sync({ alter: true });

// import Tasks from './tasks';
// Tasks.init();

import { startApp } from './app';

if (cluster.isPrimary && process.env.NODE_ENV !== 'development') {
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
} else {
  startApp();
}
