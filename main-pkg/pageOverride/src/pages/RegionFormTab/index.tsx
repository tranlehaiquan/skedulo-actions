import * as React from 'react'

import { SkedFormValidation, SkedFormChildren, FormSubmission } from '@skedulo/sked-ui'

import _fromPairs from 'lodash/fromPairs'

import { Regions, UpdateRegions } from 'shared/dist/__graphql/graphql'

import { GroupDefinition } from '../../commons/types'

import RegionForm from './RegionForm'

interface RegionFormTabProps {
  region: Regions
  handleUpdate: (region: UpdateRegions) => void
}

const REGION_STANDARD_FIELDS: Array<GroupDefinition<Regions>> = [
  {
    key: 'details',
    groupLabel: 'Details',
    fields: [
      { name: 'Name', label: 'Region Name', isRequired: 'Region name is required', type: 'string' },
      { name: 'Description', label: 'Description', type: 'string' },
    ],
  },
  {
    key: 'location',
    groupLabel: 'Location',
    fields: [
      { name: 'GeoLatitude', label: 'Location (Latitude)', type: 'number' },
      { name: 'GeoLongitude', label: 'Location (Longitude)', type: 'number' },
    ],
  },
]

const RegionFormTab: React.FC<RegionFormTabProps> = ({ region, handleUpdate }) => {
  const handleSubmit = React.useCallback(async (form: FormSubmission<UpdateRegions>) => {
    const updateData = { ...region, ...form.fields }

    handleUpdate(updateData)
  }, [region])

  const objectFormConfig = React.useMemo(() => Object.assign(
    {},
    ...(REGION_STANDARD_FIELDS.map(group =>
      _fromPairs(group.fields.map(({ name, isRequired }) => [name, isRequired ? { isRequired: true } : {}]))
    ))
  ), [])

  return (
    <div className="crud-full-page__body scroll cx-pb-0">
      <SkedFormValidation<UpdateRegions>
        config={{ ...objectFormConfig, Timezone: { isRequired: true } }}
        options={{ clickToEdit: true }}
        onSubmit={handleSubmit}
        initialValues={region}
      >
        {(formParams: SkedFormChildren<UpdateRegions>) => (
          <RegionForm formParams={formParams} formDefinition={REGION_STANDARD_FIELDS} />
        )}
      </SkedFormValidation>
    </div>
  )
}

export default React.memo(RegionFormTab)
