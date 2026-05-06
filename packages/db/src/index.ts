import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null

export async function getDb(uri: string, dbName: string): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db(dbName)
}

export { ObjectId } from 'mongodb'
export type { Db, Collection } from 'mongodb'
