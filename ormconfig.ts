const path = require('path')

const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.resolve(__dirname, 'dist', '**/*.entity.js')],
  migrations: [path.resolve(__dirname, 'dist', 'migrations/*.js')],
  cli: { migrationsDir: 'migrations' },
  logging: true,
  synchronize: true,
}

module.exports = config