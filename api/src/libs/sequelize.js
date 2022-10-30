import { Sequelize } from "sequelize";
import { config } from "../config/config.js";
const USER = encodeURIComponent(config.db_user);
const PASSWORD = encodeURIComponent(config.db_password);
const URI = `postgres://${USER}:${PASSWORD}@${config.db_host}:${config.db_port}/${config.db_name}`;
const sequelize = new Sequelize(URI, {
  dialect: "postgres",
});

export default sequelize;
