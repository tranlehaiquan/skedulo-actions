import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import withLoadFormData from '../withLoadFormData'

jest.mock('shared/dist/components/GlobalLoading', () => ({
  LoadingTrigger: () => <div>{'Loading Trigger'}</div>,
}))

jest.mock('../../../contexts/services/ServicesContext.tsx', () => ({
  useServices: () => {
    return {
      getReferenceUIDFromContext: jest.fn(() => 'resourceId'),
      getMaxRequestedWorkingHoursPerWeek: jest.fn(() => 40),
      fetchResourceById: jest.fn(() => null),
      updateResource: jest.fn(),
    }
  },
}))

const TestComponent: React.FC<any> = () => <div>{'Test Component'}</div>

const WrappedTestComponent = withLoadFormData(TestComponent)

let container: Element | DocumentFragment | null

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container)
  }
  container = null
})

describe('withLoadFormData', () => {
  it('Should render without crashing', () => {
    render(<WrappedTestComponent />, container)
    expect(container?.textContent).toBe('Loading form ...')
  })
})
