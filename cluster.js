require('module-alias/register');
const cluster = require('cluster');
const os = require('os');
const { init: initializeTasks } = require('@tasks/init');

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  console.dir(cluster.workers, {depth: 0});

  process.stdin.on('data', (data) => {
    initControlCommands(data);
  });

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker.`);
      const nw = cluster.fork();
      console.log(`Worker ${nw.process.pid} will replace worker ${worker.process.pid}`);
    }
  });

  console.log(`Master PID: ${process.pid}`);
  initializeTasks();
} else {
  require('./index');
}