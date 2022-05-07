import { Model, ModelStatic, Sequelize } from 'sequelize';
import { readdirSync } from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

let sequelize: Sequelize;

if (env === 'production' || env === 'test') {
  if (!process.env.DATABASE_URL) {
    throw new Error('Production database url is not set');
  }
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  if (
    !process.env.POSTGRES_USER &&
    !process.env.POSTGRES_PASSWORD &&
    !process.env.POSTGRES_HOST &&
    !process.env.POSTGRES_PORT &&
    !process.env.POSTGRES_DB
  ) {
    throw new Error('Development database environment variables are not set');
  }

  sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      ...(process.env.NODE_ENV === 'test' && { logging: false }),
    }
  );
}

readdirSync(path.join(__dirname + '/models'))
  .filter(
    (file: string) =>
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.ts'
  )
  .forEach(async (file: string) => {
    const model: ModelStatic<Model> = (
      await import(path.join(__dirname, '/models', file))
    ).default;
    sequelize.modelManager.addModel(model);
  });

export default sequelize;
