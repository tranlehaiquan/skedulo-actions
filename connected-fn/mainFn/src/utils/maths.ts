export function sum(arr: number[]) {
  return arr.reduce((sum, item) => {
    return sum + item
  }, 0)
}
