const fs = require('fs');
const YAML = require('yaml');
const cron = require('node-cron');
const { performance } = require('perf_hooks');
const { ROOT_DIR } = require('../constants');

const load_task = taskPath => {
  taskPath = taskPath.split('.');
  var taskFunction = taskPath.pop();
  taskPath = taskPath.join('/');

  return {
    taskEndpoint: require(`${ROOT_DIR}/${taskPath}`),
    taskFunction: taskFunction,
  };
};

const init = () => {
  const file = fs.readFileSync(ROOT_DIR + '/tasks.yaml', 'utf8');
  const data = YAML.parse(file);
  const allTasks = Object.keys(data.tasks);

  for (task of allTasks) {
    const taskName = task;
    const taskPath = data.tasks[task].module;
    const { taskEndpoint, taskFunction } = load_task(taskPath);

    cron.schedule(data.tasks[task].schedule, async () => {
      console.log(`Running task: ${taskName}`);
      const start_time = performance.now();
      await taskEndpoint[taskFunction]();
      console.log(
        `Time took to complete ${taskName}: ${(
          performance.now() - start_time
        ).toFixed(3)}ms`
      );
    });
  }
};

module.exports = init;
