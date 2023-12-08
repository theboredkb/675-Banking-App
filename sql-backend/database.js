import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bank-675',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
