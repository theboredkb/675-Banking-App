const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bank-675',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function createTables() {
  try {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    // Create User table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `)

    // Create Transaction table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Transaction (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type ENUM('deposit', 'withdrawal') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `)

    // Create Transfer table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Transfer (
        id INT PRIMARY KEY AUTO_INCREMENT,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES User(id),
        FOREIGN KEY (receiverId) REFERENCES User(id)
      )
    `)

    await conn.commit()
    console.log('Tables created successfully!')
  } catch (err) {
    console.error(err)
    await conn.rollback()
  } finally {
    conn.release()
  }
}

createTables()
