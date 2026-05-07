'use client'

import { useState, useActionState } from 'react'
import { updateItem, deleteItem, togglePurchased } from './actions'

type Item = {
  _id: string
  name: string
  quantity: number
  purchased: boolean
}

export function ItemRow({ item, onMutate }: { item: Item; onMutate: () => void }) {
  const [editing, setEditing] = useState(false)

  const [, updateAction, isUpdatePending] = useActionState(
    async (_: null, formData: FormData) => {
      await updateItem(formData)
      setEditing(false)
      await onMutate()
      return null
    },
    null
  )

  const [, toggleAction] = useActionState(
    async (_: null, formData: FormData) => {
      await togglePurchased(formData)
      await onMutate()
      return null
    },
    null
  )

  const [, deleteAction, isDeletePending] = useActionState(
    async (_: null, formData: FormData) => {
      await deleteItem(formData)
      await onMutate()
      return null
    },
    null
  )

  if (editing) {
    return (
      <li className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700">
        <form key="edit" action={updateAction} className="flex flex-1 items-center gap-2">
          <input type="hidden" name="id" defaultValue={item._id} />
          <input
            name="name"
            type="text"
            defaultValue={item.name}
            required
            autoFocus
            disabled={isUpdatePending}
            className="flex-1 rounded border border-zinc-200 px-2 py-1 outline-none focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900"
          />
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue={item.quantity}
            required
            disabled={isUpdatePending}
            className="w-16 rounded border border-zinc-200 px-2 py-1 text-center outline-none focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={isUpdatePending}
            className="text-sm font-medium text-zinc-900 hover:underline disabled:opacity-50 dark:text-zinc-100"
          >
            {isUpdatePending ? 'Saving…' : 'Save'}
          </button>
        </form>
        <button
          onClick={() => setEditing(false)}
          disabled={isUpdatePending}
          className="text-sm text-zinc-400 hover:underline disabled:opacity-50"
        >
          Cancel
        </button>
      </li>
    )
  }

  return (
    <li className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-800">
      <form key="toggle" action={toggleAction}>
        <input type="hidden" name="id" defaultValue={item._id} />
        <input type="hidden" name="purchased" value={String(!item.purchased)} />
        <button
          type="submit"
          className={`h-5 w-5 rounded border-2 ${item.purchased ? 'border-zinc-400 bg-zinc-400' : 'border-zinc-300 dark:border-zinc-600'}`}
          aria-label={item.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
        />
      </form>
      <span className={`flex-1 ${item.purchased ? 'line-through text-zinc-400' : ''}`}>
        {item.name}
      </span>
      <span className="text-sm text-zinc-500">×{item.quantity}</span>
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
      >
        Edit
      </button>
      <form action={deleteAction}>
        <input type="hidden" name="id" defaultValue={item._id} />
        <button
          type="submit"
          disabled={isDeletePending}
          className="text-sm text-red-400 hover:text-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </form>
      {isDeletePending && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden bg-red-100">
          <div className="h-full w-full animate-[delete-progress_1.2s_linear_infinite] bg-red-400" />
        </div>
      )}
    </li>
  )
}
