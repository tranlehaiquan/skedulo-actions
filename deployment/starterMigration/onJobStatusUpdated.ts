/**
 * NOTE:
 * @WEBHOOK_NAME
 *   - [ @org ][ @functionName ]
 * @WEBHOOK_QUERY
 *   - subscriptionSchema: which schema / object ?
 *   - operation: which operation (UPDATE, INSERT, DELETE)
 *   - isDeferred ?
 *   - filter: which data subscription should filter before notify ?
 *   - data model ?
 * @FUNCTION_NAME
 *   - route to the function handler in connectedFn
 * @PACKAGE_NAME_ENDPOINT
 *   - { @packageName }/{ @projectName };
 * url: route to your handler on the webhook
 *   - If devEndpoint is provided in console, then it uses the devEndpoint to register the webhook
 *   - @devUrl - { @devEndpoint }/{ @FUNCTION_NAME }
 *   - @apiUrl - { @apiEndpoint }/function/{ @PACKAGE_NAME_ENDPOINT }/{ @FUNCTION_NAME }
 *
 * @apiToken  - in console
 * @apiServer - AxiosInstance injected
 */

import { AxiosInstance } from 'axios'
import createWebhookDefinitionCore, { CreateWebhookMap, WebhookType } from '../core/createWebhookDefinition'
import updateWebhookDefinitionCore from '../core/updateWebhookDefinition'

interface IWebhookConfigs {
  WEBHOOK_NAME: string
  WEBHOOK_QUERY: string
  ROUTE_NAME: string
  FUNCTION_NAME: string
  PACKAGE_NAME_ENDPOINT: string
}

const WEBHOOK_CONFIGS: IWebhookConfigs = {
  WEBHOOK_NAME: 'starter_Webhook__Test',
  WEBHOOK_QUERY: `
    subscription {
      schemaJobs(operation: UPDATE) {
        data {
          UID
          Address
        }
      }
    }
  `,
  ROUTE_NAME: 'testHandler',
  FUNCTION_NAME: 'mainFn',
  PACKAGE_NAME_ENDPOINT: 'skedulo-pkg-starter',
}

export default async (apiServer: AxiosInstance, apiEndpoint: string, apiToken: string, devEndpoint: string) => {
  const { WEBHOOK_NAME, WEBHOOK_QUERY, FUNCTION_NAME, PACKAGE_NAME_ENDPOINT, ROUTE_NAME } = WEBHOOK_CONFIGS

  const devUrl = `${devEndpoint}/${ROUTE_NAME}`
  const apiUrl = `${apiEndpoint}/function/${PACKAGE_NAME_ENDPOINT}/${FUNCTION_NAME}/${ROUTE_NAME}`
  const url = devEndpoint ? devUrl : apiUrl

  const headers = {
    Authorization: `Bearer ${apiToken}`,
  }

  const createWebhooks: CreateWebhookMap = {
    [WEBHOOK_NAME]: {
      name: WEBHOOK_NAME,
      query: WEBHOOK_QUERY,
      url,
      headers,
      type: WebhookType.graphql,
    },
  }

  const updateWebhooks = {
    [WEBHOOK_NAME]: {
      overide: {
        query: WEBHOOK_QUERY,
        url,
        headers,
      },
    },
  }

  const createWebhookDefinition = createWebhookDefinitionCore(createWebhooks)
  const updateWebhookDefinition = updateWebhookDefinitionCore(updateWebhooks)

  try {
    await updateWebhookDefinition(apiServer)
  } catch (error) {
    await createWebhookDefinition(apiServer)
  }
}
