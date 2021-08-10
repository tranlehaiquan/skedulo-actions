import * as React from 'react'
import classNames from 'classnames'
import { isObject as _isObject, toNumber as _toNumber } from 'lodash/fp'

import { FormElementWrapper, AsyncSearchSelect, ISelectItem, FormInputElement, NumberInput } from '@skedulo/sked-ui'

import { shareServices } from '../../services/ShareServices'
import { BaseObject } from '../../types'

interface WrappedFormInputProps {
  size?: number
  label: string
  name: string
  value: string | BaseObject
  referenceSchemaName?: string
  error?: string
  type?: string
  isReadonly: boolean
  isRequired: boolean
  customFieldUpdate: (key: string) => (value: any) => void
}

const useLookupField = (schemaName: string, value: WrappedFormInputProps['value'],
  customFieldUpdate: WrappedFormInputProps['customFieldUpdate'], name: string) => {
  const loadItems = React.useCallback(
    async (search: string) => {
      const result = await shareServices.searchObject(schemaName, search)

      return result.map(res => ({
        value: res,
        label: res.Name
      }))
    }
    , [schemaName]
  )

  const onSelectedItemChange = React.useCallback(
    ({ value: newVal }: ISelectItem<BaseObject>) =>
      customFieldUpdate(name)(newVal)
    , [customFieldUpdate, name]
  )

  const initialSelectedItem = React.useMemo(() => {
    if (_isObject(value)) {
      return {
        value,
        label: value.Name
      }
    }

    return undefined
  }, [value])
  return {
    loadItems,
    onSelectedItemChange,
    initialSelectedItem
  }
}

const useNumberField = (value: WrappedFormInputProps['value'], name: string, customFieldUpdate: WrappedFormInputProps['customFieldUpdate']) => {
  const formattedValue = React.useMemo(() => _toNumber(value), [value])
  const [numberValue, setNumberValue] = React.useState<number>(formattedValue)

  const onNumberInputChanged = React.useCallback(
    (changedValue: React.ReactText) => {
      customFieldUpdate(name)(_toNumber(changedValue))
    }
    , [customFieldUpdate, name]
  )

  React.useEffect(() => {
    setNumberValue(formattedValue)
  }, [formattedValue])

  return {
    numberValue,
    onNumberInputChanged
  }
}

const WrappedFormInput: React.FC<WrappedFormInputProps> = props => {
  const {
    label, name, value,
    isRequired, isReadonly, error, type, size, referenceSchemaName, customFieldUpdate
  } = props

  const labelClasses = React.useMemo(() => classNames('label', {
    required: isRequired,
    valid: !error
  }), [isRequired, error])

  const wrapperClasses = React.useMemo(() => classNames({
    'cx-whitespace-pre-line': type === 'textarea'
  }), [type])

  const defaultValue = _isObject(value) ? value.Name : value

  const {
    loadItems,
    onSelectedItemChange,
    initialSelectedItem
  } = useLookupField(referenceSchemaName ?? '', value, customFieldUpdate, name)

  const {
    numberValue,
    onNumberInputChanged
  } = useNumberField(defaultValue, name, customFieldUpdate)

  return (
    <div className={labelClasses}>
      <span className="span-label">{label}</span>
      <FormElementWrapper
        className={wrapperClasses}
        name={name}
        readOnlyValue={defaultValue}
        isReadOnly={isReadonly}
        validation={{ isValid: !error, error }}
      >
        {
          type === 'reference' && (
            <AsyncSearchSelect<ISelectItem<BaseObject>>
              id="input"
              name={name}
              fetchItems={loadItems}
              debounceTime={300}
              onSelectedItemChange={onSelectedItemChange}
              initialSelectedItem={initialSelectedItem}
              disabled={false}
              useCache={false}
              icon="chevronDown"
            />
          )
        }
        {
          type === 'string' && (
            <FormInputElement
              id="input"
              type={type || 'text'}
              name={name}
              defaultValue={defaultValue}
              size={size}
            />
          )
        }
        {
          type === 'number' && (
            <NumberInput
              id={`number_${name}`}
              name={name}
              value={numberValue}
              onValueChange={onNumberInputChanged}
              precision={9}
            />
          )
        }
        {
          type === 'textarea' && (
            <textarea
              name={name}
              className="sked-input-textbox"
              rows={10}
              defaultValue={defaultValue}
            />
          )
        }
      </FormElementWrapper>
    </div>

  )
}

export default React.memo(WrappedFormInput)
