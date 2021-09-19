import { FormElementWrapper, FormLabel, ValidationProps } from '@skedulo/sked-ui'
import React from 'react'

interface IProps {
  label: string
  name?: string
  validation?: ValidationProps['validation']
}

const FormElement: React.FC<IProps> = ({ children, label, name, validation }) => {
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <FormElementWrapper name={name} validation={validation}>
        {children}
      </FormElementWrapper>
    </div>
  )
}

export default FormElement
