require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')

const app = express()
app.use(express.json())
app.use(cors())

const client = new MongoClient(process.env.MONGODB_URI)
let db

function items() {
  return db.collection('items')
}

// --- Routes ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/items', async (req, res) => {
  try {
    const data = await items().find().sort({ created_at: 1 }).toArray()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/items', async (req, res) => {
  try {
    const { name, quantity } = req.body
    const doc = { name, quantity, purchased: false, created_at: new Date() }
    const result = await items().insertOne(doc)
    res.json({ ...doc, _id: result.insertedId })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/items/:id', async (req, res) => {
  try {
    const { name, quantity } = req.body
    const doc = await items().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, quantity } },
      { returnDocument: 'after' }
    )
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/items/:id', async (req, res) => {
  try {
    const { purchased } = req.body
    const doc = await items().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { purchased } },
      { returnDocument: 'after' }
    )
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/items/:id', async (req, res) => {
  try {
    await items().deleteOne({ _id: new ObjectId(req.params.id) })
    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- Start ---

const PORT = process.env.PORT || 3001
client.connect().then(() => {
  db = client.db(process.env.MONGODB_DB || 'shopping-list')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
