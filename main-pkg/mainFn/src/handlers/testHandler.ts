import { FunctionPayload } from '@skedulo/sdk-utilities'
// import { first, last, isNumber, isArray } from 'lodash'

// import skedService from '../skedService'

function produceSuccessResponse(data: any) {
  return {
    status: 200,
    body: {
      success: true,
      data,
    },
  }
}

export default async (body: FunctionPayload['body'], headers: FunctionPayload['headers']) => {
  // const rrAccessTokenInfo = await skedService.fetchReadyRespondersAccessToken()
  // let res

  // console.log('body', JSON.stringify(body))

  // if (!!rrAccessTokenInfo) {
  //   res = await skedService.forwardWebhookMessages(body, rrAccessTokenInfo)
  //   console.log('res', JSON.stringify(res))
  // }

  return produceSuccessResponse(null)
}
