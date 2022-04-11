import cron from 'node-cron';
import { readdirSync } from 'fs';
import path from 'path';

class Tasks {
  tasks = [];

  init = () => {
    console.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'development') {
      console.info('Will not initialize tasks');
      return;
    }
    console.info('Initializing tasks...');
    readdirSync(path.join(__dirname))
      .filter((file: string) => file.slice(-3) !== '.ts')
      .forEach(async (folder: string) => {
        try {
          const [endpoint, schedule] = (
            await import(path.join(__dirname, folder, 'handler.ts'))
          ).default;
          this.load(endpoint, schedule, folder);
        } catch (err) {
          console.error(`Could not load task ${folder}`);
        }
      });
  };

  load = (
    endpoint: () => Promise<void>,
    schedule: string,
    taskName: string
  ) => {
    this.tasks.push(
      cron.schedule(schedule, async () => {
        console.info(`Running task: ${taskName}`);
        const startTime = performance.now();
        try {
          await endpoint();
        } catch (err) {
          console.error('Error executing task', err);
        } finally {
          console.info(
            `Time took to complete ${taskName}: ${(
              performance.now() - startTime
            ).toFixed(3)}ms`
          );
        }
      })
    );
  };
}

export default new Tasks();
