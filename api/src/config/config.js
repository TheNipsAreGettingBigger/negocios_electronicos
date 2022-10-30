import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT_BACKEND || 3000,
  db_user: process.env.USER_DB_POSTGRES,
  db_password: process.env.PASSWORD_DB_POSTGRES,
  db_host: process.env.HOST_DB_POSTGRES,
  db_name: process.env.DATABASE_NAME_DB_POSTGRES,
  db_port: process.env.PORT_DB_POSTGRES,
};

export { config };
