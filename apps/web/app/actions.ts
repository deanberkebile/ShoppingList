'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function togglePurchased(formData: FormData) {
  const id = formData.get('id') as string
  const purchased = formData.get('purchased') === 'true'
  if (!id) return

  await fetch(`${API_URL}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchased }),
  })
}

export async function deleteItem(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) return

  await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
}

export async function updateItem(formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string)?.trim()
  if (!id || !name) return
  const quantity = Number(formData.get('quantity')) || 1

  await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity }),
  })
}

export async function addItem(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  const quantity = Number(formData.get('quantity')) || 1

  await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity }),
  })
}
