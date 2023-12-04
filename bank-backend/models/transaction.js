function createFakeTransaction() {
  return {
    id: Math.random() * 1000,
    userId: fakeTransactions.length + 1,
    amount: Math.random * 1000000,
    type: 'deposit',
    createdAt: Date.now(),
  }
}

//amount: number
export function getFakeTransactions(amount) {
  return Array(amount).fill(createFakeTransaction())
}

//id: number
export function getTransaction(id) {
  try {
    getTransactionsByUserId(id)
  } catch (e) {
    console.error(e)
  }
}
