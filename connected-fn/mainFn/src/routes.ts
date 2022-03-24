/**
 * Describe the entry-point into the "skedulo-function" by updating the
 * array returned by the `getRoutes` method with additional routes
 */

import * as pathToRegExp from 'path-to-regexp'

import { FunctionRoute } from '@skedulo/sdk-utilities'

import testHandler from './handlers/testHandler'
import { getAttachmentRedirectUrl } from './handlers/getAttachmentRedirectUrl'

export function getCompiledRoutes() {
  return getRoutes().map((route) => {
    const regex = pathToRegExp(route.path)

    return {
      regex,
      method: route.method,
      handler: route.handler,
    }
  })
}

function getRoutes(): FunctionRoute[] {
  return [
    {
      method: 'post',
      path: '/testHandler',
      handler: testHandler,
    },
    {
      method: 'post',
      path: '/getAttachmentRedirectUrl',
      handler: getAttachmentRedirectUrl
    }
  ]
}
