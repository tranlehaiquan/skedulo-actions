import { sum } from './maths'

it('Should return 0 when array is empty', () => {
  // Act
  const result = sum([])
  // Assert
  expect(result).toBe(0)
})

it('Should return 3', () => {
  // Act
  const result = sum([1, 2])
  // Assert
  expect(result).toBe(3)
})
