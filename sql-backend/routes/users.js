import express from 'express'
import { db } from '../database'
import bcrypt from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export const usersRouter = express.Router()

usersRouter.get('/count/', async (req, res) => {
  try {
    const results = await db.query(`SELECT COUNT(*) FROM User`)
    res.status(200).json(results)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

usersRouter.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, dob, ssn } = req.body

  if (!firstName || !lastName || !email || !password || !dob || !ssn) {
    res.status(400).send('Missing required fields')
  }

  const inDb = await db.query('SELECT * FROM User WHERE email = ?', [email])
  if (inDb.length > 0) {
    res.status(400).send('User already exists')
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const [rows] = await db.query(
      `
      INSERT INTO User (first_name, last_name, email, password, dob, ssn) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, dob, ssn]
    )
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }

  res.status(201).send('User created')
})

usersRouter.post('/login', async (req, res) => {
  const secretKey = 'secretKey'
  try {
    const { email, password } = req.body

    const [users] = await db.query(`SELECT * FROM User WHERE email = ?`, [
      email,
    ])
    const user = users[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials')
    }

    const userToken = {
      userId: user.id,
      role: user.role,
    }

    const token = sign(userToken, 'secret')
    res.status(200).json({ token })
  } catch (err) {
    console.log(err)
    res.status(500).send('Error logging in')
  }
})
