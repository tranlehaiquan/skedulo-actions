import { printTable } from 'console-table-printer'
import * as readline from 'readline'

import { CustomFieldsDefinition } from '../core/addNewCustomsFields'
import { resourceNewCustomFields } from '../starterMigration/exampleResources'

export function printFields(fields: Array<CustomFieldsDefinition>) {
  const tableFields = fields.map((field) => {
    const { column, ...remainingField } = field
    return {
      ...remainingField,
      ...column,
    }
  })

  printTable(tableFields)
}

const rl = readline.createInterface(process.stdin, process.stdout)
const questionAsync = async (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

const main = async () => {
  const option = await questionAsync(`Print Table:\n
  [0] Resources\n
Please choose number: `)
  try {
    switch (option) {
      case '0':
        printFields(resourceNewCustomFields)
        break
    }
  } catch (error) {
    console.log(error)
  } finally {
    rl.close()
  }
}

main()
