// Starts a local PostgreSQL server for development without a system install.
// Data persists in ./.dev-db (git-ignored). Stop with Ctrl+C.
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve('.dev-db')
const PORT = 54329
const DATABASE = 'joblink'

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
})

if (!existsSync(DATA_DIR)) {
  await pg.initialise()
}
await pg.start()

try {
  await pg.createDatabase(DATABASE)
} catch {
  // Database already exists.
}

console.log(`Postgres ready: postgres://postgres:postgres@127.0.0.1:${PORT}/${DATABASE}`)

const shutdown = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
