import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool(process.env.DB_URI);
export default pool;
