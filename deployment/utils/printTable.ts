import { printTable } from 'console-table-printer'

import { CustomFieldsDefinition } from '../core/addNewCustomsFields'
import { resourceNewCustomFields } from '../starterMigration/exampleResources'
import questionAsync, { rl } from './question'

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
