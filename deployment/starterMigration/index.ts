import { AxiosInstance } from "axios";
import addNewSchema from "../core/addNewSchema";
import addNewCustomsFields, { ColumnType } from "../core/addNewCustomsFields";
import addNewCustomFieldMapping from "../core/addNewCustomFieldMapping";
import updatePermissionCore from "../core/updatePermission";
import onJobStatusUpdated from "./onJobStatusUpdated"

const newSchemas = addNewSchema([
  {
    name: "StarterTest",
    label: "Starter Test Object",
    fields: [
      {
        name: "Resource",
        label: "Resource",
        description: "A required lookup to the resource.",
        column: {
          type: ColumnType.reference,
          referenceSchemaName: "Resources",
          required: true
        },
      },
    ],
  },
])

const newFields = addNewCustomsFields([
  {
    schemaName: 'StarterTest',
    name: 'StarterTestDecimalField',
    label: 'Starter Test Decimal Field',
    column: {
      type: ColumnType.decimal,
      precision: 10,
      scale: 0,
    },
    showDesktop: false,
  },
  {
    schemaName: 'StarterTest',
    name: 'StarterTestBooleanField',
    label: 'Starter Test Boolean Field',
    column: {
      type: ColumnType.boolean,
      default: false
    },
    showDesktop: false,
  },
  {
    schemaName: 'StarterTest',
    name: 'StarterTestPicklistField',
    label: 'Starter Test Picklist Field',
    column: {
      type: ColumnType.picklist,
      items: [
        ['Pending', 'Pending'],
        ['Yes', 'Yes'],
        ['No', 'No'],
      ],
    },
    showDesktop: false,
  }
])

const hasManyRelationship = addNewCustomFieldMapping([
  {
    schemaName: "Resources",
    name: "StarterTest",
    label: "Starter Test",
    fieldType: "reference",
    mapping: "__startertest",
    referenceSchemaName: "StarterTest",
    referenceSchemaFieldName: "ResourceId",
    accessMode: "read_only",
    showDesktop: false
  }
]);

const updateSchedulerPermission = updatePermissionCore('scheduler', {
  StarterTest: {
    permissions: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
    fields: {},
  }
})

const updateResourcePermission = updatePermissionCore('resource', {
  StarterTest: {
    permissions: {
      read: true,
      create: false,
      update: false,
      delete: false,
    },
    fields: {},
  }
})

export default async (
  apiServer: AxiosInstance,
  apiEndpoint: string,
  apiToken: string,
  devEndpoint: string
) => {
  await newSchemas(apiServer);
  await newFields(apiServer);
  await hasManyRelationship(apiServer);
  await updateSchedulerPermission(apiServer);
  await updateResourcePermission(apiServer);
  await onJobStatusUpdated(
    apiServer,
    apiEndpoint,
    apiToken,
    devEndpoint
  );
};
