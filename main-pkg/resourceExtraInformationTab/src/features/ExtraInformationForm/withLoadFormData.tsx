import * as React from 'react'
import { useEffect, useState } from 'react'
import { FieldsConfig, SkedFormValidationProps, ValidatorContext } from '@skedulo/sked-ui'
import { LoadingTrigger } from 'shared/dist/components/GlobalLoading'

import { useServices } from '../../contexts/services/ServicesContext'

import { FormValues } from './types'

export interface IHandleForm {
  submit: (formValues: FormValues) => Promise<unknown>
}

export interface FormValidationProps {
  configs: SkedFormValidationProps<FormValues>['config']
}

export interface IExtraData {
  maxRequestedWorkingHoursPerWeek?: number
}

type IWrappedComponentProps = FormValues & IHandleForm & FormValidationProps & IExtraData

const DEFAULT_MAX_RWH_PER_WEEK = 40

export const buildFormConfigs = ({
  maxRequestedWorkingHoursPerWeek,
}: {
  maxRequestedWorkingHoursPerWeek: number
}): FieldsConfig<FormValues> => ({
  requestedWorkingHoursPerWeek: {
    isNumber: 'Please enter a valid number',
    isGreaterThan: (validatorContext: ValidatorContext<FormValues>) => {
      const maxValue = maxRequestedWorkingHoursPerWeek <= DEFAULT_MAX_RWH_PER_WEEK ? maxRequestedWorkingHoursPerWeek : DEFAULT_MAX_RWH_PER_WEEK
      const value = validatorContext.fields.requestedWorkingHoursPerWeek
      return {
        validateIf: value > maxValue,
        message: `WARNING: Requested Working Hours Per Week CANNOT exceed ${maxRequestedWorkingHoursPerWeek} total availability hours.`,
      }
    },
  },
})

export const useLoadFormData = () => {
  const { getReferenceUIDFromContext, getMaxRequestedWorkingHoursPerWeek, fetchResourceById } = useServices()
  const resourceIdFromSkedContext = getReferenceUIDFromContext() || ''
  const [formData, setFormData] = useState<{
    infiniteState: 'idle' | 'pending' | 'success' | 'error'
    resourceId: string
    formConfigs?: FieldsConfig<FormValues>
    requestedWorkingHoursPerWeek?: number
    maxRequestedWorkingHoursPerWeek?: number
    errorMessage?: string
  }>({
    infiniteState: 'idle',
    resourceId: resourceIdFromSkedContext,
    requestedWorkingHoursPerWeek: 0,
    errorMessage: '',
  })

  useEffect(() => {
    if (resourceIdFromSkedContext) {
      setFormData((prevState) => ({ ...prevState, infiniteState: 'pending' }))
      Promise.all([
        fetchResourceById(resourceIdFromSkedContext),
        getMaxRequestedWorkingHoursPerWeek(resourceIdFromSkedContext),
      ])
        .then((res) => {
          const [resource, maxRequestedWorkingHoursPerWeek] = res
          setFormData((prevState) => ({
            ...prevState,
            infiniteState: 'success',
            maxRequestedWorkingHoursPerWeek,
            requestedWorkingHoursPerWeek: resource.RequestedWorkingHoursPerWeek || 0,
            formConfigs: buildFormConfigs({ maxRequestedWorkingHoursPerWeek }),
          }))
        })
        .catch((error) => {
          console.error(error)
          setFormData((prevState) => ({
            ...prevState,
            infiniteState: 'error',
            errorMessage: 'Something went wrong. Fetch data failed.',
          }))
        })
    } else {
      setFormData((prev) => ({ ...prev, infiniteState: 'error', errorMessage: 'Invalid resource id' }))
    }
  }, [resourceIdFromSkedContext, fetchResourceById, getMaxRequestedWorkingHoursPerWeek])

  return {
    formData,
  }
}

const withLoadFormData =
  <P extends object>(WrappedComponent: React.FC<P & IWrappedComponentProps>) =>
  (props: P): JSX.Element => {
    const { updateResource, getReferenceUIDFromContext } = useServices()
    const resourceIdFromSkedContext = getReferenceUIDFromContext() || ''

    const { formData } = useLoadFormData()

    const handleSubmit = async (formValues: FormValues) => {
      if (!resourceIdFromSkedContext) {
        throw Error('Resource is not found')
      }

      const res = await updateResource(resourceIdFromSkedContext, {
        RequestedWorkingHoursPerWeek: formValues.requestedWorkingHoursPerWeek,
      })

      return res
    }

    if (formData.infiniteState === 'pending') {
      return <LoadingTrigger />
    }

    if (formData.infiniteState === 'error') {
      return <div className="cx-text-xl">{formData.errorMessage}</div>
    }

    if (formData.infiniteState === 'success') {
      return (
        <WrappedComponent
          {...props}
          maxRequestedWorkingHoursPerWeek={formData.maxRequestedWorkingHoursPerWeek}
          configs={formData.formConfigs as FieldsConfig<FormValues>}
          requestedWorkingHoursPerWeek={formData.requestedWorkingHoursPerWeek || 0}
          submit={handleSubmit}
        />
      )
    }

    return <div>{'Loading form ...'}</div>
  }

export default withLoadFormData
