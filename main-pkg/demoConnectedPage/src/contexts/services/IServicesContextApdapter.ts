interface IServiceAdapter {
  fetchResourceById: (id: string) => Promise<{ name: string; email: string; phone: string }>
  getReferenceUIDFromContext: () => string | undefined
}

export default IServiceAdapter
