import 'server-only'
import type { EnquiriesRepository } from '../repositories'
import { getPayloadClient } from './client'

export const payloadEnquiriesRepository: EnquiriesRepository = {
  async createRecruitmentRequest(input) {
    const payload = await getPayloadClient()
    // The collection denies all public create access; only this validated server path may write.
    await payload.create({
      collection: 'recruitment-requests',
      overrideAccess: true,
      data: { ...input, consent: true, status: 'new' },
    })
  },
}
