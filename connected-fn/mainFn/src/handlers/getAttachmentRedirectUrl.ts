import { FunctionPayload } from '@skedulo/sdk-utilities'
import { isArray } from 'lodash/fp'

import axios from 'axios'

export const getAttachmentRedirectUrl = async (body: FunctionPayload['body']) => {
  if (!isArray(body)) {
    return { status: 200, body: { requestBody: body, error: 'No body' } }
  }
  // TODO: as right now, Connected Function don't send the original header
  // When CF can do that, we can move this to request header to make it more customization

  const attachments = body as string[]

  const redirectUrls = await Promise.all(
    attachments.map(async (attachment) => {
      const resp = await axios(attachment, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      })

      return resp.headers.location
    })
  )

  return { status: 200, body: redirectUrls }
}