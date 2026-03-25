import mysql from "mysql2/promise";

const pool = mysql.createConnection(process.env.DB_URI);
export default pool;
