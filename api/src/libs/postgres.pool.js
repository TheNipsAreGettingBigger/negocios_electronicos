import pg from "pg";
import { config } from "../config/config.js";
const USER = encodeURIComponent(config.db_user);
const PASSWORD = encodeURIComponent(config.db_password);
const URI = `postgres://${USER}:${PASSWORD}@${config.db_host}:${config.db_port}/${config.db_name}`;

const pool = new pg.Pool({
  connectionString: URI,
});

export default pool;
