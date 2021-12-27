export interface FieldDefinition<T> {
  name: keyof T & string
  label: string
  isRequired?: string
  type: string
  referenceSchemaName?: string
}

export interface GroupDefinition<T> {
  key: string
  groupLabel: string
  fields: Array<FieldDefinition<T>>
}
