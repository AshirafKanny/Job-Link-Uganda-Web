import type { CollectionConfig } from 'payload'

/**
 * PRIVATE — candidate system (Phase 5). Intentionally empty.
 *
 * Do not add collections here until Job Link Uganda has confirmed:
 *   1. PDPO data-controller registration (Data Protection and Privacy Act, 2019)
 *   2. The privacy notice and consent wording
 *   3. The retention period, and which staff roles may see candidate data
 *
 * Planned design once cleared:
 *   - `candidates` and `applications`: recruiter/admin read only, no public API
 *     access, created through validated server actions with Turnstile.
 *   - `candidate-documents`: a separate upload collection in a PRIVATE bucket
 *     (never the public `media` collection). Files are served only through
 *     access-checked, short-lived signed URLs; PDF/DOC/DOCX up to 5 MB.
 *   - Audit trail for record access, and a deletion-on-request workflow.
 *
 * payload.config.ts refuses to start if FEATURE_CANDIDATE_SYSTEM is enabled
 * while this list is still empty.
 */
export const candidateCollections: CollectionConfig[] = []
