/**
 *
 * LoginForm
 *
 */

import React, { memo } from 'react'
interface IProps {
  title: string
}

const LoginForm: React.FC<IProps> = ({ title }) => {
  return <div>{title}</div>
}

export default memo(LoginForm)
