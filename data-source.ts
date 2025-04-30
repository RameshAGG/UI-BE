// data-source.ts (root level)
require('reflect-metadata');
require('dotenv').config();
const { DataSource } = require('typeorm');
const { dirname, join } = require('path');

const currentDir = process.cwd();
const baseDir = dirname(currentDir);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'your_postgres_username',
  password: process.env.DB_PASSWORD || 'your_postgres_password',
  database: process.env.DB_NAME || 'your_database_name',
  entities: [join(currentDir, 'src/**/*.entity.{ts,js}')],
  migrations: [join(currentDir, 'src/migrations/**/*{.ts,.js}')],
  synchronize: false,
});

module.exports = AppDataSource;