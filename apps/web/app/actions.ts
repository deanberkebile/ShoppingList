'use server'

import { refresh } from 'next/cache'

export async function togglePurchased(formData: FormData) {
  const id = formData.get('id') as string
  const purchased = formData.get('purchased') === 'true'
  if (!id) return

  await fetch(`http://localhost:3001/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchased }),
  })

  refresh()
}

export async function deleteItem(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  await fetch(`http://localhost:3001/items/${id}`, { method: 'DELETE' })

  refresh()
}

export async function updateItem(formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  if (!id || !name) return
  const quantity = Number(formData.get('quantity')) || 1

  await fetch(`http://localhost:3001/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity }),
  })

  refresh()
}

export async function addItem(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  const quantity = Number(formData.get('quantity')) || 1

  await fetch('http://localhost:3001/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity }),
  })

  refresh()
}
