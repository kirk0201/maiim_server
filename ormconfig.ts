const path = require("path");

const config = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.resolve(__dirname, "dist", "**/*.entity.js")],
  migrations: [path.resolve(__dirname, "dist", "migrations/*.js")],
  cli: { migrationsDir: "migrations" },
  logging: true, // 로깅을 할 것인가 하지 않을 것인가를 설정
  synchronize: false, // 애플리케이션에 작동할 때마다 DB Schema가 자동으로 만들어지게 할 것인가를 설정
};

module.exports = config;
