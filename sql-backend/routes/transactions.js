import express from 'express'
import { db } from '../database'

export const transactionsRouter = express.Router()

transactionsRouter.get('/', async (req, res) => {
  const userId = req.query.userId
  try {
    const results = await db.query(
      `SELECT * FROM UserTransaction WHERE userId = ?`,
      [userId]
    )
    res.status(200).json(results)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

transactionsRouter.get('/totalBalance', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT SUM(balance) from User WHERE balance > 0`
    )
    res.status(200).json(results)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

transactionsRouter.post('/deposit', async (req, res) => {
  const { userId, amount } = req.body

  if (!userId || !amount) {
    res.status(400).send('Missing required fields')
  }

  try {
    const [rows] = await db.query(
      `
      INSERT INTO UserTransaction (userId, amount, type) 
      VALUES (?, ?, ?)`,
      [userId, amount, 'deposit']
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }

  res.status(201).send('Deposit successful')
})

transactionsRouter.post('/withdrawal', async (req, res) => {
  const { userId, amount } = req.body

  if (!userId || !amount) {
    res.status(400).send('Missing required fields')
  }

  try {
    const [rows] = await db.query(
      `
        INSERT INTO UserTransaction (userId, amount, type) 
        VALUES (?, ?, ?)`,
      [userId, amount, 'withdrawal']
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }

  res.status(201).send('Withdrawal successful')
})
