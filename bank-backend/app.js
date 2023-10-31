const express = require('express')
const app = express()
const mysql = require('mysql2/promise')

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
