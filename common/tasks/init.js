const fs = require('fs');
const YAML = require('yaml');
const cron = require('node-cron');
const md5 = require('md5');
const { performance } = require('perf_hooks');
const { ROOT_DIR, TASKS_PATH } = require('@constants');

const listOfCronTasks = [];

const load_task = taskPath => {
  taskPath = taskPath.split('.');
  var taskFunction = taskPath.pop();
  taskPath = taskPath.join('/');

  return {
    taskEndpoint: require(`${ROOT_DIR}/${taskPath}`),
    taskFunction: taskFunction,
  };
};

const load_tasks = () => {
  for (cronTask of listOfCronTasks) {
    cronTask.destroy();
  }

  var file;
  var data;
  var allTasks;

  try {
    file = fs.readFileSync(TASKS_PATH, 'utf8');
  } catch (err) {
    console.error(`${TASKS_PATH} is either missing or cannot be read.`);
    return;
  }

  try {
    data = YAML.parse(file);
  } catch (err) {
    console.error('Cannot parse yaml file. Please follow tasks.yaml.TEMPLATE.');
    return;
  }

  try {
    allTasks = Object.keys(data.tasks);
  } catch (err) {
    console.error('Cannot grab tasks. Please follow tasks.yaml.TEMPLATE.');
    return;
  }

  for (task of allTasks) {
    const taskName = task;
    const taskPath = data.tasks[task].module;

    listOfCronTasks.push(
      cron.schedule(data.tasks[task].schedule, async () => {
        try {
          const { taskEndpoint, taskFunction } = load_task(taskPath);
          console.info(`Running task: ${taskName}`);
          const start_time = performance.now();
          try {
            await taskEndpoint[taskFunction]();
            console.info(
              `Time took to complete ${taskName}: ${(
                performance.now() - start_time
              ).toFixed(3)}ms`
            );
          } catch (err) {
            console.error('Error executing task', err);
          }
        } catch (err) {
          console.warn(
            `Cannot load module: ${taskPath}. Check if module exists or path is correct.`
          );
        }
      })
    );
  }
};

const init = () => {
  var md5Previous = null;
  var fsWait = false;

  load_tasks();

  fs.watch(TASKS_PATH, (event, fileName) => {
    if (fileName) {
      if (fsWait) return;
      fsWait = setTimeout(() => {
        fsWait = false;
      }, 100);
      const md5Current = md5(fs.readFileSync(TASKS_PATH));
      if (md5Current == md5Previous) return;
      md5Previous = md5Current;
      load_tasks();
    }
  });
};

module.exports = {
  init,
};
