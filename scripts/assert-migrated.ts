/**
 * Build guard: fails (exit 1) if any migration in src/migrations has not been
 * applied to the database the build points at.
 *
 * Runs in `npm run ci` straight after `payload migrate`. If migrating was
 * skipped or failed quietly, the deploy stops here and the previous working
 * version stays live, instead of shipping code that expects columns the
 * database does not have yet (which crashed the admin on 2026-10-03).
 *
 * Read-only: it only lists applied migrations.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { migrations } from '../src/migrations'

const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'payload-migrations',
  pagination: false,
  depth: 0,
  overrideAccess: true,
})
const applied = new Set(docs.map((d) => d.name))
const pending = migrations.map((m) => m.name).filter((name) => !applied.has(name))

if (pending.length > 0) {
  payload.logger.error(`Database is missing ${pending.length} migration(s): ${pending.join(', ')}. Stopping the build.`)
  process.exit(1)
}
payload.logger.info(`All ${migrations.length} migrations are applied.`)
process.exit(0)
