import { fromPairs } from 'lodash'

interface Params<T> {
  mutationType: 'insert' | 'update' | 'delete'
  schemaName: string
  data: T[]
  alias?: string
}

interface SingleMutationParams<T> {
  mutationType: 'insert' | 'update' | 'delete'
  schemaName: string
  data: T
  alias?: string
}

export const generateMutipleMutation = <T = any>({
  schemaName,
  mutationType,
  data,
  alias,
}: Params<T>) => {
  let query = ''
  const schemaNameKey = schemaName
  const variables = fromPairs(
    data.map((item: string | Record<string, any>, index: number) => [
      `input_${index}`,
      item,
    ])
  )

  if (mutationType === 'insert' || mutationType === 'update') {
    const variableType = mutationType === 'insert' ? 'New' : 'Update'
    const variableSections = data.map(
      (item, index) => `$input_${index}: ${variableType}${schemaNameKey}!`
    )
    const mutaionSections = data.map(
      (item, index) =>
        `${
          alias || mutationType
        }_${index}: ${mutationType}${schemaNameKey}(input: $input_${index})`
    )
    query = `
      mutation ${mutationType}${schemaNameKey}(${variableSections.join(', ')}) {
        schema {
          ${mutaionSections.join('\n')}
        }
      }
    `
  }

  if (mutationType === 'delete') {
    const variableSections = data.map((item, index) => `$input_${index}: ID!`)
    const mutaionSections = data.map(
      (item, index) =>
        `d_${index}: delete${schemaNameKey}(UID: $input_${index})`
    )
    query = `
      mutation delete${schemaNameKey}(${variableSections.join(', ')}) {
        schema {
          ${mutaionSections.join('\n')}
        }
      }
    `
  }

  return { variables, query }
}


export const generateSingleMutation = <T = any>({
  schemaName,
  mutationType,
  data,
}: SingleMutationParams<T>) => {
  let query = ''
  const schemaNameKey = schemaName
  const inputKey = '$input'
  const variables = {
    [inputKey.substring(1)]: data
  }

  if (mutationType === 'insert' || mutationType === 'update') {
    const variableType = mutationType === 'insert' ? 'New' : 'Update'

    query = `
      mutation ${mutationType}${schemaNameKey}(${inputKey}: ${variableType}${schemaNameKey}!) {
        schema {
          ${mutationType}${schemaNameKey}(input: ${inputKey})
        }
      }
    `
  }

  if (mutationType === 'delete') {
    query = `
      mutation delete${schemaNameKey}(${inputKey}: ID!) {
        schema {
          delete${schemaNameKey}(UID: ${inputKey})
        }
      }
    `
  }

  return { variables, query }
}
