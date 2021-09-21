import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { render, screen, waitFor } from '../../../utils/servicesContextTestUtils'

import ResourceDetails from '../ResourceDetails'

const fakeAPI =
  <T extends object>(data: T) =>
  () =>
    new Promise<T>((resolve) => setTimeout(() => resolve(data as T), 1000))

test('load and display resource details', async () => {
  render(<ResourceDetails />, {
    fetchResourceById: fakeAPI<{ name: string; phone: string; email: string }>({
      name: 'Steve',
      email: 'steve@example.com',
      phone: '0000-1111-2222',
    }),
    getReferenceUIDFromContext: () => 'test_01',
  })

  await waitFor(() => screen.getByText('Resource details:'))

  expect(screen.queryByText('Steve')).toBeInTheDocument()
  expect(screen.queryByText('steve@example.com')).toBeInTheDocument()
  expect(screen.queryByText('0000-1111-2222')).toBeInTheDocument()
})
