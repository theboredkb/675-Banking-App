const mysql = require('mysql2/promise')
const { faker } = require('@faker-js/faker')

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
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    // Create User table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS User (
        id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        dob DATE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        balance DECIMAL(10, 2) DEFAULT 0,
        ssn VARCHAR(9) NOT NULL UNIQUE,
        role ENUM('customer', 'admin') DEFAULT 'customer'
      );
    `)

    // Create Account table
    await conn.query(`
        CREATE TABLE IF NOT EXISTS Account (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT NOT NULL,
            accountType ENUM('checking', 'savings') NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id)
        );
    `)

    await conn.query(`
        CREATE TABLE IF NOT EXISTS SavingsAccount (
          id INT PRIMARY KEY AUTO_INCREMENT,
          accountId INT NOT NULL,
          interestRate DECIMAL(10, 2) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (accountId) REFERENCES Account(id)
          );
    `)

    // Create Credit Card table
    await conn.query(`
        CREATE TABLE IF NOT EXISTS CreditCard (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT NOT NULL,
            cardNumber VARCHAR(16) NOT NULL,
            cardType ENUM('visa', 'mastercard') NOT NULL,
            expirationDate DATE NOT NULL,
            cvv VARCHAR(3) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES User(id)
        );
    `)

    // Create Transaction table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS UserTransaction (
        id INT PRIMARY KEY AUTO_INCREMENT,
        accountId INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        type ENUM('deposit', 'withdrawal') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (accountIdId) REFERENCES Account(id)
      );
    `)

    // Create Transfer table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS Transfer (
        senderTransactionId INT,
        receiverTransactionId INT,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (senderTransactionId, receiverTransactionId),
        FOREIGN KEY (senderTransactionId) REFERENCES UserTransaction(id),
        FOREIGN KEY (receiverTransactionId) REFERENCES UserTransaction(id),
        FOREIGN KEY (senderId) REFERENCES User(id),
        FOREIGN KEY (receiverId) REFERENCES User(id)
      );
    `)

    // Create Account View used by customer service
    await conn.query(`
      CREATE OR REPLACE VIEW AccountView AS
      SELECT
        u.first_name,
        u.last_name,
        u.email,
        u.dob,
        u.balance
        FROM User u`)

    // Create Transaction View
    await conn.query(`
      CREATE OR REPLACE VIEW TransactionView AS
      SELECT
        t.id,
        t.userId,
        t.amount,
        t.type,
        t.createdAt
        FROM UserTransaction t
        ORDER BY t.createdAt DESC`)

    // Create Transaction query updating user balance
    await conn.query(`
        CREATE TRIGGER update_user_balance_after_insert
        AFTER INSERT ON UserTransaction
        FOR EACH ROW
        BEGIN
            IF NEW.type = 'deposit' THEN
                UPDATE User
                SET balance = balance + NEW.amount
                WHERE id = NEW.userId;
            ELSEIF NEW.type = 'withdrawal' THEN
                UPDATE User
                SET balance = balance - NEW.amount
                WHERE id = NEW.userId;
            END IF;
        END;
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
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        dob: faker.date.birthdate(),
        balance: 0,
        ssn: faker.string.numeric(9),
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
          type: faker.helpers.arrayElement(['deposit', 'withdrawal']),
          createdAt: faker.date.past(),
        }

        await conn.query(
          `INSERT INTO UserTransaction (
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

async function initializeDatabase() {
  await createTables()
  await populateUserTable()
  await populateTransactionTable()

  return 'Database initialized successfully!'
}

console.log(initializeDatabase())
