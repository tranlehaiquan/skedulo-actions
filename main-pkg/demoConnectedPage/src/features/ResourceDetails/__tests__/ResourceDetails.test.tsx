import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { Type } from 'shared'
import { render, screen, waitFor } from '../../../utils/servicesContextTestUtils'

import ResourceDetails from '../ResourceDetails'

const fakeAPI =
  <T extends object>(data: T) =>
  () =>
    new Promise<T>((resolve) => setTimeout(() => resolve(data as T), 1000))

const fakeResource = {
  UID: 'test_01',
  Name: 'Steve',
  Email: 'steve@example.com',
  ResourceType: 'Person',
  EmploymentType: 'Full-time',
  PrimaryPhone: '123-123-123',
  MobilePhone: '123-123-123',
  Category: null,
  IsActive: true,
  ResourceTags: [],
  PrimaryRegion: {
    UID: '122121',
    Name: 'New York'
  }
}

test('load and display resource details', async () => {
  render(<ResourceDetails />, {
    fetchResourceById: fakeAPI<Type.ResourceById>(fakeResource),
    getReferenceUIDFromContext: () => 'test_01',
    fetchResources: fakeAPI<Type.TransformedListResponse<Type.Resources>>({
      data: [fakeResource],
      totalCount: 1
    }),
    searchObject: fakeAPI([{ UID: 'test_02', Name: 'New York' }])
  })

  await waitFor(() => screen.getByText('Resource details:'))

  expect(screen.queryByText('Steve')).toBeInTheDocument()
  expect(screen.queryByText('steve@example.com')).toBeInTheDocument()
})
