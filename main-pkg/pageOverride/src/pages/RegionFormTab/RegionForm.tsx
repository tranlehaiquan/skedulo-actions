import * as React from 'react'
import { SkedFormChildren, Button, FormElementWrapper } from '@skedulo/sked-ui'

import WrappedFormInput from 'shared/dist/components/WrappedFormInput'
import TimezonePicker from 'shared/dist/components/TimezonePicker'
import { Regions, UpdateRegions } from 'shared/dist/__graphql/graphql'

import { GroupDefinition } from '../../commons/types'

interface RegionFormProps {
  formParams: SkedFormChildren<UpdateRegions>
  formDefinition: Array<GroupDefinition<Regions>>
}

const RegionForm = ({ formParams, formDefinition }: RegionFormProps) => {
  const { fields, isFormReadonly, resetFieldsToInitialValues, errors, submitted, customFieldUpdate } = formParams

  const formFields = React.useMemo(() => {
    return formDefinition.map((item) => (
      <div className="vertical-panel" key={`form-group-${item.key}`}>
        <div className="header">
          <h2>{item.groupLabel}</h2>
        </div>
        <div className="content">
          {item.fields.map((field) => {
            return (
              <WrappedFormInput
                {...field}
                isRequired={!!field.isRequired}
                key={field.name}
                isReadonly={isFormReadonly}
                value={fields[field.name as keyof UpdateRegions] as string}
                error={submitted ? (errors[field.name as keyof UpdateRegions] as string) : ''}
                customFieldUpdate={customFieldUpdate as (key: string) => (value: any) => void}
              />
            )
          })}
        </div>
      </div>
    ))
  }, [formParams])

  return (
    <>
      <div className="vertical-panel">
        {formFields}
        <div className="content">
          <div className="label">
            <span className="span-label">Timezone</span>
            <FormElementWrapper
              readOnlyValue={fields.Timezone || undefined}
              isReadOnly={isFormReadonly}
              validation={{
                isValid: submitted ? !!errors.Timezone : true,
                error: submitted ? errors.Timezone : '',
              }}
            >
              <TimezonePicker timezone={fields.Timezone} onChange={customFieldUpdate('Timezone')} />
            </FormElementWrapper>
          </div>
        </div>
      </div>
      <div className="cx-flex cx-justify-end cx-p-4 border-top cx-bg-white cx-sticky cx-bottom-0">
        <Button buttonType="secondary" onClick={resetFieldsToInitialValues}>
          Cancel
        </Button>
        <Button buttonType="primary" className="cx-ml-2" type="submit">
          Save
        </Button>
      </div>
    </>
  )
}

export default React.memo(RegionForm)
