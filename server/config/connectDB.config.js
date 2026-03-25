import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createConnection(process.env.DB_URI);
export default pool;
