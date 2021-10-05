import { createObjectCsvWriter } from 'csv-writer'
import { ColumnDefinition, ColumnType, CustomFieldsDefinition } from '../core/addNewCustomsFields'
import { resourceNewCustomFields } from '../starterMigration/exampleResources'
import questionAsync, { rl } from './question'

function getFieldType(column: ColumnDefinition) {
  return column.type !== ColumnType.reference ? column.type : `Lookup(${column.referenceSchemaName})`
}

function createCSV(name: string, fields: Array<CustomFieldsDefinition>) {
  const csvWriter = createObjectCsvWriter({
    path: `${name}.csv`,
    header: [
      {
        id: 'object',
        title: 'Object',
      },
      {
        id: 'label',
        title: 'Label',
      },
      {
        id: 'apiName',
        title: 'API Name',
      },
      {
        id: 'fieldType',
        title: 'Field Type',
      },
    ],
  })

  const records = fields.map((field) => {
    return {
      object: field.schemaName,
      label: field.label,
      apiName: field.name,
      fieldType: getFieldType(field.column),
    }
  })

  csvWriter.writeRecords(records).then(() => {
    console.log('Done')
  })
}

const main = async () => {
  const fileName = await questionAsync(`FileName (Default is objectName):`)
  const option = await questionAsync(`Create CSV:\n
  [0] Resources\n
Please choose number: `)
  try {
    switch (option) {
      case '0':
        createCSV(fileName || 'Resources', resourceNewCustomFields)
        break
    }
  } catch (error) {
    console.log(error)
  } finally {
    rl.close()
  }
}

main()
