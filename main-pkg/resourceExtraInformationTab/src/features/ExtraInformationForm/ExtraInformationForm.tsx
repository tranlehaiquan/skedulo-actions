import React from 'react'
import { Button, NumberInput, SkedFormChildren } from '@skedulo/sked-ui'

import FormElement from '../../components/FormElement/FormElement'

import { FormValues } from './types'

interface IForm {
  formParams: SkedFormChildren<FormValues>
  disabledFields?: string[]
  disabledSubmit?: boolean
}

const ExtraInformationForm: React.FC<IForm> = ({ formParams, disabledFields, disabledSubmit }) => {
  const { fields, customFieldUpdate, errors } = formParams

  const { requestedWorkingHoursPerWeek } = fields

  const setFieldValue = (fieldName: keyof FormValues) => (value: any) => {
    customFieldUpdate(fieldName)(value)
  }

  return (
    <>
      <FormElement
        name="requestedWorkingHoursPerWeek"
        label="Requested Working Hours Per Week"
        validation={{
          isValid: !errors.requestedWorkingHoursPerWeek,
          error: errors.requestedWorkingHoursPerWeek,
        }}
      >
        <NumberInput
          name={'requestedWorkingHoursPerWeek'}
          value={requestedWorkingHoursPerWeek}
          step={1}
          disabled={disabledFields?.includes('requestedWorkingHoursPerWeek')}
          onValueChange={setFieldValue('requestedWorkingHoursPerWeek')}
        />
      </FormElement>
      <Button className="cx-mt-4" buttonType="primary" type="submit" disabled={disabledSubmit}>
        Save
      </Button>
    </>
  )
}

export default ExtraInformationForm
