import * as React from 'react'
import { render as rtlRender } from '@testing-library/react'

import ServicesProvider from '../contexts/services'
import IServiceAdapter from '../contexts/services/IServicesContextApdapter'

function render(ui: React.ReactElement, servicesAdapter: IServiceAdapter) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    return <ServicesProvider {...servicesAdapter}>{children}</ServicesProvider>
  }

  return rtlRender(ui, { wrapper: Wrapper as React.ComponentType })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
