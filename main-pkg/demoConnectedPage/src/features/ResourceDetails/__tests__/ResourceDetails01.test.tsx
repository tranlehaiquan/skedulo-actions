import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { render, waitFor, screen } from '@testing-library/react'

import ResourceDetails01 from '../ResourceDetails01'

jest.mock('../../../services/index.ts', () => {
  return {
		default: {
			getReferenceUIDFromContext: () => 'test_id',
			fetchResourceById: async () => {
				return {
					Name: 'Steve',
					Email: 'steve@example.com',
					PrimaryPhone: '0000-1111-2222',
				}
			},
		}
	}
})

test('load and display resource details', async () => {
  render(<ResourceDetails01 />)

  await waitFor(() => screen.getByText('Resource details:'))

  expect(screen.queryByText('Steve')).toBeInTheDocument()
  expect(screen.queryByText('steve@example.com')).toBeInTheDocument()
  expect(screen.queryByText('0000-1111-2222')).toBeInTheDocument()
})
