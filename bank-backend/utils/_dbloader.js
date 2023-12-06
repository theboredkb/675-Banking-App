const mysql = require('mysql2/promise')
const faker = require('faker')

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  // password: 'password',
  database: 'bank-675',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function createTables() {
  try {
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    // Create Account View used by customer service
    await conn.query(`
      CREATE OR REPLACE VIEW Account AS
      SELECT
        u.first_name,
        u.last_name,
        u.email,
        u.dob,
        u.balance,
        FROM User u`)

    // Create Transaction View
    await conn.query(`
      CREATE OR REPLACE VIEW Transaction AS
      SELECT
        t.id,
        t.userId,
        t.amount,
        t.type,
        t.createdAt,
        FROM Transaction t
        ORDER BY t.createdAt DESC`)

    // Create User table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        balance DECIMAL(10, 2) DEFAULT 0
        ssn VARCHAR(255) NOT NULL UNIQUE
      )
    `)

    // Create Transaction table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Transaction (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id)
      )
    `)

    s // Create Transfer table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Transfer (
        transactionId INT,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (transactionId),
        FOREIGN KEY (transactionId) REFERENCES Transaction(id),
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

async function populateUserTable() {
  const conn = await pool.getConnection()

  try {
    for (let i = 0; i < 100; i++) {
      const fakeUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        dob: faker.date.past(50, new Date(2000, 0, 1)),
        balance: faker.finance.amount(),
        ssn: faker.datatype.uuid(),
      }

      await conn.query(
        `INSERT INTO User (
          first_name, 
          last_name, 
          email, 
          password, 
          dob, 
          balance, 
          ssn
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          fakeUser.firstName,
          fakeUser.lastName,
          fakeUser.email,
          fakeUser.password,
          fakeUser.dob,
          fakeUser.balance,
          fakeUser.ssn,
        ]
      )
    }
  } finally {
    conn.release()
  }
}

async function populateTransactionTable() {
  const conn = await pool.getConnection()

  try {
    const [users] = await conn.query('SELECT id FROM User')

    for (const user of users) {
      for (let i = 0; i < 10; i++) {
        const fakeTransaction = {
          userId: user.id,
          amount: faker.finance.amount(100, 10000, 2),
          type: faker.random.arrayElement([
            'deposit',
            'withdrawal',
            'transfer',
          ]),
          createdAt: faker.date.past(1),
        }

        await conn.query(
          `INSERT INTO Transaction (
            userId, 
            amount, 
            type, 
            createdAt
          ) VALUES (?, ?, ?, ?)`,
          [
            fakeTransaction.userId,
            fakeTransaction.amount,
            fakeTransaction.type,
            fakeTransaction.createdAt,
          ]
        )
      }
    }
  } finally {
    conn.release()
  }
}

async function populateTransferTable() {
  const conn = await pool.getConnection()

  try {
    const [users] = await conn.query('SELECT id FROM User')

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        const receiver = faker.random.arrayElement(
          users.filter((u) => u.id !== user.id)
        )

        const amount = faker.finance.amount(100, 5000, 2)
        const [transactionResult] = await conn.query(
          `INSERT INTO Transaction (
            userId, 
            amount, 
            type, 
            createdAt
          ) VALUES (?, ?, "transfer", ?)`,
          [user.id, amount, faker.date.past(1)]
        )

        const transactionId = transactionResult.insertId

        await conn.query(
          `INSERT INTO Transfer (
            transactionId, 
            senderId, 
            receiverId, 
            createdAt
          ) VALUES (?, ?, ?, ?)`,
          [transactionId, user.id, receiver.id, faker.date.past(1)]
        )
      }
    }
  } finally {
    conn.release()
  }
}

createTables()
populateUserTable()
populateTransactionTable()
populateTransferTable()
