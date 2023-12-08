import express, { json } from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users'
import { transactionsRouter } from './routes/transactions'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(json())
app.use('/users/', usersRouter)
app.use('/transactions/', transactionsRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
