import { pool } from "../utils/_dbloader"

export async function getTransactionsByUserId(userId) {
  try {
    const conn = await pool.getConnection()
    const [rows] = await conn.query(
      'SELECT * FROM Transaction WHERE userId = ?',
      [userId]
    )
    conn.release()
    return rows
  } catch (err) {
    console.error(err)
    throw err
  }
}
