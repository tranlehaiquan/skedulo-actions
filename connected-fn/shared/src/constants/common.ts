export interface GraphQLMutationResult {
  schema: {
    [operationName: string]: string
  }
}
