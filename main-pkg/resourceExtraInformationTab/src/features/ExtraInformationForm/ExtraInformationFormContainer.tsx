import React from 'react'
import { FormContext, SkedFormChildren, SkedFormValidation } from '@skedulo/sked-ui'
import { useGlobalLoading } from 'shared/dist/components/GlobalLoading'

import { toastMessage } from '../../commons/utils'

import ExtraInformationForm from './ExtraInformationForm'
import { FormValues } from './types'
import withLoadFormData, { FormValidationProps, IHandleForm, IExtraData } from './withLoadFormData'

type IProps = FormValues & IHandleForm & FormValidationProps & IExtraData

const computeDisabledFields = (rules: Array<{ fieldName: string; isDisabled: () => boolean }>): string[] => {
  return rules.reduce(
    (acc, item) => {
      if (item.isDisabled()) {
        return [...acc, item.fieldName]
      }
      return [...acc]
    },
    ['']
  )
}

const ExtraInformationFormContainer: React.FC<IProps> = ({
  maxRequestedWorkingHoursPerWeek,
  configs,
  requestedWorkingHoursPerWeek,
  submit,
}) => {
  const { startGlobalLoading, endGlobalLoading } = useGlobalLoading()

  const handleFormSubmit = async (formContext: FormContext<FormValues>) => {
    try {
      startGlobalLoading()
      await submit(formContext.fields)
      toastMessage.success('Update success')
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
      toastMessage.error('Something went wrong !')
    } finally {
      endGlobalLoading()
    }
  }

  const disabledFields = computeDisabledFields([
    { fieldName: 'requestedWorkingHoursPerWeek', isDisabled: () => !maxRequestedWorkingHoursPerWeek },
  ])

  return (
    <SkedFormValidation
      config={configs}
      initialValues={{
        requestedWorkingHoursPerWeek,
      }}
      onSubmit={handleFormSubmit}
    >
      {(props: SkedFormChildren<FormValues>) => {
        return (
          <ExtraInformationForm
            formParams={props}
            disabledFields={disabledFields}
            disabledSubmit={disabledFields.includes('requestedWorkingHoursPerWeek')}
          />
        )
      }}
    </SkedFormValidation>
  )
}

export default withLoadFormData(ExtraInformationFormContainer)
