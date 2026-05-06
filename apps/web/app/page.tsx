import { addItem } from './actions'
import { AutoRefresh } from './auto-refresh'
import { ItemRow } from './item-row'

type Item = {
  _id: string
  name: string
  quantity: number
  purchased: boolean
}

export default async function Page() {
  const res = await fetch('http://localhost:3001/items')
  const items: Item[] = await res.json()

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <AutoRefresh intervalMs={15000} />
      <h1 className="mb-6 text-2xl font-semibold">Shopping List</h1>

      <form action={addItem} className="mb-6 flex gap-2">
        <input
          name="name"
          type="text"
          placeholder="Add item..."
          required
          className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
          required
          className="w-16 rounded-lg border border-zinc-200 px-3 py-2 text-center outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-zinc-500">No items yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </ul>
      )}
    </main>
  )
}
