import { ValueValidatorConfig, FormContext, ValidatorContext } from '@skedulo/sked-ui'
export interface IValidatorResult<T = string> {
  key: string
  isValid: boolean
  message?: T
}

export type IValidator = (...args: any[]) => IValidatorResult

export const skedValidatorWrapper = <T extends object>(
  validator: IValidator,
  validateIf?: (formData: Partial<FormContext<T>>) => boolean
) => ({ errors, fields }: ValidatorContext<T>): ValueValidatorConfig<any, T> => {
  if (!validateIf) {
    const { message, isValid } = validator(fields)
    return {
      message: message || 'Invalid',
      value: isValid
    }
  }

  if (validateIf && validateIf({ errors, fields })) {
    const { message, isValid } = validator(fields)
    return {
      message:  message || 'Invalid',
      value: isValid
    }
  }

  return {
    message: '',
    value: false
  }
}

const checkSkedValidator = <T extends object>(fieldConfig: ValueValidatorConfig<any, T>) => (fieldValue: T[keyof T]) =>
  !fieldConfig.value ? fieldConfig.message : null

/**
 * This will create an object to pass through to customValidators for SkedFormValidation that takes this shape:
 * {
 *  isValidMomentFormatValidation: checkSkedValidator,
 * }
 *
 * It must be used to in conjunction with skedValidatorWrappers to return the correct validation result
 */
export const configureSkedValidators = (validatorNames: string[]) =>
  validatorNames.reduce(
    (validatorMap, validatorName) => ({ ...validatorMap, ...{ [validatorName]: checkSkedValidator } }),
    {}
  )
