import { ColumnType, CustomFieldsDefinition } from '../core/addNewCustomsFields'

const SCHEMA_NAME = 'Resources'

const newCustomFields: Array<CustomFieldsDefinition> = [
  {
    schemaName: SCHEMA_NAME,
    name: 'Language',
    label: 'Language',
    description: 'Language',
    column: {
      type: ColumnType.string,
      maxLength: 50,
    },
    showDesktop: false,
    showMobile: false,
  },
  {
    schemaName: SCHEMA_NAME,
    name: 'License',
    label: 'License',
    description: 'License',
    column: {
      type: ColumnType.string,
      maxLength: 50,
    },
    showDesktop: false,
    showMobile: false,
  },
  {
    schemaName: SCHEMA_NAME,
    name: 'VehicleID',
    label: 'Vehicle ID',
    description: 'Vehicle ID',
    column: {
      type: ColumnType.string,
      maxLength: 50,
    },
    showDesktop: false,
    showMobile: false,
  },
  {
    schemaName: SCHEMA_NAME,
    name: 'Seniority',
    label: 'Seniority',
    description: 'Seniority',
    column: {
      type: ColumnType.string,
      maxLength: 50,
    },
    showDesktop: false,
    showMobile: false,
  },
]

export { newCustomFields as resourceNewCustomFields }
