require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())
app.use(cors())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// --- Routes ---

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Get all items
app.get('/items', async (req, res) => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data.map(row => ({ ...row, _id: row.id })))
})

// Add an item
app.post('/items', async (req, res) => {
  const { name, quantity } = req.body
  const { data, error } = await supabase
    .from('items')
    .insert({ name, quantity, purchased: false })
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ...data, _id: data.id })
})

// Edit an item's name and quantity
app.put('/items/:id', async (req, res) => {
  const { id } = req.params
  const { name, quantity } = req.body
  const { data, error } = await supabase
    .from('items')
    .update({ name, quantity })
    .eq('id', id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ...data, _id: data.id })
})

// Toggle purchased on/off
app.patch('/items/:id', async (req, res) => {
  const { id } = req.params
  const { purchased } = req.body
  const { data, error } = await supabase
    .from('items')
    .update({ purchased })
    .eq('id', id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ ...data, _id: data.id })
})

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ deleted: true })
})

// --- Start ---

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
