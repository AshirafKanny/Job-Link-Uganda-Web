import 'server-only'
import type { EnquiriesRepository } from '../repositories'
import { getPayloadClient } from './client'

export const payloadEnquiriesRepository: EnquiriesRepository = {
  async createRecruitmentRequest(input) {
    const payload = await getPayloadClient()
    // The collection denies all public create access; only this validated server path may write.
    const doc = await payload.create({
      collection: 'recruitment-requests',
      overrideAccess: true,
      data: { ...input, consent: true, status: 'new', notification: { status: 'pending' } },
    })
    return { id: doc.id }
  },

  async hasRecentRecruitmentRequest({ businessName, phone }, withinMs) {
    const payload = await getPayloadClient()
    const { totalDocs } = await payload.count({
      collection: 'recruitment-requests',
      overrideAccess: true,
      where: {
        and: [
          { businessName: { equals: businessName } },
          { phone: { equals: phone } },
          { createdAt: { greater_than: new Date(Date.now() - withinMs).toISOString() } },
        ],
      },
    })
    return totalDocs > 0
  },

  async recordNotification(id, outcome) {
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'recruitment-requests',
      id,
      overrideAccess: true,
      data: {
        notification: {
          status: outcome.status,
          providerId: outcome.status === 'sent' ? outcome.providerId : null,
          // Short, non-sensitive reason only (never provider payloads or credentials).
          detail: outcome.status === 'failed' ? outcome.error : outcome.status === 'skipped' ? outcome.reason : null,
          at: new Date().toISOString(),
        },
      },
    })
  },
}
